import React, { useState } from 'react';
import { MessageSquare, TrendingUp, Video, Mic, Search } from 'lucide-react';
import styles from './styles';
import AssessmentIcon from '@mui/icons-material/Assessment';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import NotesIcon from '@mui/icons-material/Notes';
import GraphicEqRoundedIcon from '@mui/icons-material/GraphicEqRounded';
import { useMediaQuery } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const AIEngines = () => {
  const [selectedEngine, setSelectedEngine] = useState('socialite');
  const [currentSlide, setCurrentSlide] = useState(0);
  const isMobile = useMediaQuery('(max-width:768px)');

  const engines = [
    {
      id: 'socialite',
      title: 'Socialite Engine',
      description:
        'Automate your social presence across Twitter, Telegram, and Discord with AI-powered conversation management.',
      icon: <NotesIcon className='w-6 h-6' />,
      image: '/images/socialiteBanner.png',
    },
    {
      id: 'tradex',
      title: 'TradeX Engine',
      description:
        'Your 24/7 AI trading companion that analyzes, executes, and optimizes crypto trades autonomously.',
      icon: <AssessmentIcon className='w-6 h-6' />,
      image: '/images/tradexBanner.png',
    },
    {
      id: 'creator',
      title: 'Creator Engine',
      description:
        'Transform ideas into stunning content – from music to videos – with one-click AI generation.',
      icon: <TextSnippetIcon className='w-6 h-6' />,
      image: '/images/creatorEngine.png',
    },
    {
      id: 'vox',
      title: 'VoxAI Engine',
      description:
        'Professional-grade voiceovers and audio content, powered by next-gen AI synthesis.',
      icon: <GraphicEqRoundedIcon className='w-6 h-6' />,
      image: '/images/voxAIBanner.png',
    },
    {
      id: 'alpha',
      title: 'Alpha Engine',
      description:
        'Stay ahead of the market with AI-powered research that spots trending tokens before they moon.',
      icon: <AssessmentIcon className='w-6 h-6' />,
      image: '/images/alphaAIBanner.png',
    },
  ];

  const nextSlide = () => {
    if (currentSlide !== engines.length - 1) {
      setCurrentSlide((prev) => (prev === engines.length - 1 ? 0 : prev + 1));
      setSelectedEngine(
        engines[currentSlide === engines.length - 1 ? 0 : currentSlide + 1].id
      );
    }
  };

  const prevSlide = () => {
    if (currentSlide !== 0) {
      setCurrentSlide((prev) => (prev === 0 ? engines.length - 1 : prev - 1));
      setSelectedEngine(
        engines[currentSlide === 0 ? engines.length - 1 : currentSlide - 1].id
      );
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div
          style={
            isMobile ? styles.mobileHeadingContainer : styles.headingContainer
          }
        >
          <p
            style={{
              ...styles.gradientHeader,
              fontSize: isMobile ? '38px' : '40px',
            }}
          >
            AI ENGINES{' '}
          </p>
          <p style={{ ...styles.header, fontSize: isMobile ? '38px' : '40px' }}>
            {' '}
            for every use case
          </p>
        </div>
        {isMobile ? (
          <div style={styles.mobileCarousel}>
            <div style={styles.mobileImageContainer}>
              <img
                src={engines[currentSlide].image}
                alt={engines[currentSlide].title}
                style={styles.mobileImage}
              />
            </div>
            <div
              style={{
                ...styles.mobileButton,
                ...styles.selectedButton,
              }}
            >
              <div style={styles.mobileIconWrapper}>
                {engines[currentSlide].icon}
                <p
                  style={{
                    ...styles.mobileTitle,
                  }}
                >
                  {engines[currentSlide].title}
                </p>
              </div>
              <p style={styles.mobileDescription}>
                {engines[currentSlide].description}
              </p>
            </div>
            <div style={styles.carouselControls}>
              <button
                onClick={prevSlide}
                style={{
                  ...styles.carouselButton,
                  opacity: currentSlide === 0 ? 0.5 : 1,
                }}
              >
                <ArrowBackIosIcon style={styles.carouselButtonWrapper} />
              </button>
              <button
                onClick={nextSlide}
                style={{
                  ...styles.carouselButton,
                  opacity: currentSlide === engines.length - 1 ? 0.5 : 1,
                }}
              >
                <ArrowForwardIosIcon style={styles.carouselButtonWrapper} />
              </button>
            </div>
          </div>
        ) : (
          <div style={styles.panel}>
            <div style={styles.imageContainer}>
              <div style={styles.imageWrapper}>
                <img
                  src={engines.find((e) => e.id === selectedEngine)?.image}
                  alt={`${selectedEngine} preview`}
                  style={styles.image}
                />
              </div>
            </div>
            <div style={styles.listContainer}>
              {engines.map((engine) => (
                <button
                  key={engine.id}
                  onClick={() => setSelectedEngine(engine.id)}
                  style={{
                    ...styles.button,
                    ...(selectedEngine === engine.id
                      ? styles.selectedButton
                      : {}),
                  }}
                >
                  <div style={styles.buttonContent}>
                    <div
                      style={{
                        ...styles.iconWrapper,
                        ...(selectedEngine === engine.id
                          ? styles.selectedIconWrapper
                          : {}),
                      }}
                    >
                      {engine.icon}
                      <p
                        style={{
                          ...styles.title,
                          ...(selectedEngine === engine.id
                            ? styles.selectedTitle
                            : {}),
                        }}
                      >
                        {engine.title}
                      </p>
                    </div>
                    <p style={styles.description}>{engine.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIEngines;
