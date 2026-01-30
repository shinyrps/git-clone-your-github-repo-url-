import React, { useState } from 'react';
import { mockPlaylists, mockSongs, mockRegions } from '../mock/musicData';
import PlaylistCard from '../components/PlaylistCard';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

const Home = () => {
  const [selectedRegion, setSelectedRegion] = useState('global');
  const { playSong } = usePlayer();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const recentlyPlayed = mockSongs.slice(0, 4);
  const topPlaylists = mockPlaylists.slice(0, 6);
  const regionalPlaylists = mockPlaylists.filter(
    (p) => p.region.toLowerCase() === selectedRegion || p.region.toLowerCase() === 'global'
  );

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-900 to-black text-white pb-32">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gradient-to-b from-gray-900 to-transparent backdrop-blur-sm">
        <div className="flex items-center justify-between px-8 py-4">
          <div className="flex items-center gap-4">
            <button className="w-8 h-8 bg-black/40 rounded-full flex items-center justify-center hover:bg-black/60 transition-colors">
              <ChevronLeft size={20} />
            </button>
            <button className="w-8 h-8 bg-black/40 rounded-full flex items-center justify-center hover:bg-black/60 transition-colors">
              <ChevronRight size={20} />
            </button>
          </div>
          <button className="bg-white text-black px-8 py-3 rounded-full font-semibold hover:scale-105 transition-transform">
            Log in
          </button>
        </div>
      </div>

      <div className="px-8 py-6">
        {/* Greeting */}
        <h1 className="text-4xl font-bold mb-6">{getGreeting()}</h1>

        {/* Recently Played */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {recentlyPlayed.map((song) => (
            <div
              key={song.id}
              className="bg-gray-800/40 rounded-md flex items-center gap-4 cursor-pointer hover:bg-gray-700/60 transition-colors group"
            >
              <img
                src={song.coverUrl}
                alt={song.title}
                className="w-20 h-20 rounded-l-md object-cover"
              />
              <p className="font-semibold truncate flex-1">{song.title}</p>
            </div>
          ))}
        </div>

        {/* Region Selector */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Browse by Region</h2>
          <div className="flex gap-2 flex-wrap">
            {mockRegions.map((region) => (
              <button
                key={region.id}
                onClick={() => setSelectedRegion(region.id)}
                className={`px-4 py-2 rounded-full font-semibold transition-all ${
                  selectedRegion === region.id
                    ? 'bg-green-500 text-black'
                    : 'bg-gray-800 text-white hover:bg-gray-700'
                }`}
              >
                {region.flag} {region.name}
              </button>
            ))}
          </div>
        </div>

        {/* Regional Playlists */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Popular in Your Region</h2>
            <button className="text-sm font-semibold text-gray-400 hover:text-white transition-colors">
              Show all
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {regionalPlaylists.slice(0, 5).map((playlist) => (
              <PlaylistCard key={playlist.id} playlist={playlist} />
            ))}
          </div>
        </section>

        {/* Top Playlists */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Shinyfy Playlists</h2>
            <button className="text-sm font-semibold text-gray-400 hover:text-white transition-colors">
              Show all
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {topPlaylists.map((playlist) => (
              <PlaylistCard key={playlist.id} playlist={playlist} />
            ))}
          </div>
        </section>

        {/* Made For You */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Made For You</h2>
            <button className="text-sm font-semibold text-gray-400 hover:text-white transition-colors">
              Show all
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {mockPlaylists.slice(0, 5).map((playlist) => (
              <PlaylistCard key={playlist.id} playlist={playlist} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;