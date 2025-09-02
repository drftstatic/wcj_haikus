#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = __importDefault(require("yargs"));
const helpers_1 = require("yargs/helpers");
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
const generator_1 = require("../web/src/lib/generator");
// Main function to run the CLI
async function main() {
    // 1. Load the lexicon data
    // Note: __dirname may need configuration with ES modules.
    // Assuming CommonJS context for now.
    const dataDir = path.join(__dirname, 'data');
    const lexicon = {
        wrestlers: JSON.parse(await fs.readFile(path.join(dataDir, 'wrestlers.json'), 'utf-8')),
        eras: JSON.parse(await fs.readFile(path.join(dataDir, 'eras.json'), 'utf-8')),
        shows: JSON.parse(await fs.readFile(path.join(dataDir, 'shows.json'), 'utf-8')),
        tropes: JSON.parse(await fs.readFile(path.join(dataDir, 'tropes.json'), 'utf-8')),
        objects: JSON.parse(await fs.readFile(path.join(dataDir, 'objects.json'), 'utf-8')),
        pivots: JSON.parse(await fs.readFile(path.join(dataDir, 'pivots.json'), 'utf-8')),
    };
    // 2. Setup yargs for argument parsing
    (0, yargs_1.default)((0, helpers_1.hideBin)(process.argv))
        .scriptName("wcj-haiku")
        .usage('$0 [args]')
        .command('$0', 'Generate a wrestling haiku', () => { }, async (argv) => {
        const count = argv.count;
        if (!argv.json)
            console.log("---");
        const haikus = [];
        for (let i = 0; i < count; i++) {
            // For each iteration, generate a new seed if one wasn't provided
            const seed = argv.seed ? argv.seed + i : Date.now() + i;
            const options = {
                wrestlers: argv.wrestlers,
                era: argv.era,
                show: argv.show,
                match: argv.match,
                tone: argv.tone,
                chaos: argv.chaos,
                seed: seed,
            };
            const haiku = (0, generator_1.generateHaiku)(options, lexicon);
            haikus.push(haiku);
        }
        if (argv.json) {
            console.log(JSON.stringify(haikus, null, 2));
        }
        else {
            haikus.forEach(haiku => {
                console.log(haiku.line1);
                console.log(haiku.line2);
                console.log(haiku.line3);
                console.log("---");
            });
        }
    })
        .option('wrestlers', {
        alias: 'w',
        type: 'array',
        description: 'Wrestler names to influence the haiku',
    })
        .option('era', {
        alias: 'e',
        type: 'string',
        description: 'Era to influence the haiku (e.g., "Attitude")',
    })
        .option('show', {
        alias: 's',
        type: 'string',
        description: 'Show or PPV to influence the haiku (e.g., "RAW")',
    })
        .option('match', {
        alias: 'm',
        type: 'string',
        description: 'Match type to influence the haiku (e.g., "Ladder")',
    })
        .option('tone', {
        alias: 't',
        type: 'string',
        choices: ['deadpan', 'nostalgic', 'petty', 'absurdist'],
        description: 'The tone of the haiku',
    })
        .option('chaos', {
        type: 'number',
        description: 'Chaos level (0-10)',
        default: 0,
    })
        .option('seed', {
        type: 'number',
        description: 'Seed for the random number generator for deterministic output',
    })
        .option('count', {
        alias: 'c',
        type: 'number',
        description: 'Number of haikus to generate',
        default: 1,
    })
        .option('json', {
        type: 'boolean',
        description: 'Output in JSON format',
        default: false,
    })
        .help()
        .argv;
}
main().catch(console.error);
//# sourceMappingURL=index.js.map