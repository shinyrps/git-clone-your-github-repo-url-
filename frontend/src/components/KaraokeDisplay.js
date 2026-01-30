import React, { useEffect, useState } from 'react';
import { usePlayer } from '../context/PlayerContext';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const KaraokeDisplay = () => {
  const { currentSong, currentTime, karaokeMode } = usePlayer();
  const [lyrics, setLyrics] = useState([]);
  const [currentLyricIndex, setCurrentLyricIndex] = useState(-1);

  useEffect(() => {
    if (!currentSong || !karaokeMode) return;

    const fetchLyrics = async () => {
      try {
        const response = await axios.get(`${API}/songs/${currentSong.song_id}/lyrics`);
        setLyrics(response.data.lyrics || []);
      } catch (error) {
        console.error('Error fetching lyrics:', error);
        setLyrics([]);
      }
    };

    fetchLyrics();
  }, [currentSong, karaokeMode]);

  useEffect(() => {
    if (!lyrics.length) return;

    // Find current lyric based on time
    const index = lyrics.findIndex((lyric, i) => {
      const nextLyric = lyrics[i + 1];
      return currentTime >= lyric.time && (!nextLyric || currentTime < nextLyric.time);
    });

    setCurrentLyricIndex(index);
  }, [currentTime, lyrics]);

  if (!karaokeMode || !currentSong || !lyrics.length) return null;

  return (
    <div className="fixed bottom-32 left-0 right-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="bg-black/80 backdrop-blur-md rounded-lg px-8 py-4 max-w-2xl">
        {lyrics.slice(Math.max(0, currentLyricIndex - 1), currentLyricIndex + 3).map((lyric, idx) => {
          const globalIdx = Math.max(0, currentLyricIndex - 1) + idx;
          const isCurrent = globalIdx === currentLyricIndex;
          
          return (
            <p
              key={idx}
              className={`text-center transition-all duration-300 ${
                isCurrent
                  ? 'text-3xl font-bold text-white scale-110'
                  : 'text-xl text-gray-400'
              } ${idx === 0 || idx === 3 ? 'opacity-50' : 'opacity-100'}`}
              style={{ marginBottom: idx < 2 ? '1rem' : 0 }}
            >
              {lyric.text}
            </p>
          );
        })}
      </div>
    </div>
  );
};

export default KaraokeDisplay;