import React, { useState, useEffect } from 'react'
import ParkingCard from '../components/ParkingCard';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { FiSearch } from "react-icons/fi";

function SlotArea() {

    const [parkingLots, setParkingLots] = useState([]);
    const [search, setSearch] = useState("");
    const [favourites, setFavourites] = useState([]);
    const navigate = useNavigate();

    // search mall filter logic
    const filteredLots = parkingLots.filter((lot) =>
        lot.name.toLowerCase().includes(search.toLowerCase()) || lot.location.toLowerCase().includes(search.toLowerCase())
    );

    const handleView = (id) => {
        navigate(`/slotarea/${id}`)
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await API.get("/parkingLots");
                setParkingLots(response.data);

                const user = getUser();
                if (user) {

                    const favRes = await API.get("/favourites");

                    const userFavs = favRes.data
                        .filter(item => String(item.userId) === String(user.id)
                        )
                        .map(item => String(item.lotId));
                    setFavourites(userFavs);
                }
            } catch (err) {
                console.log(err);
            }
        };

        fetchData();
    }, []);

    return (
        <div className='min-h-screen bg-slate-950'>
            <Navbar />
            <div className='max-w-7xl mx-auto px-4 md:px-10 lg:px-12 py-8'>
                <div className='mb-8'>
                    {/* heading */}
                    <h1 className='text-cyan-400 text-3xl font-bold'>Slot area</h1>
                    <p className='text-gray-400 mt-2'>Choose your preferred parking location and view available slots</p>
                </div>
                {/* search bar */}
                <div className='flex items-center gap-3 mb-8'>
                    <div className='relative w-full md:w-[400px]'>
                        <FiSearch className='absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400
                        ' size={18} />
                        <input type="text" placeholder='Search parking area...' className='w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11
                        pr-4 text-white outline-none focus:border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.08)]'
                            value={search} onChange={(e) => setSearch(e.target.value)} />

                    </div>

                </div>
                {/* grid */}
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                    {
                        filteredLots.map((lot) =>

                        (
                            <ParkingCard key={lot.id} lot={lot} onView={handleView} isFavouriteProp={favourites.includes(String(lot.id))} />
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default SlotArea
