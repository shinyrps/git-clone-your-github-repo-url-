import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { mockSongs } from '../mock/musicData';

const PlayerContext = createContext();

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within PlayerProvider');
  }
  return context;
};

export const PlayerProvider = ({ children }) => {
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState('off'); // 'off', 'all', 'one'
  const [showVideo, setShowVideo] = useState(false);
  const [karaokeMode, setKaraokeMode] = useState(false);
  const playerRef = useRef(null);
  const intervalRef = useRef(null);

  const playSong = (song, playlistSongs = []) => {
    setCurrentSong(song);
    setIsPlaying(true);
    if (playlistSongs.length > 0) {
      setQueue(playlistSongs);
    }
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const playNext = () => {
    if (queue.length === 0) return;
    
    const currentIndex = queue.findIndex(s => s.id === currentSong?.id);
    let nextIndex;
    
    if (isShuffled) {
      nextIndex = Math.floor(Math.random() * queue.length);
    } else {
      nextIndex = currentIndex + 1;
      if (nextIndex >= queue.length) {
        if (repeatMode === 'all') {
          nextIndex = 0;
        } else {
          setIsPlaying(false);
          return;
        }
      }
    }
    
    setCurrentSong(queue[nextIndex]);
    setIsPlaying(true);
  };

  const playPrevious = () => {
    if (queue.length === 0) return;
    
    const currentIndex = queue.findIndex(s => s.id === currentSong?.id);
    let prevIndex = currentIndex - 1;
    
    if (prevIndex < 0) {
      prevIndex = queue.length - 1;
    }
    
    setCurrentSong(queue[prevIndex]);
    setIsPlaying(true);
  };

  const seekTo = (time) => {
    setCurrentTime(time);
    if (playerRef.current) {
      playerRef.current.seekTo(time);
    }
  };

  const changeVolume = (newVolume) => {
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleShuffle = () => {
    setIsShuffled(!isShuffled);
  };

  const toggleRepeat = () => {
    const modes = ['off', 'all', 'one'];
    const currentIndex = modes.indexOf(repeatMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setRepeatMode(modes[nextIndex]);
  };

  const toggleVideo = () => {
    setShowVideo(!showVideo);
  };

  const toggleKaraoke = () => {
    setKaraokeMode(!karaokeMode);
  };

  const addToQueue = (song) => {
    setQueue([...queue, song]);
  };

  useEffect(() => {
    // Simulate time updates (will be replaced with real YouTube player events)
    if (isPlaying && currentSong) {
      intervalRef.current = setInterval(() => {
        setCurrentTime(prev => {
          const next = prev + 1;
          if (next >= (currentSong.durationSeconds || 0)) {
            if (repeatMode === 'one') {
              return 0;
            } else {
              playNext();
              return 0;
            }
          }
          return next;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, currentSong]);

  useEffect(() => {
    if (currentSong) {
      setDuration(currentSong.durationSeconds || 0);
      setCurrentTime(0);
    }
  }, [currentSong]);

  const value = {
    currentSong,
    isPlaying,
    queue,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffled,
    repeatMode,
    showVideo,
    karaokeMode,
    playerRef,
    playSong,
    togglePlay,
    playNext,
    playPrevious,
    seekTo,
    changeVolume,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
    toggleVideo,
    toggleKaraoke,
    addToQueue,
    setIsPlaying,
    setCurrentTime,
    setDuration
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
};