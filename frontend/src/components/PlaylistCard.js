import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play } from 'lucide-react';

const PlaylistCard = ({ playlist }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/playlist/${playlist.id}`)}
      className="bg-gray-900 rounded-lg p-4 cursor-pointer transition-all duration-300 hover:bg-gray-800 group"
    >
      <div className="relative mb-4">
        <img
          src={playlist.coverUrl}
          alt={playlist.name}
          className="w-full aspect-square object-cover rounded-md"
        />
        <button
          className="absolute bottom-2 right-2 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-lg hover:scale-105"
          onClick={(e) => {
            e.stopPropagation();
            // Play playlist
          }}
        >
          <Play size={20} fill="black" className="text-black ml-0.5" />
        </button>
      </div>
      <h3 className="font-bold text-white mb-1 truncate">{playlist.name}</h3>
      <p className="text-sm text-gray-400 line-clamp-2">{playlist.description}</p>
    </div>
  );
};

export default PlaylistCard;