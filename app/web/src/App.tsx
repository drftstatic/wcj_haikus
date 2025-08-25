import React, { useState, useEffect, lazy, Suspense } from 'react';
import { generateHaiku, Haiku, HaikuOptions, Lexicon } from './utils/generator';
import { buildHashtags } from './utils/social';
import ModernControls from './components/ModernControls';
import MobileHeader from './components/MobileHeader';

// Lazy load heavy components
const ModernHaikuCard = lazy(() => import('./components/ModernHaikuCard'));

const App: React.FC = () => {
  const [haikus, setHaikus] = useState<Haiku[]>([]);
  const [lexicon, setLexicon] = useState<Lexicon | null>(null);
  const [currentOptions, setCurrentOptions] = useState<HaikuOptions | null>(null);
  const [currentHashtags, setCurrentHashtags] = useState<string[]>([]);

  // Load lexicon data using fetch with optimizations
  useEffect(() => {
    const loadLexicon = async () => {
      try {
        // Use concurrent fetch with proper cache headers
        const fetchOptions = {
          cache: 'force-cache' as RequestCache,
        };
        
        const [
          wrestlersRes,
          erasRes,
          showsRes,
          tropesRes,
          objectsRes,
          pivotsRes,
        ] = await Promise.all([
          fetch('/data/wrestlers.json', fetchOptions),
          fetch('/data/eras.json', fetchOptions),
          fetch('/data/shows.json', fetchOptions),
          fetch('/data/tropes.json', fetchOptions),
          fetch('/data/objects.json', fetchOptions),
          fetch('/data/pivots.json', fetchOptions),
        ]);

        const [
          wrestlersData,
          erasData,
          showsData,
          tropesData,
          objectsData,
          pivotsData,
        ] = await Promise.all([
          wrestlersRes.json(),
          erasRes.json(),
          showsRes.json(),
          tropesRes.json(),
          objectsRes.json(),
          pivotsRes.json(),
        ]);

        const loadedLexicon = {
          wrestlers: wrestlersData,
          eras: erasData,
          shows: showsData,
          tropes: tropesData,
          objects: objectsData,
          pivots: pivotsData,
        };
        
        setLexicon(loadedLexicon);
        
        // Auto-generate a demo haiku when data loads
        const demoOptions: HaikuOptions = {
          wrestlers: [],
          tone: 'deadpan',
          chaos: 3,
          seed: Math.floor(Math.random() * 1000000),
        };
        
        const demoHaiku = generateHaiku(demoOptions, loadedLexicon);
        const demoHashtags = buildHashtags(demoOptions);
        
        setHaikus([demoHaiku]);
        setCurrentOptions(demoOptions);
        setCurrentHashtags(demoHashtags);
      } catch (error) {
        console.error("Failed to load lexicon data:", error);
      }
    };

    // Use requestIdleCallback for non-critical loading
    if ('requestIdleCallback' in window) {
      requestIdleCallback(loadLexicon);
    } else {
      setTimeout(loadLexicon, 0);
    }
  }, []);

  const handleGenerate = (options: HaikuOptions) => {
    if (!lexicon) {
      console.error("Lexicon not loaded yet.");
      return;
    }
    
    const finalOptions: HaikuOptions = {
      ...options,
      seed: options.seed || Math.floor(Math.random() * 1000000),
    };

    const newHaiku = generateHaiku(finalOptions, lexicon);
    const generatedHashtags = buildHashtags(finalOptions);
    
    setHaikus([newHaiku]);
    setCurrentOptions(finalOptions);
    setCurrentHashtags(generatedHashtags);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <MobileHeader isLoading={!lexicon} />
      <main className="p-4 space-y-8">
        <ModernControls onGenerate={handleGenerate} />
        {haikus.length > 0 && currentOptions && (
          <Suspense fallback={<div className="text-center">Loading…</div>}>
            <ModernHaikuCard
              haiku={haikus[0]}
              options={currentOptions}
              hashtags={currentHashtags}
            />
          </Suspense>
        )}
      </main>
    </div>
  );
};

export default App;
