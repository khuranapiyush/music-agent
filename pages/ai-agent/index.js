import { Rocket } from 'lucide-react';
import { useRouter } from 'next/router';

const cards = [
  {
    id: 1,
    title: 'Muzic AI',
    description: 'Create songs with lyrical / music video',
    path: '/ai-agent/muzicai',
    icon: (
      <svg
        width='24'
        height='24'
        viewBox='0 0 24 24'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M21.7188 6.27879V7.44879C21.7188 8.42879 21.3288 9.26879 20.6388 9.75879C20.2088 10.0788 19.6788 10.2288 19.1288 10.2288C18.7888 10.2288 18.4488 10.1788 18.0988 10.0588L12.7188 8.26879V17.9988C12.7188 20.6188 10.5888 22.7488 7.96875 22.7488C5.34875 22.7488 3.21875 20.6188 3.21875 17.9988C3.21875 15.3788 5.34875 13.2488 7.96875 13.2488C9.22875 13.2488 10.3688 13.7488 11.2188 14.5488V3.99879C11.2188 3.02879 11.6188 2.18879 12.3088 1.68879C12.9988 1.19879 13.9188 1.08879 14.8388 1.38879L19.2588 2.86879C20.6188 3.31879 21.7188 4.84879 21.7188 6.27879Z'
          fill='white'
        />
      </svg>
    ),
    comingSoon: false,
  },
];

export default function Page() {
  return (
    <div className='min-h-screen bg-[#1E1E1E] text-white p-4 mt-20'>
      <header className='max-w-5xl mx-auto mb-12'>
        <div className='flex'>
          <img src='/images/ai.png' alt='' className='w-[80px] h-[80px]' />
          <div className='flex flex-col ml-[16px]'>
            <div className='flex items-center gap-4 mb-4'>
              <h1 className='text-2xl font-bold md:text-4xl'>
                TURNING IDEAS INTO REALITY
              </h1>
            </div>
            <p className='text-[#D2D2D2] text-md w-[80%]'>
              Your Ideas, Amplified - Transform Simple Text into Rich Digital
              Experiences.
            </p>
          </div>
        </div>
      </header>

      <main className='max-w-5xl mx-auto grid gap-8 md:grid-cols-3 mb-[150px]'>
        {cards.map((card) => (
          <FeatureCard
            icon={card.icon}
            title={card.title}
            description={card.description}
            key={card.id}
            path={card.path}
            {...card}
          />
        ))}
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, description, comingSoon, path }) {
  const router = useRouter();
  return (
    <div className='relative'>
      <div
        className={`relative group rounded-[12px] h-[80px] w-[328px] p-0 ${
          !comingSoon && 'cursor-pointer'
        } transition-all duration-200`}
        onClick={() => (!comingSoon ? router.push(path) : null)}
      >
        {/* Coming Soon Badge */}
        {comingSoon && (
          <div className='absolute -top-5 left-3 bg-[#6B61FF] text-white text-[10px] px-3 py-1 rounded-md z-1'>
            Coming Soon
          </div>
        )}

        {/* Gradient Border */}
        <div className='absolute inset-0 bg-gradient-to-r from-[#fe9bf3] to-[#6b61ff] rounded-[12px]'></div>

        {/* Inner Content Background */}
        <div className='absolute inset-[1px] bg-[#353535] rounded-[10px] p-[16px] flex items-center'>
          {/* Hover Effect */}
          <div className='absolute inset-0 bg-gradient-to-r from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-[10px]' />

          {/* Content */}
          <div className='flex items-center justify-between'>
            {/* Icon */}
            <div className='w-[48px] h-[48px] bg-gradient-to-b from-[#6B61FF] to-[#FE9BF3] rounded-lg flex items-center justify-center text-purple-400'>
              {icon}
            </div>

            {/* Title and Description */}
            <div className='w-[190px] ml-4'>
              <h3 className='text-white text-[15px]'>{title}</h3>
              <p className='text-gray-400 text-[12px]'>{description}</p>
            </div>

            {/* Arrow Icon */}
            <svg
              className='w-5 h-5 ml-4 text-gray-500'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M9 5l7 7-7 7'
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
