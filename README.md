# Wrestling Circle Jerks Haiku Forge

A tiny app that generates sardonic, on-brand WWE haikus for social posting.

## Features

-   **Valid 5-7-5 Syllable Lines:** Ensures haikus adhere to the traditional structure.
-   **Contextual Generation:** Options for tone, era, and wrestler references.
-   **Wrestling Circle Jerks Flavor:** Irreverent, smart, a little mean but not cruel, heavy with insider nods and 80s/90s cable weirdness.
-   **Deterministic Generation:** Seedable random number generator for reproducible haikus.
-   **CLI Tool:** Generate haikus directly from your terminal.
-   **Web Application:** Interactive UI for generating, copying, saving as PNG, and sharing haikus.
-   **Retro UI/UX:** Inspired by 80s/90s cable TV, featuring CRT and anaglyph effects.

## Getting Started

### Prerequisites

-   Node.js (v18 or higher recommended)
-   npm (Node Package Manager)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd wrestling_haikus
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```

### Running the CLI

Navigate to the `app/cli` directory and run the build script:

```bash
cd app/cli
npm run build
```

Then, you can run the `wcj-haiku` command from the project root:

```bash
node app/cli/dist/index.js --help
```

**Examples:**

-   **Basic Haiku:**
    ```bash
    node app/cli/dist/index.js --count 1 --seed 1
    ```
-   **Specific Wrestler/Era/Show:**
    ```bash
    node app/cli/dist/index.js --wrestlers "Roman Reigns" --era "Tribal Chief" --show "SmackDown" --count 3 --seed 99
    ```
-   **JSON Output:**
    ```bash
    node app/cli/dist/index.js --count 1 --seed 1 --json
    ```
-   **Tweet-ready Output:**
    ```bash
    node app/cli/dist/index.js --count 1 --seed 1 --share-x full
    ```

### Running the Web Application

Navigate to the `app/web` directory:

```bash
cd app/web
```

Then, start the development server:

```bash
npm run dev
```

Open your web browser and visit the URL displayed in the terminal (usually `http://localhost:5173/`).

## Project Structure

```
/
├── app/
│   ├── cli/             # Command Line Interface application
│   │   ├── src/         # CLI source code (JavaScript)
│   │   └── dist/        # Compiled CLI output
│   │   └── data/        # Lexicon data (copied from web app)
│   ├── web/             # Web Application (Vite + React + TypeScript)
│   │   ├── public/      # Static assets (including lexicon data)
│   │   ├── src/         # Web app source code
│   │   │   ├── components/ # React components
│   │   │   └── utils/   # Shared utility functions (generator, syllables, rng, social)
│   │   └── tailwind.config.js
│   │   └── postcss.config.js
│   └── common/          # Shared TypeScript logic (now minimal due to build issues)
├── tests/               # (Placeholder for future tests)
├── README.md
├── LICENSE
└── package.json         # Root workspace package.json
```

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.