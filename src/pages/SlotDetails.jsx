import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import Navbar from '../components/Navbar';
import { getUser } from '../services/auth';
import Swal from 'sweetalert2';

function SlotDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // get user and role 
  const user = getUser();
  const isAdmin = user?.role === "admin";

  // STATES
  const [lot, setLot] = useState(null);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLotAndSlots = async () => {
      try {
        setLoading(true);

        // Fetch lot details and slots simultaneously
        const [lotRes, slotsRes] = await Promise.all([
          API.get(`/api/parking/parkingLots/${id}`),
          API.get(`/api/parking/${id}/slots`)
        ]);

        setLot(lotRes.data);
        setSlots(slotsRes.data || []);
      } catch (err) {
        setError("Failed to load parking lot details.");
      } finally {
        setLoading(false);
      }
    };

    fetchLotAndSlots();
  }, [id]);

  if (loading) {
    return (
      <div className='min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center gap-3'>
        <div className="w-10 h-10 border-4 border-cyan-400/20 border-t-cyan-400 rounded-full animate-spin"></div>
        <p className="text-cyan-400 font-medium text-sm animate-pulse">Loading parking layout...</p>
      </div>
    );
  }

  if (error || !lot) {
    return (
      <div className='min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center gap-4 p-4'>
        <p className='text-red-400 bg-red-500/10 border border-red-500/20 px-6 py-3 rounded-xl'>
          {error || "Parking lot not found."}
        </p>
        <button
          onClick={() => navigate('/slotarea')}
          className='bg-cyan-400 text-black px-4 py-2 rounded-lg font-semibold cursor-pointer'
        >
          Back to Slot Area
        </button>
      </div>
    );
  }

  // Group slots by floor using reduce 
  const groupedSlots = slots.reduce((acc, slot) => {
    const floorKey = slot.floor || "1";
    if (!acc[floorKey]) acc[floorKey] = [];
    acc[floorKey].push(slot);
    return acc;
  }, {});

  const totalFloors = Object.keys(groupedSlots).length;
  const totalSlots = slots.length;

  const handleBooking = () => {
    // 🛑 Direct Guard: Block booking if slot is under maintenance (with responsive alert sizing)
    if (selectedSlot?.status === 'maintenance') {
      Swal.fire({
        icon: 'error',
        title: 'Unavailable',
        text: 'This slot is currently under maintenance.',
        background: '#0f172a',
        color: '#ffffff',
        confirmButtonColor: '#06b6d4',
        width: 'auto',
        customClass: {
          popup: 'w-[90vw] max-w-xs sm:max-w-sm p-4 rounded-xl border border-red-500/30 shadow-xl',
          title: 'text-base sm:text-lg font-semibold',
          htmlContainer: 'text-xs sm:text-sm text-gray-300',
          confirmButton: 'text-xs sm:text-sm px-4 py-2 font-medium rounded-lg'
        }
      });
      return;
    }

    const currentUser = getUser();

    // 🛑 Responsive SweetAlert for unauthorized / unauthenticated user
    if (!currentUser) {
      Swal.fire({
        title: 'Login Required',
        text: 'You need to be logged in to proceed with your booking.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#06b6d4', // Cyan theme
        cancelButtonColor: '#475569',  // Slate gray
        confirmButtonText: 'Log In',
        cancelButtonText: 'Cancel',
        background: '#0f172a',         // Slate-900 matching theme
        color: '#ffffff',
        width: 'auto',
        customClass: {
          popup: 'w-[90vw] max-w-xs sm:max-w-sm md:max-w-md p-5 rounded-2xl border border-cyan-500/30 shadow-2xl',
          title: 'text-base sm:text-lg font-bold text-white',
          htmlContainer: 'text-xs sm:text-sm text-gray-300 my-2',
          actions: 'gap-2 mt-3',
          confirmButton: 'text-xs sm:text-sm px-4 py-2 font-semibold rounded-lg',
          cancelButton: 'text-xs sm:text-sm px-4 py-2 font-semibold rounded-lg'
        }
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login", {
            state: {
              from: `/slotarea/${id}`,
              lot,
              selectedSlot
            }
          });
        }
      });
      return;
    }

    // Proceed if logged in
    navigate("/booking", {
      state: {
        lot,
        selectedSlot
      }
    });
  };

  return (
    <div className='min-h-screen bg-slate-950 text-white'>
      <Navbar />

      <div className='flex flex-col lg:flex-row gap-6 p-6 max-w-7xl mx-auto'>

        {/* Left Panel */}
        <div className='lg:w-1/2 w-full bg-white/5 p-6 rounded-2xl border border-white/10 h-fit'>
          <img
            src={lot.image || "https://placehold.co/400x200/0f172a/22d3ee?text=Parking+Lot"}
            alt={lot.name}
            onError={(e) => {
              e.target.onerror = null; 
              e.target.src = "https://placehold.co/400x200/0f172a/22d3ee?text=Parking+Lot";
            }}
            className='w-full h-52 object-cover rounded-xl mb-4'
          />

          <h1 className='text-2xl font-bold text-cyan-400'>{lot.name}</h1>
          <p className='text-gray-300 mb-4'>{lot.location}</p>

          <div className='space-y-2 text-sm border-t border-white/10 pt-4 mb-4'>
            <p><span className='text-gray-400'>Total Floors: </span>{totalFloors}</p>
            <p><span className='text-gray-400'>Total Slots: </span>{totalSlots}</p>
          </div>

          {/* Admin mode */}
          {isAdmin && (
            <div className='mb-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-xs text-center font-medium'>
              🛡️ Admin View Mode: You can monitor slot availability, but slot selection and booking are disabled.
            </div>
          )}

          {/* Status Indicator Legend */}
          <div className='flex flex-wrap gap-4 text-xs bg-slate-900/60 p-3 rounded-xl border border-white/5'>
            <div className='flex items-center gap-2'>
              <div className='w-3.5 h-3.5 bg-green-500/30 border border-green-400 rounded'></div>
              <p className='text-gray-300'>Available</p>
            </div>
            <div className='flex items-center gap-2'>
              <div className='w-3.5 h-3.5 bg-red-500/30 border border-red-400 rounded'></div>
              <p className='text-gray-300'>Booked</p>
            </div>
            <div className='flex items-center gap-2'>
              <div className='w-3.5 h-3.5 bg-amber-500/30 border border-amber-400 rounded'></div>
              <p className='text-gray-300'>Maintenance</p>
            </div>
            <div className='flex items-center gap-2'>
              <div className='w-3.5 h-3.5 bg-cyan-400 rounded'></div>
              <p className='text-gray-300'>Selected</p>
            </div>
          </div>

          {/* Selected Slot Action Box */}
          {selectedSlot && !isAdmin && (
            <div className='mt-6 bg-cyan-500/10 border border-cyan-400/30 p-5 rounded-xl'>
              <h3 className='text-base font-semibold text-cyan-400 mb-2'>Selected Slot Details</h3>
              <p className='text-sm text-gray-300'>Slot Number: <span className='font-bold text-white'>{selectedSlot.slotNumber}</span></p>
              <p className='text-sm text-gray-300 mt-1'>Floor: <span className='font-bold text-white'>{selectedSlot.floor}</span></p>

              <button
                onClick={handleBooking}
                className='w-full mt-4 bg-cyan-400 text-black py-2.5 rounded-lg font-bold hover:bg-cyan-300 transition duration-300 cursor-pointer'
              >
                Proceed to Booking
              </button>
            </div>
          )}
        </div>

        {/* Right Panel - Map Grid View */}
        <div className='lg:w-1/2 w-full'>
          <h2 className='text-xl font-bold mb-4 text-gray-200'>Map View</h2>

          {Object.keys(groupedSlots).length === 0 ? (
            <div className='bg-white/5 border border-white/10 rounded-2xl p-8 text-center flex flex-col items-center justify-center gap-3'>
              <div className='w-12 h-12 rounded-full bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center text-cyan-400 text-xl font-bold'>
                P
              </div>
              <h3 className='text-lg font-semibold text-gray-200'>No Slots Configured</h3>
              <p className='text-gray-400 text-sm max-w-sm'>
                There are currently no slots added for this parking location.
              </p>
            </div>
          ) : (
            Object.keys(groupedSlots).map((floor) => (
              <div key={floor} className='mb-6 bg-white/5 p-4 rounded-2xl border border-white/10'>
                <h3 className='mb-3 font-semibold text-cyan-400 text-sm uppercase tracking-wider'>
                  Floor {floor}
                </h3>

                <div className='grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-5 gap-2.5'>
                  {groupedSlots[floor].map((slot) => {
                    const slotId = slot._id || slot.id;
                    const isBooked = slot.status === "booked";
                    const isMaintenance = slot.status === "maintenance";
                    const isSelected = (selectedSlot?._id || selectedSlot?.id) === slotId;

                    return (
                      <button
                        key={slotId}
                        disabled={isBooked || isMaintenance || isAdmin}
                        onClick={() => {
                          setSelectedSlot(isSelected ? null : slot);
                        }}
                        className={`py-3 px-1 rounded-lg text-center font-bold text-xs border transition-all duration-200 ${
                          isMaintenance
                            ? "bg-amber-500/20 border-amber-500/40 text-amber-300 cursor-not-allowed opacity-70"
                            : isBooked
                            ? "bg-red-500/20 border-red-500/40 text-red-300 cursor-not-allowed opacity-60"
                            : isAdmin
                            ? "bg-green-500/10 border-green-500/20 text-green-400 cursor-not-allowed opacity-75"
                            : isSelected
                            ? "bg-cyan-400 text-black border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.4)] scale-105"
                            : "bg-green-500/20 border-green-500/40 text-green-300 hover:border-green-400 cursor-pointer"
                        }`}
                      >
                        {slot.slotNumber}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}

export default SlotDetails;