import React, { useState, useEffect } from "react";
import API from "../services/api";

const AdminAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState("");

  const [metrics, setMetrics] = useState({
    totalIncome: 0,
    totalUsers: 0,
    totalParkingLots: 0,
    totalSlots: 0,
    availableSlots: 0,
    bookedSlots: 0,
    maintenanceSlots: 0,
  });

  const [parkingLotStats, setParkingLotStats] = useState([]);

  const fetchAnalyticsData = async (isManual = false) => {
    try {
      if (isManual) setRefreshing(true);
      setError("");

      const res = await API.get("api/admin/analytics");
      const data = res.data;

      setMetrics({
        totalIncome: data.totalIncome || 0,
        totalUsers: data.totalUsers || 0,
        totalParkingLots: data.totalParkingLots || 0,
        totalSlots: data.totalSlots || 0,
        availableSlots: data.availableSlots || 0,
        bookedSlots: data.bookedSlots || 0,
        maintenanceSlots: data.maintenanceSlots || 0,
      });

      setParkingLotStats(data.parkingLotStats || []);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Failed to fetch analytics:", err);
      setError("Unable to connect to live analytics server.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Runs ONLY ONCE when the component mounts
  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const occupancyRate = metrics.totalSlots > 0
    ? Math.round((metrics.bookedSlots / metrics.totalSlots) * 100)
    : 0;

  return (
    <div className="w-full min-w-0 flex-1 px-3 sm:px-6 py-4 space-y-4 sm:space-y-6 text-white font-sans overflow-x-hidden">

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 p-4 sm:p-5 rounded-xl border border-white/10 shadow-lg">
        <div className="min-w-0">
          <h1 className="text-lg sm:text-2xl font-bold text-cyan-400 truncate">Analytics & Insights</h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Real-time revenue, parking lot occupancy, and slot allocations.
          </p>
          {lastUpdated && (
            <p className="text-[11px] text-gray-500 mt-1 font-mono">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>

        {/* MANUAL REFRESH BUTTON */}
        <button
          onClick={() => fetchAnalyticsData(true)}
          disabled={refreshing}
          className="w-full md:w-auto px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs text-cyan-300 font-semibold rounded-lg border border-cyan-500/30 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shrink-0"
        >
          {refreshing ? "Refreshing..." : "🔄 Refresh Data"}
        </button>
      </div>

      {error && (
        <div className="text-xs text-amber-400 bg-amber-950/40 border border-amber-800/50 p-3 rounded-lg">
          ⚠️ {error}
        </div>
      )}

      {loading ? (
        <div className="text-gray-400 text-sm py-12 text-center">Loading analytics metrics...</div>
      ) : (
        <>
          {/* KPI CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            
            <div className="bg-slate-900 p-4 sm:p-5 rounded-xl border border-white/10 space-y-1 min-w-0">
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
                Total Revenue
              </span>
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400 truncate">
                ₹{metrics.totalIncome.toLocaleString("en-IN")}
              </p>
              <p className="text-[10px] sm:text-[11px] text-gray-500">Gross earnings from paid bookings</p>
            </div>

            <div className="bg-slate-900 p-4 sm:p-5 rounded-xl border border-white/10 space-y-1 min-w-0">
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
                Total Users
              </span>
              <p className="text-2xl sm:text-3xl font-extrabold text-cyan-400 truncate">
                {metrics.totalUsers}
              </p>
              <p className="text-[10px] sm:text-[11px] text-gray-500">Registered user accounts</p>
            </div>

            <div className="bg-slate-900 p-4 sm:p-5 rounded-xl border border-white/10 space-y-1 min-w-0">
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
                Active Parking Lots
              </span>
              <p className="text-2xl sm:text-3xl font-extrabold text-white truncate">
                {metrics.totalParkingLots}
              </p>
              <p className="text-[10px] sm:text-[11px] text-gray-500">Commercial lots registered</p>
            </div>

            <div className="bg-slate-900 p-4 sm:p-5 rounded-xl border border-white/10 space-y-1 min-w-0">
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
                Occupancy Rate
              </span>
              <p className="text-2xl sm:text-3xl font-extrabold text-amber-400 truncate">
                {occupancyRate}%
              </p>
              <p className="text-[10px] sm:text-[11px] text-gray-500">Currently booked capacity</p>
            </div>

          </div>

          {/* OVERALL SLOT STATUS */}
          <div className="bg-slate-900 p-4 sm:p-5 rounded-xl border border-white/10 space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-100">Overall Slot Status</h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-center min-w-0">
                <p className="text-[11px] text-gray-400">Total Slots</p>
                <p className="text-base sm:text-lg font-bold text-white mt-1">{metrics.totalSlots}</p>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-emerald-900/40 text-center min-w-0">
                <p className="text-[11px] text-emerald-400 font-semibold">Available</p>
                <p className="text-base sm:text-lg font-bold text-emerald-300 mt-1">{metrics.availableSlots}</p>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-cyan-900/40 text-center min-w-0">
                <p className="text-[11px] text-cyan-400 font-semibold">Booked</p>
                <p className="text-base sm:text-lg font-bold text-cyan-300 mt-1">{metrics.bookedSlots}</p>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-amber-900/40 text-center min-w-0">
                <p className="text-[11px] text-amber-400 font-semibold">Maintenance</p>
                <p className="text-base sm:text-lg font-bold text-amber-300 mt-1">{metrics.maintenanceSlots}</p>
              </div>
            </div>
          </div>

          {/* PARKING LOT BREAKDOWN */}
          <div className="bg-slate-900 p-4 sm:p-5 rounded-xl border border-white/10 space-y-4">
            <h2 className="text-base sm:text-lg font-bold text-slate-100">Parking Lot Breakdown</h2>

            {parkingLotStats.length === 0 ? (
              <p className="text-center text-gray-500 text-xs py-4">No parking lots found.</p>
            ) : (
              <>
                {/* Mobile View */}
                <div className="block lg:hidden space-y-3">
                  {parkingLotStats.map((lot) => (
                    <div key={lot.id} className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-white text-sm">{lot.name}</h3>
                          <p className="text-xs text-gray-400">{lot.location}</p>
                        </div>
                        <span className="text-sm font-bold text-emerald-400 font-mono">
                          ₹{(lot.revenue || 0).toLocaleString("en-IN")}
                        </span>
                      </div>

                      <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-800 text-center font-mono text-xs">
                        <div>
                          <p className="text-[10px] text-gray-500 uppercase">Total</p>
                          <p className="text-gray-200 mt-0.5">{lot.total}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-emerald-500 uppercase">Avail</p>
                          <p className="text-emerald-400 mt-0.5">{lot.available}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-cyan-500 uppercase">Booked</p>
                          <p className="text-cyan-400 mt-0.5">{lot.booked}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-amber-500 uppercase">Maint</p>
                          <p className="text-amber-400 mt-0.5">{lot.maintenance}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop View */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full text-left text-sm text-gray-300">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-950 text-gray-400 text-xs uppercase">
                        <th className="p-3">Parking Lot</th>
                        <th className="p-3">Location</th>
                        <th className="p-3">Total Slots</th>
                        <th className="p-3 text-emerald-400">Available</th>
                        <th className="p-3 text-cyan-400">Booked</th>
                        <th className="p-3 text-amber-400">Maintenance</th>
                        <th className="p-3 text-right">Revenue</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {parkingLotStats.map((lot) => (
                        <tr key={lot.id} className="hover:bg-slate-800/50 transition">
                          <td className="p-3 font-semibold text-white">{lot.name}</td>
                          <td className="p-3 text-gray-400">{lot.location}</td>
                          <td className="p-3 font-mono text-gray-300">{lot.total}</td>
                          <td className="p-3 font-mono text-emerald-400">{lot.available}</td>
                          <td className="p-3 font-mono text-cyan-400">{lot.booked}</td>
                          <td className="p-3 font-mono text-amber-400">{lot.maintenance}</td>
                          <td className="p-3 text-right font-mono font-bold text-emerald-400">
                            ₹{(lot.revenue || 0).toLocaleString("en-IN")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminAnalytics;