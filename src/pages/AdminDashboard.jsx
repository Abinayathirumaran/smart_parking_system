import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const floorPrefixMap = {
  "1": "A",
  "2": "B",
  "3": "C",
  "4": "D",
  "5": "E",
};

// Reusable Confirmation Modal Component
const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, confirmText = "Confirm", isDanger = false }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4 text-center">
        <h3 className="text-lg font-bold text-slate-100">{title}</h3>
        <p className="text-sm text-slate-400">{message}</p>
        
        <div className="flex gap-3 justify-center pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-xs font-semibold hover:bg-slate-700 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
              isDanger
                ? "bg-rose-600 hover:bg-rose-500 text-white"
                : "bg-cyan-500 hover:bg-cyan-400 text-slate-950"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  // States
  const [parkingLots, setParkingLots] = useState([]);
  const [selectedLot, setSelectedLot] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  // Mobile Slot Drawer Toggle State
  const [isSlotsExpanded, setIsSlotsExpanded] = useState(true);

  // Ref for auto-scrolling to the slot section
  const slotSectionRef = useRef(null);

  // Contextual Inline Error States
  const [lotFormError, setLotFormError] = useState("");
  const [slotFormError, setSlotFormError] = useState("");
  const [gridError, setGridError] = useState("");

  // Edit Parking Lot State & Form
  const [editingLot, setEditingLot] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    location: "",
    image: "",
  });
  const [editLoading, setEditLoading] = useState(false);

  // Form States
  const [lotForm, setLotForm] = useState({ name: "", location: "", image: "" });

  // Auto Slot Generator Form
  const [bulkSlotForm, setBulkSlotForm] = useState({
    floor: "1",
    numberOfSlots: "10",
  });

  // Custom Confirm Modal State
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    title: "",
    message: "",
    isDanger: false,
    confirmText: "Confirm",
    onConfirm: null,
  });

  const closeConfirmModal = () => {
    setConfirmState((prev) => ({ ...prev, isOpen: false }));
  };

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const currentAdminName = localStorage.getItem("adminName") || "Admin User";
  const currentAdminAvatar = localStorage.getItem("adminAvatar") || "";

  // Timestamp Formatting
  const formatTimestamp = (isoString) => {
    if (!isoString) return "N/A";
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "N/A";

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Fetch Parking Lots
  const fetchParkingLots = async () => {
    try {
      setLoading(true);
      setGridError("");
      const res = await axios.get(`${API_BASE_URL}/parking/parkingLots`);
      const lotsData = Array.isArray(res.data)
        ? res.data
        : res.data.parkingLots || res.data.lots || [];

      setParkingLots(lotsData);
    } catch (err) {
      console.error("Fetch lots error:", err);
      setParkingLots([]);
      setGridError("Failed to fetch parking locations.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch Slots for Lot
  const fetchSlotsForLot = async (lotId) => {
    try {
      setLoading(true);
      setSlotFormError("");
      const res = await axios.get(`${API_BASE_URL}/parking/${lotId}/slots`);
      const slotsData = Array.isArray(res.data) ? res.data : res.data.slots || [];
      setSlots(slotsData);
    } catch (err) {
      setSlotFormError("Failed to load slots for this location.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParkingLots();
  }, []);

  const handleSelectLot = (lot) => {
    setSelectedLot(lot);
    setIsSlotsExpanded(true);
    fetchSlotsForLot(lot._id);
  };

  // Select Lot + Smooth Scroll to Slot Section
  const handleManageSlotsClick = (e, lot) => {
    e.stopPropagation();
    handleSelectLot(lot);
    
    // Smooth scroll down to the slot manager container
    setTimeout(() => {
      slotSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  // Create Parking Lot
  const handleCreateLot = async (e) => {
    e.preventDefault();
    setLotFormError("");
    try {
      const res = await axios.post(
        `${API_BASE_URL}/admin/parkingLots`,
        {
          ...lotForm,
          createdBy: currentAdminName,
        },
        getAuthHeader()
      );

      const createdLot = res.data.lot || res.data;
      setParkingLots((prev) => [...prev, createdLot]);
      setLotForm({ name: "", location: "", image: "" });
    } catch (err) {
      setLotFormError(err.response?.data?.message || "Failed to create parking location.");
    }
  };

  // Open Edit Modal with lot details
  const handleOpenEditModal = (e, lot) => {
    e.stopPropagation();
    setEditingLot(lot);
    setEditFormData({
      name: lot.name || "",
      location: lot.location || "",
      image: lot.image || "",
    });
  };

  // Update Parking Lot
  const handleUpdateLot = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    try {
      const res = await axios.put(
        `${API_BASE_URL}/admin/parkingLots/${editingLot._id}`,
        {
          ...editFormData,
        },
        getAuthHeader()
      );

      const updatedLot = res.data.lot || res.data;

      setParkingLots((prev) =>
        prev.map((lot) => (lot._id === editingLot._id ? { ...lot, ...updatedLot } : lot))
      );

      if (selectedLot?._id === editingLot._id) {
        setSelectedLot((prev) => ({ ...prev, ...updatedLot }));
      }

      setEditingLot(null);
    } catch (err) {
      console.error("Update lot error:", err);
      setConfirmState({
        isOpen: true,
        title: "Update Failed",
        message: err.response?.data?.message || "Failed to update parking location.",
        confirmText: "Close",
        isDanger: true,
        onConfirm: closeConfirmModal,
      });
    } finally {
      setEditLoading(false);
    }
  };

  // Delete Parking Lot
  const handleDeleteLot = (lotId) => {
    setConfirmState({
      isOpen: true,
      title: "Delete Parking Location?",
      message: "Are you sure? This will permanently delete all slots linked to this location.",
      confirmText: "Delete Location",
      isDanger: true,
      onConfirm: async () => {
        closeConfirmModal();
        try {
          await axios.delete(`${API_BASE_URL}/admin/parkingLots/${lotId}`, getAuthHeader());
          setParkingLots((prev) => prev.filter((lot) => lot._id !== lotId));
          if (selectedLot?._id === lotId) {
            setSelectedLot(null);
            setSlots([]);
          }
        } catch (err) {
          setGridError(err.response?.data?.message || "Failed to delete parking location.");
        }
      },
    });
  };

  // Bulk Create Slots
  const handleBulkCreateSlots = async (e) => {
    e.preventDefault();
    if (!selectedLot) return;
    setSlotFormError("");

    const floorNum = parseInt(bulkSlotForm.floor, 10);
    const count = parseInt(bulkSlotForm.numberOfSlots, 10);

    if (floorNum < 1 || floorNum > 5) {
      setSlotFormError("Floor must be between 1 and 5.");
      return;
    }

    if (isNaN(count) || count < 1 || count > 20) {
      setSlotFormError("You can only create between 1 and 20 slots per floor.");
      return;
    }

    const currentFloorSlots = slots.filter((s) => String(s.floor) === String(floorNum));
    if (currentFloorSlots.length + count > 20) {
      setSlotFormError(
        `Floor ${floorNum} already has ${currentFloorSlots.length} slot(s). Adding ${count} more exceeds the maximum 20-slot limit.`
      );
      return;
    }

    const prefix = floorPrefixMap[String(floorNum)] || "A";

    const formattedSlotsToCreate = Array.from({ length: count }, (_, i) => {
      const slotIndex = currentFloorSlots.length + i + 1;
      const paddedIndex = String(slotIndex).padStart(2, "0");
      return {
        slotNumber: `${prefix}-${floorNum}${paddedIndex}`,
        floor: String(floorNum),
        parkingId: selectedLot._id,
      };
    });

    try {
      const res = await axios.post(
        `${API_BASE_URL}/admin/slots`,
        { slots: formattedSlotsToCreate, parkingId: selectedLot._id },
        getAuthHeader()
      );

      const createdData = res.data.slots || res.data.slot || res.data;
      const createdArray = Array.isArray(createdData) ? createdData : [createdData];

      setSlots((prev) => [...prev, ...createdArray]);
      setBulkSlotForm({ floor: "1", numberOfSlots: "10" });
    } catch (err) {
      setSlotFormError(err.response?.data?.message || "Failed to generate slots.");
    }
  };

  // Toggle Maintenance Status
  const handleToggleMaintenance = (slotId, currentStatus) => {
    if (currentStatus === "occupied") {
      setConfirmState({
        isOpen: true,
        title: "Slot Occupied",
        message: "This slot is currently booked by a user. Clear or cancel the booking before updating status to maintenance.",
        confirmText: "Got it",
        isDanger: false,
        onConfirm: closeConfirmModal,
      });
      return;
    }

    const nextStatus = currentStatus === "maintenance" ? "available" : "maintenance";
    executeMaintenanceToggle(slotId, nextStatus);
  };

  const executeMaintenanceToggle = async (slotId, nextStatus) => {
    try {
      const res = await axios.patch(
        `${API_BASE_URL}/admin/slots/${slotId}/status`,
        { status: nextStatus },
        getAuthHeader()
      );
      const updatedSlot = res.data.slot || res.data;

      setSlots((prev) =>
        prev.map((s) => (s._id === slotId ? { ...s, status: updatedSlot.status } : s))
      );
    } catch (err) {
      setSlotFormError(err.response?.data?.message || "Failed to update slot status.");
    }
  };

  // Delete Slot
  const handleDeleteSlot = (slot) => {
    const isOccupied = slot.status === "occupied";

    setConfirmState({
      isOpen: true,
      title: `Delete Slot ${slot.slotNumber}?`,
      message: isOccupied
        ? "🚨 Slot is currently BOOKED by a user. Deleting this slot will force-cancel their reservation."
        : "Are you sure you want to remove this slot?",
      confirmText: isOccupied ? "Force Delete" : "Delete Slot",
      isDanger: true,
      onConfirm: async () => {
        closeConfirmModal();
        try {
          await axios.delete(`${API_BASE_URL}/admin/slots/${slot._id}`, getAuthHeader());
          setSlots((prev) => prev.filter((s) => s._id !== slot._id));
        } catch (err) {
          setSlotFormError(err.response?.data?.message || "Failed to delete slot.");
        }
      },
    });
  };

  const previewPrefix = floorPrefixMap[bulkSlotForm.floor] || "A";

  return (
    <div className="min-h-screen bg-slate-950 p-3 sm:p-6 font-sans text-slate-100">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-900 p-4 sm:p-6 rounded-xl shadow-lg border border-cyan-500/20 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-cyan-400 tracking-tight">
              Admin Management Panel
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Configure locations, manage slot numbers, and track status.
            </p>
          </div>

          <div className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-3 bg-slate-950 border border-slate-800 hover:border-cyan-500/40 px-3.5 py-2 rounded-xl sm:rounded-full shadow-inner transition-all">
            <div className="relative flex items-center justify-center">
              {currentAdminAvatar ? (
                <img
                  src={currentAdminAvatar}
                  alt={currentAdminName}
                  className="w-8 h-8 rounded-full object-cover border border-cyan-400/50"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center text-xs font-black text-white shadow-md">
                  {currentAdminName.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-slate-950"></span>
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-200 leading-none">
                {currentAdminName}
              </span>
              <span className="text-[10px] text-cyan-400 font-semibold tracking-wider uppercase mt-0.5">
                Online
              </span>
            </div>
          </div>
        </div>

        {/*Create parking lot */}
        <div className="bg-slate-900 p-4 sm:p-6 rounded-xl shadow-md border border-slate-800 space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-cyan-400 flex items-center gap-2">
            <span className="bg-cyan-500 text-slate-950 w-6 h-6 rounded-md flex items-center justify-center text-xs font-extrabold">
              +
            </span>
            Add New Parking Location
          </h2>

          <form onSubmit={handleCreateLot} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <input
              type="text"
              placeholder="Lot Name (e.g. Central Station)"
              value={lotForm.name}
              onChange={(e) => setLotForm({ ...lotForm, name: e.target.value })}
              className="p-2.5 bg-slate-950 border border-slate-700 text-slate-200 placeholder-slate-500 rounded-lg text-sm focus:border-cyan-400 focus:outline-none"
              required
            />
            <input
              type="text"
              placeholder="Location Address"
              value={lotForm.location}
              onChange={(e) => setLotForm({ ...lotForm, location: e.target.value })}
              className="p-2.5 bg-slate-950 border border-slate-700 text-slate-200 placeholder-slate-500 rounded-lg text-sm focus:border-cyan-400 focus:outline-none"
              required
            />
            <input
              type="text"
              placeholder="Image URL (optional)"
              value={lotForm.image}
              onChange={(e) => setLotForm({ ...lotForm, image: e.target.value })}
              className="p-2.5 bg-slate-950 border border-slate-700 text-slate-200 placeholder-slate-500 rounded-lg text-sm focus:border-cyan-400 focus:outline-none"
            />
            <button
              type="submit"
              className="md:col-span-2 lg:col-span-4 bg-cyan-500 text-slate-950 font-bold text-sm py-2.5 rounded-lg hover:bg-cyan-400 transition duration-150 shadow-md shadow-cyan-500/10 cursor-pointer"
            >
              Create Parking Lot
            </button>
          </form>

          {lotFormError && (
            <p className="text-xs font-medium text-rose-400 bg-rose-950/40 border border-rose-800/50 p-2 rounded mt-2">
              ⚠️ {lotFormError}
            </p>
          )}
        </div>

        {/* Parking lots grid */}
        <div className="space-y-4">
          <h2 className="text-lg sm:text-xl font-bold text-slate-100">Parking Locations</h2>
          {loading && <p className="text-slate-400 text-sm">Fetching records...</p>}

          {gridError && (
            <p className="text-xs font-medium text-rose-400 bg-rose-950/40 border border-rose-800/50 p-2 rounded">
              ⚠️ {gridError}
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {parkingLots.map((lot) => {
              const isSelected = selectedLot?._id === lot._id;

              return (
                <div
                  key={lot._id}
                  className={`bg-slate-900 rounded-xl shadow-md border transition-all duration-200 overflow-hidden cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? "border-cyan-400 ring-1 ring-cyan-400/50 bg-slate-850"
                      : "border-slate-800 hover:border-slate-700"
                  }`}
                  onClick={() => handleSelectLot(lot)}
                >
                  <div>
                    {lot.image ? (
                      <img src={lot.image} alt={lot.name} className="w-full h-36 object-cover opacity-90" />
                    ) : (
                      <div className="w-full h-24 bg-slate-950 flex items-center justify-center text-slate-600 text-xs font-semibold uppercase tracking-wider">
                        No Image Provided
                      </div>
                    )}

                    <div className="p-4 sm:p-5 space-y-3">
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-bold text-base sm:text-lg text-slate-100 leading-snug">{lot.name}</h3>
                        <button
                          type="button"
                          onClick={(e) => handleManageSlotsClick(e, lot)}
                          className="text-[11px] font-bold text-cyan-400 hover:text-cyan-300 bg-cyan-950/80 border border-cyan-800/80 hover:border-cyan-500 px-2.5 py-1 rounded-md transition shadow-xs whitespace-nowrap cursor-pointer flex items-center gap-1"
                        >
                          Manage Slots →
                        </button>
                      </div>

                      <p className="text-xs text-slate-400 flex items-center gap-1">
                        📍 {lot.location}
                      </p>

                      <div className="pt-3 border-t border-slate-800 space-y-1 text-[11px] text-slate-400">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-slate-500">Created By:</span>
                          <span className="font-semibold text-cyan-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 truncate max-w-[120px]">
                            {lot.createdBy || currentAdminName}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-slate-500">Created At:</span>
                          <span className="font-mono text-slate-400">{formatTimestamp(lot.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800 flex justify-between items-center gap-2">
                    <button
                      onClick={(e) => handleOpenEditModal(e, lot)}
                      className="bg-cyan-950/60 text-cyan-300 border border-cyan-800/80 hover:bg-cyan-500 hover:text-slate-950 text-xs font-semibold px-3 py-1.5 rounded-md transition cursor-pointer"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteLot(lot._id);
                      }}
                      className="bg-rose-950/60 text-rose-300 border border-rose-800 hover:bg-rose-600 hover:text-white text-xs font-semibold px-3 py-1.5 rounded-md transition cursor-pointer"
                    >
                      Delete Lot
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Edit parking lot */}
        {editingLot && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-cyan-500/30 rounded-2xl p-6 max-w-md w-full text-white shadow-2xl space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h2 className="text-xl font-bold text-cyan-400">Edit Parking Lot</h2>
                <button
                  type="button"
                  onClick={() => setEditingLot(null)}
                  className="text-slate-400 hover:text-white text-lg cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleUpdateLot} className="space-y-4">
                <div>
                  <label className="text-xs text-slate-400 block mb-1 font-semibold">Lot Name</label>
                  <input
                    type="text"
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-200 focus:border-cyan-400 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1 font-semibold">Location Address</label>
                  <input
                    type="text"
                    value={editFormData.location}
                    onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-200 focus:border-cyan-400 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1 font-semibold">Image URL</label>
                  <input
                    type="text"
                    value={editFormData.image}
                    onChange={(e) => setEditFormData({ ...editFormData, image: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-200 focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div className="flex gap-2 justify-end pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setEditingLot(null)}
                    className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-xs font-semibold hover:bg-slate-700 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={editLoading}
                    className="px-4 py-2 bg-cyan-500 text-slate-950 rounded-lg text-xs font-bold hover:bg-cyan-400 transition cursor-pointer disabled:opacity-50"
                  >
                    {editLoading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/*  Bulk slot genarator - configiration for selected slot*/}
        {selectedLot && (
          <div ref={slotSectionRef} className="bg-slate-900 p-4 sm:p-6 rounded-xl border border-cyan-500/30 shadow-lg space-y-6 scroll-mt-6">
            
            {/*collapsable header */}
            <div 
              onClick={() => setIsSlotsExpanded(!isSlotsExpanded)}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-4 border-b border-slate-800 cursor-pointer select-none group"
            >
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                  Selected Location
                </span>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-100">{selectedLot.name}</h2>
                  <span className="text-xs font-bold text-cyan-300 bg-cyan-950/60 border border-cyan-800 px-2 py-0.5 rounded-full flex items-center gap-1 group-hover:bg-cyan-900 transition">
                    Manage Slots {isSlotsExpanded ? "▲" : "▼"}
                  </span>
                </div>
              </div>
              <span className="text-xs text-slate-400 font-mono bg-slate-950 px-3 py-1 rounded-md border border-slate-800">
                ID: {selectedLot._id}
              </span>
            </div>

            {/* expansion container */}
            {isSlotsExpanded && (
              <div className="space-y-6 animate-fadeIn">
                {/* Auto slot generator */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <h3 className="text-xs sm:text-sm font-bold text-cyan-300">
                      ⚡ Auto Slot Generator (Max 5 Floors, Max 20 Slots/Floor)
                    </h3>
                    <span className="text-xs font-mono text-cyan-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                      Preview: {previewPrefix}-{bulkSlotForm.floor}01 to {previewPrefix}-{bulkSlotForm.floor}
                      {String(parseInt(bulkSlotForm.numberOfSlots, 10) || 1).padStart(2, "0")}
                    </span>
                  </div>

                  <form onSubmit={handleBulkCreateSlots} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">
                        Floor Number (Max 5)
                      </label>
                      <select
                        value={bulkSlotForm.floor}
                        onChange={(e) => setBulkSlotForm({ ...bulkSlotForm, floor: e.target.value })}
                        className="w-full p-2 bg-slate-900 border border-slate-700 text-slate-200 rounded-md text-sm focus:border-cyan-400 focus:outline-none"
                      >
                        <option value="1">Floor 1 (Prefix A)</option>
                        <option value="2">Floor 2 (Prefix B)</option>
                        <option value="3">Floor 3 (Prefix C)</option>
                        <option value="4">Floor 4 (Prefix D)</option>
                        <option value="5">Floor 5 (Prefix E)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">
                        Number of Slots (1-20)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={bulkSlotForm.numberOfSlots}
                        onChange={(e) => {
                          const val = Math.max(1, Math.min(20, Number(e.target.value) || 1));
                          setBulkSlotForm({ ...bulkSlotForm, numberOfSlots: String(val) });
                        }}
                        className="w-full p-2 bg-slate-900 border border-slate-700 text-slate-200 rounded-md text-sm focus:border-cyan-400 focus:outline-none"
                        required
                      />
                    </div>

                    <div className="flex items-end">
                      <button
                        type="submit"
                        className="w-full bg-cyan-500 text-slate-950 font-bold text-sm py-2 rounded-md hover:bg-cyan-400 transition cursor-pointer"
                      >
                        Generate Slots
                      </button>
                    </div>
                  </form>

                  {slotFormError && (
                    <p className="text-xs font-medium text-rose-400 bg-rose-950/40 border border-rose-800/50 p-2 rounded">
                      ⚠️ {slotFormError}
                    </p>
                  )}
                </div>

                {/* slots- display grid */}
                <div>
                  <h3 className="text-sm font-bold text-slate-300 mb-3">
                    Configured Slots ({slots.length})
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {slots.length === 0 ? (
                      <p className="col-span-full text-sm text-slate-500 italic">
                        No slots generated for this parking location yet.
                      </p>
                    ) : (
                      slots.map((slot) => {
                        const isMaintenance = slot.status === "maintenance";
                        const isOccupied = slot.status === "occupied";

                        return (
                          <div
                            key={slot._id || slot.slotNumber}
                            className={`bg-slate-950 p-3 rounded-lg border text-center space-y-2 shadow-xs transition flex flex-col justify-between ${
                              isMaintenance
                                ? "border-amber-600/50 bg-amber-950/20"
                                : isOccupied
                                ? "border-rose-600/50 bg-rose-950/20"
                                : "border-slate-800"
                            }`}
                          >
                            <div className="space-y-1">
                              <p className="font-black text-sm sm:text-base text-cyan-300 truncate">{slot.slotNumber}</p>
                              <p className="text-[11px] text-slate-400 font-medium">
                                Floor {slot.floor || "1"}
                              </p>

                              {/* Responsive Badge */}
                              <div className="flex justify-center">
                                <span
                                  className={`inline-block text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded truncate max-w-full ${
                                    isMaintenance
                                      ? "bg-amber-950/80 text-amber-300 border border-amber-700"
                                      : isOccupied
                                      ? "bg-rose-950/80 text-rose-300 border border-rose-700"
                                      : "bg-emerald-950/60 text-emerald-400 border border-emerald-800"
                                  }`}
                                >
                                  {slot.status || "available"}
                                </span>
                              </div>
                            </div>

                            {slot._id && (
                              <div className="space-y-1.5 pt-1">
                                <button
                                  type="button"
                                  onClick={() => handleToggleMaintenance(slot._id, slot.status)}
                                  className={`block w-full text-[10px] sm:text-xs font-bold py-1 px-1 rounded transition border truncate ${
                                    isOccupied
                                      ? "bg-slate-900 text-slate-600 border-slate-800 cursor-not-allowed opacity-50"
                                      : isMaintenance
                                      ? "bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border-emerald-700 cursor-pointer"
                                      : "bg-amber-950/80 hover:bg-amber-900 text-amber-300 border-amber-700 cursor-pointer"
                                  }`}
                                >
                                  {isMaintenance ? "Set Available" : "Mark Maintenance"}
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleDeleteSlot(slot)}
                                  className={`block w-full text-[10px] sm:text-[11px] font-semibold py-1 px-1 rounded transition border truncate ${
                                    isOccupied
                                      ? "bg-rose-950/80 hover:bg-rose-900 text-rose-300 border-rose-800 cursor-pointer"
                                      : "bg-slate-900 hover:bg-rose-950 text-slate-400 hover:text-rose-300 border-slate-800 hover:border-rose-800 cursor-pointer"
                                  }`}
                                >
                                  {isOccupied ? "Force Cancel" : "Remove"}
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* confirmation modal */}
      <ConfirmModal isOpen={confirmState.isOpen} title={confirmState.title}  message={confirmState.message}
        confirmText={confirmState.confirmText} isDanger={confirmState.isDanger}   onConfirm={confirmState.onConfirm}
        onCancel={closeConfirmModal}
      />
    </div>
  );
};

export default AdminDashboard;