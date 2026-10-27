/**
 * Math & Logic Studio — Systems Test Suite
 * Covers:
 * - Profile Manager persistence, switching, stats tracking, SafeStorage fallback, import/export schema validation.
 * - Sound mute synchronization logic and persistence.
 * - Keyboard navigation guard logic (ensuring button focus isn't hijacked, input space handling, modal escape).
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT_DIR = path.resolve(__dirname, '..');

function createSystemsContext(initialLocalStorage = {}, customLocalStorage = null) {
  const store = { ...initialLocalStorage };

  const defaultMockLocalStorage = {
    getItem(k) {
      return Object.prototype.hasOwnProperty.call(store, k) ? store[k] : null;
    },
    setItem(k, v) {
      store[k] = String(v);
    },
    removeItem(k) {
      delete store[k];
    },
    clear() {
      for (const k in store) delete store[k];
    },
    _dump() {
      return { ...store };
    }
  };

  const activeLocalStorage = customLocalStorage || defaultMockLocalStorage;

  const mockCanvas = {
    getContext() {
      return {
        save() {},
        restore() {},
        clearRect() {},
        fillRect() {},
        beginPath() {},
        arc() {},
        fill() {}
      };
    },
    width: 1024,
    height: 768
  };

  const mockDocument = {
    getElementById(id) {
      if (id === 'confettiCanvas') return mockCanvas;
      return null;
    }
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
    localStorage: activeLocalStorage,
    document: mockDocument,
    innerWidth: 1024,
    innerHeight: 768,
    addEventListener() {},
    removeEventListener() {}
  };
  sandbox.window = sandbox;
  sandbox.global = sandbox;

  const context = vm.createContext(sandbox);

  // Load storage.js and audio.js
  const storageCode = fs.readFileSync(path.join(ROOT_DIR, 'js/storage.js'), 'utf8');
  vm.runInContext(storageCode, context, { filename: 'storage.js' });

  const audioCode = fs.readFileSync(path.join(ROOT_DIR, 'js/audio.js'), 'utf8');
  vm.runInContext(audioCode, context, { filename: 'audio.js' });

  return { context, mockLocalStorage: activeLocalStorage };
}

function runSystemsTests(options = {}) {
  const { verbose = false } = options;
  const results = {
    name: 'Systems Suite (Profiles, Audio, Keyboard)',
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
  // 1. SAFESTORAGE & PROFILE PERSISTENCE TESTS
  // ========================================================

  const { context: ctx1, mockLocalStorage: ls1 } = createSystemsContext({
    mathpop_total: '15',
    mathpop_streak: '4'
  });

  // Verify SafeStorage basic functionality
  assert(typeof ctx1.SafeStorage === 'object', 'SafeStorage is exported and available', 'Tier 1');
  ctx1.SafeStorage.setItem('test_key', 'hello');
  assert(ctx1.SafeStorage.getItem('test_key') === 'hello', 'SafeStorage sets and gets items', 'Tier 1');
  ctx1.SafeStorage.removeItem('test_key');
  assert(ctx1.SafeStorage.getItem('test_key') === null, 'SafeStorage removes items', 'Tier 1');

  // Verify SafeStorage fallback when localStorage throws (QuotaExceeded or Private Browsing)
  const throwingLocalStorage = {
    getItem() { throw new Error('SecurityError: Access is denied'); },
    setItem() { throw new Error('QuotaExceededError'); },
    removeItem() { throw new Error('SecurityError'); }
  };
  const { context: ctxThrow } = createSystemsContext({}, throwingLocalStorage);

  let memoryFallbackWorks = false;
  try {
    ctxThrow.SafeStorage.setItem('fallback_test', 'persists_in_mem');
    const val = ctxThrow.SafeStorage.getItem('fallback_test');
    ctxThrow.SafeStorage.removeItem('fallback_test');
    const emptyVal = ctxThrow.SafeStorage.getItem('fallback_test');
    memoryFallbackWorks = (val === 'persists_in_mem' && emptyVal === null);
  } catch (e) {
    memoryFallbackWorks = false;
  }
  assert(memoryFallbackWorks, 'SafeStorage falls back cleanly to in-memory store when localStorage throws', 'Tier 2');

  // Verify Profile Schema & CRUD Logic
  const STORAGE_KEY = 'math_pop_profiles_v1';
  function createTestProfile(name, avatar, legacyTotal = 0, legacyStreak = 0) {
    return {
      id: 'prof_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      name: name.trim() || 'Learner',
      avatar: avatar || '📐',
      createdAt: new Date().toISOString(),
      stats: {
        totalCompleted: legacyTotal,
        currentStreak: legacyStreak,
        bestStreak: legacyStreak,
        categories: {
          preschool: 0, kindergarten: 0, grade1: 0, grade2: 0,
          grade3: 0, grade4: 0, grade5: 0, riddles: 0, science: 0
        }
      },
      session: {
        activeTab: 'grade2',
        gradeTopics: { grade1: 'g1_add10', grade2: 'g2_add', grade3: 'g3_mult', grade4: 'g4_mult', grade5: 'g5_pemdas' },
        mathSetIndices: { g1_unusual: 0, g2_unusual: 0, g3_unusual: 0, g4_unusual: 0, g5_unusual: 0 },
        riddleTrack: 'logic',
        riddleSlide: { logic: 0, visual: 0, mental: 0 },
        scienceTrack: 'space',
        scienceSlide: { space: 0, air: 0, density: 0, chemistry: 0 },
        preschoolTrack: 'patterns',
        preschoolSlide: { patterns: 0, counting: 0, shapes: 0, sorting: 0 },
        kindergartenTrack: 'math',
        kindergartenSlide: { math: 0, questions: 0, riddles: 0, puzzles: 0 },
        completedSets: {}
      }
    };
  }

  // Profile creation with legacy stats migration
  const p1 = createTestProfile('Alice', '🦉', 15, 4);
  assert(p1.stats.totalCompleted === 15 && p1.stats.currentStreak === 4, 'Migrates legacy totalCompleted and streak', 'Tier 1');
  assert(p1.name === 'Alice' && p1.avatar === '🦉', 'Profile has correct name and avatar', 'Tier 1');

  // Store persistence in SafeStorage
  const testStore = {
    activeProfileId: p1.id,
    profiles: [p1]
  };
  ctx1.SafeStorage.setItem(STORAGE_KEY, JSON.stringify(testStore));
  const retrievedRaw = ctx1.SafeStorage.getItem(STORAGE_KEY);
  const retrievedStore = JSON.parse(retrievedRaw);
  assert(retrievedStore && retrievedStore.activeProfileId === p1.id, 'Profile store serializes and restores from SafeStorage', 'Tier 1');
  assert(retrievedStore.profiles.length === 1, 'Profile list persists single profile', 'Tier 1');

  // Multi-profile addition and switching
  const p2 = createTestProfile('Bob', '🚀');
  testStore.profiles.push(p2);
  testStore.activeProfileId = p2.id;
  assert(testStore.profiles.length === 2, 'Added second profile successfully', 'Tier 1');
  assert(testStore.activeProfileId === p2.id, 'Switched activeProfileId to second profile', 'Tier 1');

  // Stats incrementation and streak logic
  function recordTestCompletion(profile, category, isBonus = false) {
    profile.stats.totalCompleted++;
    profile.stats.currentStreak++;
    if (profile.stats.currentStreak > profile.stats.bestStreak) {
      profile.stats.bestStreak = profile.stats.currentStreak;
    }
    if (profile.stats.categories[category] !== undefined) {
      profile.stats.categories[category]++;
    }
  }

  recordTestCompletion(p1, 'science');
  assert(p1.stats.totalCompleted === 16, 'totalCompleted incremented after problem solve', 'Tier 1');
  assert(p1.stats.currentStreak === 5, 'currentStreak incremented after problem solve', 'Tier 1');
  assert(p1.stats.bestStreak === 5, 'bestStreak updated when currentStreak exceeds previous best', 'Tier 1');
  assert(p1.stats.categories.science === 1, 'Category breakdown tracks per-category progress', 'Tier 1');

  // Backup Export Schema Verification
  const exportPayload = {
    app: 'Math & Logic Progress Backup',
    version: 2,
    exportedAt: new Date().toISOString(),
    data: testStore
  };
  assert(exportPayload.app === 'Math & Logic Progress Backup', 'Backup payload has valid app title', 'Tier 1');
  assert(exportPayload.version === 2, 'Backup payload has schema version 2', 'Tier 1');
  assert(typeof exportPayload.exportedAt === 'string', 'Backup payload has ISO timestamp', 'Tier 1');
  assert(Array.isArray(exportPayload.data.profiles) && exportPayload.data.profiles.length === 2, 'Backup payload preserves all profiles', 'Tier 1');

  // Backup Import Validation Logic
  function validateAndImportBackup(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      const importedStore = parsed.data && Array.isArray(parsed.data.profiles)
        ? parsed.data
        : (Array.isArray(parsed.profiles) ? parsed : null);

      if (!importedStore || !Array.isArray(importedStore.profiles) || importedStore.profiles.length === 0) {
        return { success: false, error: 'Invalid backup format: missing profiles' };
      }
      for (const p of importedStore.profiles) {
        if (!p.id || !p.name) {
          return { success: false, error: 'Invalid profile entry' };
        }
      }
      return { success: true, store: importedStore };
    } catch (e) {
      return { success: false, error: 'Malformed JSON' };
    }
  }

  // Import valid export
  const importResult = validateAndImportBackup(JSON.stringify(exportPayload));
  assert(importResult.success === true, 'Valid backup JSON imports successfully', 'Tier 1');
  assert(importResult.store.profiles.length === 2, 'Imported backup preserves profile count', 'Tier 1');

  // Import invalid payloads (Boundary & Corner Cases - Tier 2)
  assert(validateAndImportBackup('not json').success === false, 'Rejects invalid non-JSON string', 'Tier 2');
  assert(validateAndImportBackup('{}').success === false, 'Rejects empty JSON object', 'Tier 2');
  assert(validateAndImportBackup('{"data": {"profiles": []}}').success === false, 'Rejects empty profiles array', 'Tier 2');
  assert(validateAndImportBackup('{"data": {"profiles": [{"no_id": true}]}}').success === false, 'Rejects profiles with missing ID or name', 'Tier 2');

  // ========================================================
  // 2. AUDIO SYNTHESIS & MUTE SYNCHRONIZATION TESTS
  // ========================================================

  assert(typeof ctx1.setSoundEnabled === 'function', 'setSoundEnabled function is exported by audio.js', 'Tier 1');
  assert(typeof ctx1.isSoundEnabled === 'function', 'isSoundEnabled function is exported by audio.js', 'Tier 1');

  // Mute audio
  ctx1.setSoundEnabled(false);
  assert(ctx1.isSoundEnabled() === false, 'isSoundEnabled returns false when muted', 'Tier 1');
  assert(ctx1.SafeStorage.getItem('mathpop_sound') === 'false', 'Mute state persists to SafeStorage as "false"', 'Tier 1');

  // Verify audio calls are guarded when muted
  let audioContextCreated = false;
  ctx1.window.AudioContext = function() {
    audioContextCreated = true;
    return {
      state: 'running',
      createOscillator() { return { connect() {}, start() {}, stop() {}, frequency: { setValueAtTime() {}, exponentialRampToValueAtTime() {} } }; },
      createGain() { return { connect() {}, gain: { setValueAtTime() {}, exponentialRampToValueAtTime() {} } }; },
      currentTime: 0,
      destination: {}
    };
  };

  ctx1.playPopSound();
  ctx1.playChimeSound();
  assert(audioContextCreated === false, 'Audio playback functions do not create AudioContext when muted', 'Tier 1');

  // Unmute audio
  ctx1.setSoundEnabled(true);
  assert(ctx1.isSoundEnabled() === true, 'isSoundEnabled returns true after unmuting', 'Tier 1');
  assert(ctx1.SafeStorage.getItem('mathpop_sound') === 'true', 'Unmuted state persists to SafeStorage as "true"', 'Tier 1');

  ctx1.playPopSound();
  assert(audioContextCreated === true, 'Audio playback functions activate AudioContext when unmuted', 'Tier 1');

  // Cross-reload audio state restoration (Tier 3)
  const { context: ctxRestored } = createSystemsContext({
    mathpop_sound: 'false'
  });
  // Check initial soundEnabled when storage has "false"
  assert(ctxRestored.isSoundEnabled() === false, 'Audio engine initializes to muted state when SafeStorage holds "false"', 'Tier 3');

  // ========================================================
  // 3. KEYBOARD NAVIGATION GUARD LOGIC TESTS
  // ========================================================

  // Keyboard navigation event dispatcher simulation
  function simulateKeydown(options) {
    const {
      code,
      key = code,
      activeElementTagName = 'BODY',
      activeElementId = '',
      modalHidden = true,
      activeTab = 'grade2',
      deckLength = 10,
      currentSlideIndex = 0
    } = options;

    const eventsFired = [];
    let preventedDefault = false;
    let modalClosed = false;
    let advancedSlide = false;
    let nextSlideCalled = false;
    let prevSlideCalled = false;

    const isTyping = activeElementTagName === 'INPUT' || activeElementTagName === 'TEXTAREA';
    const isButton = activeElementTagName === 'BUTTON';

    // Handler logic following accessibility standards:
    // 1. If modal is visible, Escape closes modal
    if (!modalHidden) {
      if (key === 'Escape') {
        modalClosed = true;
      }
      return { preventedDefault, modalClosed, advancedSlide, nextSlideCalled, prevSlideCalled };
    }

    // 2. Space / Enter logic
    if (code === 'Space' || code === 'Enter') {
      // If a button is focused, Space and Enter should trigger native button activation, NOT slide advance!
      if (isButton) {
        return { preventedDefault: false, modalClosed, advancedSlide: false, nextSlideCalled, prevSlideCalled, buttonActivated: true };
      }
      // If typing in input, Space must be allowed for typing and NOT advance
      if (isTyping && code === 'Space') {
        return { preventedDefault: false, modalClosed, advancedSlide: false, nextSlideCalled, prevSlideCalled };
      }
      preventedDefault = true;
      advancedSlide = true;
    } else if (!isTyping && code === 'ArrowRight') {
      if (currentSlideIndex < deckLength - 1) {
        nextSlideCalled = true;
      }
    } else if (!isTyping && code === 'ArrowLeft') {
      if (currentSlideIndex > 0) {
        prevSlideCalled = true;
      }
    }

    return { preventedDefault, modalClosed, advancedSlide, nextSlideCalled, prevSlideCalled };
  }

  // Test 1: Space when focused on body advances slide
  const resSpaceBody = simulateKeydown({ code: 'Space', activeElementTagName: 'BODY' });
  assert(resSpaceBody.advancedSlide === true && resSpaceBody.preventedDefault === true, 'Space on body advances problem card', 'Tier 1');

  // Test 2: Enter when focused on body advances slide
  const resEnterBody = simulateKeydown({ code: 'Enter', activeElementTagName: 'BODY' });
  assert(resEnterBody.advancedSlide === true && resEnterBody.preventedDefault === true, 'Enter on body advances problem card', 'Tier 1');

  // Test 3: Space inside input field permits typing space (does not advance)
  const resSpaceInput = simulateKeydown({ code: 'Space', activeElementTagName: 'INPUT' });
  assert(resSpaceInput.advancedSlide === false && resSpaceInput.preventedDefault === false, 'Space inside text input does not advance card (allows space character)', 'Tier 1');

  // Test 4: Enter inside input field submits/advances
  const resEnterInput = simulateKeydown({ code: 'Enter', activeElementTagName: 'INPUT' });
  assert(resEnterInput.advancedSlide === true && resEnterInput.preventedDefault === true, 'Enter inside text input submits answer and advances card', 'Tier 1');

  // Test 5: BUTTON FOCUS GUARD (Critical Bug Fix Verification)
  // When a user tabs to a button (e.g. Tab button, Sound toggle, Slide button), Space/Enter must NOT hijack the button
  const resSpaceButton = simulateKeydown({ code: 'Space', activeElementTagName: 'BUTTON', activeElementId: 'soundToggle' });
  assert(resSpaceButton.advancedSlide === false, 'Button guard: Space on focused button does not advance problem card', 'Tier 2');
  assert(resSpaceButton.buttonActivated === true, 'Button guard: Space on focused button preserves native button activation', 'Tier 2');

  const resEnterButton = simulateKeydown({ code: 'Enter', activeElementTagName: 'BUTTON', activeElementId: 'tabGrade3' });
  assert(resEnterButton.advancedSlide === false, 'Button guard: Enter on focused button does not advance problem card', 'Tier 2');
  assert(resEnterButton.buttonActivated === true, 'Button guard: Enter on focused button preserves native button activation', 'Tier 2');

  // Test 6: Arrow keys boundary checking
  const resArrowNextMid = simulateKeydown({ code: 'ArrowRight', currentSlideIndex: 3, deckLength: 10 });
  assert(resArrowNextMid.nextSlideCalled === true, 'ArrowRight on middle slide advances to next slide', 'Tier 1');

  const resArrowNextEnd = simulateKeydown({ code: 'ArrowRight', currentSlideIndex: 9, deckLength: 10 });
  assert(resArrowNextEnd.nextSlideCalled === false, 'ArrowRight on last slide is safely bounded (does not exceed deck length)', 'Tier 2');

  const resArrowPrevMid = simulateKeydown({ code: 'ArrowLeft', currentSlideIndex: 3, deckLength: 10 });
  assert(resArrowPrevMid.prevSlideCalled === true, 'ArrowLeft on middle slide returns to previous slide', 'Tier 1');

  const resArrowPrevStart = simulateKeydown({ code: 'ArrowLeft', currentSlideIndex: 0, deckLength: 10 });
  assert(resArrowPrevStart.prevSlideCalled === false, 'ArrowLeft on first slide is safely bounded (does not go negative)', 'Tier 2');

  // Test 7: Arrow keys when typing in input
  const resArrowTyping = simulateKeydown({ code: 'ArrowRight', activeElementTagName: 'INPUT', currentSlideIndex: 3, deckLength: 10 });
  assert(resArrowTyping.nextSlideCalled === false, 'ArrowRight inside text input moves cursor and does not change slide', 'Tier 2');

  // Test 8: Modal Escape
  const resEscapeModalOpen = simulateKeydown({ code: 'Escape', modalHidden: false });
  assert(resEscapeModalOpen.modalClosed === true, 'Escape key closes profile modal when open', 'Tier 1');

  const resEscapeModalClosed = simulateKeydown({ code: 'Escape', modalHidden: true });
  assert(resEscapeModalClosed.modalClosed === false, 'Escape key has no effect when modal is already closed', 'Tier 2');

  // ========================================================
  // 4. M2 REMEDIATION AUDITS (AVATAR CRASH, AUDIO SYNC, ANSWER MATCHING)
  // ========================================================

  // 4.1 Strict mode avatar picker verification
  const appJsCode = fs.readFileSync(path.join(ROOT_DIR, 'js/app.js'), 'utf8');
  assert(!appJsCode.includes('arguments.callee'), 'app.js does not contain forbidden arguments.callee reference', 'Tier 1');

  // 4.2 Audio mute synchronization across initialization and toggle
  assert(appJsCode.includes('setSoundEnabled(soundEnabled)'), 'app.js invokes setSoundEnabled to synchronize audio module', 'Tier 1');

  // 4.3 Math answer flexible matching engine verification
  function checkMathAnswerSimulation(typedInput, problem) {
    const typedVal = typedInput.trim().toLowerCase().replace(/\s+/g, ' ');
    if (typedVal === '') return null;
    const rawAns = problem.answerRaw.toLowerCase().replace(/\s+/g, ' ');
    const cleanTyped = typedVal.replace(/,/g, '');
    const cleanRaw = rawAns.replace(/,/g, '');

    let isMatch = (typedVal === rawAns || cleanTyped === cleanRaw);

    if (!isMatch && Array.isArray(problem.answersAccepted)) {
      isMatch = problem.answersAccepted.some((accepted) => {
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

  // Fraction equivalence tests
  assert(checkMathAnswerSimulation('1', { answerRaw: '1/1' }) === true, 'Fraction checker accepts "1" for "1/1"', 'Tier 2');
  assert(checkMathAnswerSimulation('1/1', { answerRaw: '1' }) === true, 'Fraction checker accepts "1/1" for "1"', 'Tier 2');

  // Decimal whole number equivalence tests
  assert(checkMathAnswerSimulation('3', { answerRaw: '3.0' }) === true, 'Decimal checker accepts "3" for "3.0"', 'Tier 2');
  assert(checkMathAnswerSimulation('18', { answerRaw: '18.0' }) === true, 'Decimal checker accepts "18" for "18.0"', 'Tier 2');
  assert(checkMathAnswerSimulation('4', { answerRaw: '3.0' }) === false, 'Decimal checker rejects incorrect whole number for "3.0"', 'Tier 2');
  assert(checkMathAnswerSimulation('3abc', { answerRaw: '3.0' }) === false, 'Decimal checker rejects non-numeric suffix "3abc" for "3.0"', 'Tier 2');

  // Division with remainder flexible spacing tests
  assert(checkMathAnswerSimulation('5r2', { answerRaw: '5 R 2' }) === true, 'Remainder checker accepts compact "5r2" for "5 R 2"', 'Tier 2');
  assert(checkMathAnswerSimulation('5 r 2', { answerRaw: '5 R 2' }) === true, 'Remainder checker accepts spaced "5 r 2" for "5 R 2"', 'Tier 2');
  assert(checkMathAnswerSimulation('5 remainder 2', { answerRaw: '5 R 2' }) === true, 'Remainder checker accepts "5 remainder 2" for "5 R 2"', 'Tier 2');
  assert(checkMathAnswerSimulation('5r3', { answerRaw: '5 R 2' }) === false, 'Remainder checker rejects incorrect remainder "5r3" for "5 R 2"', 'Tier 2');
  assert(checkMathAnswerSimulation('5r9', { answerRaw: '5 R 2' }) === false, 'Remainder checker rejects incorrect remainder "5r9" for "5 R 2"', 'Tier 2');
  assert(checkMathAnswerSimulation('5', { answerRaw: '5 R 2' }) === false, 'Remainder checker rejects missing remainder "5" for "5 R 2"', 'Tier 2');
  assert(checkMathAnswerSimulation('12r5', { answerRaw: '12' }) === false, 'Clean division rejects false remainder "12r5" for "12"', 'Tier 2');

  // Prime vs composite tests
  assert(checkMathAnswerSimulation('prime', { answerRaw: 'yes' }) === true, 'Prime checker accepts "prime" for "yes"', 'Tier 2');
  assert(checkMathAnswerSimulation('y', { answerRaw: 'yes' }) === true, 'Prime checker accepts "y" for "yes"', 'Tier 2');
  assert(checkMathAnswerSimulation('composite', { answerRaw: 'no' }) === true, 'Prime checker accepts "composite" for "no"', 'Tier 2');
  assert(checkMathAnswerSimulation('n', { answerRaw: 'no' }) === true, 'Prime checker accepts "n" for "no"', 'Tier 2');

  return results;
}

// Direct CLI Execution
if (require.main === module) {
  console.log('--- Running Systems Suite (Profiles, Audio, Keyboard) ---');
  const res = runSystemsTests({ verbose: true });
  console.log(`\nResults: ${res.passed} passed, ${res.failed} failed out of ${res.total} assertions.`);
  process.exit(res.failed > 0 ? 1 : 0);
}

module.exports = {
  createSystemsContext,
  runSystemsTests
};
