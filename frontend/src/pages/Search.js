import React, { useState } from 'react';
import { Search as SearchIcon, X } from 'lucide-react';
import TrackList from '../components/TrackList';
import PlaylistCard from '../components/PlaylistCard';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [filteredPlaylists, setFilteredPlaylists] = useState([]);
  const [filteredArtists, setFilteredArtists] = useState([]);
  const [searching, setSearching] = useState(false);

  const filters = ['all', 'songs', 'playlists', 'artists'];

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setFilteredSongs([]);
      setFilteredPlaylists([]);
      setFilteredArtists([]);
      return;
    }

    try {
      setSearching(true);
      const response = await axios.get(`${API}/songs/search?q=${encodeURIComponent(query)}`);
      setFilteredSongs(response.data.songs || []);
      setFilteredPlaylists(response.data.playlists || []);
      setFilteredArtists(response.data.artists || []);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setSearching(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // Debounce search
    if (value.trim()) {
      handleSearch(value);
    } else {
      setFilteredSongs([]);
      setFilteredPlaylists([]);
      setFilteredArtists([]);
    }
  };

  const hasResults =
    filteredSongs.length > 0 ||
    filteredPlaylists.length > 0 ||
    filteredArtists.length > 0;

  const browseCategories = [
    {
      name: 'Pop',
      color: 'bg-pink-500',
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop'
    },
    {
      name: 'Hip-Hop',
      color: 'bg-purple-500',
      image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=300&h=300&fit=crop'
    },
    {
      name: 'Rock',
      color: 'bg-red-500',
      image: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=300&h=300&fit=crop'
    },
    {
      name: 'Electronic',
      color: 'bg-blue-500',
      image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop'
    },
    {
      name: 'Jazz',
      color: 'bg-yellow-500',
      image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=300&fit=crop'
    },
    {
      name: 'Classical',
      color: 'bg-indigo-500',
      image: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=300&h=300&fit=crop'
    }
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-900 to-black text-white pb-32">
      <div className="px-8 py-6">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <SearchIcon
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="What do you want to listen to?"
              value={searchQuery}
              onChange={handleInputChange}
              className="w-full bg-white text-black pl-12 pr-12 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-white font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-black"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Search Results */}
        {searching ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">Searching...</p>
          </div>
        ) : searchQuery && hasResults ? (
          <div>
            {/* Filters */}
            <div className="flex gap-2 mb-6">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 rounded-full font-semibold capitalize transition-colors ${
                    activeFilter === filter
                      ? 'bg-white text-black'
                      : 'bg-gray-800 text-white hover:bg-gray-700'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Songs */}
            {(activeFilter === 'all' || activeFilter === 'songs') &&
              filteredSongs.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">Songs</h2>
                  <TrackList songs={filteredSongs.slice(0, 5)} showHeader={true} />
                </div>
              )}

            {/* Playlists */}
            {(activeFilter === 'all' || activeFilter === 'playlists') &&
              filteredPlaylists.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">Playlists</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {filteredPlaylists.map((playlist) => (
                      <PlaylistCard key={playlist.id} playlist={playlist} />
                    ))}
                  </div>
                </div>
              )}

            {/* Artists */}
            {(activeFilter === 'all' || activeFilter === 'artists') &&
              filteredArtists.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">Artists</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {filteredArtists.map((artist) => (
                      <div
                        key={artist.id}
                        className="bg-gray-900 rounded-lg p-4 cursor-pointer transition-all duration-300 hover:bg-gray-800"
                      >
                        <img
                          src={artist.imageUrl}
                          alt={artist.name}
                          className="w-full aspect-square object-cover rounded-full mb-4"
                        />
                        <h3 className="font-bold text-white mb-1">
                          {artist.name}
                        </h3>
                        <p className="text-sm text-gray-400">Artist</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>
        ) : searchQuery ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No results found for &quot;{searchQuery}&quot;</p>
          </div>
        ) : (
          <div>
            {/* Browse Categories */}
            <h2 className="text-2xl font-bold mb-4">Browse all</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {browseCategories.map((category) => (
                <div
                  key={category.name}
                  className={`${category.color} rounded-lg p-4 h-40 cursor-pointer hover:scale-105 transition-transform relative overflow-hidden`}
                >
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {category.name}
                  </h3>
                  <img
                    src={category.image}
                    alt={category.name}
                    className="absolute bottom-0 right-0 w-24 h-24 object-cover transform rotate-12 translate-x-2 translate-y-2 shadow-lg"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;