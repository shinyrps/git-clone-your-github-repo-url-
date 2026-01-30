import React from 'react';
import { mockPlaylists, mockSongs } from '../mock/musicData';
import PlaylistCard from '../components/PlaylistCard';
import { Music, Clock, Heart } from 'lucide-react';

const Library = () => {
  const myPlaylists = mockPlaylists.slice(0, 3);
  const likedSongs = mockSongs.slice(0, 5);

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-900 to-black text-white pb-32">
      <div className="px-8 py-6">
        <h1 className="text-4xl font-bold mb-8">Your Library</h1>

        {/* Liked Songs Section */}
        <section className="mb-8">
          <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg p-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-md flex items-center justify-center">
                <Heart size={32} fill="white" className="text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold">Playlist</p>
                <h2 className="text-3xl font-bold">Liked Songs</h2>
                <p className="text-sm mt-1">{likedSongs.length} songs</p>
              </div>
            </div>
          </div>
        </section>

        {/* Playlists */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Playlists</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {myPlaylists.map((playlist) => (
              <PlaylistCard key={playlist.id} playlist={playlist} />
            ))}
          </div>
        </section>

        {/* Recently Played */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Recently Played</h2>
          <div className="space-y-2">
            {mockSongs.slice(0, 4).map((song) => (
              <div
                key={song.id}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-800 cursor-pointer transition-colors group"
              >
                <img
                  src={song.coverUrl}
                  alt={song.title}
                  className="w-14 h-14 rounded object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white truncate">
                    {song.title}
                  </p>
                  <p className="text-sm text-gray-400 truncate">
                    {song.artist}
                  </p>
                </div>
                <div className="text-sm text-gray-400">{song.duration}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Stats */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Your Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-900 rounded-lg p-6">
              <Music className="text-green-500 mb-2" size={32} />
              <p className="text-3xl font-bold mb-1">{mockSongs.length}</p>
              <p className="text-gray-400">Songs</p>
            </div>
            <div className="bg-gray-900 rounded-lg p-6">
              <Clock className="text-blue-500 mb-2" size={32} />
              <p className="text-3xl font-bold mb-1">127h</p>
              <p className="text-gray-400">Listening Time</p>
            </div>
            <div className="bg-gray-900 rounded-lg p-6">
              <Heart className="text-pink-500 mb-2" size={32} />
              <p className="text-3xl font-bold mb-1">{likedSongs.length}</p>
              <p className="text-gray-400">Liked Songs</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Library;