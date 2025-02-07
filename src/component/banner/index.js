import {
  Box,
  Button,
  Container,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { default as React } from 'react';
import Marquee from 'react-fast-marquee';
import TextReveal from '../TextRevel';
import styles from './styles';
import { openLink } from '../../utils/common';

const Banner = ({ data }) => {
  const isMobile = useMediaQuery('(max-width:768px)');

  return (
    <Box
      className={'min-h rounded-t-[48px] rounded-b-none'}
      sx={{
        background: isMobile
          ? 'center/contain no-repeat url(/images/ai/aiBannerMobileBg.png)'
          : 'center/contain no-repeat url(/images/ai/bannerBg.png)',
        backgroundSize: 'cover',
      }}
    >
      <Box sx={{ ...styles.landingPage }} className={isMobile ? 'p-4' : 'p-0'}>
        <Container sx={styles.containerStyle} maxWidth={false}>
          <Box sx={styles.mainPage}>
            <Box sx={styles.middleSection}>
              <Box
                sx={{
                  ...styles.middleLeftSection,
                  ...(isMobile && {
                    width: '100%',
                    textAlign: 'center',
                    padding: '2rem 1rem',
                  }),
                }}
                className='animate__animated animate__fadeInLeft animate__delay-0.3s'
              >
                <Box sx={{ display: 'block' }}>
                  {isMobile ? (
                    <>
                      <TextReveal delay={0.5}>
                        <Typography
                          variant='h1'
                          style={{
                            fontFamily: 'Bricolage Grotesque',
                          }}
                        >
                          Nation state for AI AGents
                        </Typography>
                      </TextReveal>
                    </>
                  ) : (
                    <>
                      <TextReveal delay={0.5}>
                        <Typography
                          variant='h1'
                          style={{ fontFamily: 'Bricolage Grotesque' }}
                        >
                          Nation state for
                        </Typography>
                      </TextReveal>
                      <TextReveal delay={0.8}>
                        <Typography
                          variant='h1'
                          style={{ fontFamily: 'Bricolage Grotesque' }}
                        >
                          AI AGents
                        </Typography>
                      </TextReveal>
                    </>
                  )}
                </Box>
                <Typography
                  variant='h2'
                  className='mb-4'
                  sx={
                    isMobile
                      ? {
                          fontSize: '16px',
                          fontFamily: 'Nohemi',
                          fontWeight: '500',
                          lineHeight: '16px',
                        }
                      : {}
                  }
                >
                  Discover, build and co-own AI agents
                </Typography>
                <Button
                  variant='contained'
                  className={`px-4 py-2 max-w-[170px] text-sm font-bold text-black bg-white rounded-xl`}
                  style={{
                    backgroundColor: 'white',
                    fontFamily: '600',
                    borderRadius: '12px',
                    margin: isMobile ? 'auto' : '10px 0px',
                  }}
                  sx={isMobile ? { display: 'block', margin: '0 auto' } : {}}
                  onClick={() => openLink(process.env.NEXT_PUBLIC_REDIRECT_URL)}
                >
                  Launch App
                </Button>
              </Box>

              <Box
                sx={{
                  ...styles.middleRightSection,
                }}
              >
                <img src='/images/socialiteBanner.png' alt={'banner'} />
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
      <div className='w-full'>
        <Typography
          variant='h5'
          className={`mb-6 font-semibold text-center ${
            isMobile ? 'text-2xl' : 'text-4xl'
          }`}
        >
          Featured Agents
        </Typography>
        <Box className='grid w-full gap-10 bg-gradient-to-t from-black via-black/50 to-transparent'>
          <div className='w-[95%] mx-2 justify-items-start items-center *:w-full grid grid-cols-0 md:grid-cols-0 lg:grid-cols-0 gap-10'>
            <Marquee play={true} pauseOnHover direction='left'>
              {data?.data?.topBarAgents?.map((item, index) => (
                <a href={item?.redirectionUrl} rel='noreferrer' key={index}>
                  <Box
                    className={`text-center transition duration-300 rounded-lg hover:shadow-md ${
                      isMobile ? 'p-4' : 'p-10'
                    }`}
                  >
                    <img
                      src={item?.profilePic}
                      alt='Agent'
                      className={`mx-auto mb-2 rounded-md w-20 h-20`}
                    />
                    <Box className='flex flex-row justify-center gap-2 text-center align-center'>
                      <Typography
                        variant='body1'
                        className={`font-bold text-white ${
                          isMobile ? 'text-sm' : 'text-2xl'
                        }`}
                      >
                        {item?.name}
                      </Typography>
                      <Typography
                        variant='body2'
                        className={`font-thin text-white mt-1 ${
                          isMobile ? 'text-xs' : ''
                        }`}
                      >
                        M cap.
                      </Typography>
                      <Typography
                        variant='body2'
                        className={`font-thin text-[#D2D2D2] mt-1 ${
                          isMobile ? 'text-xs' : ''
                        }`}
                      >
                        ({item?.marketCap})
                      </Typography>
                    </Box>
                  </Box>
                </a>
              ))}
            </Marquee>
          </div>
        </Box>
      </div>
    </Box>
  );
};

export default Banner;
