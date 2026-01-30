import React from 'react';
import { useParams } from 'react-router-dom';
import { mockPlaylists, mockSongs } from '../mock/musicData';
import TrackList from '../components/TrackList';
import { Play, MoreHorizontal, Clock } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

const Playlist = () => {
  const { id } = useParams();
  const { playSong } = usePlayer();
  const playlist = mockPlaylists.find((p) => p.id === id);

  if (!playlist) {
    return (
      <div className="flex-1 flex items-center justify-center bg-black text-white">
        <p>Playlist not found</p>
      </div>
    );
  }

  const playlistSongs = playlist.songs
    .map((songId) => mockSongs.find((s) => s.id === songId))
    .filter(Boolean);

  const totalDuration = playlistSongs.reduce((acc, song) => {
    return acc + (song.durationSeconds || 0);
  }, 0);

  const formatTotalDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours} hr ${mins} min` : `${mins} min`;
  };

  const handlePlayPlaylist = () => {
    if (playlistSongs.length > 0) {
      playSong(playlistSongs[0], playlistSongs);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-800 via-gray-900 to-black text-white pb-32">
      {/* Playlist Header */}
      <div className="bg-gradient-to-b from-green-900/40 to-gray-900/0 px-8 py-12">
        <div className="flex items-end gap-6">
          <img
            src={playlist.coverUrl}
            alt={playlist.name}
            className="w-56 h-56 rounded-lg shadow-2xl object-cover"
          />
          <div className="flex-1">
            <p className="text-sm font-semibold uppercase mb-2">Playlist</p>
            <h1 className="text-6xl font-bold mb-6">{playlist.name}</h1>
            <p className="text-gray-300 mb-4">{playlist.description}</p>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-semibold">Shinyfy</span>
              <span>•</span>
              <span>{playlist.followers.toLocaleString()} followers</span>
              <span>•</span>
              <span>{playlistSongs.length} songs</span>
              <span>•</span>
              <span className="text-gray-400">
                {formatTotalDuration(totalDuration)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Playlist Controls */}
      <div className="px-8 py-6 flex items-center gap-6">
        <button
          onClick={handlePlayPlaylist}
          className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center hover:scale-105 hover:bg-green-400 transition-all shadow-lg"
        >
          <Play size={24} fill="black" className="text-black ml-0.5" />
        </button>
        <button className="text-gray-400 hover:text-white transition-colors">
          <MoreHorizontal size={32} />
        </button>
      </div>

      {/* Track List */}
      <div className="px-8">
        <TrackList songs={playlistSongs} showHeader={true} playlist={playlist} />
      </div>
    </div>
  );
};

export default Playlist;