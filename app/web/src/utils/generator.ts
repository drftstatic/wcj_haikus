import { countSyllablesInSentence } from './syllables';
import { mulberry32 } from './rng';

// Interfaces for our data structures
export interface Wrestler {
  name: string;
  aliases: string[];
  finishers: string[];
  catchphrases: string[];
  factions: string[];
  era: string;
}

export interface Lexicon {
  wrestlers: Wrestler[];
  eras: string[];
  shows: string[];
  tropes: string[];
  objects: string[];
  pivots: string[];
}

export interface HaikuOptions {
  wrestlers?: string[];
  era?: string;
  show?: string;
  match?: string;
  tone?: 'deadpan' | 'nostalgic' | 'petty' | 'absurdist';
  chaos?: number; // 0-10
  seed: number;
}

export interface Haiku {
  line1: string;
  line2: string;
  line3: string;
  seed: number;
}

// --- HELPERS ---
function generateLine(targetSyllables: number, randomFn: () => number, pool: string[]): string {
    // Helper function for generateLine
    function getRandomElement<T>(arr: T[], randomFn: () => number): T {
      return arr[Math.floor(randomFn() * arr.length)];
    }

    const MAX_ATTEMPTS = 200;
    const fallbacks: { [key: number]: string } = {
        5: "creative has nothing",
        7: "the writers just gave up now",
    };

    if (pool.length === 0) {
        return fallbacks[targetSyllables] || "the pool is empty";
    }

    for (let i = 0; i < MAX_ATTEMPTS; i++) {
        let line = "";
        let currentSyllables = 0;
        const maxWordsInLine = 6;
        let wordsInLine = 0;

        const shuffledPool = [...pool].sort(() => randomFn() - 0.5);

        while (currentSyllables < targetSyllables && wordsInLine < maxWordsInLine) {
            const term = getRandomElement(shuffledPool, randomFn); // Explicitly use getRandomElement
            const termSyllables = countSyllablesInSentence(term);

            if (termSyllables > 0 && currentSyllables + termSyllables <= targetSyllables) {
                line += (line ? " " : "") + term;
                currentSyllables += termSyllables;
                wordsInLine++;
            } else if (termSyllables > targetSyllables) {
                // If a single term is already too long, skip it
                continue;
            }

            if (currentSyllables === targetSyllables) {
                return line.trim();
            }
        }
    }
    return fallbacks[targetSyllables] || "a swing and a miss";
}


// --- MAIN GENERATOR ---
export function generateHaiku(options: HaikuOptions, lexicon: Lexicon): Haiku {
  const random = mulberry32(options.seed);
  const requestedWrestlers = options.wrestlers;

  // 1. Filter lexicon based on options to create a relevant pool of terms
  let relevantWrestlers = lexicon.wrestlers;
  if (requestedWrestlers && requestedWrestlers.length > 0) {
      relevantWrestlers = lexicon.wrestlers.filter(w => 
          requestedWrestlers.some(optW => w.name.toLowerCase().includes(optW.toLowerCase()))
      );
  } else if (options.era) {
      relevantWrestlers = lexicon.wrestlers.filter(w => w.era === options.era);
  }
  
  if (relevantWrestlers.length === 0) {
      relevantWrestlers = lexicon.wrestlers; // Avoid empty pool
  }

  const namePool = relevantWrestlers.flatMap(w => [w.name, ...w.aliases]);
  const actionPool = relevantWrestlers.flatMap(w => [...w.finishers, ...w.catchphrases]);
  
  let contextPool = [...lexicon.tropes, ...lexicon.objects, ...lexicon.pivots];
  if (options.show) {
      contextPool.push(options.show);
  }
  if (options.era) {
      contextPool.push(options.era);
  }

  const masterPool = [...new Set([...namePool, ...actionPool, ...contextPool])].filter(Boolean); // Filter out null/undefined

  // 2. Generate each line with the correct syllable count
  const line1 = generateLine(5, random, masterPool);
  const line2 = generateLine(7, random, masterPool);
  const line3 = generateLine(5, random, masterPool);

  return {
    line1,
    line2,
    line3,
    seed: options.seed,
  };
}