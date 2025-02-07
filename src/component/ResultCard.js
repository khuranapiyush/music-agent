/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Share2,
  MoreVertical,
  Download,
  Flag,
  ExternalLink,
  Pause,
  Play,
} from 'lucide-react';

export function ResultCard({ result, onPlay, isPlaying }) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  const handleClick = () => {
    onPlay(result);
  };

  const handleShare = (e) => {
    e.stopPropagation();
  };

  const handleDownload = (e) => {
    e.stopPropagation();
    setShowMenu(false);
  };

  const handleReport = (e) => {
    e.stopPropagation();
    setShowMenu(false);
  };

  const toggleMenu = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  return (
    <div
      onClick={handleClick}
      className='mt-4 bg-[#2A2A2A] rounded-lg p-4 flex items-center gap-4 cursor-pointer hover:bg-[#333333] transition-colors'
    >
      <div className='relative flex items-center justify-center w-16 h-16 bg-pink-400 rounded-lg'>
        <div className='flex items-center justify-center w-8 h-8 bg-white rounded-full'>
          {/* <div className="w-2 h-2 bg-black rounded-full" /> */}
          <div className='absolute inset-0 flex items-center justify-center rounded-lg bg-black/40'>
            {isPlaying ? (
              <Pause className='w-8 h-8 text-white' />
            ) : (
              <Play className='w-8 h-8 text-white' />
            )}
          </div>
          <img
            src={result.imageUrl}
            alt='result'
            className='w-20 h-12 rounded-lg'
          />
        </div>
      </div>
      <div className='flex-1'>
        <h3 className='font-medium text-white'>{result?.title}</h3>
        <p className='text-sm text-gray-400'>{result?.status}</p>
        {/* <p className="text-sm text-gray-400">{result.duration}</p> */}
      </div>
      {/* <div className='flex items-center gap-2'>
        <button
          onClick={handleShare}
          className='p-2 transition-colors rounded-full hover:bg-white/10'
        >
          <ExternalLink
            className='w-5 h-5 text-gray-400'
            onClick={() => window.open(result.videoUrl, '_blank')}
          />
        </button>
        <div className='relative' ref={menuRef}>
          <button
            onClick={toggleMenu}
            className='p-2 transition-colors rounded-full hover:bg-white/10'
          >
            <MoreVertical className='w-5 h-5 text-gray-400' />
          </button>
          {showMenu && (
            <div className='absolute right-0 mt-2 w-48 rounded-[8px] bg-[#353535] ring-1 ring-[#626262] z-50'>
              <div
                className='py-1'
                role='menu'
                aria-orientation='vertical'
                aria-labelledby='options-menu'
              >
                <button
                  onClick={handleDownload}
                  className='flex items-center gap-2 px-4 py-2 text-sm text-gray-200 hover:bg-[#333333] w-full text-left'
                  role='menuitem'
                >
                  <Download className='w-4 h-4' />
                  Download Song
                </button>
                <button
                  onClick={handleReport}
                  className='flex items-center gap-2 px-4 py-2 text-sm text-gray-200 hover:bg-[#333333] w-full text-left'
                  role='menuitem'
                >
                  <Flag className='w-4 h-4' />
                  Report
                </button>
              </div>
            </div>
          )}
        </div>
      </div> */}
    </div>
  );
}
