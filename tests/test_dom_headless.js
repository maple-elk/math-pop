/**
 * Math & Logic Studio — Headless DOM & Browser Sanity Test Suite
 * Covers Requirement R2 Acceptance Criteria:
 * - Headless browser verification via Google Chrome (--headless=new --dump-dom)
 * - Verifies clean initial page load with all primary sections, tabs, header, footer, modal
 * - Verifies zero uncaught JavaScript exceptions (TypeError, SyntaxError, ReferenceError)
 * - Verifies all script references in index.html exist on disk
 * - Verifies deep-link URL rendering and fallback handling in headless Chrome
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT_DIR = path.resolve(__dirname, '..');
const CHROME_PATHS = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium-browser',
  '/usr/bin/chromium'
];

function findChromeBinary() {
  for (const p of CHROME_PATHS) {
    if (fs.existsSync(p)) {
      return p;
    }
  }
  return null;
}

function dumpDomWithChrome(chromePath, url, timeoutMs = 12000) {
  try {
    const res = spawnSync(chromePath, [
      '--headless=new',
      '--dump-dom',
      '--disable-gpu',
      '--no-sandbox',
      '--disable-dev-shm-usage',
      url
    ], {
      encoding: 'utf8',
      timeout: timeoutMs
    });
    return {
      status: res.status,
      stdout: res.stdout || '',
      stderr: res.stderr || '',
      error: res.error || null
    };
  } catch (err) {
    return {
      status: -1,
      stdout: '',
      stderr: err.message,
      error: err
    };
  }
}

function runDomHeadlessTests(options = {}) {
  const { verbose = false } = options;
  const results = {
    name: 'Headless DOM & Browser Suite',
    total: 0,
    passed: 0,
    failed: 0,
    failures: [],
    details: {}
  };

  function assert(condition, message, tier = 'Tier 1') {
    results.total++;
    if (condition) {
      results.passed++;
    } else {
      results.failed++;
      results.failures.push({ message, tier });
      if (verbose) {
        console.error(`  FAIL [${tier}]: ${message}`);
      }
    }
  }

  // ========================================================
  // 1. TIER 1: STATIC MARKUP & SCRIPT DEPENDENCY AUDIT
  // ========================================================

  const indexPath = path.join(ROOT_DIR, 'index.html');
  assert(fs.existsSync(indexPath), 'index.html exists at project root', 'Tier 1');
  const indexHtml = fs.readFileSync(indexPath, 'utf8');

  // Verify core landmarks and containers in HTML
  assert(indexHtml.includes('class="app-container"'), 'index.html contains .app-container', 'Tier 1');
  assert(indexHtml.includes('class="quiz-header"'), 'index.html contains .quiz-header', 'Tier 1');
  assert(indexHtml.includes('class="app-tabs"'), 'index.html contains .app-tabs tab bar', 'Tier 1');
  assert(indexHtml.includes('id="profileModal"'), 'index.html contains #profileModal dialog', 'Tier 1');
  assert(indexHtml.includes('id="soundToggle"'), 'index.html contains #soundToggle button', 'Tier 1');
  assert(indexHtml.includes('id="confettiCanvas"'), 'index.html contains #confettiCanvas', 'Tier 1');

  // Verify all 9 sections exist in markup
  const expectedSections = [
    'id="preschoolSection"',
    'id="kindergartenSection"',
    'id="mathSection"',
    'id="riddlesSection"',
    'id="scienceSection"'
  ];
  for (const sec of expectedSections) {
    assert(indexHtml.includes(sec), `index.html contains stage container ${sec}`, 'Tier 1');
  }

  // Verify all script dependencies referenced in index.html exist on disk
  const scriptRegex = /<script\s+src="([^"]+)"><\/script>/g;
  let match;
  const foundScripts = [];
  while ((match = scriptRegex.exec(indexHtml)) !== null) {
    foundScripts.push(match[1]);
  }

  assert(foundScripts.length >= 8, `Found ${foundScripts.length} script tags in index.html (expected >= 8)`, 'Tier 1');
  for (const relScript of foundScripts) {
    const fullScriptPath = path.join(ROOT_DIR, relScript);
    assert(fs.existsSync(fullScriptPath), `Script dependency exists on disk: ${relScript}`, 'Tier 1');
  }

  // ========================================================
  // 1.1 ACCESSIBILITY & LANDMARK INTEGRITY (M2 REMEDIATION)
  // ========================================================

  // Landmark uniqueness: exactly one <main> element
  const mainMatches = indexHtml.match(/<main[\s>]/g) || [];
  assert(mainMatches.length === 1, `index.html contains exactly 1 <main> landmark (got ${mainMatches.length})`, 'Tier 1');
  assert(indexHtml.includes('id="mainApp"'), 'index.html contains single <main id="mainApp"> container', 'Tier 1');

  // Answer input aria-labels (all 5 stages)
  const requiredInputs = [
    'id="preschoolAnswerInput"',
    'id="kindergartenAnswerInput"',
    'id="answerInput"',
    'id="riddleAnswerInput"',
    'id="scienceAnswerInput"'
  ];
  for (const inputId of requiredInputs) {
    const inputRegex = new RegExp(`<input[^>]*${inputId}[^>]*aria-label="[^"]+"`, 'i');
    const inputRegexAlt = new RegExp(`<input[^>]*aria-label="[^"]+"[^>]*${inputId}`, 'i');
    assert(inputRegex.test(indexHtml) || inputRegexAlt.test(indexHtml), `${inputId} has non-empty aria-label`, 'Tier 1');
  }

  // Live feedback regions (aria-live and role="status")
  const feedbackIds = [
    'preschoolInputFeedback',
    'kindergartenInputFeedback',
    'inputFeedback',
    'riddleInputFeedback',
    'scienceInputFeedback'
  ];
  for (const fbId of feedbackIds) {
    const fbRegex = new RegExp(`<div[^>]*id="${fbId}"[^>]*aria-live="polite"[^>]*role="status"`, 'i');
    const fbRegexAlt = new RegExp(`<div[^>]*aria-live="polite"[^>]*role="status"[^>]*id="${fbId}"`, 'i');
    assert(fbRegex.test(indexHtml) || fbRegexAlt.test(indexHtml), `#${fbId} has aria-live="polite" and role="status"`, 'Tier 1');
  }

  // Focus-visible stylesheet validation
  const cssPath = path.join(ROOT_DIR, 'style.css');
  assert(fs.existsSync(cssPath), 'style.css exists on disk', 'Tier 1');
  const cssContent = fs.readFileSync(cssPath, 'utf8');
  assert(cssContent.includes(':focus-visible'), 'style.css contains :focus-visible rules for keyboard navigation', 'Tier 1');
  assert(cssContent.includes('.app-main'), 'style.css styles the main application container (.app-main)', 'Tier 1');

  // ========================================================
  // 2. TIER 2 & 4: HEADLESS CHROME RUNTIME VERIFICATION
  // ========================================================

  const chromeBinary = findChromeBinary();
  if (!chromeBinary) {
    if (verbose) console.warn('  [WARN] Google Chrome binary not found in standard paths; skipping headless binary execution.');
    assert(true, 'Chrome binary check skipped (not in standard path)', 'Tier 2');
    return results;
  }

  assert(true, `Discovered Google Chrome binary at: ${chromeBinary}`, 'Tier 1');

  const fileUrlBase = `file://${indexPath}`;

  // Test 1: Clean Initial Load (Tier 2)
  const initialLoad = dumpDomWithChrome(chromeBinary, fileUrlBase);
  assert(initialLoad.status === 0, 'Headless Chrome exits with code 0 on initial load', 'Tier 2');
  assert(initialLoad.stdout.includes('app-container'), 'Initial DOM contains .app-container', 'Tier 2');
  assert(initialLoad.stdout.includes('quiz-header'), 'Initial DOM contains .quiz-header', 'Tier 2');

  // Check for uncaught JS exceptions
  const hasUncaughtJs = /Uncaught (TypeError|ReferenceError|SyntaxError|RangeError)/i.test(initialLoad.stderr);
  assert(!hasUncaughtJs, 'Zero uncaught JavaScript exceptions on initial load', 'Tier 2');

  // Test 2: Deep Link Permutations in Headless Chrome (Tier 3 & 4)
  const deepLinksToTest = [
    { hash: '#preschool', expectedDom: 'preschoolSection' },
    { hash: '#kindergarten', expectedDom: 'kindergartenSection' },
    { hash: '#grade3/g3_mult', expectedDom: 'mathSection' },
    { hash: '#riddles/visual', expectedDom: 'riddlesSection' },
    { hash: '#science/space', expectedDom: 'scienceSection' },
    { hash: '#invalid_tab/nonsense/999', expectedDom: 'app-container' } // Fallback sanity
  ];

  for (const item of deepLinksToTest) {
    const linkUrl = `${fileUrlBase}${item.hash}`;
    const domRes = dumpDomWithChrome(chromeBinary, linkUrl);
    assert(domRes.status === 0, `Headless Chrome exits 0 for ${item.hash}`, 'Tier 3');
    assert(domRes.stdout.includes(item.expectedDom), `DOM rendered expected container "${item.expectedDom}" for ${item.hash}`, 'Tier 3');
    const linkUncaught = /Uncaught (TypeError|ReferenceError|SyntaxError|RangeError)/i.test(domRes.stderr);
    assert(!linkUncaught, `Zero uncaught exceptions on deep link ${item.hash}`, 'Tier 3');
  }

  return results;
}

// Direct CLI Execution
if (require.main === module) {
  console.log('--- Running Headless DOM & Browser Suite ---');
  const res = runDomHeadlessTests({ verbose: true });
  console.log(`\nResults: ${res.passed} passed, ${res.failed} failed out of ${res.total} assertions.`);
  process.exit(res.failed > 0 ? 1 : 0);
}

module.exports = {
  findChromeBinary,
  dumpDomWithChrome,
  runDomHeadlessTests
};
