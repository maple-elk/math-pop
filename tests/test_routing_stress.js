/**
 * Math & Logic Studio — Adversarial URL Hash Routing Stress Test Suite
 * Executed by Challenger 1 (Milestone 1)
 *
 * Verifies Requirement R1 under hostile, malformed, and rapid state conditions:
 *
 * Section 1: Malformed & Hostile Route Stress Tests
 *   - Non-existent sections (#alien_math, #__proto__, #constructor, #404, #<script>, etc.)
 *   - Extreme numbers (#preschool/patterns/-99999, #preschool/patterns/99999999, 0, MAX_SAFE_INTEGER)
 *   - Non-numeric problem numbers (#grade4/g4_unusual/abc, NaN, Infinity, [object%20Object], floats)
 *   - Query parameters & multi-hash (#grade3/g3_mult?foo=bar#extra, ?autoplay=1, trailing ?)
 *   - Special URL-encoded characters (#grade1/%20%20, %2F, %3Cscript%3E, %E2%9C%A8, invalid UTF-8 %FF%FE%FD)
 *   - Topic mismatches and invalid tracks under valid sections
 *
 * Section 2: Rapid Routing Stress Tests (Zero crashes, Zero leaks, Zero unhandled rejections)
 *   - 50 sequential rapid hashchange transitions across all 9 sections
 *   - 50 high-frequency alternating ping-pong transitions
 *   - 50 rapid adversarial malformed route inputs
 *   - 500-iteration memory leak benchmark (heap growth bounding)
 *
 * Section 3: Empirical Headless Chrome Verification
 *   - Chrome CLI --headless=new --dump-dom assertions on live index.html across all required adversarial routes
 *   - Chrome CLI execution of iframe_stress_runner.html for real browser task-queue rapid routing
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { spawnSync } = require('child_process');

const ROOT_DIR = path.resolve(__dirname, '..');

// Chrome binary discovery
const CHROME_PATHS = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium-browser',
  '/usr/bin/chromium'
];

function findChromeBinary() {
  for (const p of CHROME_PATHS) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

/**
 * Creates an instrumented sandbox mimicking a full browser DOM environment
 * for executing js/app.js and verifying AppRouter behavior directly.
 */
function createInstrumentedAppSandbox(initialHash = '#preschool/patterns/1') {
  function createMockElement(tag = 'div') {
    const listeners = {};
    const attrs = {};
    const classes = new Set();
    const children = [];
    return {
      tagName: tag.toUpperCase(),
      style: {},
      classList: {
        add: (...c) => c.forEach(x => classes.add(x)),
        remove: (...c) => c.forEach(x => classes.delete(x)),
        toggle: (c, force) => {
          if (force === undefined) {
            if (classes.has(c)) { classes.delete(c); return false; }
            else { classes.add(c); return true; }
          } else if (force) { classes.add(c); return true; }
          else { classes.delete(c); return false; }
        },
        contains: (c) => classes.has(c)
      },
      setAttribute: (k, v) => { attrs[k] = String(v); },
      getAttribute: (k) => attrs[k] || null,
      removeAttribute: (k) => { delete attrs[k]; },
      addEventListener: (evt, fn) => {
        listeners[evt] = listeners[evt] || [];
        listeners[evt].push(fn);
      },
      removeEventListener: (evt, fn) => {
        if (!listeners[evt]) return;
        const idx = listeners[evt].indexOf(fn);
        if (idx !== -1) listeners[evt].splice(idx, 1);
      },
      dispatchEvent: (evt) => {
        const type = typeof evt === 'string' ? evt : evt.type;
        (listeners[type] || []).forEach(fn => fn(evt));
      },
      appendChild: (child) => { children.push(child); return child; },
      removeChild: (child) => {
        const idx = children.indexOf(child);
        if (idx !== -1) children.splice(idx, 1);
        return child;
      },
      get children() { return children; },
      innerHTML: '',
      textContent: '',
      value: '',
      focus: () => {},
      blur: () => {},
      getContext: () => ({
        save() {}, restore() {}, clearRect() {}, fillRect() {},
        fill() {}, beginPath() {}, arc() {}
      })
    };
  }

  const windowListeners = {};
  const mockStorage = {
    _store: {},
    getItem(k) { return this._store[k] || null; },
    setItem(k, v) { this._store[k] = String(v); },
    removeItem(k) { delete this._store[k]; },
    clear() { this._store = {}; }
  };

  const sandbox = {
    console: console,
    Math: Math,
    Date: Date,
    parseInt: parseInt,
    parseFloat: parseFloat,
    isNaN: isNaN,
    isFinite: isFinite,
    Array: Array,
    Object: Object,
    String: String,
    Number: Number,
    Boolean: Boolean,
    RegExp: RegExp,
    JSON: JSON,
    setTimeout: setTimeout,
    clearTimeout: clearTimeout,
    setInterval: setInterval,
    clearInterval: clearInterval,
    localStorage: mockStorage,
    location: { hash: initialHash },
    history: {
      replaceState: (state, title, hash) => { sandbox.location.hash = hash; },
      pushState: (state, title, hash) => { sandbox.location.hash = hash; }
    },
    document: {
      getElementById: (id) => createMockElement('div'),
      querySelectorAll: (sel) => [createMockElement('button')],
      querySelector: (sel) => createMockElement('div'),
      createElement: (tag) => createMockElement(tag),
      createTextNode: (text) => ({ textContent: String(text) }),
      addEventListener: () => {},
      body: createMockElement('body')
    },
    addEventListener: (evt, fn) => {
      windowListeners[evt] = windowListeners[evt] || [];
      windowListeners[evt].push(fn);
    },
    removeEventListener: (evt, fn) => {
      if (!windowListeners[evt]) return;
      const idx = windowListeners[evt].indexOf(fn);
      if (idx !== -1) windowListeners[evt].splice(idx, 1);
    },
    dispatchWindowEvent: (evtType) => {
      (windowListeners[evtType] || []).forEach(fn => fn({ type: evtType }));
    }
  };
  sandbox.window = sandbox;
  sandbox.global = sandbox;

  const ctx = vm.createContext(sandbox);

  const scripts = [
    'js/storage.js',
    'js/audio.js',
    'js/speech.js',
    'js/data/math-data.js',
    'js/data/logic-data.js',
    'js/data/science-data.js',
    'js/data/preschool-data.js',
    'js/data/kindergarten-data.js',
    'js/app.js'
  ];

  for (const s of scripts) {
    const code = fs.readFileSync(path.join(ROOT_DIR, s), 'utf8');
    vm.runInContext(code, ctx, { filename: s });
  }

  return { ctx, sandbox };
}

function runStressSuite(options = {}) {
  const { verbose = false } = options;
  const results = {
    name: 'Adversarial URL Routing Stress Suite',
    total: 0,
    passed: 0,
    failed: 0,
    failures: []
  };

  function assert(condition, message) {
    results.total++;
    if (condition) {
      results.passed++;
      if (verbose) console.log(`  PASS: ${message}`);
    } else {
      results.failed++;
      results.failures.push(message);
      console.error(`  FAIL: ${message}`);
    }
  }

  console.log('\n======================================================');
  console.log(' SECTION 1: MALFORMED & HOSTILE ROUTE STRESS TESTS');
  console.log('======================================================');

  const { ctx, sandbox } = createInstrumentedAppSandbox('#preschool/patterns/1');
  const AppRouter = ctx.AppRouter;

  assert(typeof AppRouter === 'object' && AppRouter !== null, 'AppRouter is loaded and initialized');

  // 1.1 Non-existent sections
  const nonExistentSections = [
    '#alien_math',
    '#non_existent_tab',
    '#404',
    '#null',
    '#undefined',
    '#__proto__',
    '#constructor',
    '#<script>alert(1)</script>',
    '#<script_alert>'
  ];

  for (const item of nonExistentSections) {
    const parsed = AppRouter.parseHash(item);
    assert(parsed !== null, `parseHash returned an object for malformed section: ${item}`);
    assert(!AppRouter.VALID_SECTIONS.includes(parsed.section), `Malformed section is not in VALID_SECTIONS: ${parsed.section} (from ${item})`);

    // Apply route must return false for invalid section
    const applied = AppRouter.applyRoute(parsed, false);
    assert(applied === false, `applyRoute rejected invalid section: ${item}`);

    // handleHashChange must fall back to grade2
    sandbox.location.hash = item;
    sandbox.dispatchWindowEvent('hashchange');
    const canonical = AppRouter.getCurrentCanonicalHash();
    assert(canonical.startsWith('#grade2'), `handleHashChange on ${item} gracefully defaulted to grade2: ${canonical}`);
  }

  // 1.2 Extreme numbers (Negative, Zero, Huge, MAX_SAFE_INTEGER)
  const extremeNumberCases = [
    { input: '#preschool/patterns/-99999', sec: 'preschool', topic: 'patterns', rawNum: -99999, expectedClamped: 1, expectedCanonical: '#preschool/patterns/1' },
    { input: '#preschool/patterns/99999999', sec: 'preschool', topic: 'patterns', rawNum: 99999999, expectedClamped: 12, expectedCanonical: '#preschool/patterns/12' },
    { input: '#preschool/patterns/0', sec: 'preschool', topic: 'patterns', rawNum: 0, expectedClamped: 1, expectedCanonical: '#preschool/patterns/1' },
    { input: '#preschool/patterns/-1', sec: 'preschool', topic: 'patterns', rawNum: -1, expectedClamped: 1, expectedCanonical: '#preschool/patterns/1' },
    { input: '#science/space/-500', sec: 'science', topic: 'space', rawNum: -500, expectedClamped: 1, expectedCanonical: '#science/space/1' },
    { input: '#science/space/5000', sec: 'science', topic: 'space', rawNum: 5000, expectedClamped: 4, expectedCanonical: '#science/space/4' },
    { input: '#grade4/g4_unusual/-99999', sec: 'grade4', topic: 'g4_unusual', rawNum: -99999, expectedClamped: 1, expectedCanonical: '#grade4/g4_unusual/1' },
    { input: '#grade4/g4_unusual/99999999', sec: 'grade4', topic: 'g4_unusual', rawNum: 99999999, expectedClamped: 10, expectedCanonical: '#grade4/g4_unusual/10' },
    { input: '#riddles/logic/9007199254740991', sec: 'riddles', topic: 'logic', rawNum: 9007199254740991, expectedClamped: 12, expectedCanonical: '#riddles/logic/12' }
  ];

  for (const item of extremeNumberCases) {
    const parsed = AppRouter.parseHash(item.input);
    assert(parsed.problem === item.rawNum, `parseHash extracted extreme number: ${item.rawNum}`);
    const clamped = AppRouter.clampProblemNumber(item.sec, item.topic, parsed.problem);
    assert(clamped === item.expectedClamped, `clampProblemNumber(${item.sec}, ${item.topic}, ${parsed.problem}) clamped to ${item.expectedClamped}`);

    sandbox.location.hash = item.input;
    sandbox.dispatchWindowEvent('hashchange');
    const canonical = AppRouter.getCurrentCanonicalHash();
    assert(canonical === item.expectedCanonical, `Extreme number route ${item.input} formatted canonical ${item.expectedCanonical}`);
  }

  // 1.3 Non-numeric problem numbers: verify parsing sets problem to null, and fresh load defaults to Problem 1
  const nonNumericCases = [
    { input: '#grade4/g4_unusual/abc', sec: 'grade4', topic: 'g4_unusual' },
    { input: '#preschool/patterns/NaN', sec: 'preschool', topic: 'patterns' },
    { input: '#science/space/Infinity', sec: 'science', topic: 'space' },
    { input: '#riddles/logic/undefined', sec: 'riddles', topic: 'logic' },
    { input: '#kindergarten/math/[object%20Object]', sec: 'kindergarten', topic: 'math' },
    { input: '#preschool/patterns/3.14159', sec: 'preschool', topic: 'patterns', expectedProblem: 3 }
  ];

  for (const item of nonNumericCases) {
    const parsed = AppRouter.parseHash(item.input);
    assert(parsed.section === item.sec && parsed.topic === item.topic, `parseHash section and topic parsed cleanly: ${item.input}`);
    if (item.expectedProblem !== undefined) {
      assert(parsed.problem === item.expectedProblem, `Parsed float truncated to integer: ${item.expectedProblem}`);
    } else {
      assert(parsed.problem === null, `Non-numeric problem string correctly normalized to null problem: ${item.input}`);
    }

    // In a fresh sandbox, verify it opens problem 1 cleanly
    const fresh = createInstrumentedAppSandbox(item.input);
    const freshCanonical = fresh.ctx.AppRouter.getCurrentCanonicalHash();
    const expectedNum = (item.expectedProblem !== undefined) ? item.expectedProblem : 1;
    assert(freshCanonical.endsWith(`/${expectedNum}`), `Fresh load on ${item.input} correctly defaulted to problem ${expectedNum}: ${freshCanonical}`);
  }

  // 1.4 Query parameters & extra hash fragments
  const queryParamCases = [
    { input: '#grade3/g3_mult?foo=bar#extra', sec: 'grade3', topic: 'g3_mult', expectedCanonical: '#grade3/g3_mult' },
    { input: '#preschool/patterns/5?autoplay=true&volume=0', sec: 'preschool', topic: 'patterns', expectedProblem: 5, expectedCanonical: '#preschool/patterns/5' },
    { input: '#science/density?', sec: 'science', topic: 'density', expectedCanonical: '#science/density/1' },
    { input: '#grade2/g2_add?a=1&b=2?c=3', sec: 'grade2', topic: 'g2_add', expectedCanonical: '#grade2/g2_add' },
    { input: '#kindergarten/riddles/2?utm_source=twitter&utm_medium=cpc#nav', sec: 'kindergarten', topic: 'riddles', expectedProblem: 2, expectedCanonical: '#kindergarten/riddles/2' }
  ];

  for (const item of queryParamCases) {
    const parsed = AppRouter.parseHash(item.input);
    assert(parsed.section === item.sec && parsed.topic === item.topic, `parseHash stripped query params: ${item.input}`);
    if (item.expectedProblem) {
      assert(parsed.problem === item.expectedProblem, `parseHash retained problem number with query params: ${item.expectedProblem}`);
    }

    sandbox.location.hash = item.input;
    sandbox.dispatchWindowEvent('hashchange');
    const canonical = AppRouter.getCurrentCanonicalHash();
    assert(canonical === item.expectedCanonical, `Query param hash ${item.input} canonicalized to: ${canonical}`);
  }

  // 1.5 Special URL encoded characters & malformed encodings
  const encodedCharCases = [
    { input: '#grade1/%20%20', sec: 'grade1', expectedFallbackTopic: 'g1_add10', expectedCanonical: '#grade1/g1_add10' },
    { input: '#preschool/%2F%2F', sec: 'preschool', expectedFallbackTrack: 'patterns', expectedCanonicalTrack: 'patterns' },
    { input: '#science/%3Cscript%3E', sec: 'science', expectedFallbackTrack: 'space', expectedCanonicalSection: 'science' },
    { input: '#preschool/patterns/%E2%9C%A8', sec: 'preschool', topic: 'patterns', expectedCanonicalTrack: 'patterns' },
    { input: '#%FF%FE%FD', expectedCanonicalPrefix: '#grade2' } // Malformed UTF-8 sequence must NOT throw URIError
  ];

  for (const item of encodedCharCases) {
    let parseError = null;
    let parsed = null;
    try {
      parsed = AppRouter.parseHash(item.input);
    } catch (err) {
      parseError = err;
    }
    assert(parseError === null, `parseHash did not throw on encoded/malformed string ${item.input}`);

    sandbox.location.hash = item.input;
    let eventError = null;
    try {
      sandbox.dispatchWindowEvent('hashchange');
    } catch (err) {
      eventError = err;
    }
    assert(eventError === null, `handleHashChange did not throw on ${item.input}`);

    const canonical = AppRouter.getCurrentCanonicalHash();
    if (item.expectedCanonical) {
      assert(canonical === item.expectedCanonical, `Encoded char hash ${item.input} canonicalized to: ${canonical}`);
    } else if (item.expectedCanonicalPrefix) {
      assert(canonical.startsWith(item.expectedCanonicalPrefix), `Malformed UTF-8 sequence ${item.input} safely defaulted to grade2: ${canonical}`);
    } else if (item.expectedCanonicalSection) {
      assert(canonical.startsWith(`#${item.expectedCanonicalSection}`), `Encoded char hash ${item.input} stayed in section ${item.expectedCanonicalSection}: ${canonical}`);
    } else if (item.expectedCanonicalTrack) {
      assert(canonical.includes(item.expectedCanonicalTrack), `Encoded char hash ${item.input} resolved to track ${item.expectedCanonicalTrack}: ${canonical}`);
    }
  }

  console.log('\n======================================================');
  console.log(' SECTION 2: RAPID ROUTING STRESS TESTS');
  console.log('======================================================');

  // 2.1 50 Sequential Rapid State Changes
  const sequence50 = [
    '#kindergarten/math/3',
    '#grade1/g1_sub10',
    '#preschool/patterns/-99999',
    '#grade4/g4_unusual/abc',
    '#alien_math',
    '#science/space/4',
    '#riddles/visual/5',
    '#grade3/g3_mult?foo=bar#extra',
    '#grade1/%20%20',
    '#preschool/patterns/99999999',
    '#grade5/g5_pemdas',
    '#kindergarten/riddles/7',
    '#science/density/2',
    '#riddles/mental/1',
    '#grade2/g2_chal',
    '#grade4/g4_frac',
    '#grade2/g2_unusual/8',
    '#preschool/counting/12',
    '#preschool/shapes/2',
    '#kindergarten/puzzles/11',
    '#science/chemistry/3',
    '#science/air/1',
    '#riddles/logic/12',
    '#grade5/g5_unusual/10',
    '#grade3/g3_geom',
    '#grade1/g1_make10',
    '#grade2/g2_sub',
    '#grade4/g4_prime',
    '#grade3/g3_div',
    '#grade5/g5_volume',
    '#preschool/sorting/4',
    '#kindergarten/questions/9',
    '#riddles/visual/2',
    '#science/space/1',
    '#grade1/g1_add20',
    '#grade2/g2_mix',
    '#grade3/g3_addsub',
    '#grade4/g4_dec',
    '#grade5/g5_dec_ops',
    '#invalid/route/here',
    '#grade1/g1_tens',
    '#grade2/g2_add',
    '#preschool/patterns/1',
    '#kindergarten/math/1',
    '#science/space/2',
    '#riddles/logic/3',
    '#grade4/g4_unusual/4',
    '#grade5/g5_frac_unlike',
    '#grade3/g3_mix',
    '#science/space/3' // 50th destination
  ];

  let seqErrors = 0;
  const seqStart = Date.now();
  for (let i = 0; i < sequence50.length; i++) {
    try {
      sandbox.location.hash = sequence50[i];
      sandbox.dispatchWindowEvent('hashchange');
    } catch (err) {
      seqErrors++;
      console.error(`Error at rapid sequence index ${i} (${sequence50[i]}):`, err);
    }
  }
  const seqElapsed = Date.now() - seqStart;
  assert(seqErrors === 0, `50 rapid state changes threw 0 exceptions (completed in ${seqElapsed}ms)`);
  assert(AppRouter.getCurrentCanonicalHash() === '#science/space/3', `Final canonical hash after 50 rapid changes matches exact target #science/space/3`);
  assert(sandbox.location.hash === '#science/space/3', `Browser location.hash after 50 rapid changes is synchronized to #science/space/3`);

  // 2.2 50 Alternating Rapid Transitions (Preschool Patterns <-> Science Chemistry)
  let pingPongErrors = 0;
  for (let i = 0; i < 50; i++) {
    try {
      const target = (i % 2 === 0) ? '#preschool/patterns/1' : '#science/chemistry/4';
      sandbox.location.hash = target;
      sandbox.dispatchWindowEvent('hashchange');
    } catch (err) {
      pingPongErrors++;
    }
  }
  assert(pingPongErrors === 0, `50 alternating high-frequency ping-pong changes threw 0 exceptions`);
  assert(AppRouter.getCurrentCanonicalHash() === '#science/chemistry/4', `Alternating transitions resolved accurately to final target`);

  // 2.3 50 Rapid Malformed Barrage
  let barrageErrors = 0;
  for (let i = 0; i < 50; i++) {
    try {
      sandbox.location.hash = `#bogus_section_${i}/track_${i}/${i * 1000}`;
      sandbox.dispatchWindowEvent('hashchange');
    } catch (err) {
      barrageErrors++;
    }
  }
  assert(barrageErrors === 0, `50 rapid malformed routes threw 0 exceptions`);
  assert(AppRouter.getCurrentCanonicalHash().startsWith('#grade2'), `Malformed barrage safely preserved valid grade2 default state`);

  // 2.4 500-Iteration Memory Leak Benchmark
  const memBefore = process.memoryUsage().heapUsed;
  for (let i = 0; i < 500; i++) {
    const route = sequence50[i % sequence50.length];
    sandbox.location.hash = route;
    sandbox.dispatchWindowEvent('hashchange');
  }
  if (global.gc) global.gc();
  const memAfter = process.memoryUsage().heapUsed;
  const memDeltaMb = (memAfter - memBefore) / (1024 * 1024);
  assert(memDeltaMb < 15.0, `Memory delta over 500 route transitions is bounded: ${memDeltaMb.toFixed(2)} MB (< 15 MB)`);

  console.log('\n======================================================');
  console.log(' SECTION 3: EMPIRICAL HEADLESS CHROME VERIFICATION');
  console.log('======================================================');

  const chromeBinary = findChromeBinary();
  if (!chromeBinary) {
    console.warn('  [WARN] Chrome binary not found; skipping Headless Chrome CLI execution.');
  } else {
    assert(true, `Headless Chrome discovered at: ${chromeBinary}`);

    const indexPath = path.join(ROOT_DIR, 'index.html');
    const fileUrl = `file://${indexPath}`;

    function dumpWithChrome(url, timeoutMs = 12000, extraFlags = []) {
      const args = [
        '--headless=new',
        '--dump-dom',
        '--disable-gpu',
        '--no-sandbox',
        '--disable-dev-shm-usage',
        ...extraFlags,
        url
      ];
      return spawnSync(chromeBinary, args, { encoding: 'utf8', timeout: timeoutMs });
    }

    // 3.1 Test Chrome on required adversarial routes:
    const chromeAdversarialRoutes = [
      {
        hash: '#alien_math',
        name: 'Non-existent section (#alien_math)',
        expectedSnippet: 'data-tab="grade2"'
      },
      {
        hash: '#preschool/patterns/-99999',
        name: 'Extreme negative number (#preschool/patterns/-99999)',
        expectedSnippet: 'Preschool • Patterns • Problem 1 of 12'
      },
      {
        hash: '#preschool/patterns/99999999',
        name: 'Extreme overflow number (#preschool/patterns/99999999)',
        expectedSnippet: 'Preschool • Patterns • Problem 12 of 12'
      },
      {
        hash: '#grade4/g4_unusual/abc',
        name: 'Non-numeric problem number (#grade4/g4_unusual/abc)',
        expectedSnippet: '4th Grade • Number Sense • Problem 1 of 10'
      },
      {
        hash: '#grade3/g3_mult?foo=bar#extra',
        name: 'Query parameters and extra hash (#grade3/g3_mult?foo=bar#extra)',
        expectedSnippet: '3rd Grade • Multiplication'
      },
      {
        hash: '#grade1/%20%20',
        name: 'Special URL encoded spaces (#grade1/%20%20)',
        expectedSnippet: '1st Grade • Addition (to 10)'
      },
      {
        hash: '#%FF%FE%FD',
        name: 'Malformed percent encoding (#%FF%FE%FD)',
        expectedSnippet: 'data-tab="grade2"'
      }
    ];

    for (const testCase of chromeAdversarialRoutes) {
      const res = dumpWithChrome(`${fileUrl}${testCase.hash}`);
      assert(res.status === 0, `Headless Chrome exit code 0 on ${testCase.name}`);
      assert(res.stdout.includes(testCase.expectedSnippet), `Headless Chrome DOM contains "${testCase.expectedSnippet}" for ${testCase.name}`);
      const uncaught = /Uncaught (TypeError|ReferenceError|SyntaxError|RangeError|URIError)/i.test(res.stderr);
      assert(!uncaught, `Headless Chrome stderr reports 0 uncaught exceptions for ${testCase.name}`);
    }

    // 3.2 In-browser 50-state rapid sequence in Chrome engine
    const runnerPath = path.join(ROOT_DIR, 'tests/iframe_stress_runner.html');
    if (fs.existsSync(runnerPath)) {
      const runnerRes = dumpWithChrome(
        `file://${runnerPath}`,
        15000,
        ['--allow-file-access-from-files', '--virtual-time-budget=6000']
      );
      assert(runnerRes.status === 0, 'Headless Chrome executed iframe_stress_runner.html with exit code 0');
      assert(runnerRes.stdout.includes('data-status="PASS"'), 'In-browser 50-state rapid routing test status is PASS');
      assert(runnerRes.stdout.includes('data-errors="0"'), 'In-browser 50-state rapid routing test recorded 0 errors');
      assert(runnerRes.stdout.includes('data-final-canonical="#science/space/3"'), 'In-browser 50-state rapid routing ended at canonical #science/space/3');
      assert(runnerRes.stdout.includes('data-active-tab="science"'), 'In-browser 50-state rapid routing synchronized active tab to science');
      assert(runnerRes.stdout.includes('data-active-slide="3"'), 'In-browser 50-state rapid routing synchronized active slide button to 3');
    }
  }

  console.log('\n======================================================');
  console.log(` SUMMARY: ${results.passed} passed, ${results.failed} failed out of ${results.total} assertions.`);
  console.log('======================================================\n');

  return results;
}

if (require.main === module) {
  const verbose = process.argv.includes('--verbose') || process.argv.includes('-v');
  const res = runStressSuite({ verbose });
  process.exit(res.failed > 0 ? 1 : 0);
}

module.exports = {
  runStressSuite
};
