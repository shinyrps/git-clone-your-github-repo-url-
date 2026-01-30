import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

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

  const playSong = async (song, playlistSongs = []) => {
    setCurrentSong(song);
    setIsPlaying(true);
    setCurrentTime(0);
    if (playlistSongs.length > 0) {
      setQueue(playlistSongs);
    }
    
    // Track play on backend
    try {
      await axios.post(`${API}/songs/${song.song_id}/play`, {}, {
        withCredentials: true
      });
    } catch (error) {
      console.error('Error tracking play:', error);
    }
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const playNext = () => {
    if (queue.length === 0) return;
    
    const currentIndex = queue.findIndex(s => s.song_id === currentSong?.song_id);
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
    
    playSong(queue[nextIndex], queue);
  };

  const playPrevious = () => {
    if (queue.length === 0) return;
    
    const currentIndex = queue.findIndex(s => s.song_id === currentSong?.song_id);
    let prevIndex = currentIndex - 1;
    
    if (prevIndex < 0) {
      prevIndex = queue.length - 1;
    }
    
    playSong(queue[prevIndex], queue);
  };

  const seekTo = (time) => {
    setCurrentTime(time);
    if (playerRef.current && playerRef.current.seekTo) {
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