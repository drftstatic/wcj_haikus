import React, { useRef, useState } from 'react';
import type { Haiku, HaikuOptions } from '../utils/generator';
import { buildTweetText } from '../utils/social';

// Lazy load html-to-image only when needed
const loadHtmlToImage = () => import('html-to-image');

interface ModernHaikuCardProps {
  haiku: Haiku;
  options: HaikuOptions;
  hashtags: string[];
}

const ModernHaikuCard: React.FC<ModernHaikuCardProps> = ({
  haiku,
  options,
  hashtags
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSavePng = async () => {
    if (!cardRef.current) return;

    setIsSaving(true);
    try {
      const { toPng } = await loadHtmlToImage();
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        backgroundColor: '#0F172A',
        width: 600,
        height: 600,
      });

      const link = document.createElement('a');
      link.download = `wrestling-haiku-${haiku.seed}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to generate image:', err);
    }
    setIsSaving(false);
  };

  const handleShareX = () => {
    const tweetText = buildTweetText(haiku, options, hashtags, 'full');
    const tweetUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
    window.open(tweetUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      <div
        ref={cardRef}
        className="p-6 bg-slate-800 border border-slate-700 rounded-xl space-y-4"
      >
        <div className="text-center">
          <h2 className="text-xl font-bold">Wrestling Circle Jerks</h2>
          <p className="text-slate-400 text-sm">Haiku Generator</p>
        </div>
        <div className="space-y-2">
          <div className="p-3 text-center bg-slate-900 border border-slate-700 rounded">
            {haiku.line1}
          </div>
          <div className="p-3 text-center bg-slate-900 border border-slate-700 rounded">
            {haiku.line2}
          </div>
          <div className="p-3 text-center bg-slate-900 border border-slate-700 rounded">
            {haiku.line3}
          </div>
        </div>
        <div className="text-center text-xs text-slate-500">#{haiku.seed}</div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleShareX}
          className="flex-1 py-3 px-4 rounded-lg bg-slate-700 text-slate-200 active:scale-95"
        >
          Post to X
        </button>
        <button
          onClick={handleSavePng}
          className="flex-1 py-3 px-4 rounded-lg bg-red-600 text-white active:scale-95"
        >
          {isSaving ? 'Saving…' : 'Save Image'}
        </button>
      </div>
    </div>
  );
};

export default ModernHaikuCard;

