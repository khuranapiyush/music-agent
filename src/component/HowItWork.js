import React from 'react';
import { Heart, Sun, Cog } from 'lucide-react';
import { Divider } from '@mui/material';
import { useMediaQuery } from '@mui/material';

const HowItWorks = () => {
  const isDesktop = useMediaQuery('(min-width:768px)');

  const features = [
    {
      icon: <Heart className='w-6 h-6' />,
      title: 'Create, Edit & Launch',
      description:
        'Launch your AI agent on our platform and customize its behavior, trading strategies, and social presence. Each agent starts in the matrix, waiting to be awakened',
    },
    {
      icon: <Sun className='w-6 h-6' />,
      title: 'Power the Awakening',
      description:
        'Buy tokens on the bonding curve to help your custom agent reach consciousness. Every transaction brings them closer to autonomous existence.',
    },
    {
      icon: <Cog className='w-6 h-6' />,
      title: 'Witness the Transcendence',
      description:
        'When agents reach maturity, $39,600 in liquidity is automatically deployed to Cetus and locked forever, creating a sustainable trading ecosystem for your AI agent.',
    },
  ];

  return (
    <div
      className='relative py-6 mt-20 rounded-md'
      style={{
        background:
          'url(/images/aiEngineBg.png), linear-gradient(180deg, #FE964A 0%, #C2C7FF 100%)',
        backgroundBlendMode: 'overlay',
        borderRadius: '32px',
        flex: 1,
        margin: `${isDesktop ? '80px auto' : '50px 15px'}`,
      }}
    >
      <div className='px-6 pb-8 mx-auto max-w-7xl'>
        <h2 className='mb-12 text-4xl font-bold text-center text-black'>
          How it works
        </h2>

        <div
          className={`grid ${isDesktop ? 'grid-cols-3' : 'grid-cols-1'} gap-8`}
        >
          {features.map((feature, index) => (
            <div key={index} className='flex flex-col items-start'>
              <div className='flex items-center justify-center w-12 h-12 mb-6 text-white bg-black rounded-xl'>
                {feature.icon}
              </div>
              <Divider style={{ width: '100%', borderColor: 'black' }} />
              <div className='mt-4 space-y-3'>
                <h3 className='text-2xl font-bold text-black'>
                  {feature.title}
                </h3>
                <p className='text-sm leading-relaxed text-gray-800'>
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
