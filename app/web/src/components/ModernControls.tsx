import React, { useState } from 'react';
import type { HaikuOptions } from '../utils/generator';

interface ModernControlsProps {
  onGenerate: (options: HaikuOptions) => void;
}

const ModernControls: React.FC<ModernControlsProps> = ({ onGenerate }) => {
  const [wrestlers, setWrestlers] = useState('');
  const [tone, setTone] = useState('deadpan');
  const [chaos, setChaos] = useState(0);
  const [seed, setSeed] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleGenerate = () => {
    onGenerate({
      wrestlers: wrestlers.split(',').map(s => s.trim()).filter(Boolean),
      tone,
      chaos,
      seed: seed ? parseInt(seed) : undefined,
    });
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle options"
          className="w-12 flex items-center justify-center border border-slate-700 rounded-lg"
        >
          <svg
            className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <button
          onClick={handleGenerate}
          className="flex-1 bg-red-600 text-white font-semibold rounded-lg px-4 py-3"
        >
          Generate
        </button>
      </div>

      {isOpen && (
        <div className="space-y-4 border border-slate-700 rounded-lg p-4 text-left">
          <div>
            <label htmlFor="wrestlers" className="block text-sm mb-1 text-slate-300">
              Wrestlers
            </label>
            <input
              id="wrestlers"
              type="text"
              className="w-full p-2 rounded bg-slate-800 border border-slate-700"
              placeholder="Hulk Hogan, The Rock"
              value={wrestlers}
              onChange={e => setWrestlers(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="tone" className="block text-sm mb-1 text-slate-300">
              Tone
            </label>
            <select
              id="tone"
              value={tone}
              onChange={e => setTone(e.target.value)}
              className="w-full p-2 rounded bg-slate-800 border border-slate-700"
            >
              <option value="deadpan">Deadpan</option>
              <option value="nostalgic">Nostalgic</option>
              <option value="petty">Petty</option>
              <option value="absurdist">Absurdist</option>
            </select>
          </div>

          <div>
            <label htmlFor="chaos" className="block text-sm mb-1 text-slate-300">
              Chaos: {chaos}
            </label>
            <input
              id="chaos"
              type="range"
              min="0"
              max="10"
              value={chaos}
              onChange={e => setChaos(parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label htmlFor="seed" className="block text-sm mb-1 text-slate-300">
              Seed (optional)
            </label>
            <input
              id="seed"
              type="text"
              className="w-full p-2 rounded bg-slate-800 border border-slate-700"
              placeholder="Leave blank for random"
              value={seed}
              onChange={e => setSeed(e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ModernControls;

