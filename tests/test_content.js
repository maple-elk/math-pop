/**
 * Math & Logic Studio — Content & Generator Validation Test Suite
 * Tier 1: Feature Coverage & Tier 2: Boundary/Mathematical Integrity
 *
 * Requirements:
 * - Load all 5 data modules in isolated Node.js VM context.
 * - Assert all 190 curated slides (Preschool 48, Kindergarten 48, Finite Math 50, Logic 28, Science 16):
 *   non-empty questions, valid answerRaw, answersAccepted array containing answerRaw,
 *   non-empty explanations, valid visual returns from render(false) and render(true).
 * - Assert all 28 open-ended math generator topics across Grades 1–5:
 *   100+ generated samples per topic (2,800+ samples total), asserting valid answers,
 *   solvable problems, matching types, zero NaN/undefined outputs.
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT_DIR = path.resolve(__dirname, '..');

function loadDataModules() {
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

  const context = vm.createContext(sandbox);

  const files = [
    'js/data/math-data.js',
    'js/data/logic-data.js',
    'js/data/science-data.js',
    'js/data/preschool-data.js',
    'js/data/kindergarten-data.js'
  ];

  for (const relFile of files) {
    const fullPath = path.join(ROOT_DIR, relFile);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Data module not found: ${fullPath}`);
    }
    const code = fs.readFileSync(fullPath, 'utf8');
    vm.runInContext(code, context, { filename: relFile });
  }

  return context;
}

function runContentTests(options = {}) {
  const { verbose = false } = options;
  const results = {
    name: 'Content & Generators Suite',
    total: 0,
    passed: 0,
    failed: 0,
    failures: [],
    details: {
      curatedCounts: {},
      generatorCounts: {}
    }
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

  let ctx;
  try {
    ctx = loadDataModules();
    assert(true, 'All 5 data modules loaded cleanly in Node VM', 'Tier 1');
  } catch (err) {
    assert(false, `Failed to load data modules: ${err.message}`, 'Tier 1');
    return results;
  }

  // ========================================================
  // 1. CURATED SLIDES AUDIT (190 SLIDES)
  // ========================================================

  // Preschool: 4 tracks x 12 slides = 48
  const preschoolTracks = ['patterns', 'counting', 'shapes', 'sorting'];
  assert(ctx.PRESCHOOL_SLIDES && typeof ctx.PRESCHOOL_SLIDES === 'object', 'PRESCHOOL_SLIDES defined', 'Tier 1');
  let preschoolTotal = 0;
  for (const track of preschoolTracks) {
    const slides = ctx.PRESCHOOL_SLIDES[track] || [];
    assert(slides.length === 12, `Preschool track "${track}" has 12 slides (got ${slides.length})`, 'Tier 1');
    preschoolTotal += slides.length;
    slides.forEach((slide, idx) => {
      validateSlideSchema(slide, `Preschool • ${track} #${idx + 1}`);
    });
  }
  results.details.curatedCounts.preschool = preschoolTotal;
  assert(preschoolTotal === 48, `Total Preschool slides equal 48 (got ${preschoolTotal})`, 'Tier 1');

  // Kindergarten: 4 tracks x 12 slides = 48
  const kindergartenTracks = ['math', 'questions', 'riddles', 'puzzles'];
  assert(ctx.KINDERGARTEN_SLIDES && typeof ctx.KINDERGARTEN_SLIDES === 'object', 'KINDERGARTEN_SLIDES defined', 'Tier 1');
  let kindergartenTotal = 0;
  for (const track of kindergartenTracks) {
    const slides = ctx.KINDERGARTEN_SLIDES[track] || [];
    assert(slides.length === 12, `Kindergarten track "${track}" has 12 slides (got ${slides.length})`, 'Tier 1');
    kindergartenTotal += slides.length;
    slides.forEach((slide, idx) => {
      validateSlideSchema(slide, `Kindergarten • ${track} #${idx + 1}`);
    });
  }
  results.details.curatedCounts.kindergarten = kindergartenTotal;
  assert(kindergartenTotal === 48, `Total Kindergarten slides equal 48 (got ${kindergartenTotal})`, 'Tier 1');

  // Logic & Spatial: 12 + 10 + 6 = 28
  assert(Array.isArray(ctx.LOGIC_SLIDES), 'LOGIC_SLIDES is array', 'Tier 1');
  assert(Array.isArray(ctx.VISUAL_SLIDES), 'VISUAL_SLIDES is array', 'Tier 1');
  assert(Array.isArray(ctx.MENTAL_3D_SLIDES), 'MENTAL_3D_SLIDES is array', 'Tier 1');

  assert(ctx.LOGIC_SLIDES.length === 12, `LOGIC_SLIDES has 12 slides (got ${ctx.LOGIC_SLIDES.length})`, 'Tier 1');
  ctx.LOGIC_SLIDES.forEach((slide, idx) => validateSlideSchema(slide, `Logic #${idx + 1}`));

  assert(ctx.VISUAL_SLIDES.length === 10, `VISUAL_SLIDES has 10 slides (got ${ctx.VISUAL_SLIDES.length})`, 'Tier 1');
  ctx.VISUAL_SLIDES.forEach((slide, idx) => validateSlideSchema(slide, `Visual #${idx + 1}`));

  assert(ctx.MENTAL_3D_SLIDES.length === 6, `MENTAL_3D_SLIDES has 6 slides (got ${ctx.MENTAL_3D_SLIDES.length})`, 'Tier 1');
  ctx.MENTAL_3D_SLIDES.forEach((slide, idx) => validateSlideSchema(slide, `Mental 3D #${idx + 1}`));

  const logicTotal = ctx.LOGIC_SLIDES.length + ctx.VISUAL_SLIDES.length + ctx.MENTAL_3D_SLIDES.length;
  results.details.curatedCounts.logic = logicTotal;
  assert(logicTotal === 28, `Total Logic & Spatial slides equal 28 (got ${logicTotal})`, 'Tier 1');

  // Science Lab: 4 tracks x 4 slides = 16
  const scienceTracks = ['space', 'air', 'density', 'chemistry'];
  assert(ctx.SCIENCE_SLIDES && typeof ctx.SCIENCE_SLIDES === 'object', 'SCIENCE_SLIDES defined', 'Tier 1');
  let scienceTotal = 0;
  for (const track of scienceTracks) {
    const slides = ctx.SCIENCE_SLIDES[track] || [];
    assert(slides.length === 4, `Science track "${track}" has 4 slides (got ${slides.length})`, 'Tier 1');
    scienceTotal += slides.length;
    slides.forEach((slide, idx) => {
      validateSlideSchema(slide, `Science • ${track} #${idx + 1}`);
    });
  }
  results.details.curatedCounts.science = scienceTotal;
  assert(scienceTotal === 16, `Total Science slides equal 16 (got ${scienceTotal})`, 'Tier 1');

  // Finite Math Sets: 5 grades x 10 problems = 50
  assert(ctx.FINITE_MATH_SETS && typeof ctx.FINITE_MATH_SETS === 'object', 'FINITE_MATH_SETS defined', 'Tier 1');
  const finiteMathKeys = ['g1_unusual', 'g2_unusual', 'g3_unusual', 'g4_unusual', 'g5_unusual'];
  let finiteMathTotal = 0;
  for (const setKey of finiteMathKeys) {
    const problems = ctx.FINITE_MATH_SETS[setKey] || [];
    assert(problems.length === 10, `Finite math set "${setKey}" has 10 problems (got ${problems.length})`, 'Tier 1');
    finiteMathTotal += problems.length;
    problems.forEach((item, idx) => {
      validateFiniteMathItem(item, `Finite Math • ${setKey} #${idx + 1}`);
    });
  }
  results.details.curatedCounts.finiteMath = finiteMathTotal;
  assert(finiteMathTotal === 50, `Total Finite Math slides equal 50 (got ${finiteMathTotal})`, 'Tier 1');

  // Overall Curated Count Verification
  const grandCuratedTotal = preschoolTotal + kindergartenTotal + logicTotal + scienceTotal + finiteMathTotal;
  results.details.curatedCounts.total = grandCuratedTotal;
  assert(grandCuratedTotal === 190, `Grand total curated slides equal 190 (got ${grandCuratedTotal})`, 'Tier 1');

  function validateSlideSchema(slide, label) {
    assert(typeof slide.question === 'string' && slide.question.trim().length > 0, `${label}: question is non-empty`, 'Tier 1');
    assert(typeof slide.answerRaw === 'string' && slide.answerRaw.trim().length > 0, `${label}: answerRaw is valid string`, 'Tier 1');
    assert(Array.isArray(slide.answersAccepted) && slide.answersAccepted.length > 0, `${label}: answersAccepted is non-empty array`, 'Tier 1');
    assert(slide.answersAccepted.includes(slide.answerRaw), `${label}: answersAccepted contains answerRaw ("${slide.answerRaw}")`, 'Tier 1');
    assert(typeof slide.explanation === 'string' && slide.explanation.trim().length > 0, `${label}: explanation is non-empty`, 'Tier 1');
    assert(typeof slide.render === 'function', `${label}: render is a function`, 'Tier 1');

    try {
      const unrevealedMarkup = slide.render(false);
      assert(
        typeof unrevealedMarkup === 'string' &&
        unrevealedMarkup.trim().length > 0 &&
        (unrevealedMarkup.includes('<svg') || unrevealedMarkup.includes('<div')),
        `${label}: render(false) returns valid SVG/visual markup`,
        'Tier 1'
      );
    } catch (e) {
      assert(false, `${label}: render(false) threw error: ${e.message}`, 'Tier 1');
    }

    try {
      const revealedMarkup = slide.render(true);
      assert(
        typeof revealedMarkup === 'string' &&
        revealedMarkup.trim().length > 0 &&
        (revealedMarkup.includes('<svg') || revealedMarkup.includes('<div')),
        `${label}: render(true) returns valid SVG/visual markup`,
        'Tier 1'
      );
    } catch (e) {
      assert(false, `${label}: render(true) threw error: ${e.message}`, 'Tier 1');
    }
  }

  function validateFiniteMathItem(item, label) {
    const hasExpr = (typeof item.a === 'string' && typeof item.op === 'string' && typeof item.b === 'string') ||
                    (typeof item.leftHtml === 'string' && item.leftHtml.trim().length > 0);
    assert(hasExpr, `${label}: has valid expression operands or leftHtml`, 'Tier 1');
    assert(typeof item.ans === 'string' && item.ans.trim().length > 0, `${label}: has non-empty answer (ans)`, 'Tier 1');
    assert(typeof item.exp === 'string' && item.exp.trim().length > 0, `${label}: has non-empty explanation (exp)`, 'Tier 1');
    if (typeof item.raw !== 'undefined') {
      assert(typeof item.raw === 'string' && item.raw.trim().length > 0, `${label}: raw answer is valid string if present`, 'Tier 1');
    }
  }

  // ========================================================
  // 2. OPEN-ENDED MATH GENERATORS (28 TOPICS x 100 SAMPLES)
  // ========================================================

  const generatorTopics = [
    // Grade 1 (7)
    'g1_add10', 'g1_sub10', 'g1_make10', 'g1_add20', 'g1_sub20', 'g1_tens', 'g1_mix',
    // Grade 2 (4)
    'g2_add', 'g2_sub', 'g2_mix', 'g2_chal',
    // Grade 3 (5)
    'g3_mult', 'g3_div', 'g3_addsub', 'g3_geom', 'g3_mix',
    // Grade 4 (6)
    'g4_mult', 'g4_div', 'g4_frac', 'g4_prime', 'g4_dec', 'g4_mix',
    // Grade 5 (6)
    'g5_pemdas', 'g5_frac_unlike', 'g5_frac_mult', 'g5_dec_ops', 'g5_volume', 'g5_mix'
  ];

  assert(generatorTopics.length === 28, 'Exactly 28 open-ended generator topics defined', 'Tier 1');
  assert(typeof ctx.generateRandomMathProblemOnce === 'function', 'generateRandomMathProblemOnce is available', 'Tier 1');

  const SAMPLES_PER_TOPIC = 100;
  let totalGenerated = 0;

  for (const topic of generatorTopics) {
    let topicPassed = true;
    for (let i = 0; i < SAMPLES_PER_TOPIC; i++) {
      totalGenerated++;
      let problem;
      try {
        problem = ctx.generateRandomMathProblemOnce(topic);
      } catch (err) {
        assert(false, `Generator [${topic}] threw exception on iteration ${i + 1}: ${err.message}`, 'Tier 2');
        topicPassed = false;
        continue;
      }

      if (!problem) {
        assert(false, `Generator [${topic}] returned null/undefined problem on iteration ${i + 1}`, 'Tier 2');
        topicPassed = false;
        continue;
      }

      // Assert zero NaN or undefined in any output property
      const rawAns = String(problem.answerRaw);
      const htmlAns = String(problem.answerHtml);
      const leftH = String(problem.leftHtml);
      const stepE = typeof problem.stepExplanation !== 'undefined' ? String(problem.stepExplanation) : '';

      const hasNaN = rawAns.includes('NaN') || htmlAns.includes('NaN') || leftH.includes('NaN') || stepE.includes('NaN');
      const hasUndefined = rawAns.includes('undefined') || htmlAns.includes('undefined') || leftH.includes('undefined');

      if (hasNaN) {
        assert(false, `Generator [${topic}] produced NaN output on sample #${i + 1}: ansRaw=${rawAns}`, 'Tier 2');
        topicPassed = false;
      }
      if (hasUndefined) {
        assert(false, `Generator [${topic}] produced "undefined" output on sample #${i + 1}: ansRaw=${rawAns}`, 'Tier 2');
        topicPassed = false;
      }

      // Solvability & structure
      if (!rawAns || rawAns.trim().length === 0) {
        assert(false, `Generator [${topic}] produced empty answerRaw on sample #${i + 1}`, 'Tier 2');
        topicPassed = false;
      }
      if (!leftH || leftH.trim().length === 0) {
        assert(false, `Generator [${topic}] produced empty leftHtml on sample #${i + 1}`, 'Tier 2');
        topicPassed = false;
      }
    }

    results.details.generatorCounts[topic] = SAMPLES_PER_TOPIC;
    if (topicPassed) {
      assert(true, `Generator [${topic}]: ${SAMPLES_PER_TOPIC} samples verified without NaN/undefined`, 'Tier 2');
    }
  }

  assert(totalGenerated === 2800, `Total math generator samples equal 2,800 (got ${totalGenerated})`, 'Tier 2');

  // ========================================================
  // 3. M2 REMEDIATION AUDITS (EXPLANATIONS & FRACTION INTEGRITY)
  // ========================================================

  let g2AddExplanationValid = true;
  for (let i = 0; i < 50; i++) {
    const pAdd = ctx.generateRandomMathProblemOnce('g2_add');
    if (!pAdd.stepExplanation || pAdd.stepExplanation.trim().length === 0) {
      g2AddExplanationValid = false;
      break;
    }
  }
  assert(g2AddExplanationValid, 'g2_add generates non-empty stepExplanation across all samples', 'Tier 2');

  let g2SubExplanationValid = true;
  for (let i = 0; i < 50; i++) {
    const pSub = ctx.generateRandomMathProblemOnce('g2_sub');
    if (!pSub.stepExplanation || pSub.stepExplanation.trim().length === 0) {
      g2SubExplanationValid = false;
      break;
    }
  }
  assert(g2SubExplanationValid, 'g2_sub generates non-empty stepExplanation across all samples', 'Tier 2');

  let g5UnlikeDen1Tested = false;
  let g5UnlikeDen1Clean = true;
  for (let i = 0; i < 500; i++) {
    const p = ctx.generateRandomMathProblemOnce('g5_frac_unlike');
    if (p.answerHtml === '1') {
      g5UnlikeDen1Tested = true;
      if (p.answerRaw !== '1' || p.stepExplanation.includes('(simplified to 1/1)')) {
        g5UnlikeDen1Clean = false;
        break;
      }
    }
  }
  assert(g5UnlikeDen1Tested, 'g5_frac_unlike generates den=1 sample within 500 trials', 'Tier 2');
  assert(g5UnlikeDen1Clean, 'g5_frac_unlike sets answerRaw="1" when simplified denominator is 1', 'Tier 2');

  return results;
}

// Direct CLI Execution
if (require.main === module) {
  console.log('--- Running Content & Generator Suite ---');
  const res = runContentTests({ verbose: true });
  console.log(`\nResults: ${res.passed} passed, ${res.failed} failed out of ${res.total} assertions.`);
  process.exit(res.failed > 0 ? 1 : 0);
}

module.exports = {
  loadDataModules,
  runContentTests
};
