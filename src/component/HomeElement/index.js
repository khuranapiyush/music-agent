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

// AudioPlayer Component
export const AudioPlayer = ({ currentTrack, onNext, onPrev }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    if (currentTrack && audioRef.current) {
      audioRef.current.src = currentTrack.audioUrl;
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch((error) => {
          console.error('Playback error:', error);
        });
      }
    }
  }, [currentTrack]);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
  };

  const handleSeek = (e) => {
    const time = e.target.value;
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className='fixed bottom-0 left-0 right-0 bg-[#1E1E1E] text-white p-2 border-t border-gray-800'>
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={onNext || {}}
        preload='auto'
      />
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
                </div>
              </>
            )}
          </div>

          <div className='flex flex-col items-center flex-1 gap-2'>
            <div className='flex items-center gap-4'>
              <button
                onClick={onPrev || {}}
                className='p-2 hover:text-[#FF7F50]'
              >
                <SkipBack className='w-5 h-5' />
              </button>
              <button
                onClick={togglePlay}
                className='p-2 bg-[#FF7F50] rounded-full hover:bg-[#FF7F50]/80'
              >
                {isPlaying ? (
                  <Pause className='w-6 h-6' />
                ) : (
                  <Play className='w-6 h-6' />
                )}
              </button>
              <button onClick={onNext} className='p-2 hover:text-[#FF7F50]'>
                <SkipForward className='w-5 h-5' />
              </button>
            </div>

            <div className='flex items-center w-full gap-2'>
              <span className='text-xs'>{formatTime(currentTime)}</span>
              <input
                type='range'
                min={0}
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
                className='flex-1 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer'
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
              defaultValue={1}
              onChange={(e) => (audioRef.current.volume = e.target.value)}
              className='w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer'
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
                </div>
              </div>
            )}
            <div className='flex items-center gap-2'>
              <button
                onClick={onPrev || {}}
                className='p-1 hover:text-[#FF7F50]'
              >
                <SkipBack className='w-4 h-4' />
              </button>
              <button
                onClick={togglePlay}
                className='p-1 bg-[#FF7F50] rounded-full hover:bg-[#FF7F50]/80'
              >
                {isPlaying ? (
                  <Pause className='w-5 h-5' />
                ) : (
                  <Play className='w-5 h-5' />
                )}
              </button>
              <button onClick={onNext} className='p-1 hover:text-[#FF7F50]'>
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
              value={currentTime}
              onChange={handleSeek}
              className='flex-1 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer'
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
      console.error('Error fetching audio list:', error);
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
