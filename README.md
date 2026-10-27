# 📐 Math & Logic Studio — Preschool to 5th Grade Math, Logic & Science

A clean, interactive, distraction-free educational web application designed for young learners and elementary students (Preschool through Grade 5). Features single-key **Spacebar** progression, clearly numbered problem sets with non-repeating advancement, speech synthesis for pre-readers, and curated logic and science labs.

🌐 **Live Demo on GitHub Pages**: [https://maple-elk.github.io/math-pop/](https://maple-elk.github.io/math-pop/)

---

## 🚀 Quick Start (Local)

Run Math & Logic Studio in two easy ways locally:

### Option 1: Double-Click or Open Directly (Instant)
Simply open `index.html` in any web browser:
```bash
open index.html
```

### Option 2: Local Python Server
```bash
python3 server.py
```
Serves the app locally and opens your default browser.

---

## ⌨️ How to Use (Keyboard-First UX)

Designed for rapid, frictionless learning:
1. **Challenge Appears**: A clearly numbered problem or concept appears with custom vector diagrams.
2. **Press [SPACE BAR]**: Reveals the solution, visual counters/diagrams, and an intuitive explanation.
3. **Press [SPACE BAR] Again**: Advances strictly to the next uncompleted problem in the set.
4. **Set Complete**: When the final problem is solved, a clean summary appears rather than looping back.

*Optional Input: Children can type their answer into the input box before hitting Space to test their typing and accuracy, or use the mouse/touchscreen to tap the big button or numbered step buttons.*

---

## 🌟 Key Sections

### 1. 🔲 Preschool (48 Curated Numbered Problems)
- **Patterns (12 Problems)**: AB patterns (Red/Blue circles, Apple/Banana), ABB patterns (Frog/Duck/Duck), AAB patterns (Sun/Sun/Moon), ABC three-color sequences, size patterns (Big/Small stars), growing dot patterns, and missing elements.
- **Counting 1–5 (12 Problems)**: 1-to-1 correspondence with fruits and objects, 5-frame spatial counting, comparing sets (more vs. fewer), one-more addition, and number paths.
- **Shapes & Sizes (12 Problems)**: Circles, squares, and triangles, counting sides and corners, comparing sizes (biggest/smallest, taller/shorter, longer), spatial positions (on top vs. under, inside vs. outside), and composite shapes.
- **Sorting & Matching (12 Problems)**: Identifying the odd one out by category (vehicles vs. fruits, land animals vs. water animals, clothing for weather), color classification, part-to-whole matching, and daytime vs. nighttime sorting.
- **🔊 Read Aloud**: Built-in speech synthesis (`🔊 Listen`) so preschoolers and early readers can hear questions and explanations read aloud.

### 2. 🎒 Kindergarten (48 Curated Numbered Problems)
- **Counting & Number Bonds (12 Problems)**: 10-frame visual dot counting, missing numbers to make 10, addition within 5 ($3 + 2 = 5$), subtraction within 5 ($5 - 2 = 3$), pairs and skip-counting by 2s and 5s, comparing sets, and doubles ($4 + 4 = 8$).
- **Everyday Questions (12 Problems)**: Color mixing (Red + Yellow = Orange, Blue + Yellow = Green), analog clocks on the hour (3 o'clock), money fundamentals (Penny 1¢, Nickel 5¢), calendar days of the week (7 days), seasonal changes, 5 senses (hearing with ears), and insect anatomy (6 legs).
- **Word & Sound Riddles (12 Problems)**: Rhyming pairs (Cat/Hat, Tree/Bee), starting and ending sounds, opposites (Hot/Cold), compound words (Rain + Bow = Rainbow, Sun + Flower = Sunflower), syllable clapping, and alphabetical sequence.
- **Patterns & Shapes (12 Problems)**: 2D grids, halves and wholes (pizza symmetry), sorting by attributes, plant life cycles (Seed → Sprout → Flower), block tower counting, right triangle composition, and line symmetry.

### 3. 📚 Elementary Math (Grades 1 – 5)
- **1st Grade**: Addition (within 10 and 20), Subtraction (within 10 and 20), Making 10, Tens & Ones place value, and curated 10-problem Number Sense Set.
- **2nd Grade**: Addition (to 20), Subtraction (to 20), Mixed mode, Challenge (to 100), and curated 10-problem Number Sense Set.
- **3rd Grade**: Times Tables (up to $10 \times 10$), Division Facts, 3-Digit Addition & Subtraction, Perimeter & Area, and curated 10-problem Number Sense Set.
- **4th Grade**: Multi-Digit Multiplication, Long Division Facts, Mixed Operations, Fraction Equivalence, and curated 10-problem Number Sense Set.
- **5th Grade**: Order of Operations (PEMDAS), Unlike Fractions, Fraction Multiplication, Decimal Operations, Volume, and curated 10-problem Number Sense Set.
- **Deduplication**: Randomized problem generators keep track of seen questions so learners don't see duplicate equations in the same session.

### 4. 🧩 Logic & Spatial (28 Curated Numbered Problems)
- **Logic Problems (12 Problems)**: Lateral thinking puzzles and wordplay (Odd Seven, 2 Apples on a Table, 2nd Place Runner, Hens & Eggs rate, Guess My Number, Feathers vs. Rocks, Three Generations, Zero Phone Keypad, Coins Problem, Common Multiples, Age Riddle, and Carton of Eggs).
- **Visual & Spatial (10 Problems)**: Shape sequences, 3D isometric cube stacks with hidden blocks, butterfly symmetry, triangle counting, rotating arrows, 3D staircases, heart mirror line, orthographic grids, paper fold & punch, and cube nets.
- **3D Geometry (6 Problems)**: Mental visualization of 3D solids revealed on Spacebar (Cube edges, pyramid vertices, cylinder faces, cone cross-sections, triangular prism vertices, and rectangular prism faces).

### 5. 🔬 Science Lab (16 Curated Numbered Problems)
- **Space & Gravity (4 Problems)**: Apollo 15 hammer & feather vacuum drop, sound in space (wave transmission), ISS perpetual free-fall orbit, and Moon vs. Earth gravity.
- **Air & Friction (4 Problems)**: Surface drag (flat vs. crumpled paper), parachute canopy air traps, ice vs. grass friction, and rolling vs. sliding friction with ball bearings.
- **Density & Fluids (4 Problems)**: Steel ship vs. pebble (Archimedes' Principle), oil and water density separation, honey vs. water viscosity, and floating ice density anomaly.
- **Chemistry & Mechanics (4 Problems)**: Baking soda & vinegar gas expansion ($CO_2$), seesaw lever mechanics ($\text{Torque} = \text{Force} \times \text{Distance}$), candle under a jar atmospheric pressure, and sugar dissolution.

---

## 🛠️ Technology & Modular Architecture

- **Zero Dependencies & Buildless**: Pure HTML5, CSS3, and modular vanilla JavaScript. Runs instantly by double-clicking `index.html` or through any static web server with no Node/npm build steps required.
- **Clean Modular Codebase**:
  - [`js/storage.js`](file:///Users/mattbolte/Documents/antigravity/goofy-tesla/js/storage.js): LocalStorage persistence with memory fallbacks for private browsing.
  - [`js/audio.js`](file:///Users/mattbolte/Documents/antigravity/goofy-tesla/js/audio.js): Web Audio API sound synthesis and HTML5 Canvas particle confetti system.
  - [`js/speech.js`](file:///Users/mattbolte/Documents/antigravity/goofy-tesla/js/speech.js): Web Speech API text-to-speech engine for early childhood reading assistance.
  - [`js/data/math-data.js`](file:///Users/mattbolte/Documents/antigravity/goofy-tesla/js/data/math-data.js): Math topics, curated 10-problem number sense sets, and arithmetic generators.
  - [`js/data/logic-data.js`](file:///Users/mattbolte/Documents/antigravity/goofy-tesla/js/data/logic-data.js): Isometric 3D cube renderers, logic riddles, visual puzzles, and 3D geometry models.
  - [`js/data/science-data.js`](file:///Users/mattbolte/Documents/antigravity/goofy-tesla/js/data/science-data.js): Physics, engineering, and chemistry experiments and interactive SVG diagrams.
  - [`js/data/preschool-data.js`](file:///Users/mattbolte/Documents/antigravity/goofy-tesla/js/data/preschool-data.js): 48 preschool problems across patterns, counting 1–5, shapes, sizes, and sorting.
  - [`js/data/kindergarten-data.js`](file:///Users/mattbolte/Documents/antigravity/goofy-tesla/js/data/kindergarten-data.js): 48 kindergarten problems across counting, nature, riddles, and shapes.
  - [`js/app.js`](file:///Users/mattbolte/Documents/antigravity/goofy-tesla/js/app.js): Application state, deck navigation, multi-learner profile management, and event handling.
- **Local Storage & Backup**: Multiple learner profiles, category breakdowns, streak tracking, and JSON backup export/import.
- **Responsive & Accessible**: Clean, calm typography (`Inter` and `Plus Jakarta Sans`) tailored for classroom, desktop, tablet, and mobile devices.

## 🔗 URL Hash Deep Linking

Math & Logic Studio features full client-side hash routing, enabling seamless bookmarking, direct problem sharing, and full browser history integration.

### Hash Format Hierarchy
The router supports three granular levels of deep linking:

1. **Section Level (`#<section>`)**:
   Opens any primary section or grade-level tab directly:
   - `#preschool` — Preschool Learning Deck
   - `#kindergarten` — Kindergarten Discovery Deck
   - `#grade1`, `#grade2`, `#grade3`, `#grade4`, `#grade5` — Elementary Math Grades 1–5
   - `#riddles` — Logic & Spatial Puzzles
   - `#science` — Science Lab Experiments

2. **Topic / Track Level (`#<section>/<topic-or-track>`)**:
   Activates both the section and the specified sub-topic or learning track:
   - `#preschool/counting` — Preschool 1–5 Counting track
   - `#kindergarten/riddles` — Kindergarten Word & Sound Riddles track
   - `#grade3/g3_mult` — 3rd Grade Multiplication Times Tables
   - `#riddles/visual` — Visual & Spatial isometric puzzles
   - `#science/density` — Science Lab Density & Fluids experiments

3. **Problem Number Level (`#<section>/<topic-or-track>/<problem-number>`)**:
   Directly navigates to a specific 1-based problem index for any finite problem set:
   - `#preschool/patterns/5` — Preschool Patterns, Problem 5
   - `#grade4/g4_unusual/3` — 4th Grade Number Sense Set, Problem 3
   - `#riddles/logic/10` — Logic Riddles, Problem 10
   - `#science/space/2` — Science Lab Space & Gravity, Problem 2

### Routing Features
- **Browser History Support**: Navigating between tabs, tracks, or problems synchronizes the URL hash, supporting native browser **Back** and **Forward** buttons without page reloads.
- **Initial Load Precedence**: When a URL hash is present on initial page load, it takes precedence over the active profile's saved `localStorage` session state.
- **Graceful Fallbacks**: Malformed or out-of-bounds hashes (e.g. `#invalid/nonsense/999`) safely fall back to valid default states without runtime exceptions.
- **Universal Compatibility**: Works identically on GitHub Pages (`https://maple-elk.github.io/math-pop/`), local development servers (`http://localhost:8000`), and direct local `file://` execution.

---

## 🧪 Automated Testing & Quality Assurance

The application includes a comprehensive, standalone test suite requiring zero external npm dependencies. The suite executes directly via vanilla Node.js VM and headless Google Chrome.

### Running the Test Suites

Execute the master test runner CLI (1,590 passing assertions across Tiers 1–4):
```bash
node tests/test_runner.js
```

Fast execution (skips headless Chrome browser launch, runs in ~0.05s):
```bash
node tests/test_runner.js --fast
```

Run independent adversarial stress tests (3,018 assertions covering generators, fractions, remainders, and edge cases):
```bash
node tests/test_adversarial_m2_1.js
```

### Test Suite Architecture & Audit Reports
- **[`REVIEW_REPORT.md`](REVIEW_REPORT.md)**: Full comprehensive app-wide audit report detailing verification across all 190 curated slides, 28 math topic generators, multi-learner profile storage, audio mute synchronization, strict mode avatar crash fixes, and W3C accessibility landmarks.
- **[`TEST_READY.md`](TEST_READY.md)**: Test suite inventory, tiered assertion breakdown, and execution guides for individual component suites (`tests/test_content.js`, `tests/test_routing.js`, `tests/test_systems.js`, `tests/test_dom_headless.js`).

---

## 📄 License

MIT License. Free to use, share, and expand for learners and classrooms everywhere.

