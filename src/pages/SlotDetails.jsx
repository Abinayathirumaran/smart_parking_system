import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import API from '../services/api';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';




function SlotDetails() {

  const { id } = useParams();
  const navigate = useNavigate()
  const [lot, setLot] = useState(null)
  const [slots, setSlots] = useState([])

  // selected slot state
  const [selectedSlot, setSelectedSlot] = useState(null)


  useEffect(() => {
    const fetchLot = async () => {
      const response = await API.get(`/parkingLots/${id}`)
      setLot(response.data)

      const slotResponse = await API.get(`/slots?parkingId=${id}`)    //give me only slots that belong to parking lot id
      setSlots(slotResponse.data)
    }

    fetchLot()
  }, [id]);


  if (!lot) {
    return (
      <div className='min-h-screen bg-slate-950 text-white flex items-center justify-center'>Loading...</div>
    )
  }

  //for loop for grouping data

  const groupedSlots = {}                                    //empty object created to store slots grouped by floor

  for (let i = 0; i < slots.length; i++) {                  //loop start from first slot and go till last slot one by one
    const slot = slots[i]                                   //take the slot at position i from the array and store it in a variable called slot

    if (!groupedSlots[slot.floor]) {                         //if this floor does not already exist in the grouped object
      groupedSlots[slot.floor] = []                          //create an empty array for this floor in groupedSlots

    }

    groupedSlots[slot.floor].push(slot)

    // console.log(groupedSlots)
  }

  const totalFloors = Object.keys(groupedSlots).length                //object gives a keys of an object as a array["1","2","3"]
  const totalSlots = slots.length

  console.log(totalSlots)

  //check the credentials for proceed booking
  const handleBooking = () => {

    const user = JSON.parse(localStorage.getItem("userData"));

    // NOT LOGGED IN
    if (!user) {

      alert("Please login to continue booking");

      navigate("/login", {
        state: {
          from: "/booking",
          lot,
          selectedSlot
        }
      });

      return;
    }

    // LOGGED IN
    navigate("/booking", {
      state: {
        lot,
        selectedSlot
      }
    });
  };

  return (
    <div className='min-h-screen bg-slate-950 text-white'>
      {/* navbar */}
      <Navbar />
      <div className='flex flex-col lg:flex-row gap-6 p-6'>

        <div className='lg:w-1/2 w-full bg-white/5 p-6 rounded-2xl border border-white/10'>
          {/* left pannel */}
          {/* img,name,location */}
          <img src={lot.image} alt="mall image" className='w-full h-52 min-h-52 max-h-52  object-cover rounded-xl mb-4' />

          <h1 className='text-2xl font-bold text-cyan-400'>{lot.name}</h1>
          <p className='text-gray-300 mb-4'> {lot.location}</p>

          {/* total floors and slots */}
          <div className='space-y-3 text-sm'>
            <p><span className='text-gray-400'>Total Floors: </span>{totalFloors}</p>
            <p><span className='text-gray-400'>Total Slots: </span>{totalSlots}</p>
          </div>

          {/* indicator */}
          <div className='flex gap-4 mt-6 text-sm'>
            <div className='flex items-center gap-2'>
              <div className='w-4 h-4 bg-green-500 rounded'></div>
              <p>Available</p>
            </div>


            <div className='flex items-center gap-2'>
              <div className='w-4 h-4 bg-red-500 rounded'></div>
              <p>Booked</p>
            </div>
          </div>
          {
            selectedSlot && (
              <div className='mt-2 bg-cyan-500/10 border border-cyan-400/30 p-4 rounded-xl min-w-[180px] h-fit'>
                <h3 className='text-lg font-semibold text-cyan-400 mb-2'>Selected Slot</h3>
                <p className='text-sm'>
                  <span className='font-semibold text-white'>{""}{selectedSlot.slotNumber}</span> </p>
                <p className='text-sm mt-1'> <span className='font-semibold text-white'>{""}{selectedSlot.floor}</span></p>
                <button onClick={() => handleBooking()} className=' cursor-pointer mt-4 bg-cyan-400 text-black px-5 py-2 rounded-lg font-semibold'>Proceed to Booking</button>
              </div>
            )
          }

        </div>

        {/* Right pannel */}
        <div className='lg:w-1/2 w-full pr-2'>

          <h2 className='text-xl font-bold mb-4'>Map view</h2>
          {
            Object.keys(groupedSlots).map(floor => (
              <div key={floor} className='mb-6'>
                <h3 className='mb-2 font-semibold'>Floor {floor}</h3>


                {/* grid-view */}
                <div className='grid grid-cols-5 sm:grid-cols-6 md:grid-cols-5 lg:grid-cols-5 gap-2'>
                  {groupedSlots[floor].map(slot => (                            //floor comes from previous above map 
                    <div key={slot.id}

                      onClick={() => {
                        if (slot.status === "available") {
                          setSelectedSlot(slot)                       //one single object from array
                        }
                      }}

                      className={`cursor-pointer py-2 px-1 rounded-md text-center font-semibold border text-[10px]
                      ${slot.status === "booked" ? "bg-red-500/30 border-red-400 text-red-200" : "bg-green-500/30 border-green-400 text-green-200"
                        }

                        ${selectedSlot?.id === slot.id ? "ring-2 ring-cyan-400" : ""}        

                    `}>
                      {slot.slotNumber}
                    </div>
                  ))
                  }
                </div>

              </div>
            ))
          }


        </div>



      </div>
    </div>

  )
}

export default SlotDetails  