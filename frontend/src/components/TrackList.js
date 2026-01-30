import React from 'react';
import { usePlayer } from '../context/PlayerContext';
import { Play, Pause, Music } from 'lucide-react';

const TrackList = ({ songs, showHeader = true, playlist = null }) => {
  const { currentSong, isPlaying, playSong, togglePlay } = usePlayer();

  const handlePlaySong = (song) => {
    if (currentSong?.id === song.id) {
      togglePlay();
    } else {
      playSong(song, songs);
    }
  };

  return (
    <div className="w-full">
      {showHeader && (
        <div className="grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-4 py-2 text-sm text-gray-400 border-b border-gray-800">
          <div>#</div>
          <div>Title</div>
          <div>Album</div>
          <div>Duration</div>
        </div>
      )}
      <div className="space-y-1">
        {songs.map((song, index) => {
          const isCurrentSong = currentSong?.song_id === song.song_id;
          const isCurrentlyPlaying = isCurrentSong && isPlaying;

          return (
            <div
              key={song.song_id}
              onClick={() => handlePlaySong(song)}
              className="grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-4 py-3 rounded-md hover:bg-gray-800 cursor-pointer group transition-colors"
            >
              <div className="flex items-center justify-center">
                {isCurrentSong ? (
                  <div className="text-green-500">
                    {isCurrentlyPlaying ? (
                      <Music size={14} className="animate-pulse" />
                    ) : (
                      <Play size={14} />
                    )}
                  </div>
                ) : (
                  <span className="text-gray-400 group-hover:hidden">
                    {index + 1}
                  </span>
                )}
                {!isCurrentSong && (
                  <Play
                    size={14}
                    className="hidden group-hover:block text-white"
                  />
                )}
              </div>
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={song.coverUrl}
                  alt={song.title}
                  className="w-10 h-10 rounded object-cover"
                />
                <div className="min-w-0">
                  <p
                    className={`font-semibold truncate ${
                      isCurrentSong ? 'text-green-500' : 'text-white'
                    }`}
                  >
                    {song.title}
                  </p>
                  <p className="text-sm text-gray-400 truncate">
                    {song.artist}
                  </p>
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-400">
                {song.album}
              </div>
              <div className="flex items-center text-sm text-gray-400">
                {song.duration}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrackList;