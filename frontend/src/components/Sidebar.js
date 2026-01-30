import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Library, Plus, Heart, List } from 'lucide-react';

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
        <Link to="/" className="flex items-center gap-3">
          <div className="relative w-10 h-10 bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600 rounded-lg flex items-center justify-center transform rotate-3 hover:rotate-0 transition-transform duration-300 shadow-lg shadow-green-500/50">
            <span className="text-white font-black text-2xl italic transform -rotate-3">S</span>
            <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent rounded-lg"></div>
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Shinyfy</span>
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