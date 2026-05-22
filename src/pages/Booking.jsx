import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import API from '../services/api';
import Navbar from '../components/Navbar';
import { toast } from "react-toastify"
import { getUser } from "../services/auth";


function Booking() {

  const navigate = useNavigate()
  const location = useLocation()                    //receive data sent from navigate()
  const lot = location.state?.lot;
  const selectedSlot = location.state?.selectedSlot;      //receive state data from slotDetails.jsx through state
  const [selectedHours, setSelectedHours] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState("Pending");
  const user = getUser();


  // create state
  const [bookingData, setBookingData] = useState({
    phone: "",
    vehicleName: "",
    vehicleNumber: "",
    startTime: "",
    endTime: ""
  })


  //amount calculation
  const totalAmount = selectedHours * 30;

  // validation
  const handleBooking = async ( ) => {
    
    try {
      if (!bookingData.phone || !bookingData.vehicleName || !bookingData.vehicleNumber || selectedHours === 0) {
        toast.error("Please fill all fields")
        return
      }

      setPaymentStatus("Pending")

      // store end time during booking
      const startTime = new Date();

      const endTime = new Date(
        startTime.getTime() +
        selectedHours * 60 * 60 * 1000
      );

      //post data to backend
      await API.post("/bookings", {
        userId: user.id,
        username: user.username,
        email: user.email,

        phone: bookingData.phone,
        vehicleName: bookingData.vehicleName,
        vehicleNumber: bookingData.vehicleNumber,
        selectedHours: selectedHours,
        pricePerHour: 30,
        totalAmount: totalAmount,
        slotNumber: selectedSlot.slotNumber,
        floor: selectedSlot.floor, 
        slotId: selectedSlot.id,
        parkingName: lot.name,
        parkingLocation: lot.location,

        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),

        bookingDate: new Date().toISOString(),
        status: "booked"
      })
      //update the slot status
      await API.patch(`/slots/${selectedSlot.id}`, {
        status: "booked"
      })

      setPaymentStatus("Paid")
      alert("Booking successful")

      navigate(`/slotarea/${lot.id}`)

    }
    catch (error) {
      console.log(error)
      alert("Booking failed")
      setPaymentStatus("Pending")

    }
  }

  if (!lot || !selectedSlot) {
    return <div>No booking data found</div>;
  }

  return (
    <div className='min-h-screen bg-slate-950 text-white'>
      <Navbar />
      <div className='max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch'>

        {/* left */}
        <div className='bg-white/5 border border-white/10 rounded-2xl p-6 h-full'>

          <img src={lot.image} alt="parking" className='w-full h-56 object-cover rounded-xl mb-4' />

          <h1 className='text-2xl font-bold text-cyan-400 mb-2'>{lot.name}</h1>
          <p className='text-gray-300 mb-6'>{lot.location}</p>

          {/* slot informations */}
          <div className='space-y-2 text-sm'>

            <p>Slot Number: <span className='font-semibold text-white'>{" "}{selectedSlot.slotNumber}</span></p>
            <p>Floor: <span className='font-semibold text-white'> {" "} {selectedSlot.floor}</span></p>
            <p>Parking Charge: <span className='font-semibold text-white'>{" "}₹30 / hour</span></p>

          </div>

          <div className='mt-6 bg-slate-900/50 border border-white/10 rounded-xl p-5'>
            <h3 className='text-cyan-400 font-semibold mb-2'>Parking Rules</h3>
            <ul className='text-sm text-gray-300 space-y-3'>
              <li>🚗 No overnight parking without booking</li>
              <li>💰 Payment is ₹30/hour</li>
              <li>📋 Slot must be selected before booking</li>
              <li>🔑 Only the logged users can allow to booking</li>
            </ul>
          </div>
        </div>


        {/* right  */}
        <div className='bg-white/5 border border-white/10 rounded-xl p-6 w-full h-full '>
          <h2 className='mb-3'>Booking Details</h2>

          <div className='space-y-4'>

            {/* phone */}
            <input type="text" onChange={(e) => setBookingData({ ...bookingData, [e.target.name]: e.target.value })} name='phone' placeholder='Enter Phone Number' value={bookingData.phone} className='
          w-full p-3 md:p-4 mb-5 rounded-xl bg-white/10 border border-gray-600 text-white outline-none focus:border-cyan-400'/>
            {/* vehicle name */}
            <input type="text" onChange={(e) => setBookingData({ ...bookingData, [e.target.name]: e.target.value })} name='vehicleName' placeholder='Enter Vehicle Name' value={bookingData.vehicleName} className='
          w-full p-3 md:p-4 mb-5 rounded-xl bg-white/10 border border-gray-600 text-white outline-none focus:border-cyan-400'/>
            {/* Vehicle Number */}
            <input type="text" onChange={(e) => setBookingData({ ...bookingData, [e.target.name]: e.target.value })} name='vehicleNumber' placeholder='Enter Vehicle Number' value={bookingData.vehicleNumber} className='
          w-full p-3 md:p-4 mb-5 rounded-xl bg-white/10 border border-gray-600 text-white outline-none focus:border-cyan-400'/>
            {/* start time */}
            <div>
              <label className="text-sm text-gray-400">Select Hours</label>

              <select name="hours" value={selectedHours} onChange={(e) => setSelectedHours(Number(e.target.value))}
                className="w-full mt-2 bg-slate-900 border border-white/10 rounded-lg px-4 py-3 outline-none"
              >
                <option value={0}>Select duration</option>
                <option value={1}>1 Hour</option>
                <option value={2}>2 Hours</option>
                <option value={3}>3 Hours</option>
                <option value={4}>4 Hours</option>
                <option value={5}>5 Hours</option>
                <option value={6}>6 Hours</option>
                <option value={7}>7 Hours</option>
                <option value={8}>8Hours</option>
              </select>
            </div>

            {/* payment */}
            <div className='bg-slate-900 rounded-xl p-4 border border-white/10'>
              <h3 className='mb-2'>Payment Summary</h3>

              <div className='space-y-2 text-sm'>
                <div className='flex justify-between'>
                  <span>Parking Charge</span>
                  <span>₹30 / hour</span>
                </div>

                <div className='space-y-2 text-sm'>
                  <span>Total Hours</span>
                  <span>{selectedHours}</span>
                </div>

                <div className='flex justify-between text-cyan-400 font-bold text-lg'>
                  <span>Total Amount</span>
                  <span>₹{totalAmount}</span>
                </div>

                <div className='flex justify-between'>
                  <span>Payment Status</span>
                  <span className={
                    paymentStatus === "Paid" ? "text-green-400" : "text-yellow-400"}
                  >
                    {paymentStatus}
                  </span>
                </div>

              </div>
            </div>

            {/* button */}
            <button type="button" onClick={handleBooking} className='cursor-pointer w-full bg-cyan-400 hover:bg-cyan-300 text-black font-bold py-3 rounded-xl transition-all duration-300'>
              Confirm Booking
            </button>

          </div>

        </div>
      </div>



    </div>
  )
}

export default Booking