import React from 'react';

interface ControlsProps {
  onGenerate: (options: any) => void; // Will refine 'any' later
}

const Controls: React.FC<ControlsProps> = ({ onGenerate }) => {
  const [wrestlers, setWrestlers] = React.useState('');
  const [era, setEra] = React.useState('');
  const [show, setShow] = React.useState('');
  const [match, setMatch] = React.useState('');
  const [tone, setTone] = React.useState('deadpan');
  const [chaos, setChaos] = React.useState(0);
  const [seed, setSeed] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
    setSeed(''); // Clear seed to generate a new one
    onGenerate({
      wrestlers: wrestlers.split(',').map(s => s.trim()).filter(Boolean),
      era: era || undefined,
      show: show || undefined,
      match: match || undefined,
      tone: tone,
      chaos: chaos,
      seed: undefined, // Explicitly undefined for shuffle
    });
  };

  return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-xl border-2 border-cyan-500 crt-effect">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="wrestlers" className="block text-sm font-bold text-cyan-400 mb-1">Wrestler(s) (comma-separated)</label>
          <input
            type="text"
            id="wrestlers"
            className="mt-1 block w-full p-3 border-2 border-magenta-500 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition duration-200 ease-in-out"
            value={wrestlers}
            onChange={(e) => setWrestlers(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="era" className="block text-sm font-bold text-cyan-400 mb-1">Era</label>
          <input
            type="text"
            id="era"
            className="mt-1 block w-full p-3 border-2 border-magenta-500 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition duration-200 ease-in-out"
            value={era}
            onChange={(e) => setEra(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="show" className="block text-sm font-bold text-cyan-400 mb-1">Show/PPV</label>
          <input
            type="text"
            id="show"
            className="mt-1 block w-full p-3 border-2 border-magenta-500 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition duration-200 ease-in-out"
            value={show}
            onChange={(e) => setShow(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="match" className="block text-sm font-bold text-cyan-400 mb-1">Match Type</label>
          <input
            type="text"
            id="match"
            className="mt-1 block w-full p-3 border-2 border-magenta-500 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition duration-200 ease-in-out"
            value={match}
            onChange={(e) => setMatch(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="tone" className="block text-sm font-bold text-cyan-400 mb-1">Tone: {tone}</label>
          <select
            id="tone"
            className="mt-1 block w-full p-3 border-2 border-magenta-500 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition duration-200 ease-in-out"
            value={tone}
            onChange={(e) => setTone(e.target.value)}
          >
            <option value="deadpan">Deadpan</option>
            <option value="nostalgic">Nostalgic</option>
            <option value="petty">Petty</option>
            <option value="absurdist">Absurdist</option>
          </select>
        </div>

        <div>
          <label htmlFor="chaos" className="block text-sm font-bold text-cyan-400 mb-1">Chaos: {chaos}</label>
          <input
            type="range"
            id="chaos"
            min="0"
            max="10"
            value={chaos}
            onChange={(e) => setChaos(parseInt(e.target.value))}
            className="mt-1 block w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>

        <div>
          <label htmlFor="seed" className="block text-sm font-bold text-cyan-400 mb-1">Seed (optional)</label>
          <input
            type="text"
            id="seed"
            className="mt-1 block w-full p-3 border-2 border-magenta-500 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition duration-200 ease-in-out"
            value={seed}
            onChange={(e) => setSeed(e.target.value)}
            placeholder="Leave empty for random"
          />
        </div>

        <div className="flex space-x-4 pt-4">
          <button
            type="submit"
            className="flex-1 py-3 px-4 bg-cyan-600 text-gray-900 font-extrabold rounded-md hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-gray-800 transition duration-200 ease-in-out transform hover:scale-105"
          >
            Generate Haiku
          </button>
          <button
            type="button"
            onClick={handleShuffle}
            className="flex-1 py-3 px-4 bg-magenta-600 text-gray-900 font-extrabold rounded-md hover:bg-magenta-500 focus:outline-none focus:ring-2 focus:ring-magenta-400 focus:ring-offset-2 focus:ring-offset-gray-800 transition duration-200 ease-in-out transform hover:scale-105"
          >
            Shuffle
          </button>
        </div>
      </form>
    </div>
  );
};

export default Controls;