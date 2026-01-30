import React, { useEffect } from 'react';
import { usePlayer } from '../context/PlayerContext';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Shuffle,
  Repeat,
  Repeat1,
  Video,
  Music,
  Mic2,
  ListMusic
} from 'lucide-react';
import { Slider } from './ui/slider';

const MusicPlayer = () => {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffled,
    repeatMode,
    showVideo,
    karaokeMode,
    togglePlay,
    playNext,
    playPrevious,
    seekTo,
    changeVolume,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
    toggleVideo,
    toggleKaraoke
  } = usePlayer();

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleProgressChange = (value) => {
    seekTo(value[0]);
  };

  const handleVolumeChange = (value) => {
    changeVolume(value[0]);
  };

  if (!currentSong) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-gray-900 via-black to-gray-900 border-t border-gray-800 text-white px-4 py-3 z-50">
      <div className="max-w-screen-2xl mx-auto">
        <div className="flex items-center justify-between gap-4">
          {/* Song Info */}
          <div className="flex items-center gap-3 min-w-[180px] w-[30%]">
            <img
              src={currentSong.coverUrl}
              alt={currentSong.title}
              className="w-14 h-14 rounded-md object-cover"
            />
            <div className="min-w-0">
              <p className="font-semibold text-sm truncate">{currentSong.title}</p>
              <p className="text-xs text-gray-400 truncate">{currentSong.artist}</p>
            </div>
          </div>

          {/* Player Controls */}
          <div className="flex flex-col items-center gap-2 flex-1 max-w-[40%]">
            <div className="flex items-center gap-4">
              {/* Shuffle */}
              <button
                onClick={toggleShuffle}
                className={`hover:text-white transition-colors ${
                  isShuffled ? 'text-green-500' : 'text-gray-400'
                }`}
                title="Shuffle"
              >
                <Shuffle size={18} />
              </button>

              {/* Previous */}
              <button
                onClick={playPrevious}
                className="text-gray-400 hover:text-white transition-colors"
                title="Previous"
              >
                <SkipBack size={20} fill="currentColor" />
              </button>

              {/* Play/Pause */}
              <button
                onClick={togglePlay}
                className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 transition-transform"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-0.5" />}
              </button>

              {/* Next */}
              <button
                onClick={playNext}
                className="text-gray-400 hover:text-white transition-colors"
                title="Next"
              >
                <SkipForward size={20} fill="currentColor" />
              </button>

              {/* Repeat */}
              <button
                onClick={toggleRepeat}
                className={`hover:text-white transition-colors ${
                  repeatMode !== 'off' ? 'text-green-500' : 'text-gray-400'
                }`}
                title="Repeat"
              >
                {repeatMode === 'one' ? <Repeat1 size={18} /> : <Repeat size={18} />}
              </button>
            </div>

            {/* Progress Bar */}
            <div className="flex items-center gap-2 w-full">
              <span className="text-xs text-gray-400 min-w-[40px] text-right">
                {formatTime(currentTime)}
              </span>
              <Slider
                value={[currentTime]}
                max={duration || 100}
                step={1}
                onValueChange={handleProgressChange}
                className="flex-1"
              />
              <span className="text-xs text-gray-400 min-w-[40px]">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* Additional Controls */}
          <div className="flex items-center gap-3 justify-end min-w-[180px] w-[30%]">
            {/* Karaoke Mode */}
            <button
              onClick={toggleKaraoke}
              className={`hover:text-white transition-colors ${
                karaokeMode ? 'text-green-500' : 'text-gray-400'
              }`}
              title="Karaoke Mode"
            >
              <Mic2 size={20} />
            </button>

            {/* Video/Audio Toggle */}
            <button
              onClick={toggleVideo}
              className={`hover:text-white transition-colors ${
                showVideo ? 'text-green-500' : 'text-gray-400'
              }`}
              title={showVideo ? 'Show Audio Only' : 'Show Video'}
            >
              {showVideo ? <Video size={20} /> : <Music size={20} />}
            </button>

            {/* Queue */}
            <button
              className="text-gray-400 hover:text-white transition-colors"
              title="Queue"
            >
              <ListMusic size={20} />
            </button>

            {/* Volume */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleMute}
                className="text-gray-400 hover:text-white transition-colors"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
              <Slider
                value={[isMuted ? 0 : volume]}
                max={100}
                step={1}
                onValueChange={handleVolumeChange}
                className="w-24"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;