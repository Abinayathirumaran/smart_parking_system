import React, { useState, useEffect } from 'react'
import { FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { getUser } from "../services/auth";
import API from '../services/api';

function ParkingCard({ lot, onView, removeFavourite, isFavouriteProp }) {

  // fav state
  const [isFavourite, setIsFavourite] = useState(
    isFavouriteProp || false
  );

  useEffect(() => {
    setIsFavourite(isFavouriteProp || false);
  }, [isFavouriteProp]);

  //when page loads hearts stays filled
  useEffect(() => {
    const fetchFav = async () => {
      const user = getUser();
      if (!user) return;

      try {
        const res = await API.get("/favourites");
        const exists = res.data.find(
          (item) => String(item.lotId) === String(lot.id) &&
            String(item.userId) === String(user.id)
        );
        setIsFavourite(!!exists);
      } catch (err) {
        console.log(err);
      }
    };
    fetchFav();

  }, [lot.id]);

  // toggle fav func
  const handleFavourite = async (e) => {

    e.preventDefault();
    e.stopPropagation()


    const user = getUser();
    // If not logged in
    if (!user) {
      alert("Please login to add favourites");
      return;
    }

    try {
      const res = await API.get("/favourites");

      const exists = res.data.find(
        (item) => String(item.lotId) === String(lot.id) &&
          String(item.userId) === String(user.id)
      );

      if (exists) {
        // remove
        await API.delete(`/favourites/${exists.id}`);
        setIsFavourite((prev) => !prev);

        if (removeFavourite) {
          removeFavourite(lot.id);
        }

      } else {
        // add
        await API.post("/favourites", {
          userId: user.id,
          lotId: lot.id,
          lot
        });
        setIsFavourite((prev) => !prev);
      }
    } catch (err) {
      console.log(err);
    }

  };

  return (
    <div className='bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-[0_0_20px_rgba(34,211,238,0.10)] hover:shadow-[0_0_35px_rgba(34,211,238,0.20)] hover:-translate-y-1
    transition-all duration-300 flex flex-col'>
      {/* image */}
      <div className="relative h-52 w-full overflow-hidden">
        <img src={lot.image} alt={lot.name} className="w-full h-full object-cover hover:scale-105 transition duration-500" />

        {/* fav-button */}
        <button type="button" onClick={handleFavourite} className='cursor-pointer absolute top-3 right-3 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex
        items-center justify-center text-white '>
          {isFavourite ? (
            <FaHeart className="text-cyan-500 fill-cyan-500 text-xl" size={18} />
          ) : (
            <FiHeart className="text-white text-xl" size={18} />
          )}
        </button>
      </div>

      <div className='flex flex-col flex-1 p-5'>
        {/* title */}
        <div className='mb-4'>
          <h2 className='text-xl font-bold text-cyan-400'>{lot.name}</h2>
        </div>

        <p className='text-gray-400 text-sm mt-2'>{lot.location}</p>

        {/* infos */}
        <div className='flex justify-between items-center bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 mb-5'>
          <p className='text-gray-300 text-sm'>Total Slots</p>
          <span className='bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm border border-green-400'>25 Slots</span>
        </div>
      </div>



      {/* button */}
      <button onClick={() => onView(lot.id)} className='mt-auto w-full bg-cyan-400 text-black py-3 rounded-xl font-semibold hover:bg-cyan-300 hover:scale-[1.02]
      transition duration-300 cursor-pointer'>View Slots</button>

    </div>
  )
}

export default ParkingCard