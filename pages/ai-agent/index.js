/* eslint-disable @next/next/no-img-element */
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { ArrowLeft } from 'lucide-react';
import PlayerLoader from './[slug]/PlayerLoader';
import { fetchListAPI, generateAudio } from '../../src/dataProvider/apiHelper';
import { ResultCard } from '../../src/component/ResultCard';
import { AudioPlayer } from '../../src/component/HomeElement';

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

  const tool = useSelector((state) => state.aiToolsSlice.tools['muzicai']);

  // const fetchAudioList = async () => {
  //   try {
  //     const response = await fetch('http://localhost:8000/v1/audio-list');
  //     const result = await response.json();

  //     if (result.success) {
  //       setAudioList(result.data);
  //     } else {
  //       throw new Error(result.error || 'Failed to fetch audio list');
  //     }
  //   } catch (error) {
  //     console.error('Error fetching audio list:', error);
  //     setError(error.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchAudioList();
  // }, []);

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
    <div className='flex h-screen bg-[#0E0E11] overflow-hidden'>
      {/* Sidebar */}
      <aside className='fixed inset-y-0 left-0 hidden w-64 bg-[#18181B] pt-24 md:block'>
        <nav className='p-6 space-y-4'>
          <div
            onClick={() => router.push('/')}
            className={`flex items-center space-x-2 text-white cursor-pointer hover:text-[#FF7F50] p-2 rounded-lg transition-all ${
              pathname === '' ? 'bg-[#FF7F50]/10' : 'hover:text-[#FF7F50]'
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
      <div className='flex-1 ml-64 overflow-y-auto bg-[#0E0E11]'>
        {loading && <PlayerLoader isVideoLoading={slug !== 'scriptgen'} />}
        <div className='h-[auto] bg-[#0E0E11] text-white p-4 md:p-8 mt-20'>
          <div className='grid max-w-6xl grid-cols-1 gap-8 mx-auto md:grid-cols-2'>
            {/* Left Column */}
            <div className='md:border-r-[1px] md:border-[#353535] pr-[10px]'>
              <div className='space-y-4'>
                {/* <h2 className='text-xl font-medium'>Results</h2> */}
                <h2 className='mb-12 text-xl font-bold text-white md:text-xl'>
                  {tool.description}
                </h2>
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
                <div className='rounded-[100px] border-4 border-[#C87D48] bg-gradient-to-b from-[#FE954A] to-[#FC6C14]'>
                  <button
                    className='w-full text-black py-3 font-medium transition-colors rounded-[100px] border-2 border-[#FFD5A9]/20 bg-gradient-to-r from-[#FFD5A9]/50 via-[#FFD5A9] to-[#FFD5A9]/50 shadow-2xl shadow-black/75'
                    onClick={handleCreate}
                    disabled={loading}
                  >
                    {loading
                      ? 'Loading...'
                      : tool.description.split(' ')[0] === 'Music'
                      ? 'Create a Song'
                      : `Create a ${tool.description.split(' ')[0]}`}
                  </button>
                </div>
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
              ) : (
                <div>
                  <p
                    className='text-white/15 text-[50px] items-center justify-center font-bold leading-[150%] tracking-[-2.8px] uppercase'
                    style={{ fontFamily: 'Bricolage Grotesque' }}
                  >
                    Nothing To Show
                  </p>
                </div>
              )}

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
      {currentTrack && (
        <AudioPlayer currentTrack={currentTrack} onNext={{}} onPrev={{}} />
      )}
    </div>
  );
}

export async function getServerSideProps(context) {
  return {
    props: { query: context.query },
  };
}
