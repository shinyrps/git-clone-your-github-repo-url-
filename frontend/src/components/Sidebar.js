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
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <span className="text-2xl font-bold">Shinyfy</span>
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