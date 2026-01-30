import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Library, Plus, Heart, Headphones } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Search, label: 'Search', path: '/search' },
    { icon: Library, label: 'Your Library', path: '/library' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-64 bg-black text-white h-full flex flex-col fixed left-0 top-0 bottom-0">
      {/* Logo */}
      <div className="p-6">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative w-12 h-12">
            {/* Royal background with gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-indigo-700 to-purple-900 rounded-xl shadow-2xl shadow-purple-500/50 group-hover:shadow-purple-400/70 transition-all duration-300"></div>
            
            {/* Golden border */}
            <div className="absolute inset-0 rounded-xl border-2 border-yellow-400/30 group-hover:border-yellow-400/60 transition-all duration-300"></div>
            
            {/* Letter S */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white font-black text-2xl z-10 drop-shadow-lg">S</span>
            </div>
            
            {/* Headphone icon overlay */}
            <div className="absolute -top-1 -right-1 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full p-1 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Headphones size={14} className="text-purple-900" strokeWidth={3} />
            </div>
            
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent rounded-xl opacity-60"></div>
          </div>
          
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-300 via-white to-purple-300 bg-clip-text text-transparent drop-shadow-lg">
            Shinyfy
          </span>
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center gap-4 px-3 py-3 rounded-md transition-colors ${
                  isActive(item.path)
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-900'
                }`}
              >
                <item.icon size={24} />
                <span className="font-semibold">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Library Actions */}
        <div className="mt-6 space-y-2">
          <Link
            to="/create-playlist"
            className="flex items-center gap-4 px-3 py-3 text-gray-400 hover:text-white transition-colors rounded-md hover:bg-gray-900"
          >
            <Plus size={24} />
            <span className="font-semibold">Create Playlist</span>
          </Link>
          <Link
            to="/liked"
            className="flex items-center gap-4 px-3 py-3 text-gray-400 hover:text-white transition-colors rounded-md hover:bg-gray-900"
          >
            <Heart size={24} />
            <span className="font-semibold">Liked Songs</span>
          </Link>
        </div>

        {/* Playlists */}
        <div className="mt-6 border-t border-gray-800 pt-4">
          <div className="space-y-3">
            <div className="px-3 py-2 text-gray-400 hover:text-white cursor-pointer transition-colors rounded-md hover:bg-gray-900">
              <p className="text-sm">Today's Top Hits</p>
            </div>
            <div className="px-3 py-2 text-gray-400 hover:text-white cursor-pointer transition-colors rounded-md hover:bg-gray-900">
              <p className="text-sm">Chill Vibes</p>
            </div>
            <div className="px-3 py-2 text-gray-400 hover:text-white cursor-pointer transition-colors rounded-md hover:bg-gray-900">
              <p className="text-sm">Workout Mix</p>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;