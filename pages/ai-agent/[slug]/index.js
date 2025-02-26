/* eslint-disable @next/next/no-img-element */
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  ArrowLeft,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
} from 'lucide-react';
import PlayerLoader from './PlayerLoader';
import {
  generateAudio,
  // fetchListAPI,
} from '../../../src/dataProvider/apiHelper';
import { ResultCard } from '../../../src/component/ResultCard';

export default function ToolPage({ query }) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [list, setList] = useState([]);
  const [error, setError] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const router = useRouter();
  const pathname = usePathname();
  const slug = query?.slug;

  const tool = useSelector((state) => state.aiToolsSlice.tools[slug]);

  // useEffect(() => {
  //   if (!slug) return;
  //   const fetchList = async () => {
  //     try {
  //       const response = await fetchListAPI();
  //       setList(response.data);
  //     } catch (err) {
  //       setError('Failed to fetch list.');
  //     }
  //   };

  //   fetchList();
  // }, [slug]);

  if (!tool) {
    return <div>Tool not found</div>;
  }

  const handleCreate = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await generateAudio(input);
      setResult(response.data);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePlay = (track) => {
    if (currentTrack?._id === track._id) {
      if (isPlaying) {
        audioRef.current?.pause();
      } else {
        audioRef.current?.play();
      }
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
    }
  };

  return (
    <div className='flex h-screen bg-[#1E1E1E] overflow-hidden'>
      {/* Sidebar */}
      <aside className='fixed inset-y-0 left-0 hidden w-64 bg-[#18181B] pt-24 md:block'>
        <nav className='p-6 space-y-4'>
          <div
            onClick={() => router.push('/')}
            className='flex items-center space-x-2 text-white cursor-pointer hover:text-[#FF7F50] p-2 rounded-lg transition-all'
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
      <div className='flex-1 ml-64 overflow-y-auto'>
        {loading && <PlayerLoader isVideoLoading={slug !== 'scriptgen'} />}
        <div className='min-h-screen bg-[#1E1E1E] text-white p-4 md:p-8 mt-20'>
          <div className='grid max-w-6xl grid-cols-1 gap-8 mx-auto md:grid-cols-2'>
            {/* Left Column */}
            <div className='md:border-r-[1px] md:border-[#353535] pr-[10px]'>
              <div className='flex items-center gap-4 mb-8 pr-[32px]'>
                <button
                  onClick={() => router.back()}
                  className='text-gray-400 transition-colors hover:text-white'
                >
                  <ArrowLeft className='w-8 h-8' />
                </button>
                <h1 className='text-[20px] md:text-[44px] font-bold text-white'>
                  {tool.name}
                </h1>
              </div>

              <div className='space-y-4'>
                <h2>{tool.description}</h2>
                <div className='relative'>
                  <textarea
                    value={input}
                    onChange={(e) =>
                      setInput(e.target.value.slice(0, tool.maxChars))
                    }
                    placeholder={tool.placeholder}
                    className='w-full h-[225px] bg-[#353535] rounded-xl p-4 text-gray-200 placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/50'
                  />
                  <div className='absolute text-sm text-gray-500 bottom-4 right-4'>
                    {input.length}/{tool.maxChars}
                  </div>
                </div>
                <button
                  className='w-full bg-[#6B61FF] hover:bg-[#6B22FF] text-white rounded-[102px] py-3 font-medium transition-colors'
                  onClick={handleCreate}
                  disabled={loading}
                >
                  {loading
                    ? 'Loading...'
                    : tool.description.split(' ')[0] === 'Music'
                    ? 'Create a music video'
                    : `Create a ${tool.description.split(' ')[0]}`}
                </button>
              </div>
            </div>

            {/* Right Column */}
            <div>
              <div className='flex items-center justify-between mb-8'>
                <h2 className='text-xl font-medium'>Results</h2>
              </div>
              {/* Results Section */}
              {result ? (
                <div className='my-4'>
                  <ResultCard
                    result={result}
                    onPlay={handlePlay}
                    isPlaying={false}
                  />
                </div>
              ) : null}

              <div className='my-4'>
                {list
                  .filter((item) => item.type === 'story')
                  .map((filteredItem) => (
                    <ResultCard
                      key={filteredItem.id}
                      result={filteredItem}
                      onPlay={handlePlay}
                      isPlaying={false}
                    />
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Audio Player */}
      {/* Audio Player */}
      {currentTrack && (
        <div className='fixed bottom-0 left-0 right-0 bg-[#1E1E1E] text-white p-4 border-t border-gray-800'>
          <audio
            ref={audioRef}
            src={currentTrack.videoUrl}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
            autoPlay // Add this to start playing when track changes
          />
          <div className='container flex items-center justify-between gap-4 mx-auto'>
            {/* Track Info */}
            <div className='flex items-center gap-4 min-w-[200px]'>
              <img
                src={currentTrack.thumbUrl}
                alt={currentTrack.title}
                className='w-12 h-12 rounded'
              />
              <div>
                <h4 className='font-medium'>{currentTrack.title}</h4>
                <p className='text-sm text-gray-400'>{currentTrack.status}</p>
              </div>
            </div>

            {/* Controls */}
            <div className='flex flex-col items-center flex-1 gap-2'>
              <div className='flex items-center gap-4'>
                {/* Previous Button */}
                <button
                  className='p-2 text-gray-400 cursor-not-allowed'
                  disabled
                >
                  <SkipBack className='w-5 h-5' />
                </button>

                {/* Play/Pause Button */}
                <button
                  onClick={() => handlePlay(currentTrack)}
                  className='p-3 bg-[#FF7F50] rounded-full hover:bg-[#FF7F50]/80'
                >
                  {isPlaying ? (
                    <Pause className='w-6 h-6' />
                  ) : (
                    <Play className='w-6 h-6' />
                  )}
                </button>

                {/* Next Button */}
                <button
                  className='p-2 text-gray-400 cursor-not-allowed'
                  disabled
                >
                  <SkipForward className='w-5 h-5' />
                </button>
              </div>
            </div>

            {/* Volume Control */}
            <div className='flex items-center w-32 gap-2'>
              <Volume2 className='w-5 h-5' />
              <input
                type='range'
                min={0}
                max={1}
                step={0.1}
                defaultValue={1}
                onChange={(e) => {
                  if (audioRef.current) {
                    audioRef.current.volume = e.target.value;
                  }
                }}
                className='w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer'
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export async function getServerSideProps(context) {
  return {
    props: { query: context.query },
  };
}
