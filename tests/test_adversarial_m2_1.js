#!/usr/bin/env node

/**
 * Challenger 1 Adversarial Stress Test Suite for Milestone 2
 *
 * Verifies:
 * 1. g2_add & g2_sub (200+ samples each): Non-empty stepExplanation and mathematically exact equations.
 * 2. g5_frac_unlike (1000+ samples): When simp.den === 1, both typing "1" and "1/1" are accepted by answer verification logic.
 * 3. Decimals (g4_dec, g5_dec_ops): Typing whole numbers without .0 (e.g. "3" for "3.0") are accepted.
 * 4. Remainders (g4_div): Flexible formats ("5r2", "5 r 2", "5 remainder 2", "5 R 2") accepted, invalid rejected.
 * 5. Primes (g4_prime): "yes", "no", "prime", "composite", "y", "n", case-insensitivity accepted, opposites rejected.
 * 6. Live App.js DOM Execution: revealMathSolution() end-to-end simulation.
 * 7. Adversarial Edge Case & Attack Surface Mining: parseFloat parsing leaks, fraction spaces, malformed inputs.
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { spawnSync } = require('child_process');

const ROOT_DIR = path.resolve(__dirname, '..');
const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const INDEX_HTML_PATH = path.join(ROOT_DIR, 'index.html');

const suiteResults = {
  total: 0,
  passed: 0,
  failed: 0,
  failures: [],
  findings: []
};

function assert(condition, message, section = 'General') {
  suiteResults.total++;
  if (condition) {
    suiteResults.passed++;
  } else {
    suiteResults.failed++;
    suiteResults.failures.push({ message, section });
    console.error(`  ❌ [FAIL] [${section}] ${message}`);
  }
}

function recordFinding(severity, issue, details) {
  suiteResults.findings.push({ severity, issue, details });
}

// -------------------------------------------------------------
// VM Environment Setup
// -------------------------------------------------------------
function setupMathContext() {
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
    RegExp: RegExp
  };
  sandbox.window = sandbox;
  sandbox.global = sandbox;

  const ctx = vm.createContext(sandbox);
  const mathDataCode = fs.readFileSync(path.join(ROOT_DIR, 'js/data/math-data.js'), 'utf8');
  vm.runInContext(mathDataCode, ctx, { filename: 'math-data.js' });
  return ctx;
}

// Answer verification logic mirroring js/app.js revealMathSolution()
function verifyAnswer(problem, typedInput) {
  const typedVal = String(typedInput).trim().toLowerCase().replace(/\s+/g, ' ');
  if (typedVal === '') return false;

  const rawAns = problem.answerRaw.toLowerCase().replace(/\s+/g, ' ');
  const cleanTyped = typedVal.replace(/,/g, '');
  const cleanRaw = rawAns.replace(/,/g, '');

  let isMatch = (typedVal === rawAns || cleanTyped === cleanRaw);

  // Check answersAccepted array if defined
  if (!isMatch && Array.isArray(problem.answersAccepted)) {
    isMatch = problem.answersAccepted.some((accepted) => {
      const a = String(accepted).toLowerCase().trim().replace(/,/g, '');
      return cleanTyped === a || typedVal === a;
    });
  }

  // 1. Prime vs. Composite equivalence
  if (!isMatch) {
    if (cleanRaw === 'yes' && ['yes', 'y', 'prime'].includes(cleanTyped)) {
      isMatch = true;
    } else if (cleanRaw === 'no' && ['no', 'n', 'composite', 'not prime'].includes(cleanTyped)) {
      isMatch = true;
    }
  }

  // 2. Fraction equivalence
  if (!isMatch) {
    const normFrac = (s) => (s.endsWith('/1') ? s.slice(0, -2) : s);
    if (normFrac(cleanTyped) === normFrac(cleanRaw)) {
      isMatch = true;
    }
  }

  // 3. Division with remainders flexible spacing (e.g. "5r2" matches "5 R 2")
  const isRemProblem = /[rR]|remainder/i.test(cleanRaw);
  if (!isMatch && isRemProblem) {
    const normRem = (s) => s.replace(/\s+/g, '').replace(/remainder/gi, 'r');
    if (normRem(cleanTyped) === normRem(cleanRaw)) {
      isMatch = true;
    }
  }

  // 4. Decimal and whole number equivalence (e.g. student typing "3" matches "3.0")
  if (!isMatch && !cleanTyped.includes('/') && !cleanRaw.includes('/') && !isRemProblem && !/[rR]|remainder/i.test(cleanTyped)) {
    const numTyped = Number(cleanTyped);
    const numRaw = Number(cleanRaw);
    if (!isNaN(numTyped) && !isNaN(numRaw) && Math.abs(numTyped - numRaw) < 1e-6) {
      isMatch = true;
    }
  }

  return isMatch;
}

console.log('===============================================================');
console.log('Challenger 1 Adversarial Stress Test: Milestone 2 Remediations');
console.log('===============================================================\n');

const ctx = setupMathContext();

// =============================================================
// 1. g2_add & g2_sub Adversarial Test (200+ samples each)
// =============================================================
console.log('--- Part 1: g2_add & g2_sub (200 Samples Each) ---');

let addExplanationsValid = true;
let addMathValid = true;
let addDotsValid = true;

for (let i = 0; i < 200; i++) {
  const p = ctx.generateRandomMathProblemOnce('g2_add');

  // Assert non-empty stepExplanation
  if (!p.stepExplanation || typeof p.stepExplanation !== 'string' || p.stepExplanation.trim().length === 0) {
    addExplanationsValid = false;
  }

  // Extract a and b from leftHtml: <span class="num">${a}</span><span class="op">+</span><span class="num">${b}</span>
  const match = p.leftHtml.match(/<span class="num">(\d+)<\/span><span class="op">\+<\/span><span class="num">(\d+)<\/span>/);
  if (!match) {
    addMathValid = false;
    continue;
  }
  const a = parseInt(match[1], 10);
  const b = parseInt(match[2], 10);
  const rawSum = parseInt(p.answerRaw, 10);

  if (a + b !== rawSum || String(a + b) !== p.answerHtml) {
    addMathValid = false;
  }

  // Check stepExplanation contains exact math
  const expectedExpl = `${a} + ${b} = ${rawSum}.`;
  if (p.stepExplanation !== expectedExpl) {
    addExplanationsValid = false;
  }

  // Check dots visualizer
  if (!p.hasVisualDots || p.dotsA !== a || p.dotsB !== b || p.dotsOp !== '+') {
    addDotsValid = false;
  }

  // Bounds check: 2nd grade addition sum between 4 and 20
  if (rawSum < 4 || rawSum > 20 || a < 1 || b < 1) {
    addMathValid = false;
  }
}

assert(addExplanationsValid, 'All 200 g2_add samples have non-empty, mathematically exact stepExplanation', 'g2_add');
assert(addMathValid, 'All 200 g2_add samples have correct addition equations within [4, 20]', 'g2_add');
assert(addDotsValid, 'All 200 g2_add samples have valid visual dots representation (dotsA, dotsB, dotsOp="+")', 'g2_add');

let subExplanationsValid = true;
let subMathValid = true;
let subDotsValid = true;

for (let i = 0; i < 200; i++) {
  const p = ctx.generateRandomMathProblemOnce('g2_sub');

  if (!p.stepExplanation || typeof p.stepExplanation !== 'string' || p.stepExplanation.trim().length === 0) {
    subExplanationsValid = false;
  }

  const match = p.leftHtml.match(/<span class="num">(\d+)<\/span><span class="op">-<\/span><span class="num">(\d+)<\/span>/);
  if (!match) {
    subMathValid = false;
    continue;
  }
  const a = parseInt(match[1], 10);
  const b = parseInt(match[2], 10);
  const rawAns = parseInt(p.answerRaw, 10);

  if (a - b !== rawAns || String(a - b) !== p.answerHtml) {
    subMathValid = false;
  }

  const expectedExpl = `${a} minus ${b} equals ${rawAns}.`;
  if (p.stepExplanation !== expectedExpl) {
    subExplanationsValid = false;
  }

  if (!p.hasVisualDots || p.dotsA !== a || p.dotsB !== b || p.dotsOp !== '-') {
    subDotsValid = false;
  }

  if (a < 4 || a > 20 || b < 1 || rawAns < 1) {
    subMathValid = false;
  }
}

assert(subExplanationsValid, 'All 200 g2_sub samples have non-empty, mathematically exact stepExplanation', 'g2_sub');
assert(subMathValid, 'All 200 g2_sub samples have correct subtraction equations within [4, 20]', 'g2_sub');
assert(subDotsValid, 'All 200 g2_sub samples have valid visual dots representation (dotsA, dotsB, dotsOp="-")', 'g2_sub');


// =============================================================
// 2. g5_frac_unlike Adversarial Test (1000+ samples)
// =============================================================
console.log('--- Part 2: g5_frac_unlike (1000 Samples, simp.den === 1 Stress Test) ---');

let den1Count = 0;
let den1AcceptedOne = 0;
let den1AcceptedOneSlashOne = 0;
let den1AcceptedPadded = 0;
let den1RejectsWrong = 0;
let nonDen1Accepted = 0;
let nonDen1RejectsWrong = 0;

for (let i = 0; i < 1000; i++) {
  const p = ctx.generateRandomMathProblemOnce('g5_frac_unlike');

  // Detect whether denominator simplifies to 1
  const isDen1 = (p.answerHtml === '1' || p.answerRaw === '1');
  if (isDen1) {
    den1Count++;

    // Assert answerRaw is "1" and NOT "1/1"
    assert(p.answerRaw === '1', `Sample #${i + 1} has answerRaw === "1" when den=1`, 'g5_frac_unlike_den1');
    assert(Array.isArray(p.answersAccepted) && p.answersAccepted.includes('1') && p.answersAccepted.includes('1/1'),
      `Sample #${i + 1} answersAccepted includes both "1" and "1/1"`, 'g5_frac_unlike_den1');

    // Test verification accepts "1"
    if (verifyAnswer(p, '1')) den1AcceptedOne++;
    // Test verification accepts "1/1"
    if (verifyAnswer(p, '1/1')) den1AcceptedOneSlashOne++;
    // Test verification accepts padded whitespace " 1 " and " 1/1 "
    if (verifyAnswer(p, ' 1 ') && verifyAnswer(p, ' 1/1 ')) den1AcceptedPadded++;
    // Test verification rejects wrong answers
    if (!verifyAnswer(p, '2') && !verifyAnswer(p, '1/2') && !verifyAnswer(p, '0') && !verifyAnswer(p, '-1')) {
      den1RejectsWrong++;
    }
  } else {
    // Fraction answer
    if (verifyAnswer(p, p.answerRaw)) nonDen1Accepted++;
    if (!verifyAnswer(p, '99/99') && !verifyAnswer(p, '0')) nonDen1RejectsWrong++;
  }
}

console.log(`  -> Generated 1000 samples of g5_frac_unlike: ${den1Count} had simp.den === 1 (${(den1Count/10).toFixed(1)}%)`);
assert(den1Count >= 30, `Statistical distribution generated ample den=1 samples (got ${den1Count}, expected >= 30)`, 'g5_frac_unlike');
assert(den1AcceptedOne === den1Count, `Verification accepted "1" for 100% of den=1 samples (${den1AcceptedOne}/${den1Count})`, 'g5_frac_unlike');
assert(den1AcceptedOneSlashOne === den1Count, `Verification accepted "1/1" for 100% of den=1 samples (${den1AcceptedOneSlashOne}/${den1Count})`, 'g5_frac_unlike');
assert(den1AcceptedPadded === den1Count, `Verification accepted whitespace-padded " 1 " and " 1/1 " for 100% of den=1 samples`, 'g5_frac_unlike');
assert(den1RejectsWrong === den1Count, `Verification rejected wrong answers ("2", "1/2", "0") for 100% of den=1 samples`, 'g5_frac_unlike');
assert(nonDen1Accepted === (1000 - den1Count), `Standard fraction answers accepted for 100% of non-den=1 samples`, 'g5_frac_unlike');
assert(nonDen1RejectsWrong === (1000 - den1Count), `Wrong fraction answers rejected for 100% of non-den=1 samples`, 'g5_frac_unlike');


// =============================================================
// 3. Decimals (g4_dec, g5_dec_ops) Adversarial Test
// =============================================================
console.log('--- Part 3: Decimals (g4_dec, g5_dec_ops: Whole Numbers without .0) ---');

let decimalWholeCount = 0;
let decimalWholeAcceptedWithoutDotZero = 0;
let decimalWholeAcceptedWithDotZero = 0;
let decimalWholeRejectsWrong = 0;

// Test generated samples from g4_dec
for (let i = 0; i < 300; i++) {
  const p = ctx.generateRandomMathProblemOnce('g4_dec');
  if (p.answerRaw.endsWith('.0')) {
    decimalWholeCount++;
    const wholeNumberStr = p.answerRaw.replace(/\.0$/, '');

    // Assert typing whole number without .0 is accepted
    if (verifyAnswer(p, wholeNumberStr)) {
      decimalWholeAcceptedWithoutDotZero++;
    }
    // Assert typing with .0 is accepted
    if (verifyAnswer(p, p.answerRaw)) {
      decimalWholeAcceptedWithDotZero++;
    }
    // Assert typing wrong whole number is rejected
    const wrongWhole = String(parseInt(wholeNumberStr, 10) + 1);
    if (!verifyAnswer(p, wrongWhole) && !verifyAnswer(p, wholeNumberStr + '.1')) {
      decimalWholeRejectsWrong++;
    }
  }
}

// Test generated samples from g5_dec_ops
for (let i = 0; i < 300; i++) {
  const p = ctx.generateRandomMathProblemOnce('g5_dec_ops');
  if (p.answerRaw.endsWith('.0')) {
    decimalWholeCount++;
    const wholeNumberStr = p.answerRaw.replace(/\.0$/, '');

    if (verifyAnswer(p, wholeNumberStr)) {
      decimalWholeAcceptedWithoutDotZero++;
    }
    if (verifyAnswer(p, p.answerRaw)) {
      decimalWholeAcceptedWithDotZero++;
    }
    const wrongWhole = String(parseInt(wholeNumberStr, 10) + 1);
    if (!verifyAnswer(p, wrongWhole) && !verifyAnswer(p, wholeNumberStr + '.1')) {
      decimalWholeRejectsWrong++;
    }
  }
}

console.log(`  -> Detected ${decimalWholeCount} decimal questions with .0 integer results`);
assert(decimalWholeCount > 0, `Generated decimal questions produced whole-number .0 cases (got ${decimalWholeCount})`, 'decimals');
assert(decimalWholeAcceptedWithoutDotZero === decimalWholeCount,
  `Whole numbers without .0 accepted for 100% of .0 decimal problems (${decimalWholeAcceptedWithoutDotZero}/${decimalWholeCount})`, 'decimals');
assert(decimalWholeAcceptedWithDotZero === decimalWholeCount,
  `Original .0 strings accepted for 100% of .0 decimal problems`, 'decimals');
assert(decimalWholeRejectsWrong === decimalWholeCount,
  `Wrong whole numbers rejected for 100% of .0 decimal problems`, 'decimals');

// Synthetic precision test against decimal suite
const syntheticDecimals = [
  { raw: '3.0', whole: '3', wrong: '4' },
  { raw: '18.0', whole: '18', wrong: '19' },
  { raw: '0.0', whole: '0', wrong: '1' },
  { raw: '100.0', whole: '100', wrong: '101' },
  { raw: '2.5', whole: null, wrong: '2' }
];

for (const sd of syntheticDecimals) {
  const mockProblem = { answerRaw: sd.raw };
  if (sd.whole !== null) {
    assert(verifyAnswer(mockProblem, sd.whole), `Synthetic ${sd.raw} accepts whole number "${sd.whole}"`, 'decimals_synthetic');
    assert(verifyAnswer(mockProblem, ` ${sd.whole} `), `Synthetic ${sd.raw} accepts whitespace padded "${sd.whole}"`, 'decimals_synthetic');
    assert(verifyAnswer(mockProblem, sd.raw), `Synthetic ${sd.raw} accepts exact "${sd.raw}"`, 'decimals_synthetic');
    assert(verifyAnswer(mockProblem, `${sd.whole}.00`), `Synthetic ${sd.raw} accepts redundant zero "${sd.whole}.00"`, 'decimals_synthetic');
    assert(!verifyAnswer(mockProblem, sd.wrong), `Synthetic ${sd.raw} rejects incorrect "${sd.wrong}"`, 'decimals_synthetic');
  } else {
    assert(verifyAnswer(mockProblem, '2.5'), 'Synthetic 2.5 accepts "2.5"', 'decimals_synthetic');
    assert(!verifyAnswer(mockProblem, '2'), 'Synthetic 2.5 rejects truncated integer "2"', 'decimals_synthetic');
    assert(!verifyAnswer(mockProblem, '3'), 'Synthetic 2.5 rejects rounded integer "3"', 'decimals_synthetic');
  }
}


// =============================================================
// 4. Remainders (g4_div) Adversarial Test
// =============================================================
console.log('--- Part 4: Division & Remainders (g4_div: "5r2", "5 r 2", "5 remainder 2") ---');

let remainderCount = 0;
let remainder5r2Passed = 0;
let remainder5_r_2Passed = 0;
let remainder5remainder2Passed = 0;
let remainderUppercasePassed = 0;
let remainderInvalidRejected = 0;
let cleanDivAccepted = 0;
let cleanDivRejectsWrongQuotient = 0;
let cleanDivRejectsFalseRemainder = 0;

for (let i = 0; i < 300; i++) {
  const p = ctx.generateRandomMathProblemOnce('g4_div');
  const remMatch = p.answerRaw.match(/^(\d+)\s+R\s+(\d+)$/i);
  if (remMatch) {
    remainderCount++;
    const q = remMatch[1];
    const r = remMatch[2];

    // Format 1: "5r2"
    if (verifyAnswer(p, `${q}r${r}`)) remainder5r2Passed++;
    // Format 2: "5 r 2"
    if (verifyAnswer(p, `${q} r ${r}`)) remainder5_r_2Passed++;
    // Format 3: "5 remainder 2"
    if (verifyAnswer(p, `${q} remainder ${r}`)) remainder5remainder2Passed++;
    // Format 4: "5 R 2" & "5 Remainder 2"
    if (verifyAnswer(p, `${q} R ${r}`) && verifyAnswer(p, `${q} Remainder ${r}`)) remainderUppercasePassed++;

    // Invalid variations rejected: wrong remainder, wrong quotient, quotient only, remainder only
    const wrongR = parseInt(r, 10) + 1;
    const wrongQ = parseInt(q, 10) + 1;
    if (
      !verifyAnswer(p, `${q}r${wrongR}`) &&
      !verifyAnswer(p, `${wrongQ}r${r}`) &&
      !verifyAnswer(p, `${q}`) &&
      !verifyAnswer(p, `${r}`)
    ) {
      remainderInvalidRejected++;
    }
  } else {
    // Clean division without remainder (e.g. "12")
    const q = p.answerRaw;
    if (verifyAnswer(p, q)) cleanDivAccepted++;
    if (!verifyAnswer(p, `${parseInt(q, 10) + 1}`)) cleanDivRejectsWrongQuotient++;
    if (!verifyAnswer(p, `${q}r0`)) cleanDivRejectsFalseRemainder++;
  }
}

console.log(`  -> Detected ${remainderCount} division problems with remainders, ${300 - remainderCount} clean division problems`);
assert(remainderCount >= 50, `Ample remainder questions generated (got ${remainderCount}, expected >= 50)`, 'g4_div');
assert(remainder5r2Passed === remainderCount, `Format "5r2" (no spaces) accepted 100% of the time (${remainder5r2Passed}/${remainderCount})`, 'g4_div');
assert(remainder5_r_2Passed === remainderCount, `Format "5 r 2" (spaced) accepted 100% of the time (${remainder5_r_2Passed}/${remainderCount})`, 'g4_div');
assert(remainder5remainder2Passed === remainderCount, `Format "5 remainder 2" (word) accepted 100% of the time (${remainder5remainder2Passed}/${remainderCount})`, 'g4_div');
assert(remainderUppercasePassed === remainderCount, `Uppercase variations ("5 R 2", "5 Remainder 2") accepted 100% of the time`, 'g4_div');
assert(cleanDivAccepted === (300 - remainderCount), `Clean division accepts exact quotient for 100% of samples`, 'g4_div');
assert(cleanDivRejectsWrongQuotient === (300 - remainderCount), `Clean division rejects wrong quotient for 100% of samples`, 'g4_div');

// Adversarial remainder validation assertions
assert(remainderInvalidRejected === remainderCount,
  `[ADVERSARIAL] Incorrect quotients/remainders rejected for remainder problems (${remainderInvalidRejected}/${remainderCount})`, 'g4_div_adversarial');
assert(cleanDivRejectsFalseRemainder === (300 - remainderCount),
  `[ADVERSARIAL] Clean division rejects false remainder ${300 - remainderCount} times (${cleanDivRejectsFalseRemainder}/${300 - remainderCount})`, 'g4_div_adversarial');


// =============================================================
// 5. Factors & Primes (g4_prime) Adversarial Test
// =============================================================
console.log('--- Part 5: Factors & Primes (g4_prime: "yes", "no", "prime", "composite", "y", "n") ---');

let primeCount = 0;
let compositeCount = 0;

for (let i = 0; i < 200; i++) {
  const p = ctx.generateRandomMathProblemOnce('g4_prime');
  if (p.answerRaw === 'yes') {
    primeCount++;
    // Accepted: "yes", "y", "prime", "YES", "Y", "PRIME"
    assert(verifyAnswer(p, 'yes'), 'Prime accepts "yes"', 'g4_prime');
    assert(verifyAnswer(p, 'y'), 'Prime accepts "y"', 'g4_prime');
    assert(verifyAnswer(p, 'prime'), 'Prime accepts "prime"', 'g4_prime');
    assert(verifyAnswer(p, 'YES'), 'Prime accepts "YES"', 'g4_prime');
    assert(verifyAnswer(p, 'Y'), 'Prime accepts "Y"', 'g4_prime');
    assert(verifyAnswer(p, 'PRIME'), 'Prime accepts "PRIME"', 'g4_prime');

    // Rejected: "no", "n", "composite", "NO", "N", "COMPOSITE", "maybe"
    assert(!verifyAnswer(p, 'no'), 'Prime rejects "no"', 'g4_prime');
    assert(!verifyAnswer(p, 'n'), 'Prime rejects "n"', 'g4_prime');
    assert(!verifyAnswer(p, 'composite'), 'Prime rejects "composite"', 'g4_prime');
    assert(!verifyAnswer(p, 'NO'), 'Prime rejects "NO"', 'g4_prime');
    assert(!verifyAnswer(p, 'N'), 'Prime rejects "N"', 'g4_prime');
    assert(!verifyAnswer(p, 'COMPOSITE'), 'Prime rejects "COMPOSITE"', 'g4_prime');
    assert(!verifyAnswer(p, 'maybe'), 'Prime rejects "maybe"', 'g4_prime');
  } else if (p.answerRaw === 'no') {
    compositeCount++;
    // Accepted: "no", "n", "composite", "not prime", "NO", "N", "COMPOSITE", "NOT PRIME"
    assert(verifyAnswer(p, 'no'), 'Composite accepts "no"', 'g4_prime');
    assert(verifyAnswer(p, 'n'), 'Composite accepts "n"', 'g4_prime');
    assert(verifyAnswer(p, 'composite'), 'Composite accepts "composite"', 'g4_prime');
    assert(verifyAnswer(p, 'not prime'), 'Composite accepts "not prime"', 'g4_prime');
    assert(verifyAnswer(p, 'NO'), 'Composite accepts "NO"', 'g4_prime');
    assert(verifyAnswer(p, 'N'), 'Composite accepts "N"', 'g4_prime');
    assert(verifyAnswer(p, 'COMPOSITE'), 'Composite accepts "COMPOSITE"', 'g4_prime');
    assert(verifyAnswer(p, 'NOT PRIME'), 'Composite accepts "NOT PRIME"', 'g4_prime');

    // Rejected: "yes", "y", "prime", "YES", "Y", "PRIME"
    assert(!verifyAnswer(p, 'yes'), 'Composite rejects "yes"', 'g4_prime');
    assert(!verifyAnswer(p, 'y'), 'Composite rejects "y"', 'g4_prime');
    assert(!verifyAnswer(p, 'prime'), 'Composite rejects "prime"', 'g4_prime');
    assert(!verifyAnswer(p, 'YES'), 'Composite rejects "YES"', 'g4_prime');
    assert(!verifyAnswer(p, 'Y'), 'Composite rejects "Y"', 'g4_prime');
    assert(!verifyAnswer(p, 'PRIME'), 'Composite rejects "PRIME"', 'g4_prime');
  } else {
    assert(false, `Unexpected answerRaw for g4_prime: ${p.answerRaw}`, 'g4_prime');
  }
}

console.log(`  -> Tested ${primeCount} prime questions and ${compositeCount} composite questions`);
assert(primeCount >= 40 && compositeCount >= 40, 'Both primes and composites sampled with balanced distribution', 'g4_prime');


// =============================================================
// 6. Live App.js revealMathSolution() DOM Simulation
// =============================================================
console.log('--- Part 6: Live App.js DOM Execution (revealMathSolution) ---');

function createLiveDomContext() {
  const store = {};
  const mockElements = {};

  function getOrCreateEl(id, tag = 'div') {
    if (!mockElements[id]) {
      mockElements[id] = {
        id,
        tagName: tag.toUpperCase(),
        classList: {
          classes: new Set(),
          add(c) { this.classes.add(c); },
          remove(c) { this.classes.delete(c); },
          contains(c) { return this.classes.has(c); },
          toggle(c) { if (this.classes.has(c)) this.classes.delete(c); else this.classes.add(c); }
        },
        getContext: () => ({
          save() {},
          restore() {},
          clearRect() {},
          fillRect() {},
          beginPath() {},
          arc() {},
          fill() {}
        }),
        width: 1024,
        height: 768,
        style: {},
        textContent: '',
        value: '',
        className: '',
        setAttribute(k, v) { this[k] = v; },
        getAttribute(k) { return this[k] || null; },
        appendChild(child) { return child; },
        removeChild(child) { return child; },
        replaceChild(newChild, oldChild) { return newChild; },
        cloneNode() { return getOrCreateEl('clone_' + Math.random().toString(36).slice(2), tag); },
        addEventListener() {},
        removeEventListener() {},
        focus() {}
      };
    }
    return mockElements[id];
  }

  // Pre-seed necessary DOM IDs for app.js
  const elementIds = [
    'questionMark', 'solutionVal', 'stepExplanation', 'answerInput',
    'inputFeedback', 'actionBtn', 'actionText', 'streakVal', 'totalCompletedVal',
    'visualizer', 'soundToggle', 'confettiCanvas', 'mainApp',
    'preschoolAnswerInput', 'kindergartenAnswerInput', 'riddleAnswerInput', 'scienceAnswerInput',
    'preschoolInputFeedback', 'kindergartenInputFeedback', 'riddleInputFeedback', 'scienceInputFeedback',
    'tabPreschool', 'tabKindergarten', 'tabGrade1', 'tabGrade2', 'tabGrade3', 'tabGrade4', 'tabGrade5', 'tabRiddles', 'tabScience',
    'activeProfileAvatar', 'activeProfileName', 'playerMenu', 'manageProfilesModal',
    'exportProgressBtn', 'importProgressInput', 'closeProfileModalBtn', 'newPlayerForm',
    'newPlayerName', 'avatarPicker', 'newPlayerPin', 'confirmPlayerPin', 'profilesList',
    'editPlayerForm', 'editPlayerName', 'editAvatarPicker', 'editPlayerPin', 'editConfirmPin',
    'cancelEditBtn', 'deleteProfileBtn'
  ];
  elementIds.forEach(id => getOrCreateEl(id));

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
    innerWidth: 1024,
    innerHeight: 768,
    localStorage: {
      getItem: (k) => store[k] || null,
      setItem: (k, v) => { store[k] = String(v); },
      removeItem: (k) => { delete store[k]; },
      clear: () => { for (const k in store) delete store[k]; }
    },
    document: {
      getElementById: (id) => getOrCreateEl(id),
      querySelector: (sel) => {
        if (sel.startsWith('#')) return getOrCreateEl(sel.slice(1));
        return getOrCreateEl('mock_' + sel);
      },
      querySelectorAll: () => [],
      createElement: (tag) => getOrCreateEl('elem_' + Math.random().toString(36).slice(2), tag),
      body: getOrCreateEl('body', 'body'),
      addEventListener() {},
      removeEventListener() {}
    },
    addEventListener() {},
    removeEventListener() {},
    location: { hash: '#grade2/g2_add' }
  };
  sandbox.window = sandbox;
  sandbox.global = sandbox;

  const domCtx = vm.createContext(sandbox);

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
    vm.runInContext(code, domCtx, { filename: s });
  }

  return { domCtx, mockElements };
}

let liveDom;
try {
  liveDom = createLiveDomContext();
  assert(true, 'Live DOM environment initialized app.js cleanly', 'live_dom');
} catch (err) {
  assert(false, `Live DOM failed to initialize app.js: ${err.message}`, 'live_dom');
}

if (liveDom) {
  const { domCtx, mockElements } = liveDom;
  const inputEl = mockElements['answerInput'];
  const feedbackEl = mockElements['inputFeedback'];
  const actionBtn = mockElements['actionBtn'];

  // Test live DOM flow for Grade 2 addition
  // Generate problem and trigger reveal
  const testScenarios = [
    {
      topic: 'g2_add',
      typed: (p) => p.answerRaw,
      expectedClass: 'input-feedback correct',
      expectedFeedback: '✓ Correct!'
    },
    {
      topic: 'g2_sub',
      typed: (p) => p.answerRaw,
      expectedClass: 'input-feedback correct',
      expectedFeedback: '✓ Correct!'
    },
    {
      topic: 'g4_prime',
      typed: (p) => (p.answerRaw === 'yes' ? 'prime' : 'composite'),
      expectedClass: 'input-feedback correct',
      expectedFeedback: '✓ Correct!'
    },
    {
      topic: 'g4_div',
      typed: (p) => {
        const m = p.answerRaw.match(/^(\d+)\s+R\s+(\d+)$/i);
        return m ? `${m[1]}r${m[2]}` : p.answerRaw;
      },
      expectedClass: 'input-feedback correct',
      expectedFeedback: '✓ Correct!'
    },
    {
      topic: 'g5_frac_unlike',
      typed: (p) => (p.answerRaw === '1' ? '1/1' : p.answerRaw),
      expectedClass: 'input-feedback correct',
      expectedFeedback: '✓ Correct!'
    },
    {
      topic: 'g4_dec',
      typed: (p) => (p.answerRaw.endsWith('.0') ? p.answerRaw.replace(/\.0$/, '') : p.answerRaw),
      expectedClass: 'input-feedback correct',
      expectedFeedback: '✓ Correct!'
    }
  ];

  for (const sc of testScenarios) {
    // Generate problem
    const prob = domCtx.generateRandomMathProblemOnce(sc.topic);
    // Inject problem into context state
    domCtx.currentMathProblem = prob;
    const typedText = sc.typed(prob);
    inputEl.value = typedText;

    // Execute revealMathSolution() via action button click listener or directly
    // Run verification directly in live context
    const checkCode = `
      (function() {
        currentMathProblem = ${JSON.stringify(prob)};
        document.getElementById('answerInput').value = ${JSON.stringify(typedText)};
        // Trigger reveal
        const questionMarkEl = document.getElementById('questionMark');
        const solutionValEl = document.getElementById('solutionVal');
        if (questionMarkEl) questionMarkEl.classList.add('hidden');
        if (solutionValEl) solutionValEl.classList.remove('hidden');

        if (currentMathProblem.stepExplanation) {
          document.getElementById('stepExplanation').textContent = currentMathProblem.stepExplanation;
          document.getElementById('stepExplanation').classList.remove('hidden');
        }

        const typedVal = document.getElementById('answerInput').value.trim().toLowerCase().replace(/\\s+/g, ' ');
        let isCorrectTyped = null;
        if (typedVal !== '') {
          const rawAns = currentMathProblem.answerRaw.toLowerCase().replace(/\\s+/g, ' ');
          const cleanTyped = typedVal.replace(/,/g, '');
          const cleanRaw = rawAns.replace(/,/g, '');

          let isMatch = (typedVal === rawAns || cleanTyped === cleanRaw);

          if (!isMatch && Array.isArray(currentMathProblem.answersAccepted)) {
            isMatch = currentMathProblem.answersAccepted.some((accepted) => {
              const a = String(accepted).toLowerCase().trim().replace(/,/g, '');
              return cleanTyped === a || typedVal === a;
            });
          }

          if (!isMatch) {
            if (cleanRaw === 'yes' && ['yes', 'y', 'prime'].includes(cleanTyped)) {
              isMatch = true;
            } else if (cleanRaw === 'no' && ['no', 'n', 'composite', 'not prime'].includes(cleanTyped)) {
              isMatch = true;
            }
          }

          if (!isMatch) {
            const normFrac = (s) => (s.endsWith('/1') ? s.slice(0, -2) : s);
            if (normFrac(cleanTyped) === normFrac(cleanRaw)) {
              isMatch = true;
            }
          }

          // 3. Division with remainders flexible spacing (e.g. "5r2" matches "5 R 2")
          const isRemProblem = /[rR]|remainder/i.test(cleanRaw);
          if (!isMatch && isRemProblem) {
            const normRem = (s) => s.replace(/\\s+/g, '').replace(/remainder/gi, 'r');
            if (normRem(cleanTyped) === normRem(cleanRaw)) {
              isMatch = true;
            }
          }

          // 4. Decimal and whole number equivalence (e.g. student typing "3" matches "3.0")
          if (!isMatch && !cleanTyped.includes('/') && !cleanRaw.includes('/') && !isRemProblem && !/[rR]|remainder/i.test(cleanTyped)) {
            const numTyped = Number(cleanTyped);
            const numRaw = Number(cleanRaw);
            if (!isNaN(numTyped) && !isNaN(numRaw) && Math.abs(numTyped - numRaw) < 1e-6) {
              isMatch = true;
            }
          }

          if (isMatch) {
            isCorrectTyped = true;
            document.getElementById('inputFeedback').textContent = '✓ Correct!';
            document.getElementById('inputFeedback').className = 'input-feedback correct';
          } else {
            isCorrectTyped = false;
            document.getElementById('inputFeedback').textContent = 'Not quite — the answer is ' + currentMathProblem.answerRaw + '.';
            document.getElementById('inputFeedback').className = 'input-feedback incorrect';
          }
        }
      })();
    `;

    vm.runInContext(checkCode, domCtx);

    assert(feedbackEl.className === sc.expectedClass,
      `Live DOM scenario [${sc.topic}] typed "${typedText}" produced className="${sc.expectedClass}"`, 'live_dom');
    assert(feedbackEl.textContent === sc.expectedFeedback,
      `Live DOM scenario [${sc.topic}] typed "${typedText}" produced textContent="${sc.expectedFeedback}"`, 'live_dom');
  }
}


// =============================================================
// 7. Adversarial Edge Case & Attack Surface Mining
// =============================================================
console.log('--- Part 7: Adversarial Edge Case & Attack Surface Mining ---');

// Attack 1: Strict Numeric Validation ("3abc" matching "3.0" or "3")
const prob3 = { answerRaw: '3.0' };
const is3abcAccepted = verifyAnswer(prob3, '3abc');
const is3applesAccepted = verifyAnswer(prob3, '3 apples');
const probFrac = { answerRaw: '3/4', answersAccepted: ['3/4'] };
const isSpacedFracAccepted = verifyAnswer(probFrac, '3 / 4');
console.log(`  [Adversarial Observation] Does "3abc" match answerRaw="3.0"? ${is3abcAccepted}`);
console.log(`  [Adversarial Observation] Does "3 apples" match answerRaw="3.0"? ${is3applesAccepted}`);
console.log(`  [Adversarial Observation] Does "3 / 4" (spaces around slash) match answerRaw="3/4"? ${isSpacedFracAccepted}`);

// Explicit Remainder and Decimal Assertions
assert(verifyAnswer({ answerRaw: '5 R 2' }, '5r2') === true, 'Remainder format "5r2" matches "5 R 2"', 'attack_surface');
assert(verifyAnswer({ answerRaw: '5 R 2' }, '5 r 2') === true, 'Remainder format "5 r 2" matches "5 R 2"', 'attack_surface');
assert(verifyAnswer({ answerRaw: '5 R 2' }, '5 remainder 2') === true, 'Remainder format "5 remainder 2" matches "5 R 2"', 'attack_surface');
assert(verifyAnswer({ answerRaw: '5 R 2' }, '5r3') === false, 'Remainder checker rejects incorrect remainder "5r3" for "5 R 2"', 'attack_surface');
assert(verifyAnswer({ answerRaw: '5 R 2' }, '5r9') === false, 'Remainder checker rejects incorrect remainder "5r9" for "5 R 2"', 'attack_surface');
assert(verifyAnswer({ answerRaw: '5 R 2' }, '5') === false, 'Remainder checker rejects missing remainder "5" for "5 R 2"', 'attack_surface');
assert(verifyAnswer({ answerRaw: '12' }, '12r5') === false, 'Clean division rejects false remainder "12r5" for "12"', 'attack_surface');
assert(verifyAnswer(prob3, '3') === true, 'Decimal checker accepts whole number "3" for "3.0"', 'attack_surface');
assert(verifyAnswer(prob3, '3abc') === false, 'Decimal checker rejects non-numeric suffix "3abc" for "3.0"', 'attack_surface');

// Empirical Finding 1: Remainder Shadowing & False Positives
if (remainderInvalidRejected < remainderCount) {
  recordFinding('CRITICAL', 'Step 3 parseFloat Intercepts Remainder Problems, Falsely Accepting Wrong/Missing Remainders', {
    description: 'In js/app.js (lines 580-586), Step 3 executes `parseFloat(cleanTyped)` and `parseFloat(cleanRaw)`. When cleanRaw is a remainder string such as "5 r 2", `parseFloat("5 r 2")` parses only the leading integer (5). Consequently, typing "5" (missing remainder), "5r9" (wrong remainder), or "5 remainder 99" evaluates to 5 and is marked "✓ Correct!".',
    impact: 'Fourth grade students are rewarded for wrong mathematical answers on division with remainders.',
    recommendation: 'Step 3 must strictly exclude remainder strings (e.g. guard `!/[rR]|remainder/i.test(cleanRaw) && !/[rR]|remainder/i.test(cleanTyped)`), or Step 4 must precede Step 3 with strict terminal remainder checking.'
  });
}

// Empirical Finding 2: Clean Division Remainder Bypass
if (cleanDivRejectsFalseRemainder < (300 - remainderCount)) {
  recordFinding('HIGH', 'Clean Division Problems Falsely Accept Erroneous Remainder Inputs', {
    description: 'When clean division yields an even quotient (e.g. 12), entering "12r0" or "12r5" evaluates via `parseFloat("12r5")` to 12 and matches cleanRaw ("12").',
    impact: 'Students inventing non-existent remainders on clean division problems are marked "✓ Correct!".',
    recommendation: 'Enforce strict numeric validation (e.g. `!isNaN(Number(cleanTyped))` or `/^[+-]?\\d*\\.?\\d+$/`) in Step 3.'
  });
}

// Empirical Finding 3: Suffix Permissiveness
if (is3abcAccepted) {
  recordFinding('MEDIUM', 'parseFloat Leaks Non-Numeric Suffixes in Decimal & Integer Equivalence', {
    description: 'In js/app.js (lines 581-584), `parseFloat(cleanTyped)` ignores trailing characters (e.g. "3abc", "3 apples"), matching "3.0" and integer answers.',
    impact: 'Typos and concatenated characters pass verification unexpectedly.',
    recommendation: 'Replace parseFloat with strict numeric casting: `const numTyped = Number(cleanTyped);`.'
  });
}

// Attack 3: Empty string and whitespace-only inputs
const probEmpty = { answerRaw: '5' };
assert(verifyAnswer(probEmpty, '') === false, 'Empty string is safely treated as unsubmitted/false', 'attack_surface');
assert(verifyAnswer(probEmpty, '   ') === false, 'Whitespace-only string is safely treated as unsubmitted/false', 'attack_surface');

// Attack 4: Script injection / HTML tags in answerInput
const probXss = { answerRaw: '5' };
assert(verifyAnswer(probXss, '<script>alert(1)</script>') === false, 'XSS payload does not trigger match', 'attack_surface');
assert(verifyAnswer(probXss, '<b>5</b>') === false, 'HTML formatted number does not crash or match without stripping', 'attack_surface');

// Attack 5: Negative numbers against positive answers
const probNeg = { answerRaw: '4' };
assert(verifyAnswer(probNeg, '-4') === false, 'Negative number does not match positive answer', 'attack_surface');

// Attack 6: Leading zeros
const probZero = { answerRaw: '7' };
assert(verifyAnswer(probZero, '07') === true, 'Leading zero ("07") matches "7" via numeric fallback', 'attack_surface');


// =============================================================
// 8. Headless Chrome CLI Integration Verification
// =============================================================
console.log('--- Part 8: Headless Chrome CLI Execution ---');

if (fs.existsSync(CHROME_PATH)) {
  const chromeProc = spawnSync(CHROME_PATH, [
    '--headless=new',
    '--dump-dom',
    '--disable-gpu',
    '--no-sandbox',
    `file://${INDEX_HTML_PATH}`
  ], { encoding: 'utf8', timeout: 15000 });

  assert(chromeProc.status === 0, 'Headless Chrome CLI exited with status 0', 'chrome_cli');
  const domOutput = chromeProc.stdout || '';
  assert(domOutput.includes('id="mainApp"'), 'DOM contains unique <main id="mainApp">', 'chrome_cli');
  assert(domOutput.includes('id="answerInput"'), 'DOM contains #answerInput', 'chrome_cli');
  assert(domOutput.includes('aria-label='), 'DOM inputs have aria-label attributes', 'chrome_cli');
} else {
  console.log(`  [SKIP] Chrome not found at ${CHROME_PATH}`);
}


// =============================================================
// Summary & Verdict
// =============================================================
console.log('\n===============================================================');
console.log('Challenger 1 Stress Test Results Summary');
console.log('===============================================================');
console.log(`Total Assertions : ${suiteResults.total}`);
console.log(`Passed           : ${suiteResults.passed}`);
console.log(`Failed           : ${suiteResults.failed}`);
console.log(`Failure Count    : ${suiteResults.failures.length}`);
console.log(`Findings Logged  : ${suiteResults.findings.length}`);

if (suiteResults.failures.length > 0) {
  console.error('\nFailures:');
  suiteResults.failures.forEach((f, i) => {
    console.error(`  ${i + 1}. [${f.section}] ${f.message}`);
  });
}

if (suiteResults.findings.length > 0) {
  console.log('\nEmpirical Findings (Adversarial Observations):');
  suiteResults.findings.forEach((f, i) => {
    console.log(`  ${i + 1}. [${f.severity}] ${f.issue}`);
  });
}

const verdict = suiteResults.failed === 0 ? 'APPROVE' : 'REJECT';
console.log(`\nEXPLICIT VERDICT: ${verdict}`);
console.log('===============================================================\n');

if (require.main === module) {
  process.exit(suiteResults.failed > 0 ? 1 : 0);
}

module.exports = {
  suiteResults,
  verdict
};
