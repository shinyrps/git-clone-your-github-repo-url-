import React, { useState, useEffect } from 'react';
import { mockRegions } from '../mock/musicData';
import PlaylistCard from '../components/PlaylistCard';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Home = () => {
  const [selectedRegion, setSelectedRegion] = useState('global');
  const [songs, setSongs] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [loading, setLoading] = useState(true);
  const { playSong } = usePlayer();
  const { user, isAuthenticated, login } = useAuth();

  useEffect(() => {
    fetchData();
  }, [selectedRegion, isAuthenticated]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch songs
      const songsResponse = await axios.get(`${API}/songs?limit=20`);
      setSongs(songsResponse.data);
      
      // Fetch playlists
      const playlistsResponse = await axios.get(`${API}/playlists?limit=10`);
      setPlaylists(playlistsResponse.data);
      
      // Fetch recently played if authenticated
      if (isAuthenticated) {
        try {
          const recentResponse = await axios.get(`${API}/library/recently-played`, {
            withCredentials: true
          });
          setRecentlyPlayed(recentResponse.data.slice(0, 4));
        } catch (error) {
          console.error('Error fetching recently played:', error);
        }
      } else {
        setRecentlyPlayed(songsResponse.data.slice(0, 4));
      }
      
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const topPlaylists = playlists.slice(0, 6);
  const regionalPlaylists = playlists.filter(
    (p) => p.region.toLowerCase() === selectedRegion || p.region.toLowerCase() === 'global'
  );

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

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
          {!isAuthenticated ? (
            <button 
              onClick={login}
              className="bg-white text-black px-8 py-3 rounded-full font-semibold hover:scale-105 transition-transform"
            >
              Log in
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <img 
                src={user?.picture} 
                alt={user?.name}
                className="w-10 h-10 rounded-full"
              />
              <span className="font-semibold">{user?.name}</span>
            </div>
          )}
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
              onClick={() => playSong(song, mockSongs)}
              className="bg-gray-800/40 rounded-md flex items-center gap-4 cursor-pointer hover:bg-gray-700/60 transition-colors group"
            >
              <img
                src={song.coverUrl}
                alt={song.title}
                className="w-20 h-20 rounded-l-md object-cover"
              />
              <p className="font-semibold truncate flex-1">{song.title}</p>
              <div className="mr-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <Play size={20} fill="white" className="text-white" />
              </div>
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