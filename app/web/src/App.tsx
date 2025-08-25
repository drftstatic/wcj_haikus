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

  const handleRemoveHashtag = (tagToRemove: string) => {
    setCurrentHashtags(prevTags => prevTags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 relative overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>
      
      {/* Subtle mobile background patterns */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-gradient-to-br from-red-600/10 to-transparent rounded-full blur-xl"></div>
        <div className="absolute bottom-1/3 left-1/4 w-40 h-40 bg-gradient-to-tl from-amber-500/10 to-transparent rounded-full blur-xl"></div>
      </div>
      
      {/* Mobile-first layout */}
      <div className="relative z-10">
        {/* Header */}
        <MobileHeader isLoading={!lexicon} />

        {/* Main Content - Mobile Stack / Desktop Split */}
        <div className="px-4 pb-8">
          <div className="max-w-6xl mx-auto">
            <div className="md:grid md:grid-cols-5 md:gap-12 md:items-start">
              {/* Controls - Mobile: Top, Desktop: Left */}
              <div className="mb-8 md:mb-0 md:col-span-2 md:sticky md:top-8">
                <ModernControls onGenerate={handleGenerate} />
              </div>
              
              {/* Haiku Display - Mobile: Bottom, Desktop: Right (more prominent) */}
              <div className="md:col-span-3 min-h-[400px] flex flex-col justify-center">
                {haikus.length > 0 && currentOptions && (
                  <div className="animate-fade-in">
                    <Suspense fallback={
                      <div className="glass-card rounded-2xl p-12 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-700 flex items-center justify-center animate-pulse">
                          <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                        <h3 className="text-xl font-semibold text-slate-100 mb-2">
                          Loading Haiku Card
                        </h3>
                      </div>
                    }>
                      <ModernHaikuCard 
                        haiku={haikus[0]} 
                        options={currentOptions} 
                        hashtags={currentHashtags} 
                        onRemoveHashtag={handleRemoveHashtag} 
                      />
                    </Suspense>
                  </div>
                )}
                
                
                {!lexicon && (
                  <div className="glass-card rounded-2xl p-12 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-700 flex items-center justify-center animate-pulse">
                      <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <h3 className="text-xl font-semibold text-slate-100 mb-2">
                      Loading Wrestling Data
                    </h3>
                    <p className="text-slate-400">
                      Preparing wrestlers, eras, and legendary moments...
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
