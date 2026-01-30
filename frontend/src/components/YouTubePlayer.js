import React, { useEffect, useRef, useState } from 'react';
import { usePlayer } from '../context/PlayerContext';

const YouTubePlayer = () => {
  const {
    currentSong,
    isPlaying,
    showVideo,
    volume,
    isMuted,
    setIsPlaying,
    setCurrentTime,
    setDuration,
    playNext,
    repeatMode
  } = usePlayer();

  const [player, setPlayer] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const playerRef = useRef(null);
  const intervalRef = useRef(null);

  // Load YouTube IFrame API
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        console.log('YouTube API Ready');
      };
    }
  }, []);

  // Initialize player when song changes
  useEffect(() => {
    if (!currentSong || !window.YT) return;

    const initPlayer = () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }

      const newPlayer = new window.YT.Player('youtube-player', {
        height: '360',
        width: '640',
        videoId: currentSong.youtube_id,
        playerVars: {
          autoplay: 1,
          controls: 0,
          disablekb: 1,
          modestbranding: 1,
          rel: 0
        },
        events: {
          onReady: (event) => {
            setIsReady(true);
            setPlayer(event.target);
            playerRef.current = event.target;
            setDuration(event.target.getDuration());
            if (isPlaying) {
              event.target.playVideo();
            }
          },
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.ENDED) {
              if (repeatMode === 'one') {
                event.target.seekTo(0);
                event.target.playVideo();
              } else {
                playNext();
              }
            } else if (event.data === window.YT.PlayerState.PLAYING) {
              setIsPlaying(true);
            } else if (event.data === window.YT.PlayerState.PAUSED) {
              setIsPlaying(false);
            }
          }
        }
      });

      setPlayer(newPlayer);
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [currentSong]);

  // Handle play/pause
  useEffect(() => {
    if (!player || !isReady) return;

    if (isPlaying) {
      player.playVideo();
    } else {
      player.pauseVideo();
    }
  }, [isPlaying, player, isReady]);

  // Handle volume
  useEffect(() => {
    if (!player || !isReady) return;

    if (isMuted) {
      player.mute();
    } else {
      player.unMute();
      player.setVolume(volume);
    }
  }, [volume, isMuted, player, isReady]);

  // Update current time
  useEffect(() => {
    if (!player || !isReady || !isPlaying) return;

    intervalRef.current = setInterval(() => {
      if (player.getCurrentTime) {
        setCurrentTime(Math.floor(player.getCurrentTime()));
      }
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [player, isReady, isPlaying, setCurrentTime]);

  if (!currentSong) return null;

  return (
    <div className={`fixed ${showVideo ? 'bottom-24 right-8' : 'bottom-0 left-0'} z-40`}>
      {showVideo ? (
        <div className="bg-black rounded-lg overflow-hidden shadow-2xl">
          <div id="youtube-player"></div>
        </div>
      ) : (
        <div className="hidden">
          <div id="youtube-player"></div>
        </div>
      )}
    </div>
  );
};

export default YouTubePlayer;