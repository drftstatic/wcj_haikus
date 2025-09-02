// A simple heuristic-based syllable counter for English words.
// It's not perfect, but it's lightweight and works for most common cases.

export function countSyllables(word: string): number {
  // 1. Lowercase and remove non-alphabetic characters
  word = word.toLowerCase().replace(/[^a-z]/g, '');

  // 2. Handle short words and empty strings
  if (word.length <= 3) {
    return 1;
  }

  // 3. Core heuristic: vowel groups
  // - Don't count 'e' at the end of a word.
  // - Collapse consecutive vowels into one.
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
  word = word.replace(/^y/, '');
  
  const vowelMatches = word.match(/[aeiouy]{1,2}/g);

  if (vowelMatches) {
    let syllables = vowelMatches.length;

    // 4. Adjust for specific endings and patterns
    if (word.match(/sm$/) && word.length > 1) {
        syllables++;
    }
    if (word.match(/les$/) && word.length > 3) {
        syllables--;
    }
    
    return Math.max(1, syllables); // Ensure at least one syllable
  }

  return 1; // Fallback for no vowel matches
}

export function countSyllablesInSentence(sentence: string): number {
    const words = sentence.trim().split(/\s+/);
    return words.reduce((total, word) => total + countSyllables(word), 0);
}