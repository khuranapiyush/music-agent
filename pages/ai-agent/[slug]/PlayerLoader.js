import { useEffect, useState } from "react";

const PlayerLoader = ({ isVideoLoading }) => {
  const [textIndex, setTextIndex] = useState(0);
  const sentences = [
    "Creating script...",
    "Creating thumbnail...",
    "Creating audio...",
    "Creating video...",
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-t-purple-600 border-purple-600/30 mb-4"></div>
        <div className="text-white text-lg">
          {isVideoLoading ? sentences[textIndex] : "Creating lyrics..."}
        </div>
      </div>
    </div>
  );
};

export default PlayerLoader;
