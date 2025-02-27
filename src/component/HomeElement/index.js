/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Plus,
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { API_BASE_URL } from '../../constant/constants';
import { Howl } from 'howler';

export const AudioPlayer = ({ currentTrack, onNext, onPrev }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1.0);
  const [isReady, setIsReady] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const soundRef = useRef(null);
  const animationRef = useRef(null);

  // Fix for iOS - ensure audio context is resumed after user interaction
  useEffect(() => {
    const resumeAudioContext = () => {
      if (Howler.ctx && Howler.ctx.state !== 'running') {
        Howler.ctx.resume();
      }
      document.removeEventListener('touchstart', resumeAudioContext);
      document.removeEventListener('touchend', resumeAudioContext);
      document.removeEventListener('click', resumeAudioContext);
    };

    document.addEventListener('touchstart', resumeAudioContext);
    document.addEventListener('touchend', resumeAudioContext);
    document.addEventListener('click', resumeAudioContext);

    return () => {
      document.removeEventListener('touchstart', resumeAudioContext);
      document.removeEventListener('touchend', resumeAudioContext);
      document.removeEventListener('click', resumeAudioContext);
    };
  }, []);

  // Core cleanup function
  const cleanupSound = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    if (soundRef.current) {
      soundRef.current.unload();
      soundRef.current = null;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupSound();
    };
  }, []);

  // Process audio URL for iOS compatibility
  const processAudioUrl = (url) => {
    if (!url) return '';

    let cleanUrl = url.split('?')[0].split('#')[0];

    // Special handling for Walrus blob URLs
    if (url.includes('walrus') && url.includes('/blobs/')) {
      if (!url.endsWith('.mp3')) {
        cleanUrl = `${cleanUrl}`;
      }
    } else if (!cleanUrl.match(/\.(mp3|m4a|aac|wav)$/i)) {
      cleanUrl = `${cleanUrl}`;
    }

    return cleanUrl;
  };

  // Initialize or update Howler sound instance when track changes
  useEffect(() => {
    // Reset state
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setIsReady(false);
    setLoadError(false);

    // Clean up previous resources
    cleanupSound();

    // Skip if no track
    if (!currentTrack?.audioUrl) return;

    // Process the URL for iOS
    const processedUrl = processAudioUrl(currentTrack.audioUrl);

    // Small timeout to ensure proper cleanup
    setTimeout(() => {
      try {
        // Create new Howl instance with iOS-specific optimizations
        soundRef.current = new Howl({
          src: [processedUrl],
          html5: true, // Use HTML5 Audio for streaming
          preload: true,
          format: ['mp3'],
          xhr: {
            method: 'GET',
            headers: {
              // Disable caching which can cause issues on iOS
              'Cache-Control': 'no-cache',
              Pragma: 'no-cache',
              // Force content type to audio/mpeg for iOS
              Accept: 'audio/mpeg, audio/mp3, audio/*',
            },
            withCredentials: false,
          },
          onload: () => {
            if (soundRef.current) {
              setDuration(soundRef.current.duration());
              setIsReady(true);
              setLoadError(false);
            }
          },
          onplay: () => {
            setIsPlaying(true);
            animationRef.current = requestAnimationFrame(updateSeekPosition);
          },
          onpause: () => {
            setIsPlaying(false);
            if (animationRef.current) {
              cancelAnimationFrame(animationRef.current);
              animationRef.current = null;
            }
          },
          onstop: () => {
            setIsPlaying(false);
            setCurrentTime(0);
            if (animationRef.current) {
              cancelAnimationFrame(animationRef.current);
              animationRef.current = null;
            }
          },
          onend: () => {
            setIsPlaying(false);
            if (animationRef.current) {
              cancelAnimationFrame(animationRef.current);
              animationRef.current = null;
            }

            if (onNext) {
              setTimeout(() => onNext(), 100);
            }
          },
          onloaderror: (id, error) => {
            // console.error('Error loading audio:', error);
            setLoadError(true);

            // For Walrus URLs, try an alternative approach if the direct URL with .mp3 fails
            if (
              currentTrack.audioUrl.includes('walrus') &&
              currentTrack.audioUrl.includes('/blobs/')
            ) {
              // Clean up failed instance
              if (soundRef.current) {
                soundRef.current.unload();
                soundRef.current = null;
              }

              // Try with an Audio element approach (works better on some iOS versions)
              const audio = new Audio();
              audio.crossOrigin = 'anonymous';

              audio.addEventListener('canplaythrough', () => {
                // Create a new Howl instance with the manually loaded audio
                soundRef.current = new Howl({
                  src: [currentTrack.audioUrl + '.mp3'], // Try again with .mp3
                  html5: true,
                  format: ['mp3'],
                  onload: () => {
                    if (soundRef.current) {
                      setDuration(soundRef.current.duration());
                      setIsReady(true);
                      setLoadError(false);
                    }
                  },
                  onloaderror: () => {
                    // console.error('Alternative method also failed');
                    setLoadError(true);
                  },
                });
              });

              audio.addEventListener('error', () => {
                // console.error('Alternative method also failed to load audio');
                setLoadError(true);
              });

              // Try to load the audio
              audio.src = currentTrack.audioUrl + '.mp3';
              audio.load();
            }
          },
          onplayerror: (id, error) => {
            // console.error('Error playing audio:', error);

            // Try to recover by reloading
            if (soundRef.current) {
              soundRef.current.once('unlock', () => {
                soundRef.current.play();
              });
            }
          },
        });
      } catch (error) {
        // console.error('Error setting up Howler:', error);
        setLoadError(true);
      }
    }, 100);
  }, [currentTrack, onNext]);

  // Update seek position during playback
  const updateSeekPosition = () => {
    if (soundRef.current && soundRef.current.playing()) {
      try {
        const seek = soundRef.current.seek() || 0;
        if (!isNaN(seek)) {
          setCurrentTime(seek);
        }
        animationRef.current = requestAnimationFrame(updateSeekPosition);
      } catch (error) {
        // console.error('Error updating seek position:', error);
        animationRef.current = requestAnimationFrame(updateSeekPosition);
      }
    }
  };

  const togglePlay = () => {
    if (!soundRef.current || !isReady) return;

    try {
      if (isPlaying) {
        soundRef.current.pause();
      } else {
        // If at the end, restart
        if (currentTime >= duration - 0.1) {
          soundRef.current.seek(0);
        }
        soundRef.current.play();
      }
    } catch (error) {
      // console.error('Error toggling play state:', error);

      // Recovery attempt for iOS
      if (Howler.ctx && Howler.ctx.state !== 'running') {
        Howler.ctx.resume().then(() => {
          if (soundRef.current) {
            soundRef.current.play();
          }
        });
      }
    }
  };

  const handleSeek = (e) => {
    const value = parseFloat(e.target.value);

    if (soundRef.current && !isNaN(value)) {
      try {
        soundRef.current.seek(value);
        setCurrentTime(value);
      } catch (error) {
        // console.error('Error seeking:', error);
      }
    }
  };

  const handleVolumeChange = (e) => {
    const value = parseFloat(e.target.value);
    setVolume(value);

    if (soundRef.current) {
      try {
        soundRef.current.volume(value);
      } catch (error) {
        // console.error('Error changing volume:', error);
      }
    }
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className='fixed bottom-0 left-0 right-0 bg-[#1E1E1E] text-white p-2 border-t border-gray-800'>
      <div className='container mx-auto'>
        {/* Desktop Layout */}
        <div className='flex-col items-center justify-between hidden gap-4 md:flex md:flex-row'>
          <div className='flex items-center gap-4 min-w-[200px]'>
            {currentTrack && (
              <>
                <img
                  src={currentTrack.imageUrl}
                  alt={currentTrack.title}
                  className='w-12 h-12 rounded'
                />
                <div>
                  <h4 className='font-medium'>{currentTrack.title}</h4>
                  <p className='text-sm text-gray-400'>{currentTrack.style}</p>
                  {loadError && (
                    <p className='text-xs text-red-400'>Unable to load audio</p>
                  )}
                </div>
              </>
            )}
          </div>

          <div className='flex flex-col items-center flex-1 gap-2'>
            <div className='flex items-center gap-4'>
              <button
                onClick={onPrev}
                className='p-2 hover:text-[#FF7F50]'
                disabled={!onPrev || !isReady}
              >
                <SkipBack className='w-5 h-5' />
              </button>
              <button
                onClick={togglePlay}
                className='p-2 bg-[#FF7F50] rounded-full hover:bg-[#FF7F50]/80'
                disabled={!isReady || loadError}
              >
                {isPlaying ? (
                  <Pause className='w-6 h-6' />
                ) : (
                  <Play className='w-6 h-6' />
                )}
              </button>
              <button
                onClick={onNext}
                className='p-2 hover:text-[#FF7F50]'
                disabled={!onNext || !isReady}
              >
                <SkipForward className='w-5 h-5' />
              </button>
            </div>

            <div className='flex items-center w-full gap-2'>
              <span className='text-xs'>{formatTime(currentTime)}</span>
              <input
                type='range'
                min={0}
                max={duration || 0}
                step='0.01'
                value={currentTime}
                onChange={handleSeek}
                className='flex-1 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer'
                disabled={!isReady || loadError}
              />
              <span className='text-xs'>{formatTime(duration)}</span>
            </div>
          </div>

          <div className='flex items-center w-32 gap-2'>
            <Volume2 className='w-5 h-5' />
            <input
              type='range'
              min={0}
              max={1}
              step={0.1}
              value={volume}
              onChange={handleVolumeChange}
              className='w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer'
              disabled={!isReady || loadError}
            />
          </div>
        </div>

        {/* Mobile Layout */}
        <div className='flex flex-col items-center md:hidden'>
          <div className='flex items-center justify-between w-full mb-2'>
            {currentTrack && (
              <div className='flex items-center gap-3'>
                <img
                  src={currentTrack.imageUrl}
                  alt={currentTrack.title}
                  className='w-10 h-10 rounded'
                />
                <div>
                  <h4 className='font-medium text-sm truncate max-w-[150px]'>
                    {currentTrack.title}
                  </h4>
                  <p className='text-xs text-gray-400 truncate max-w-[150px]'>
                    {currentTrack.style}
                  </p>
                  {loadError && (
                    <p className='text-xs text-red-400'>Unable to load audio</p>
                  )}
                </div>
              </div>
            )}
            <div className='flex items-center gap-2'>
              <button
                onClick={onPrev}
                className='p-1 hover:text-[#FF7F50]'
                disabled={!onPrev || !isReady}
              >
                <SkipBack className='w-4 h-4' />
              </button>
              <button
                onClick={togglePlay}
                className='p-1 bg-[#FF7F50] rounded-full hover:bg-[#FF7F50]/80'
                disabled={!isReady || loadError}
              >
                {isPlaying ? (
                  <Pause className='w-5 h-5' />
                ) : (
                  <Play className='w-5 h-5' />
                )}
              </button>
              <button
                onClick={onNext}
                className='p-1 hover:text-[#FF7F50]'
                disabled={!onNext || !isReady}
              >
                <SkipForward className='w-4 h-4' />
              </button>
            </div>
          </div>

          <div className='flex items-center w-full gap-2'>
            <span className='w-8 text-xs text-right'>
              {formatTime(currentTime)}
            </span>
            <input
              type='range'
              min={0}
              max={duration || 0}
              step='0.01'
              value={currentTime}
              onChange={handleSeek}
              className='flex-1 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer'
              disabled={!isReady || loadError}
            />
            <span className='w-8 text-xs'>{formatTime(duration)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// MusicCard Component
const MusicCard = ({ data, onPlay, isPlaying }) => {
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className='h-[auto] overflow-hidden transition-transform rounded-lg hover:scale-105'>
      <div className='bg-gradient-to-b from-[#1E1E1E] via-[#2A2A2A] to-[#FFB672]/20 h-full'>
        <div className='relative h-40 md:h-50'>
          <img
            src={data.imageUrl}
            alt={data.title}
            className='object-cover w-full h-full'
          />
        </div>
        <div className='p-4'>
          <div className='flex items-center justify-between mb-1'>
            <h3 className='font-medium text-white'>{data.title}</h3>
            <button
              onClick={() => onPlay(data)}
              className={`${'bg-[#FE964A]'} p-2 rounded-full`}
            >
              {isPlaying ? (
                <Pause className='w-4 h-4 text-black' />
              ) : (
                <Play className='w-4 h-4 text-black' />
              )}
            </button>
          </div>
          <div className='flex flex-wrap gap-2 mb-2'>
            {data.style &&
              data.style.split(',').map((style, index) => (
                <span
                  key={index}
                  className='text-xs px-2 py-1 rounded-lg capitalize text-[#FFD5A9] border border-[#744A2E] bg-[#FE964A]/20'
                >
                  {style.trim()}
                </span>
              ))}
          </div>
          <p className='capitalize rounded-[4px] text-[#D2D2D2] text-xs font-normal leading-[150%]'>
            {formatTime(data.duration)} Min
          </p>
        </div>
      </div>
    </div>
  );
};

// Main Component
const MusicDiscovery = () => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(-1);
  const [audioList, setAudioList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    fetchAudioList();
  }, []);

  const fetchAudioList = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/v1/audio-list`);
      const result = await response.json();

      if (result.success) {
        setAudioList(result.data);
      } else {
        throw new Error(result.error || 'Failed to fetch audio list');
      }
    } catch (error) {
      // console.error('Error fetching audio list:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePlay = (track) => {
    const index = audioList.findIndex((t) => t._id === track._id);
    setCurrentTrackIndex(index);
    setCurrentTrack(track);
  };

  const handleNext = () => {
    if (currentTrackIndex < audioList.length - 1) {
      const nextTrack = audioList[currentTrackIndex + 1];
      setCurrentTrackIndex(currentTrackIndex + 1);
      setCurrentTrack(nextTrack);
    }
  };

  const handlePrev = () => {
    if (currentTrackIndex > 0) {
      const prevTrack = audioList[currentTrackIndex - 1];
      setCurrentTrackIndex(currentTrackIndex - 1);
      setCurrentTrack(prevTrack);
    }
  };

  const handleCreateClick = () => {
    router.push('/ai-agent');
  };

  return (
    <div className='min-h-screen bg-[#0E0E11] pb-24'>
      {/* Sidebar */}
      <aside className='fixed inset-y-0 left-0 hidden w-64 bg-[#18181B] pt-24 md:block'>
        <nav className='p-6 space-y-4'>
          <div
            onClick={() => router.push('/')}
            className={`flex items-center space-x-2 text-white cursor-pointer hover:text-[#FF7F50] p-2 rounded-lg transition-all 
            ${
              pathname?.includes('/')
                ? 'bg-[#FF7F50]/10'
                : 'hover:text-[#FF7F50]'
            }`}
          >
            <span className='text-lg'>🏠</span>
            <span className='font-medium'>Home</span>
          </div>
          <div
            onClick={() => router.push('/ai-agent')}
            className={`flex items-center space-x-2 text-white cursor-pointer p-2 rounded-lg transition-all ${
              pathname?.includes('/ai-agent')
                ? 'bg-[#FF7F50]/10'
                : 'hover:text-[#FF7F50]'
            }`}
          >
            <span className='text-lg'>🎵</span>
            <span className='font-medium'>Create</span>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className='p-6 pt-24 md:ml-64'>
        <h1 className='mb-8 text-3xl font-bold bg-gradient-to-b from-[#FFD5A9] to-white text-transparent bg-clip-text'>
          Discover
        </h1>

        {loading ? (
          <div className='text-center text-white'>Loading...</div>
        ) : error ? (
          <div className='text-center text-red-500'>Error: {error}</div>
        ) : (
          <div className='grid grid-cols-1 gap-6 mb-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
            {audioList.map((item) => (
              <MusicCard
                key={item._id}
                data={item}
                onPlay={handlePlay}
                isPlaying={currentTrack?._id === item._id}
              />
            ))}
          </div>
        )}
      </main>

      {/* Floating Create Button - Mobile Only */}
      <button
        onClick={handleCreateClick}
        className='fixed bottom-[90px] right-6 z-50 md:hidden bg-[#FF7F50] p-4 rounded-full shadow-2xl shadow-[#FF7F50]/50'
      >
        <Plus className='w-6 h-6 text-black' />
      </button>

      {/* Audio Player */}
      {currentTrack && (
        <AudioPlayer
          currentTrack={currentTrack}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      )}
    </div>
  );
};

export default MusicDiscovery;
