import React, { useRef } from 'react';
import { toPng } from 'html-to-image';
import type { Haiku, HaikuOptions } from '../utils/generator';
import { buildTweetText } from '../utils/social';

interface HaikuCardProps {
  haiku: Haiku;
  options: HaikuOptions;
  hashtags: string[];
  onRemoveHashtag: (tag: string) => void;
}

const HaikuCard: React.FC<HaikuCardProps> = ({ haiku, options, hashtags, onRemoveHashtag }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleCopy = () => {
    const textToCopy = `${haiku.line1}\n${haiku.line2}\n${haiku.line3}\n${hashtags.join(' ')}`;
    navigator.clipboard.writeText(textToCopy);
    alert('Haiku copied to clipboard!');
  };

  const handleSavePng = () => {
    if (cardRef.current) {
      toPng(cardRef.current, { cacheBust: true })
        .then((dataUrl) => {
          const link = document.createElement('a');
          link.download = `wrestling-haiku-${haiku.seed}.png`;
          link.href = dataUrl;
          link.click();
        })
        .catch((err) => {
          console.error('oops, something went wrong!', err);
        });
    }
  };

  const handleShareX = () => {
    const tweetText = buildTweetText(haiku, options, hashtags, 'full');
    const tweetUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
    window.open(tweetUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div ref={cardRef} className="relative p-8 bg-gray-900 rounded-lg shadow-xl border-2 border-magenta-500 text-center text-white font-mono overflow-hidden crt-effect">
      {/* Subtle scanlines */}
      <div className="absolute inset-0 bg-scanlines opacity-10"></div> 

      <div className="relative z-10">
        <h3 className="text-xl font-bold mb-4 text-cyan-400 anaglyph-red">Wrestling Circle Jerks // Haiku Forge</h3>
        <p className="text-3xl md:text-4xl mb-2 text-cyan-300 anaglyph-cyan">{haiku.line1}</p>
        <p className="text-3xl md:text-4xl mb-2 text-cyan-300 anaglyph-red">{haiku.line2}</p>
        <p className="text-3xl md:text-4xl mb-4 text-cyan-300 anaglyph-cyan">{haiku.line3}</p>
        <p className="text-sm text-gray-400">Seed: {haiku.seed}</p>

        <div className="flex flex-wrap justify-center gap-2 mt-6">
          {hashtags.map((tag, index) => (
            <span key={index} className="bg-magenta-600 text-white text-xs px-3 py-1 rounded-full flex items-center font-sans">
              {tag}
              <button onClick={() => onRemoveHashtag(tag)} className="ml-2 text-white hover:text-gray-200 focus:outline-none text-lg leading-none">
                &times;
              </button>
            </span>
          ))}
        </div>

        <div className="mt-8 flex justify-center space-x-4">
          <button
            onClick={handleCopy}
            className="py-3 px-5 bg-cyan-600 text-gray-900 font-extrabold rounded-md hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-gray-800 transition duration-200 ease-in-out transform hover:scale-105"
          >
            Copy
          </button>
          <button
            onClick={handleSavePng}
            className="py-3 px-5 bg-magenta-600 text-gray-900 font-extrabold rounded-md hover:bg-magenta-500 focus:outline-none focus:ring-2 focus:ring-magenta-400 focus:ring-offset-2 focus:ring-offset-gray-800 transition duration-200 ease-in-out transform hover:scale-105"
          >
            Save as PNG
          </button>
          <button
            onClick={handleShareX}
            className="py-3 px-5 bg-gray-600 text-white font-extrabold rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition duration-200 ease-in-out transform hover:scale-105"
          >
            Share to X
          </button>
        </div>
      </div>
    </div>
  );
};

export default HaikuCard;
