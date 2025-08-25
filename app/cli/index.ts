#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { generateHaiku, Haiku, HaikuOptions, Lexicon } from './utils/generator.js';
import { buildHashtags, buildTweetText } from './utils/social.js';

// ES Module equivalent for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Main function to run the CLI
async function main() {
  // 1. Load the lexicon data
  const dataDir = path.join(__dirname, '..', 'data');
  const lexicon: Lexicon = {
    wrestlers: JSON.parse(await fs.readFile(path.join(dataDir, 'wrestlers.json'), 'utf-8')),
    eras: JSON.parse(await fs.readFile(path.join(dataDir, 'eras.json'), 'utf-8')),
    shows: JSON.parse(await fs.readFile(path.join(dataDir, 'shows.json'), 'utf-8')),
    tropes: JSON.parse(await fs.readFile(path.join(dataDir, 'tropes.json'), 'utf-8')),
    objects: JSON.parse(await fs.readFile(path.join(dataDir, 'objects.json'), 'utf-8')),
    pivots: JSON.parse(await fs.readFile(path.join(dataDir, 'pivots.json'), 'utf-8')),
  };

  // 2. Setup yargs for argument parsing
  yargs(hideBin(process.argv))
    .scriptName("wcj-haiku")
    .usage('$0 [args]')
    .command('$0', 'Generate a wrestling haiku', () => {}, async (argv) => {
      const count = argv.count as number;
      
      const results = [];

      for (let i = 0; i < count; i++) {
        const seed = (argv.seed as number) ? (argv.seed as number) + i : Date.now() + i;

        const options: HaikuOptions = {
          wrestlers: argv.wrestlers as string[],
          era: argv.era as string,
          show: argv.show as string,
          match: argv.match as string,
          tone: argv.tone as any,
          chaos: argv.chaos as number,
          seed: seed,
        };

        const haiku = generateHaiku(options, lexicon);
        
        let output: any = { ...haiku, options };

        if (argv.hashtags) {
            const hashtags = buildHashtags(options);
            output.hashtags = hashtags;
        }

        if (argv.shareX) {
            const hashtags = argv.hashtags === false ? [] : buildHashtags(options);
            output.tweetText = buildTweetText(haiku, options, hashtags, argv.shareX as 'compact' | 'full');
        }
        
        results.push(output);
      }

      // 3. Print output
      if (argv.json) {
          console.log(JSON.stringify(results, null, 2));
      } else if (argv.shareX) {
          results.forEach(r => console.log(r.tweetText));
      } else {
          results.forEach(r => {
            console.log("---");
            console.log(r.line1);
            console.log(r.line2);
            console.log(r.line3);
            if (r.hashtags) {
                console.log(r.hashtags.join(' '));
            }
          });
          console.log("---");
      }
    })
    .option('wrestlers', { alias: 'w', type: 'array', description: 'Wrestler names to influence the haiku' })
    .option('era', { alias: 'e', type: 'string', description: 'Era to influence the haiku (e.g., "Attitude")' })
    .option('show', { alias: 's', type: 'string', description: 'Show or PPV to influence the haiku (e.g., "RAW")' })
    .option('match', { alias: 'm', type: 'string', description: 'Match type to influence the haiku (e.g., "Ladder")' })
    .option('tone', { alias: 't', type: 'string', choices: ['deadpan', 'nostalgic', 'petty', 'absurdist'], description: 'The tone of the haiku' })
    .option('chaos', { type: 'number', description: 'Chaos level (0-10)', default: 0 })
    .option('seed', { type: 'number', description: 'Seed for the random number generator for deterministic output' })
    .option('count', { alias: 'c', type: 'number', description: 'Number of haikus to generate', default: 1 })
    .option('json', { type: 'boolean', description: 'Output in JSON format', default: false })
    .option('hashtags', { type: 'boolean', description: 'Generate hashtags', default: true })
    .option('share-x', { type: 'string', choices: ['compact', 'full'], description: 'Output tweet-ready text' })
    .help()
    .argv;
}

main().catch(console.error);
