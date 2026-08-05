import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { getUser } from '../services/auth';
import Swal from 'sweetalert2';
import { 
  FaTicketAlt, 
  FaHistory, 
  FaMoneyBillWave, 
  FaTrashAlt, 
  FaTimesCircle, 
  FaCalendarAlt, 
  FaClock, 
  FaCreditCard, 
  FaParking,
  FaSync
} from 'react-icons/fa';

function Dashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [totalSpent, setTotalSpent] = useState(0);
  const [totalBookingsCount, setTotalBookingsCount] = useState(0);

  const user = getUser();

  // Fetch User Bookings
  const fetchDashboardData = async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) setRefreshing(true);
      else setLoading(true);

      const response = await API.get('/api/parking/bookings/my-bookings');
      
      let fetchedBookings = [];
      let fetchedTotal = 0;

      if (response.data.bookings) {
        fetchedBookings = response.data.bookings;
        fetchedTotal = response.data.totalSpent || 0;
      } else if (Array.isArray(response.data)) {
        fetchedBookings = response.data;
        fetchedTotal = response.data.reduce((acc, curr) => acc + (curr.totalAmount || curr.amount || 0), 0);
      }

      setBookings(fetchedBookings);
      setTotalSpent(fetchedTotal);
      setTotalBookingsCount(fetchedBookings.length);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to fetch dashboard data. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // 1. Cancel Active Booking with Refund Prompt
  const handleCancelBooking = async (bookingId) => {
    const confirmResult = await Swal.fire({
      title: 'Cancel Booking?',
      text: 'Your paid amount will be credited back within 5 to 7 business days.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#334155',
      confirmButtonText: 'Yes, Cancel It',
      cancelButtonText: 'Keep Booking',
      background: '#0f172a',
      color: '#fff'
    });

    if (confirmResult.isConfirmed) {
      try {
        await API.delete(`/api/parking/bookings/cancel/${bookingId}`);
        Swal.fire({
          title: 'Cancelled!',
          text: 'Your booking has been cancelled and refund initiated.',
          icon: 'success',
          background: '#0f172a',
          color: '#fff'
        });
        fetchDashboardData(); // Refresh UI
      } catch (err) {
        Swal.fire({
          title: 'Error!',
          text: err.response?.data?.message || 'Failed to cancel booking.',
          icon: 'error',
          background: '#0f172a',
          color: '#fff'
        });
      }
    }
  };

  // 2. Delete Completed History Record (Does not affect total amount spent or total booking count metric)
  const handleDeleteRecord = async (bookingId) => {
    const confirmResult = await Swal.fire({
      title: 'Delete History Record?',
      text: 'This will remove the entry from your history list. Your lifetime total spent and total booking metrics will remain unaffected.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#22d3ee',
      cancelButtonColor: '#334155',
      confirmButtonText: 'Yes, Delete',
      background: '#0f172a',
      color: '#fff'
    });

    if (confirmResult.isConfirmed) {
      try {
        await API.delete(`/api/parking/bookings/history/${bookingId}`);
        Swal.fire({
          title: 'Deleted!',
          text: 'Record cleared from history.',
          icon: 'success',
          background: '#0f172a',
          color: '#fff'
        });
        // Optimistically update visible array without altering overall lifetime metrics
        setBookings((prev) => prev.filter((b) => b._id !== bookingId));
      } catch (err) {
        Swal.fire({
          title: 'Error!',
          text: err.response?.data?.message || 'Failed to delete history record.',
          icon: 'error',
          background: '#0f172a',
          color: '#fff'
        });
      }
    }
  };

  // Helper date & time formatters
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return 'N/A';
    const dateObj = new Date(timeStr);
    if (isNaN(dateObj.getTime())) return timeStr; // Fallback string if already formatted
    return dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const activeBookingsCount = bookings.filter((b) => b.status === 'active' || b.status === 'confirmed').length;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header & Refresh Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-cyan-400">User Dashboard</h1>
            <p className="text-gray-400 text-sm mt-1">
              Welcome back, <span className="text-white font-semibold">{user?.username || 'User'}</span>! Manage your active reservations and view lifetime parking history.
            </p>
          </div>

          <button
            onClick={() => fetchDashboardData(true)}
            disabled={refreshing || loading}
            className="self-start sm:self-center inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-cyan-400 text-sm font-semibold hover:bg-white/10 active:scale-95 transition disabled:opacity-50 cursor-pointer"
          >
            <FaSync className={`${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-md flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Total Bookings</p>
              <h2 className="text-3xl font-bold text-white mt-1">{totalBookingsCount}</h2>
            </div>
            <div className="p-3 bg-cyan-400/10 text-cyan-400 rounded-xl border border-cyan-400/20">
              <FaTicketAlt size={24} />
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-md flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Active Reservations</p>
              <h2 className="text-3xl font-bold text-emerald-400 mt-1">{activeBookingsCount}</h2>
            </div>
            <div className="p-3 bg-emerald-400/10 text-emerald-400 rounded-xl border border-emerald-400/20">
              <FaHistory size={24} />
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-md flex items-center justify-between sm:col-span-2 md:col-span-1">
            <div>
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Total Lifetime Spent</p>
              <h2 className="text-3xl font-bold text-cyan-400 mt-1">₹{totalSpent}</h2>
            </div>
            <div className="p-3 bg-cyan-400/10 text-cyan-400 rounded-xl border border-cyan-400/20">
              <FaMoneyBillWave size={24} />
            </div>
          </div>
        </div>

        {/* Booking History Section */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 md:p-6 backdrop-blur-md">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <FaHistory className="text-cyan-400" /> Booking History & Details
          </h2>

          {loading ? (
            <div className="flex flex-col items-center py-12 gap-3">
              <div className="w-8 h-8 border-4 border-cyan-400/20 border-t-cyan-400 rounded-full animate-spin"></div>
              <p className="text-cyan-400 text-sm">Loading history records...</p>
            </div>
          ) : error ? (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl text-center text-sm">
              {error}
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              No booking records found.
            </div>
          ) : (
            <>
              {/* DESKTOP TABLE VIEW */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-gray-400 text-xs uppercase tracking-wider">
                      <th className="py-3 px-4">Parking Lot & Slot</th>
                      <th className="py-3 px-4">Booking Date</th>
                      <th className="py-3 px-4">Duration (From - Till)</th>
                      <th className="py-3 px-4">Payment Method</th>
                      <th className="py-3 px-4">Amount Paid</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm">
                    {bookings.map((booking) => {
                      const isCompleted = booking.status === 'completed' || booking.status === 'cancelled';
                      const parkingName = booking.parkingId?.name || booking.parkingLot?.name || booking.lotName || 'N/A';
                      const slotNum = booking.slotId?.slotNumber || booking.slotNumber || booking.slot?.slotNumber || 'N/A';

                      return (
                        <tr key={booking._id} className="hover:bg-white/[0.02] transition">
                          {/* Lot & Slot */}
                          <td className="py-4 px-4 font-medium">
                            <div className="flex items-center gap-2">
                              <FaParking className="text-cyan-400 shrink-0" />
                              <div>
                                <p className="text-white font-semibold">{parkingName}</p>
                                <p className="text-xs text-cyan-400">Slot #{slotNum}</p>
                              </div>
                            </div>
                          </td>

                          {/* Booking Date */}
                          <td className="py-4 px-4 text-gray-300">
                            <div className="flex items-center gap-1.5 text-xs">
                              <FaCalendarAlt className="text-gray-500" />
                              {formatDate(booking.createdAt || booking.bookingDate)}
                            </div>
                          </td>

                          {/* Duration */}
                          <td className="py-4 px-4 text-gray-300">
                            <div className="flex items-center gap-1.5 text-xs">
                              <FaClock className="text-gray-500" />
                              <span>
                                {formatTime(booking.startTime || booking.from)} - {formatTime(booking.endTime || booking.till)}
                              </span>
                            </div>
                          </td>

                          {/* Payment Method */}
                          <td className="py-4 px-4 text-gray-300">
                            <div className="flex items-center gap-1.5 text-xs uppercase">
                              <FaCreditCard className="text-gray-500" />
                              {booking.paymentMethod || 'Online UPI'}
                            </div>
                          </td>

                          {/* Amount */}
                          <td className="py-4 px-4 font-bold text-white">
                            ₹{booking.totalAmount || booking.amount || 0}
                          </td>

                          {/* Status Badges */}
                          <td className="py-4 px-4">
                            {!isCompleted ? (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                {booking.status || 'Active'}
                              </span>
                            ) : booking.status === 'completed' ? (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                                Completed
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/30">
                                Cancelled
                              </span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="py-4 px-4 text-center">
                            {!isCompleted ? (
                              <button
                                onClick={() => handleCancelBooking(booking._id)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium hover:bg-red-500/20 transition cursor-pointer"
                                title="Cancel Active Booking"
                              >
                                <FaTimesCircle /> Cancel
                              </button>
                            ) : (
                              <button
                                onClick={() => handleDeleteRecord(booking._id)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-800 border border-gray-600 text-gray-300 text-xs font-medium hover:bg-gray-700 transition cursor-pointer"
                                title="Delete Record From View"
                              >
                                <FaTrashAlt /> Delete
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* MOBILE RESPONSIVE CARD VIEW */}
              <div className="grid grid-cols-1 gap-4 md:hidden">
                {bookings.map((booking) => {
                  const isCompleted = booking.status === 'completed' || booking.status === 'cancelled';
                  const parkingName = booking.parkingId?.name || booking.parkingLot?.name || booking.lotName || 'N/A';
                  const slotNum = booking.slotId?.slotNumber || booking.slotNumber || booking.slot?.slotNumber || 'N/A';

                  return (
                    <div key={booking._id} className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <FaParking className="text-cyan-400 shrink-0 size-5" />
                          <div>
                            <p className="text-white font-semibold text-base">{parkingName}</p>
                            <p className="text-xs text-cyan-400">Slot #{slotNum}</p>
                          </div>
                        </div>

                        {!isCompleted ? (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            {booking.status || 'Active'}
                          </span>
                        ) : booking.status === 'completed' ? (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                            Completed
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/30">
                            Cancelled
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs text-gray-300 pt-2 border-t border-white/5">
                        <div className="flex items-center gap-1.5">
                          <FaCalendarAlt className="text-gray-500" />
                          <span>{formatDate(booking.createdAt || booking.bookingDate)}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <FaCreditCard className="text-gray-500" />
                          <span className="uppercase">{booking.paymentMethod || 'Online UPI'}</span>
                        </div>
                        <div className="flex items-center gap-1.5 col-span-2">
                          <FaClock className="text-gray-500" />
                          <span>
                            {formatTime(booking.startTime || booking.from)} - {formatTime(booking.endTime || booking.till)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-white/10">
                        <div>
                          <p className="text-[10px] text-gray-400 uppercase">Amount Paid</p>
                          <p className="text-lg font-bold text-white">₹{booking.totalAmount || booking.amount || 0}</p>
                        </div>

                        {!isCompleted ? (
                          <button
                            onClick={() => handleCancelBooking(booking._id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium hover:bg-red-500/20 transition"
                          >
                            <FaTimesCircle /> Cancel
                          </button>
                        ) : (
                          <button
                            onClick={() => handleDeleteRecord(booking._id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-800 border border-gray-600 text-gray-300 text-xs font-medium hover:bg-gray-700 transition"
                          >
                            <FaTrashAlt /> Delete
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
}

export default Dashboard;