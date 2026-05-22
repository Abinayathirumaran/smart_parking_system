import React, { useEffect, useState } from "react";
import API from "../services/api";
import { getUser } from "../services/auth";

function Dashboard() {
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");

  const user = getUser();

  useEffect(() => {
    console.log("Dashboard mounted");
    const fetchBookings = async () => {
      try {
        const res = await API.get("/bookings");
        setBookings(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchBookings();
  }, []);

  // filter using user id
  const myBookings = bookings.filter(
    (b) => b.userId === user?.id
  );

  // total booking calc
  const totalBookings = myBookings.length;

  const totalAmountSpent = myBookings.reduce(
    (acc, b) => acc + (b.totalAmount || 0),
    0
  );

  const latestBookings = myBookings.slice(-3).reverse();
  // delete
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this booking?");
    if (!confirmDelete) return;
    try {
      setBookings((prev) => prev.filter((b) => b.id !== id));
       await API.delete(`/bookings/${id}`);
    } catch (err) {
      console.log(err);
    }
  };

  //booking time expire logic
  useEffect(() => {

    const updateExpiredBookings = async () => {

      try {

        // get all bookings
        const bookingRes = await API.get("/bookings");
        const bookings = bookingRes.data;
        // current time
        const now = new Date();
        // loop through bookings
        for (let booking of bookings) {

          // booking start time
          const bookingStart = new Date(booking.bookingDate);

          // booking end time
          const bookingEnd = new Date(
            bookingStart.getTime() + booking.selectedHours * 60 * 60 * 1000
          );

          // check booking expired
          if (now >= bookingEnd && booking.status === "booked") {

            // update booking status
            await API.patch(`/bookings/${booking.id}`, {
              status: "completed"
            });

            // make slot available again
            await API.patch(`/slots/${booking.slotId}`, {
              status: "available"
            });

          }
        }

      } catch (err) {
        console.log(err);
      }
    };
    const interval = setInterval(() => {
      updateExpiredBookings();
    }, 60000);

    return () => clearInterval(interval);

  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">

      {/* header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-cyan-400">
          My Dashboard
        </h1>
        <p className="text-gray-400">
          Welcome, {user?.username}
        </p>
      </div>

      {/* tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("overview")}
          className={`cursor-pointer px-4 py-2 rounded-lg ${activeTab === "overview"
            ? "bg-cyan-400 text-black"
            : "bg-white/10"
            }`}
        >
          Overview
        </button>

        <button
          onClick={() => setActiveTab("history")}
          className={`cursor-pointer px-4 py-2 rounded-lg ${activeTab === "history"
            ? "bg-cyan-400 text-black"
            : "bg-white/10"
            }`}
        >
          History
        </button>
      </div>

      {/*overview */}
      {activeTab === "overview" && (
        <>
          {/* cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

            <div className="bg-white/5 p-5 rounded-xl border border-white/10">
              <h3 className="text-gray-400">Total Bookings</h3>
              <p className="text-2xl font-bold text-cyan-400">
                {totalBookings}
              </p>
            </div>

            <div className="bg-white/5 p-5 rounded-xl border border-white/10">
              <h3 className="text-gray-400">Total Spent</h3>
              <p className="text-2xl font-bold text-green-400">
                ₹{totalAmountSpent}
              </p>
            </div>

            <div className="bg-white/5 p-5 rounded-xl border border-white/10">
              <h3 className="text-gray-400">Last Booking</h3>
              <p className="text-sm text-gray-300">
                {myBookings.length > 0
                  ? new Date(
                    myBookings[myBookings.length - 1].bookingDate
                  ).toLocaleString()
                  : "No bookings yet"}
              </p>
            </div>

          </div>

          {/* quick view*/}
          <div className="bg-white/5 p-5 rounded-xl border border-white/10">
            <h2 className="text-lg font-semibold mb-4 text-cyan-400">
              Recent Bookings
            </h2>

            {latestBookings.length === 0 ? (
              <p className="text-gray-400">No bookings yet . Start booking your parking slots</p>

            ) : (
              latestBookings.map((b) => (
                <div
                  key={b.id}
                  className="border-b border-white/10 py-3"
                >
                  <p className="font-semibold">{b.vehicleName}</p>
                  <p className="text-sm text-gray-400">
                    {b.parkingName} • ₹{b.totalAmount}
                  </p>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {/* history */}
      {activeTab === "history" && (

        myBookings.length === 0 ? (

          <div className="bg-white/5 p-5 rounded-xl border border-white/10">
            No bookings found
          </div>

        ) : (

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {myBookings.map((b) => (

              <div key={b.id} className=" bg-white/5 border border-white/10 rounded-2xl p-5 shadow-lg shadow-cyan-500/10
          hover:shadow-cyan-500/30 transition-all duration-300 " >
                {/* top  */}
                <div className="flex justify-between items-start mb-4">

                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {b.vehicleName}
                    </h3>

                    <p className="text-sm text-gray-400">
                      {b.vehicleNumber}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${b.status === "completed" ? "bg-green-500/20 text-green-400"
                      : "bg-yellow-500/20 text-yellow-400"} `}>
                    {b.status}
                  </span>
                </div>


                {/* details about history */}
                <div className="space-y-3 text-sm text-gray-300">

                  <div className="flex justify-between">
                    <span>⏱ Duration</span>
                    <span>{b.selectedHours} hrs</span>
                  </div>

                  <div className="flex justify-between">
                    <span>🏢 Parking</span>
                    <span>{b.parkingName}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>🅿️ Slot</span>
                    <span>{b.slotNumber}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>📍 Floor</span>
                    <span>{b.floor}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>💰 Amount</span>
                    <span className="text-cyan-400 font-bold">
                      ₹{b.totalAmount}
                    </span>
                  </div>

                  <div className="border-t border-white/10 pt-3 text-xs text-gray-400">
                    {new Date(b.bookingDate).toLocaleString()}
                  </div>

                </div>


                {/* delete button */}
                <button type="button"
                  onClick={() =>handleDelete(b.id)} 
                  className=" cursor-pointer mt-5 w-full bg-red-500/20 border border-red-500/30 text-red-400  py-2
                  rounded-xl hover:bg-red-500 hover:text-white transition-all duration-300">
                  Delete Booking</button>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}

export default Dashboard; 