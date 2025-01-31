import { Box, Typography, useMediaQuery, IconButton } from '@mui/material';
import React, { useState } from 'react';
import styles from './styles';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const JoinTheRevolutions = () => {
  const isMobile = useMediaQuery('(max-width:768px)');
  const [currentPage, setCurrentPage] = useState(0);

  const carouselData = [
    {
      id: 0,
      title: '2024 Q1',
      items: [
        'Creator Tipping',
        'Live Streaming Launch',
        'Engagement Points',
        'Content Nodes - Testnet',
        'Game Zone',
      ],
    },
    {
      id: 1,
      title: '2024 Q2',
      items: [
        'Mobile App Launch',
        'NFT Marketplace',
        'Community Governance',
        'Token Launch',
        'Creator Dashboard',
      ],
    },
    {
      id: 2,
      title: '2024 Q3',
      items: [
        'DeFi Integration',
        'Cross-chain Bridge',
        'Social Features',
        'Content Mining',
        'Staking Platform',
      ],
    },
    {
      id: 3,
      title: '2024 Q4',
      items: [
        'DeFi Integration',
        'Cross-chain Bridge',
        'Social Features',
        'Content Mining',
        'Staking Platform',
      ],
    },
  ];

  const handleNext = () => {
    if (currentPage !== carouselData.length - 1) {
      setCurrentPage((prev) => (prev + 1) % carouselData.length);
    }
  };

  const handlePrev = () => {
    if (currentPage !== 0) {
      setCurrentPage(
        (prev) => (prev - 1 + carouselData.length) % carouselData.length
      );
    }
  };

  return (
    <Box style={{ marginTop: isMobile ? '10px' : '100px' }}>
      <Typography
        sx={{
          ...styles.title,
          fontSize: isMobile ? '24px' : '32px',
          textAlign: 'center',
          padding: isMobile ? '20px 0' : styles.title.padding,
        }}
        variant='h1'
      >
        Join the revolution
      </Typography>

      <Box
        sx={{
          ...styles.wrapper,
          padding: isMobile ? '0 16px' : styles.wrapper.padding,
          background: isMobile
            ? 'center/contain no-repeat url(/images/ai/joinTheRevolutionBg.png)'
            : 'center/contain no-repeat url(/images/tokenPoolBg.png)',
          backgroundSize: 'cover',
          width: isMobile ? '100%' : undefined,
        }}
      >
        <Box sx={styles.imageContainer}>
          <Box
            sx={{
              textAlign: 'center',
              width: isMobile ? '100%' : '400px',
              display: 'flex',
              alignItems: 'center',
              gap: isMobile ? '10px' : '20px',
              flexDirection: 'column',
              justifyContent: 'space-around',
            }}
          >
            <Box sx={styles.topLeftPadding}>
              <Typography
                variant='h1'
                sx={{
                  fontSize: isMobile ? '20px' : '32px',
                }}
              >
                {carouselData[currentPage].title}
              </Typography>
            </Box>
            <Box
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                paddingBottom: isMobile ? '5px' : '10px',
                width: '100%',
              }}
            >
              <IconButton
                onClick={handlePrev}
                style={{
                  ...styles.iconContainer,
                  opacity: currentPage === 0 ? 0.5 : 1,
                  padding: isMobile ? '8px' : '12px',
                }}
              >
                <ArrowBackIosIcon
                  style={{
                    fontSize: isMobile ? '16px' : '24px',
                    paddingLeft: '5px',
                  }}
                />
              </IconButton>
              <Box
                sx={{
                  display: 'flex',
                  gap: '5px',
                  margin: '0px 10px',
                }}
              >
                {carouselData.map((_, index) => (
                  <Box
                    key={index}
                    sx={{
                      margin: '0px 3px',
                      width: isMobile ? '32px' : '42px',
                      height: isMobile ? '6px' : '8px',
                      borderRadius: '100px',
                      backgroundColor:
                        currentPage === index
                          ? '#fff'
                          : 'rgba(255, 255, 255, 0.30)',
                      transition: 'background-color 0.3s ease',
                    }}
                  />
                ))}
              </Box>
              <IconButton
                onClick={handleNext}
                style={{
                  ...styles.iconContainer,
                  opacity: currentPage === carouselData.length - 1 ? 0.5 : 1,
                  padding: isMobile ? '8px' : '12px',
                }}
              >
                <ArrowForwardIosIcon
                  style={{
                    fontSize: isMobile ? '16px' : '24px',
                    paddingRight: '1px',
                  }}
                />
              </IconButton>
            </Box>
          </Box>

          <Box
            sx={{
              ...styles.cardContainer,
              padding: isMobile ? '0px' : styles.cardContainer.padding,
            }}
          >
            <Box
              sx={{
                ...styles.cardWrapContainer,
                gap: isMobile ? '12px' : styles.cardWrapContainer.gap,
              }}
            >
              {carouselData[currentPage].items.map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    ...styles.container,
                    padding: isMobile ? '12px' : styles.container.padding,
                    fontSize: isMobile ? '14px' : '16px',
                  }}
                >
                  <img
                    src='/images/ai/star.svg'
                    width={isMobile ? '16px' : '20px'}
                    height={isMobile ? '16px' : '20px'}
                    alt='star'
                  />
                  <p style={{ fontSize: '16px', fontWeight: 500 }}>{item}</p>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default JoinTheRevolutions;
