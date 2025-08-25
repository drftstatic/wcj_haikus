import React, { useState } from 'react';

interface ModernControlsProps {
  onGenerate: (options: any) => void;
}

const ModernControls: React.FC<ModernControlsProps> = ({ onGenerate }) => {
  const [wrestlers, setWrestlers] = useState('');
  const [era, setEra] = useState('');
  const [show, setShow] = useState('');
  const [match, setMatch] = useState('');
  const [tone, setTone] = useState('deadpan');
  const [chaos, setChaos] = useState(0);
  const [seed, setSeed] = useState('');
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);

  const handleGenerate = () => {
    onGenerate({
      wrestlers: wrestlers.split(',').map(s => s.trim()).filter(Boolean),
      era: era || undefined,
      show: show || undefined,
      match: match || undefined,
      tone: tone,
      chaos: chaos,
      seed: seed ? parseInt(seed) : undefined,
    });
  };

  const handleShuffle = () => {
    setSeed(''); // Clear seed for new random generation
    onGenerate({
      wrestlers: wrestlers.split(',').map(s => s.trim()).filter(Boolean),
      era: era || undefined,
      show: show || undefined,
      match: match || undefined,
      tone: tone,
      chaos: chaos,
      seed: undefined,
    });
  };

  const toneLabels = {
    deadpan: 'Deadpan 😐',
    nostalgic: 'Nostalgic 🌅',
    petty: 'Petty 😤',
    absurdist: 'Absurdist 🎭'
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* Main Generate Button - Prominent and Mobile Optimized */}
      <div className="gradient-border animate-fade-in">
        <div className="gradient-border-inner">
          <button
            onClick={handleGenerate}
            className="w-full py-6 px-8 btn-primary rounded-lg text-white font-bold text-xl tracking-wide animate-pulse-glow min-h-[60px] touch-manipulation"
            style={{ minHeight: '60px', minWidth: '44px' }}
          >
            🥊 Generate Wrestling Haiku
          </button>
        </div>
      </div>

      {/* Quick Shuffle Button - Mobile Optimized */}
      <button
        onClick={handleShuffle}
        className="w-full py-4 px-6 btn-secondary rounded-lg text-slate-900 font-semibold text-lg min-h-[52px] touch-manipulation"
        style={{ minHeight: '52px', minWidth: '44px' }}
      >
        🎲 Surprise Me
      </button>

      {/* Collapsible Options Panel */}
      <div className="glass-card rounded-xl">
        <button
          onClick={() => setIsOptionsOpen(!isOptionsOpen)}
          className="w-full p-6 text-left flex justify-between items-center accordion-trigger rounded-xl hover:bg-slate-700/30 transition-colors min-h-[80px] touch-manipulation"
          data-state={isOptionsOpen ? 'open' : 'closed'}
          style={{ minHeight: '80px', minWidth: '44px' }}
        >
          <div>
            <h3 className="text-lg font-semibold text-slate-100">Customize Options</h3>
            <p className="text-sm text-slate-400 mt-1">Fine-tune your haiku generation</p>
          </div>
          <div className={`transform transition-transform duration-200 ${isOptionsOpen ? 'rotate-180' : ''}`}>
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>

        <div 
          className={`accordion-content transition-all duration-200 ease-in-out ${
            isOptionsOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
          }`}
          data-state={isOptionsOpen ? 'open' : 'closed'}
        >
          <div className="px-6 pb-6 space-y-5">
            {/* Wrestlers Input */}
            <div>
              <label htmlFor="wrestlers" className="block text-sm font-medium text-slate-300 mb-2">
                Wrestler(s)
              </label>
              <input
                type="text"
                id="wrestlers"
                className="w-full px-4 py-3 rounded-lg input-modern text-slate-100 placeholder-slate-500 focus:outline-none"
                placeholder="Hulk Hogan, The Rock (comma-separated)"
                value={wrestlers}
                onChange={(e) => setWrestlers(e.target.value)}
              />
            </div>

            {/* Era Input */}
            <div>
              <label htmlFor="era" className="block text-sm font-medium text-slate-300 mb-2">
                Era
              </label>
              <input
                type="text"
                id="era"
                className="w-full px-4 py-3 rounded-lg input-modern text-slate-100 placeholder-slate-500 focus:outline-none"
                placeholder="Attitude Era, Golden Era, etc."
                value={era}
                onChange={(e) => setEra(e.target.value)}
              />
            </div>

            {/* Show/PPV Input */}
            <div>
              <label htmlFor="show" className="block text-sm font-medium text-slate-300 mb-2">
                Show/PPV
              </label>
              <input
                type="text"
                id="show"
                className="w-full px-4 py-3 rounded-lg input-modern text-slate-100 placeholder-slate-500 focus:outline-none"
                placeholder="WrestleMania, Monday Night Raw, etc."
                value={show}
                onChange={(e) => setShow(e.target.value)}
              />
            </div>

            {/* Match Type Input */}
            <div>
              <label htmlFor="match" className="block text-sm font-medium text-slate-300 mb-2">
                Match Type
              </label>
              <input
                type="text"
                id="match"
                className="w-full px-4 py-3 rounded-lg input-modern text-slate-100 placeholder-slate-500 focus:outline-none"
                placeholder="Steel Cage, Ladder Match, etc."
                value={match}
                onChange={(e) => setMatch(e.target.value)}
              />
            </div>

            {/* Tone Selector */}
            <div>
              <label htmlFor="tone" className="block text-sm font-medium text-slate-300 mb-2">
                Tone: {toneLabels[tone as keyof typeof toneLabels]}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(toneLabels).map(([value, label]) => (
                  <button
                    key={value}
                    onClick={() => setTone(value)}
                    className={`py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
                      tone === value
                        ? 'bg-red-600 text-white'
                        : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Chaos Slider */}
            <div>
              <label htmlFor="chaos" className="block text-sm font-medium text-slate-300 mb-2">
                Chaos Level: {chaos}/10 {chaos >= 8 ? '🔥' : chaos >= 5 ? '⚡' : '😌'}
              </label>
              <input
                type="range"
                id="chaos"
                min="0"
                max="10"
                value={chaos}
                onChange={(e) => setChaos(parseInt(e.target.value))}
                className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #DC2626 0%, #DC2626 ${chaos * 10}%, #475569 ${chaos * 10}%, #475569 100%)`
                }}
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>Mild</span>
                <span>Chaotic</span>
              </div>
            </div>

            {/* Seed Input */}
            <div>
              <label htmlFor="seed" className="block text-sm font-medium text-slate-300 mb-2">
                Seed (Optional)
              </label>
              <input
                type="text"
                id="seed"
                className="w-full px-4 py-3 rounded-lg input-modern text-slate-100 placeholder-slate-500 focus:outline-none"
                placeholder="Leave empty for random"
                value={seed}
                onChange={(e) => setSeed(e.target.value)}
              />
              <p className="text-xs text-slate-500 mt-1">Use the same seed to reproduce haikus</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernControls;