import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar';
import ParkingCard from '../components/ParkingCard';
import { useNavigate } from "react-router-dom";
import { getUser } from '../services/auth';
import API from '../services/api';

function Favourites() {

    const [favourites, setFavourites] = useState([]);

    useEffect(() => {

        const fetchFavs = async () => {
            const user = getUser();
            if (!user) return;

            const res = await API.get("/favourites");

            const userFavs = res.data
                .filter((item) => item.userId === user.id)
                .map((item) => item.lot);

            setFavourites(userFavs);
        };

        fetchFavs();
    }, []);

    //remove fav card from UI 
    const removeFavourite = (lotId) => {
        setFavourites((prev) =>
            prev.filter((item) => String(item.id) !== String(lotId))
        );
    };

    //handle view for display cards
    const navigate = useNavigate();

    const handleView = (id) => {
        navigate(`/slotdetails/${id}`);
    };

    return (
        <div className="min-h-screen bg-slate-950">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold text-cyan-400 mb-8">Favourite Parking Areas </h1>

                {favourites.length === 0 ? (
                    <p className="text-gray-400">  No favourites added yet.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                        {favourites.map((lot) =>
                        (<ParkingCard key={lot.id} lot={lot} onView={handleView} removeFavourite={removeFavourite} isFavouriteProp={true} />
                        ))}

                    </div>
                )}
            </div>
        </div>
    )
}

export default Favourites