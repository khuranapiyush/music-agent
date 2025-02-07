import { Box } from '@mui/material';
import { default as React } from 'react';
import { useMediaQuery } from '@mui/system';
import MusicDiscovery from '../src/component/HomeElement';

const Index = () => {
  const isMobile = useMediaQuery('(max-width:768px)');
  return (
    <div>
      <Box sx={{ width: '100%', height: 'auto', background: '#0E0E11' }}>
        <MusicDiscovery />
      </Box>
    </div>
  );
};

export default Index;
