import React from 'react';
import Marquee from 'react-fast-marquee';

const ImageCard = ({ src, name, mCap, url, isTopClipped, isBottomClipped }) => {
  const handleImageClick = (url) => {
    if (window.confirm('Do you want to visit the AIAgent?')) {
      window.location.href = `${url}`;
    }
  };

  return (
    <div
      className={`relative w-[370px] overflow-hidden ${
        isTopClipped ? 'h-[140px]' : isBottomClipped ? 'h-[140px]' : 'h-auto'
      }`}
      style={{
        overflow: 'hidden',
        borderRadius: isTopClipped
          ? '0 0 48px 48px'
          : isBottomClipped
          ? '48px 48px 0 0'
          : '48px',
        backdropFilter: 'blur(18px)',
        borderWidth: isTopClipped
          ? '0px 10px 10px 10px'
          : isBottomClipped
          ? '10px 10px 0px 0px'
          : '10px',
        borderStyle: 'solid',
        borderColor: '#758BA1',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      onClick={() => handleImageClick(url)}
    >
      <div>
        <img src={src} alt={name} className='object-cover w-full h-full' />
        {!(isBottomClipped || isTopClipped) && (
          <div
            className='absolute bottom-0 left-0 right-0 p-5'
            style={{
              borderRadius: '0px 0px 20px 20px',
              background:
                'linear-gradient(180deg, rgba(30, 30, 30, 0.69) 0%, rgba(30, 30, 30, 0.40) 100%)',
              backdropFilter: 'blur(12px)',
              overflow: 'hidden',
            }}
          >
            <h3 className='text-2xl font-semibold text-white'>{name}</h3>
            <p className='text-sm font-normal text-white'>M cap.</p>
            <p className='text-sm text-white/80'> {mCap}</p>
          </div>
        )}
      </div>
    </div>
  );
};

const AIUniverseGrid = ({ data }) => {
  const directions = ['right', 'left', 'right'];
  const rows = [0, 1, 2];

  const repeatedData = data?.data?.bottomBarAgents
    ? [...data.data.bottomBarAgents, ...data.data.bottomBarAgents]
    : [];

  return (
    <div
      className='relative w-full p-0 overflow-hidden bg-blue-100'
      style={{
        backgroundImage: 'url(/images/aiUniverseBg.png)',
        objectFit: 'cover',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <h1
        className='absolute z-10 text-5xl font-bold text-center text-white transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2'
        style={{ textShadow: '0px 3px 10px rgba(0, 0, 0, 0.85)' }}
      >
        ENABLING AI UNIVERSE
      </h1>
      {rows.map((index) => {
        const isTopClipped = index === 0;
        const isBottomClipped = index === 2;
        return (
          <div
            key={index}
            className={`relative h-[140px] ${
              isTopClipped
                ? 'h-[140px] overflow-hidden [&_img]:translate-y-[-200px]'
                : isBottomClipped
                ? 'h-[140px] overflow-hidden [&_img]:translate-y-[0px]'
                : 'h-auto'
            }`}
          >
            <Marquee
              loop={false}
              pauseOnHover
              direction={directions[index]}
              speed={50}
            >
              <div
                className='flex gap-2'
                style={{
                  margin: index === 1 || index === 2 ? '10px 0px' : '0px',
                }}
              >
                {repeatedData.map((image, idx) => (
                  <ImageCard
                    key={`${image.id}-${idx}`}
                    src={image.profilePic}
                    name={image.name}
                    mCap={image.mcap}
                    url={image?.redirectionUrl}
                    isTopClipped={isTopClipped}
                    isBottomClipped={isBottomClipped}
                  />
                ))}
              </div>
            </Marquee>
          </div>
        );
      })}
    </div>
  );
};

export default AIUniverseGrid;
