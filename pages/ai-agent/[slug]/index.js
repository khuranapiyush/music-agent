import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ArrowLeft, Clock } from 'lucide-react';
import PlayerLoader from './PlayerLoader';
import {
  createLyrics,
  createVideo,
  fetchListAPI,
  fetchVideoStatus,
} from '../../../src/dataProvider/apiHelper';
import { ResultCard } from '../../../src/component/ResultCard';

const POLLING_INTERVAL = 4000; // 4 seconds

export default function ToolPage({ query }) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [lyricsResult, setLyricsResult] = useState(null);
  const [list, setList] = useState([]);
  const [error, setError] = useState(null);

  const router = useRouter();
  const slug = query?.slug;

  const tool = useSelector((state) => state.aiToolsSlice.tools[slug]);

  useEffect(() => {
    if (!slug) return;
    const fetchList = async () => {
      try {
        const response = await fetchListAPI();
        setList(response.data);
      } catch (err) {
        setError('Failed to fetch list.');
      }
    };

    fetchList();
  }, [slug]);

  if (!tool) {
    return <div>Tool not found</div>;
  }

  // Polling function for video status
  const pollVideoStatus = async (videoId) => {
    try {
      const statusResponse = await fetchVideoStatus(videoId);
      const { status } = statusResponse.data;

      if (status === 'COMPLETED') {
        setResult(statusResponse.data);
      } else if (status === 'PENDING') {
        setTimeout(() => pollVideoStatus(videoId), POLLING_INTERVAL);
      } else if (status === 'FAILED') {
        setError('Failed to generate video.');
        setResult(statusResponse.data);
      }
    } catch (err) {
      setError('Failed to fetch video status.');
    }
  };

  // Handle content creation
  const handleCreate = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response =
        slug === 'scriptgen'
          ? await createLyrics(input)
          : await createVideo(input);

      if (slug === 'scriptgen') {
        setLyricsResult(response);
      } else {
        setResult(response.data);
        pollVideoStatus(response.data.id);
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <PlayerLoader isVideoLoading={slug !== 'scriptgen'} />}
      <div className='min-h-screen bg-[#1E1E1E] text-white p-4 md:p-8 mt-20'>
        <div className='max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8'>
          {/* Left Column */}
          <div className='md:border-r-[1px] md:border-[#353535] pr-[10px]'>
            <div className='flex items-center gap-4 mb-8 pr-[32px]'>
              <button
                onClick={() => router.back()}
                className='text-gray-400 hover:text-white transition-colors'
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
                <div className='absolute bottom-4 right-4 text-sm text-gray-500'>
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
                  : tool.description.split(' ')[0] == 'Music'
                  ? 'Create a music video'
                  : `Create a ${tool.description.split(' ')[0]}`}
              </button>
            </div>
          </div>

          {/* Right Column */}
          <div>
            <div className='flex items-center justify-between mb-8'>
              <h2 className='text-xl font-medium'>Results</h2>
              {/* <button className="flex items-center gap-2 text-[10px] text-gray-400 hover:text-white transition-colors rounded-[70px] border-[1px] border-white p-2">
                <Clock className="w-4 h-4" />
                Check History
              </button> */}
            </div>

            {/* Results Section */}
            {slug === 'scriptgen' ? (
              lyricsResult ? (
                <div className='p-4 bg-[#2A2A2A] rounded-lg space-y-2'>
                  <h3 className='text-lg font-semibold'>Generated Lyrics:</h3>
                  <pre className='whitespace-pre-wrap text-gray-300'>
                    {lyricsResult}
                  </pre>
                </div>
              ) : (
                <div className='h-[400px] flex items-center justify-center text-gray-500 text-2xl font-medium'>
                  No lyrics generated yet.
                </div>
              )
            ) : result ? (
              <div className='my-4'>
                <ResultCard result={result} />
              </div>
            ) : (
              <></>
            )}
            <div className='my-4'>
              {list
                .filter((item) => item.type === 'story')
                .map((filteredItem) => (
                  <ResultCard key={filteredItem.id} result={filteredItem} />
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  return {
    props: { query: context.query },
  };
}
