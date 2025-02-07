import { useEffect, useState } from 'react';

const PlayerLoader = ({ isVideoLoading }) => {
  const [textIndex, setTextIndex] = useState(0);
  const sentences = [
    'Creating lyrics...',
    'Creating thumbnail...',
    'Creating audio...',
  ];

  useEffect(() => {
    if (textIndex < sentences.length - 1) {
      const randomDelay = Math.floor(Math.random() * (7000 - 3000 + 1)) + 3000;
      const timer = setTimeout(() => {
        setTextIndex(textIndex + 1);
      }, randomDelay);
      return () => clearTimeout(timer);
    }
  }, [textIndex]);

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'>
      <div className='text-center'>
        <div className='inline-block w-12 h-12 mb-4 border-4 rounded-full animate-spin border-t-purple-600 border-purple-600/30'></div>
        <div className='text-lg text-white'>
          {isVideoLoading ? sentences[textIndex] : 'Creating lyrics...'}
        </div>
      </div>
    </div>
  );
};

export default PlayerLoader;
