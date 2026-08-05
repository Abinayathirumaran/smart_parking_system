import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ParkingCard from '../components/ParkingCard';
import Navbar from '../components/Navbar';
import API from '../services/api';
import { getUser } from '../services/auth';
import { FiSearch } from 'react-icons/fi';

function SlotArea() {
    // STATES
    const [parkingLots, setParkingLots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [favourites, setFavourites] = useState([]); 

    const navigate = useNavigate();

    useEffect(() => {
        const fetchParkingData = async () => {
            try {
                setLoading(true);
                setError(null);

                // 1. Fetch all parking lots
                const response = await API.get("/api/parking/parkingLots");
                setParkingLots(response.data || []);

                // 2. If user is logged in, fetch their current favorite list
                const user = getUser();
                if (user) {
                    try {
                        const favsResponse = await API.get("/api/parking/favorites");
                        const favList = favsResponse.data.favorites || [];
                        // Store array of IDs safely
                        const favIds = favList.map((item) => item._id || item.id || item);
                        setFavourites(favIds);
                    } catch (favErr) {
                        console.error("Failed to load user favorites:", favErr);
                    }
                }
            }
            catch (err) {
                setError("Failed to load parking lots. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchParkingData();
    }, []);

    // Toggle favorite logic
    const handleToggleFavorite = async (parkingId) => {
        try {
            // Call API endpoint to toggle favorite in database
            await API.post("/api/parking/favorites/toggle", { parkingId });

            // Update local state immediately so heart fills/unfills instantly
            setFavourites((prevFavs) =>
                prevFavs.includes(parkingId)
                    ? prevFavs.filter((id) => id !== parkingId)
                    : [...prevFavs, parkingId]
            );
        } catch (err) {
            console.error("Failed to toggle favorite:", err);
        }
    };

    // Search Filter - Matching name or location
    const filteredLots = parkingLots.filter((lot) => {
        const query = search.toLowerCase().trim();
        if (!query)
            return true; // if search is empty, show all lots

        const nameMatch = lot.name?.toLowerCase().includes(query);
        const locationMatch = lot.location?.toLowerCase().includes(query);
        return nameMatch || locationMatch;
    });

    const handleView = (id) => {
        navigate(`/slotarea/${id}`);
    };

    return (
        <div className='min-h-screen bg-slate-950 text-white'>
            <Navbar />
            <div className='max-w-7xl mx-auto px-4 md:px-10 lg:px-12 py-8'>

                {/* Header */}
                <div className='mb-8'>
                    <h1 className='text-cyan-400 text-3xl font-bold'>Slot Area</h1>
                    <p className='text-gray-400 mt-2'>
                        Choose your preferred parking location and view available slots
                    </p>
                </div>

                {/* Search bar */}
                <div className='flex items-center gap-3 mb-8'>
                    <div className='relative w-full md:w-[400px]'>
                        <FiSearch className='absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400'
                            size={18}
                        />
                        <input type="text" placeholder='Search by area or location...' value={search}
                            className='w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white outline-none focus:border-cyan-400 transition shadow-[0_0_15px_rgba(34,211,238,0.08)]'
                            onChange={(e) => setSearch(e.target.value)} />
                    </div>
                </div>

                {/* Loading  */}
                {loading && (
                    <div className="flex flex-col justify-center items-center py-16 gap-3">
                        {/* Spinner */}
                        <div className="w-10 h-10 border-4 border-cyan-400/20 border-t-cyan-400 rounded-full animate-spin"></div>

                        {/* Loading text */}
                        <p className="text-cyan-400 font-medium text-sm animate-pulse">
                            Loading available parking lots...
                        </p>
                    </div>
                )}

                {/* Error States */}
                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl mb-6">
                        {error}
                    </div>
                )}

                {/* Empty search result */}
                {!loading && !error && filteredLots.length === 0 && (
                    <div className="text-center py-12 text-gray-400">
                        No parking locations found matching "{search}".
                    </div>
                )}

                {/* Parking cards grid */}
                {!loading && (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {filteredLots.map((lot) => {
                            const currentId = lot._id || lot.id;
                            const isFav = favourites.includes(currentId);

                            return (
                                <ParkingCard
                                    key={currentId}
                                    lot={lot}
                                    onView={handleView}
                                    isFavorite={isFav}
                                    onToggleFavorite={handleToggleFavorite}
                                />
                            );
                        })}
                    </div>
                )}

            </div>
        </div>
    );
}

export default SlotArea;