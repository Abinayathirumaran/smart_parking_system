import React from 'react';
import API from '../services/api';
import { getUser } from '../services/auth';

function ParkingCard({ lot, onView, isFavorite = false, onToggleFavorite }) {

  // extract MongoDB ID safely (_id or id)
  const lotId = lot._id || lot.id;
  const user = getUser();

  // Safely check if user is logged in and not an admin
  // (Treats standard users as non-admins even if 'role' field is undefined)
  const isRegularUser = Boolean(user && user.role !== 'admin');

  const handleHeartClick = (e) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(lotId);
    }
  };

  return (
    <div className='bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-[0_0_20px_rgba(34,211,238,0.10)] hover:shadow-[0_0_35px_rgba(34,211,238,0.20)] hover:-translate-y-1 transition-all duration-300 flex flex-col w-full max-w-sm mx-auto relative group'>
      
      {/* lot image - reduced height to make card compact */}
      <div className="relative h-36 w-full overflow-hidden bg-slate-900">
        <img src={lot.image || "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=600&q=80"} alt={lot.name}
          className="w-full h-full object-cover hover:scale-105 transition duration-500" />

        {/* Heart Icon Button - Rendered for logged-in non-admin users */}
        {isRegularUser && (
          <button
            type="button"
            onClick={handleHeartClick}
            title={isFavorite ? "Remove from favorites" : "Add to favorites"}
            className="absolute top-3 right-3 p-2 rounded-full bg-slate-900/70 hover:bg-slate-900 backdrop-blur-md border border-white/20 transition duration-300 cursor-pointer text-cyan-400 hover:scale-110 z-10"
          >
            {isFavorite ? (
              // Filled Cyan Heart
              <svg className="w-5 h-5 fill-cyan-400 stroke-cyan-400" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            ) : (
              // Unfilled Heart Outline
              <svg className="w-5 h-5 fill-transparent stroke-white group-hover:stroke-cyan-400 transition" viewBox="0 0 24 24" strokeWidth="2">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            )}
          </button>
        )}
      </div>

      {/* Details */}
      <div className='flex flex-col flex-1 p-4'>
        {/* Title */}
        <div className='mb-1'>
          <h2 className='text-lg font-bold text-cyan-400'>{lot.name}</h2>
        </div>

        {/* Location */}
        <p className='text-gray-400 text-xs mb-4'>{lot.location}</p>

        {/* Action button */}
        <button 
          onClick={() => onView && onView(lotId)} 
          className='mt-auto w-full bg-cyan-400 text-black py-2.5 rounded-xl font-semibold hover:bg-cyan-300 hover:scale-[1.02] transition duration-300 cursor-pointer text-sm'
        >
          View Slots
        </button>

      </div>

    </div>
  );
}

export default ParkingCard;