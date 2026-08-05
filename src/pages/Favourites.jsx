import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ParkingCard from '../components/ParkingCard';
import API from '../services/api';
import { getUser } from '../services/auth';

const Favourites = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchFavorites = async () => {
        const user = getUser();
        if (!user) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const res = await API.get('/api/parking/favorites');
            setFavorites(res.data.favorites || []);
        } catch (err) {
            console.error("Error loading favorites:", err);
            setError("Failed to load favorite parking spots.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFavorites();
    }, []);

    // Toggle favorite logic
    const handleToggleFavorite = async (parkingId) => {
        try {
            await API.post('/api/parking/favorites/toggle', { parkingId });
            // Instantly remove card from favorites view when toggled off
            setFavorites((prevFavs) => prevFavs.filter((item) => (item._id || item.id) !== parkingId));
        } catch (err) {
            console.error("Failed to toggle favorite:", err);
        }
    };

    // Navigation logic matching your App routes
    const handleViewSlots = (lotId) => {
        navigate(`/slotdetails/${lotId}`);
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            <Navbar />
            
            <div className="max-w-7xl mx-auto px-4 md:px-10 lg:px-12 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-cyan-400">Favorite Parking Spots</h1>
                    <p className="text-gray-400 mt-1">Quick access to your saved parking locations</p>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex flex-col justify-center items-center py-16 gap-3">
                        <div className="w-10 h-10 border-4 border-cyan-400/20 border-t-cyan-400 rounded-full animate-spin"></div>
                        <p className="text-cyan-400 font-medium text-sm animate-pulse">
                            Loading your favorites...
                        </p>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl mb-6">
                        {error}
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && favorites.length === 0 && (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 text-center text-gray-400 max-w-md mx-auto shadow-[0_0_20px_rgba(34,211,238,0.05)]">
                        <p className="text-sm sm:text-base font-medium text-gray-300">
                            No favorite parking lots saved yet.
                        </p>
                    </div>
                )}

                {/* Favorites Grid */}
                {!loading && !error && favorites.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {favorites.map((lot) => (
                            <ParkingCard
                                key={lot._id || lot.id}
                                lot={lot}
                                isFavorite={true}
                                onToggleFavorite={handleToggleFavorite}
                                onView={handleViewSlots}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Favourites;