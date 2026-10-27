// Math Helpers & Number Formatters
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function gcd(a, b) {
    return b === 0 ? a : gcd(b, a % b);
  }

  function simplifyFraction(n, d) {
    const g = gcd(Math.abs(n), Math.abs(d));
    return { num: n / g, den: d / g };
  }

  function renderFraction(n, d) {
    return `<span class="fraction"><span class="fraction-num">${n}</span><span class="fraction-den">${d}</span></span>`;
  }


// Grade Definitions & Sub-Topics
  // ========================================================
  // GRADE DEFINITIONS & TOPIC CONFIGURATIONS
  // ========================================================
  const GRADE_TOPICS = {
    grade1: [
      { id: 'g1_add10', label: 'Addition (to 10)' },
      { id: 'g1_sub10', label: 'Subtraction (to 10)' },
      { id: 'g1_make10', label: 'Making 10' },
      { id: 'g1_add20', label: 'Addition (to 20)' },
      { id: 'g1_sub20', label: 'Subtraction (to 20)' },
      { id: 'g1_tens', label: 'Tens & Ones' },
      { id: 'g1_mix', label: 'Mixed 1st' },
      { id: 'g1_unusual', label: 'Number Sense Set (10)', isFiniteSet: true }
    ],
    grade2: [
      { id: 'g2_add', label: 'Addition (to 20)' },
      { id: 'g2_sub', label: 'Subtraction (to 20)' },
      { id: 'g2_mix', label: 'Mixed (to 20)' },
      { id: 'g2_chal', label: 'Two-Digit (to 100)' },
      { id: 'g2_unusual', label: 'Number Sense Set (10)', isFiniteSet: true }
    ],
    grade3: [
      { id: 'g3_mult', label: 'Multiplication (to 10)' },
      { id: 'g3_div', label: 'Division Facts' },
      { id: 'g3_addsub', label: '3-Digit Add/Sub' },
      { id: 'g3_geom', label: 'Area & Perimeter' },
      { id: 'g3_mix', label: 'Mixed 3rd' },
      { id: 'g3_unusual', label: 'Number Sense Set (10)', isFiniteSet: true }
    ],
    grade4: [
      { id: 'g4_mult', label: 'Multi-Digit Multiply' },
      { id: 'g4_div', label: 'Division & Remainders' },
      { id: 'g4_frac', label: 'Like Fractions' },
      { id: 'g4_prime', label: 'Factors & Primes' },
      { id: 'g4_dec', label: 'Decimals (+ / -)' },
      { id: 'g4_mix', label: 'Mixed 4th' },
      { id: 'g4_unusual', label: 'Number Sense Set (10)', isFiniteSet: true }
    ],
    grade5: [
      { id: 'g5_pemdas', label: 'Order of Operations' },
      { id: 'g5_frac_unlike', label: 'Unlike Fractions' },
      { id: 'g5_frac_mult', label: 'Fraction Multiply' },
      { id: 'g5_dec_ops', label: 'Decimal Ops (× / ÷)' },
      { id: 'g5_volume', label: 'Powers of 10 & Volume' },
      { id: 'g5_mix', label: 'Mixed 5th' },
      { id: 'g5_unusual', label: 'Number Sense Set (10)', isFiniteSet: true }
    ]
  };

  function isFiniteMathTopic(topicId) {
    return Boolean(topicId && topicId.endsWith('_unusual'));
  }


// Curated Finite Number Sense Problem Sets (10 per grade)
  // ========================================================
  // CURATED FINITE NUMBER SENSE SETS (10 NUMBERED PROBLEMS PER GRADE)
  // ========================================================
  const FINITE_MATH_SETS = {
    g1_unusual: [
      { a: '10', op: '+', b: '10', ans: '20', exp: 'Two tens make twenty: 10 + 10 = 20.' },
      { a: '20', op: '+', b: '20', ans: '40', exp: '2 tens + 2 tens = 4 tens (40).' },
      { a: '50', op: '+', b: '50', ans: '100', exp: '5 tens + 5 tens = 10 tens, which is 100.' },
      { a: '30', op: '-', b: '10', ans: '20', exp: '3 tens minus 1 ten leaves 2 tens (20).' },
      { a: '99', op: '+', b: '1', ans: '100', exp: 'One more than 99 is 100.' },
      { a: '100', op: '-', b: '1', ans: '99', exp: 'Counting back 1 from 100 gives 99.' },
      { a: '100', op: '+', b: '0', ans: '100', exp: 'Adding 0 to any number leaves the number unchanged.' },
      { a: '15', op: '-', b: '15', ans: '0', exp: 'Subtracting a number from itself always equals 0.' },
      { a: '7', op: '+', b: '7', ans: '14', exp: 'Double 7 is 14.' },
      { a: '9', op: '+', b: '9', ans: '18', exp: 'Double 9 is 18.' }
    ],
    g2_unusual: [
      { a: '100', op: '+', b: '100', ans: '200', exp: '1 hundred + 1 hundred = 2 hundreds (200).' },
      { a: '300', op: '+', b: '300', ans: '600', exp: '3 hundreds + 3 hundreds = 6 hundreds (600).' },
      { a: '500', op: '+', b: '500', ans: '1,000', raw: '1000', exp: 'Two 500s combine to make 1,000.' },
      { a: '1,000', op: '-', b: '500', ans: '500', raw: '500', exp: 'Half of 1,000 is 500.' },
      { a: '999', op: '+', b: '1', ans: '1,000', raw: '1000', exp: 'Adding 1 to 999 reaches 1,000.' },
      { a: '1,000', op: '-', b: '1', ans: '999', raw: '999', exp: 'One less than 1,000 is 999.' },
      { a: '22', op: '+', b: '22', ans: '44', exp: '20 + 20 = 40, and 2 + 2 = 4, making 44.' },
      { a: '44', op: '+', b: '44', ans: '88', exp: 'Double 44 is 88.' },
      { a: '55', op: '+', b: '55', ans: '110', exp: '50 + 50 = 100, and 5 + 5 = 10, so 100 + 10 = 110.' },
      { a: '1,000', op: '+', b: '0', ans: '1,000', raw: '1000', exp: 'The additive identity: adding 0 keeps 1,000 unchanged.' }
    ],
    g3_unusual: [
      { a: '10', op: '×', b: '100', ans: '1,000', raw: '1000', exp: '10 groups of 100 equal 1,000.' },
      { a: '100', op: '×', b: '100', ans: '10,000', raw: '10000', exp: '1 × 1 = 1, followed by four zeros: 10,000.' },
      { a: '50', op: '×', b: '20', ans: '1,000', raw: '1000', exp: '5 × 2 = 10, then attach two zeros to get 1,000.' },
      { a: '30', op: '×', b: '30', ans: '900', exp: '3 × 3 = 9, then attach two zeros to get 900.' },
      { a: '200', op: '×', b: '5', ans: '1,000', raw: '1000', exp: '2 × 5 = 10, plus two zeros equals 1,000.' },
      { a: '40', op: '×', b: '50', ans: '2,000', raw: '2000', exp: '4 × 5 = 20, plus two zeros equals 2,000.' },
      { a: '25', op: '×', b: '4', ans: '100', exp: 'Four 25s make 100 (like 4 quarters in a dollar).' },
      { a: '25', op: '×', b: '8', ans: '200', exp: 'Eight 25s make 200 (twice 100).' },
      { a: '9', op: '×', b: '11', ans: '99', exp: 'Multiplying a single digit by 11 repeats the digit: 99.' },
      { a: '99', op: '+', b: '99', ans: '198', exp: 'Compensation strategy: (100 + 100) - 2 = 198.' }
    ],
    g4_unusual: [
      { a: '1,000', op: '×', b: '1,000', ans: '1,000,000', raw: '1000000', exp: 'One thousand times one thousand equals one million (1,000,000).' },
      { a: '1,000,000', op: '÷', b: '1,000', ans: '1,000', raw: '1000', exp: '1,000,000 divided by 1,000 removes three zeros, leaving 1,000.' },
      { a: '10,000', op: '÷', b: '2', ans: '5,000', raw: '5000', exp: 'Half of 10 thousand is 5 thousand (5,000).' },
      { a: '10,000', op: '×', b: '10', ans: '100,000', raw: '100000', exp: 'Multiplying 10,000 by 10 shifts one place value to 100,000.' },
      { a: '8', op: '×', b: '9 × 0', ans: '0', exp: 'Zero property of multiplication: any product with a factor of 0 equals 0.' },
      { a: '101', op: '×', b: '7', ans: '707', exp: '100 × 7 = 700, plus 1 × 7 = 7, giving 707.' },
      { a: '101', op: '×', b: '24', ans: '2,424', raw: '2424', exp: '24 × 100 + 24 × 1 = 2,400 + 24 = 2,424.' },
      { a: '11', op: '×', b: '11', ans: '121', exp: '11 × 10 = 110, plus 11 × 1 = 11, which equals 121.' },
      { a: '12', op: '×', b: '12', ans: '144', exp: '12 squared (a gross) is 144.' },
      { a: '15', op: '×', b: '15', ans: '225', exp: '(10 × 15) + (5 × 15) = 150 + 75 = 225.' }
    ],
    g5_unusual: [
      { leftHtml: '<span class="num">100</span><span class="op">-</span><span class="num">100</span><span class="op">×</span><span class="num">0</span><span class="equals">=</span>', ans: '100', raw: '100', exp: 'Order of operations: multiply first (100 × 0 = 0), then subtract (100 - 0 = 100).' },
      { leftHtml: '<span class="num">10</span><span class="op">+</span><span class="num">10</span><span class="op">×</span><span class="num">10</span><span class="equals">=</span>', ans: '110', raw: '110', exp: 'Multiply first: 10 × 10 = 100. Then add: 10 + 100 = 110.' },
      { leftHtml: '<span class="num">50</span><span class="op">+</span><span class="num">50</span><span class="op">×</span><span class="num">2</span><span class="equals">=</span>', ans: '150', raw: '150', exp: 'Multiply first: 50 × 2 = 100. Then add: 50 + 100 = 150.' },
      { leftHtml: '<span class="num">999<sup>0</sup></span><span class="equals">=</span>', ans: '1', raw: '1', exp: 'Zero exponent rule: any non-zero number raised to the power of 0 equals 1.' },
      { leftHtml: '<span class="num">2<sup>5</sup></span><span class="equals">=</span>', ans: '32', raw: '32', exp: '2 × 2 × 2 × 2 × 2 = 32.' },
      { leftHtml: '<span style="font-size:0.65em; color:#0f172a; font-weight:800;">Half of 1,000,000</span><span class="equals">=</span>', ans: '500,000', raw: '500000', exp: '1,000,000 ÷ 2 = 500,000.' },
      { leftHtml: '<span class="num">1,000</span><span class="op">÷</span><span class="num">250</span><span class="equals">=</span>', ans: '4', raw: '4', exp: '250 × 4 = 1,000, so 1,000 ÷ 250 = 4.' },
      { leftHtml: '<span class="num">5</span><span class="op">-</span><span class="num">10</span><span class="equals">=</span>', ans: '-5', raw: '-5', exp: 'Subtracting 10 from 5 moves 5 units below zero to -5.' },
      { leftHtml: '<span class="num">0</span><span class="op">-</span><span class="num">50</span><span class="equals">=</span>', ans: '-50', raw: '-50', exp: '50 units below zero is -50.' },
      { leftHtml: '<span class="num">10</span><span class="op">-</span><span class="num">25</span><span class="equals">=</span>', ans: '-15', raw: '-15', exp: '10 minus 25 equals -15.' }
    ]
  };

  function getGradeLabel(tabKey) {
    switch (tabKey) {
      case 'grade1': return '1st Grade';
      case 'grade2': return '2nd Grade';
      case 'grade3': return '3rd Grade';
      case 'grade4': return '4th Grade';
      case 'grade5': return '5th Grade';
      default: return 'Math';
    }
  }

// Random Math Problem Generators
  // ========================================================
  // MATH PROBLEM GENERATOR (GRADES 1 - 5)
  // ========================================================
  function generateRandomMathProblemOnce(topic) {
    if (topic.startsWith('g1_')) {
      let subMode = topic;
      if (subMode === 'g1_mix') {
        const mixTopics = ['g1_add10', 'g1_sub10', 'g1_make10', 'g1_add20', 'g1_sub20', 'g1_tens'];
        subMode = mixTopics[getRandomInt(0, mixTopics.length - 1)];
      }

      if (subMode === 'g1_add10') {
        const sum = getRandomInt(2, 10);
        const a = getRandomInt(1, sum - 1);
        const b = sum - a;
        return {
          badge: '1st Grade • Addition (to 10)',
          leftHtml: `<span class="num">${a}</span><span class="op">+</span><span class="num">${b}</span><span class="equals">=</span>`,
          answerHtml: `${sum}`,
          answerRaw: `${sum}`,
          hasVisualDots: true,
          dotsA: a,
          dotsB: b,
          dotsOp: '+',
          stepExplanation: `${a} + ${b} = ${sum}.`
        };
      } else if (subMode === 'g1_sub10') {
        const a = getRandomInt(2, 10);
        const b = getRandomInt(1, a - 1);
        const ans = a - b;
        return {
          badge: '1st Grade • Subtraction (to 10)',
          leftHtml: `<span class="num">${a}</span><span class="op">-</span><span class="num">${b}</span><span class="equals">=</span>`,
          answerHtml: `${ans}`,
          answerRaw: `${ans}`,
          hasVisualDots: true,
          dotsA: a,
          dotsB: b,
          dotsOp: '-',
          stepExplanation: `${a} minus ${b} equals ${ans}.`
        };
      } else if (subMode === 'g1_make10') {
        const a = getRandomInt(1, 9);
        const partner = 10 - a;
        const askAsSubtraction = Math.random() < 0.4;
        if (askAsSubtraction) {
          return {
            badge: '1st Grade • Making 10',
            leftHtml: `<span class="num">10</span><span class="op">-</span><span class="num">${a}</span><span class="equals">=</span>`,
            answerHtml: `${partner}`,
            answerRaw: `${partner}`,
            hasVisualDots: true,
            dotsA: 10,
            dotsB: a,
            dotsOp: '-',
            stepExplanation: `10 minus ${a} leaves ${partner} (${a} + ${partner} = 10).`
          };
        } else {
          return {
            badge: '1st Grade • Making 10',
            leftHtml: `<span class="num">${a}</span><span class="op">+</span><span class="num">${partner}</span><span class="equals">=</span>`,
            answerHtml: `10`,
            answerRaw: `10`,
            hasVisualDots: true,
            dotsA: a,
            dotsB: partner,
            dotsOp: '+',
            stepExplanation: `${a} and ${partner} are number partners that make 10.`
          };
        }
      } else if (subMode === 'g1_add20') {
        const sum = getRandomInt(11, 20);
        const a = getRandomInt(2, sum - 2);
        const b = sum - a;
        return {
          badge: '1st Grade • Addition (to 20)',
          leftHtml: `<span class="num">${a}</span><span class="op">+</span><span class="num">${b}</span><span class="equals">=</span>`,
          answerHtml: `${sum}`,
          answerRaw: `${sum}`,
          hasVisualDots: true,
          dotsA: a,
          dotsB: b,
          dotsOp: '+',
          stepExplanation: `${a} + ${b} = ${sum}.`
        };
      } else if (subMode === 'g1_sub20') {
        const a = getRandomInt(11, 20);
        const b = getRandomInt(1, a - 1);
        const ans = a - b;
        return {
          badge: '1st Grade • Subtraction (to 20)',
          leftHtml: `<span class="num">${a}</span><span class="op">-</span><span class="num">${b}</span><span class="equals">=</span>`,
          answerHtml: `${ans}`,
          answerRaw: `${ans}`,
          hasVisualDots: true,
          dotsA: a,
          dotsB: b,
          dotsOp: '-',
          stepExplanation: `${a} minus ${b} equals ${ans}.`
        };
      } else {
        const isAdd = Math.random() < 0.6;
        if (isAdd) {
          const ones = getRandomInt(1, 9);
          const tens = Math.random() < 0.7 ? 10 : (getRandomInt(2, 4) * 10);
          return {
            badge: '1st Grade • Tens & Ones',
            leftHtml: `<span class="num">${tens}</span><span class="op">+</span><span class="num">${ones}</span><span class="equals">=</span>`,
            answerHtml: `${tens + ones}`,
            answerRaw: `${tens + ones}`,
            hasVisualDots: tens === 10,
            dotsA: tens === 10 ? 10 : 0,
            dotsB: tens === 10 ? ones : 0,
            dotsOp: '+',
            stepExplanation: `${tens} (tens) + ${ones} (ones) = ${tens + ones}.`
          };
        } else {
          const ones = getRandomInt(1, 9);
          const total = 10 + ones;
          return {
            badge: '1st Grade • Tens & Ones',
            leftHtml: `<span class="num">${total}</span><span class="op">-</span><span class="num">${ones}</span><span class="equals">=</span>`,
            answerHtml: `10`,
            answerRaw: `10`,
            hasVisualDots: true,
            dotsA: total,
            dotsB: ones,
            dotsOp: '-',
            stepExplanation: `Subtracting ${ones} ones from ${total} leaves 1 ten (10).`
          };
        }
      }
    }

    if (topic.startsWith('g2_')) {
      let subMode = topic;
      if (subMode === 'g2_mix') {
        subMode = Math.random() < 0.5 ? 'g2_add' : 'g2_sub';
      }

      if (subMode === 'g2_add') {
        const sum = getRandomInt(4, 20);
        const a = getRandomInt(1, sum - 1);
        const b = sum - a;
        return {
          badge: '2nd Grade • Addition',
          leftHtml: `<span class="num">${a}</span><span class="op">+</span><span class="num">${b}</span><span class="equals">=</span>`,
          answerHtml: `${sum}`,
          answerRaw: `${sum}`,
          hasVisualDots: true,
          dotsA: a,
          dotsB: b,
          dotsOp: '+',
          stepExplanation: `${a} + ${b} = ${sum}.`
        };
      } else if (subMode === 'g2_sub') {
        const a = getRandomInt(4, 20);
        const b = getRandomInt(1, a - 1);
        const ans = a - b;
        return {
          badge: '2nd Grade • Subtraction',
          leftHtml: `<span class="num">${a}</span><span class="op">-</span><span class="num">${b}</span><span class="equals">=</span>`,
          answerHtml: `${ans}`,
          answerRaw: `${ans}`,
          hasVisualDots: true,
          dotsA: a,
          dotsB: b,
          dotsOp: '-',
          stepExplanation: `${a} minus ${b} equals ${ans}.`
        };
      } else {
        const isAdd = Math.random() < 0.5;
        if (isAdd) {
          const a = getRandomInt(12, 68);
          const b = getRandomInt(10, 100 - a);
          return {
            badge: '2nd Grade • Two-Digit Addition',
            leftHtml: `<span class="num">${a}</span><span class="op">+</span><span class="num">${b}</span><span class="equals">=</span>`,
            answerHtml: `${a + b}`,
            answerRaw: `${a + b}`,
            hasVisualDots: false,
            stepExplanation: `Break into tens and ones: ${Math.floor(a/10)*10} + ${Math.floor(b/10)*10} = ${(Math.floor(a/10)+Math.floor(b/10))*10}, plus ${(a%10)+(b%10)} = ${a + b}.`
          };
        } else {
          const a = getRandomInt(25, 99);
          const b = getRandomInt(10, a - 5);
          return {
            badge: '2nd Grade • Two-Digit Subtraction',
            leftHtml: `<span class="num">${a}</span><span class="op">-</span><span class="num">${b}</span><span class="equals">=</span>`,
            answerHtml: `${a - b}`,
            answerRaw: `${a - b}`,
            hasVisualDots: false,
            stepExplanation: `${a} minus ${b} equals ${a - b}.`
          };
        }
      }
    }

    if (topic.startsWith('g3_')) {
      let subMode = topic;
      if (subMode === 'g3_mix') {
        const list = ['g3_mult', 'g3_div', 'g3_addsub', 'g3_geom'];
        subMode = list[getRandomInt(0, list.length - 1)];
      }

      if (subMode === 'g3_mult') {
        const a = getRandomInt(2, 10);
        const b = getRandomInt(2, 10);
        return {
          badge: '3rd Grade • Multiplication',
          leftHtml: `<span class="num">${a}</span><span class="op">×</span><span class="num">${b}</span><span class="equals">=</span>`,
          answerHtml: `${a * b}`,
          answerRaw: `${a * b}`,
          hasVisualDots: false,
          stepExplanation: `${a} groups of ${b} equals ${a * b}.`
        };
      } else if (subMode === 'g3_div') {
        const b = getRandomInt(2, 10);
        const ans = getRandomInt(2, 10);
        const a = b * ans;
        return {
          badge: '3rd Grade • Division Facts',
          leftHtml: `<span class="num">${a}</span><span class="op">÷</span><span class="num">${b}</span><span class="equals">=</span>`,
          answerHtml: `${ans}`,
          answerRaw: `${ans}`,
          hasVisualDots: false,
          stepExplanation: `Since ${b} × ${ans} = ${a}, ${a} ÷ ${b} = ${ans}.`
        };
      } else if (subMode === 'g3_addsub') {
        const isAdd = Math.random() < 0.5;
        if (isAdd) {
          const a = getRandomInt(120, 550);
          const b = getRandomInt(110, 440);
          return {
            badge: '3rd Grade • 3-Digit Addition',
            leftHtml: `<span class="num">${a}</span><span class="op">+</span><span class="num">${b}</span><span class="equals">=</span>`,
            answerHtml: `${a + b}`,
            answerRaw: `${a + b}`,
            hasVisualDots: false,
            stepExplanation: `Sum: ${a} + ${b} = ${a + b}.`
          };
        } else {
          const a = getRandomInt(300, 950);
          const b = getRandomInt(120, a - 50);
          return {
            badge: '3rd Grade • 3-Digit Subtraction',
            leftHtml: `<span class="num">${a}</span><span class="op">-</span><span class="num">${b}</span><span class="equals">=</span>`,
            answerHtml: `${a - b}`,
            answerRaw: `${a - b}`,
            hasVisualDots: false,
            stepExplanation: `Difference: ${a} - ${b} = ${a - b}.`
          };
        }
      } else if (subMode === 'g3_geom') {
        const w = getRandomInt(3, 9);
        const h = getRandomInt(3, 8);
        const askArea = Math.random() < 0.5;
        const ans = askArea ? (w * h) : (2 * (w + h));
        const qType = askArea ? 'Area (Length × Width)' : 'Perimeter (Distance Around)';
        const formula = askArea ? `${w} × ${h} = ${ans} sq units` : `2 × (${w} + ${h}) = ${ans} units`;

        const svg = `
          <div class="geom-container">
            <svg viewBox="0 0 200 110" width="100%" height="90">
              <rect x="35" y="20" width="130" height="70" rx="6" fill="#eef2ff" stroke="#3730a3" stroke-width="2.5" />
              <text x="100" y="14" font-family="'Inter', sans-serif" font-size="12" font-weight="700" fill="#3730a3" text-anchor="middle">Width = ${w}</text>
              <text x="20" y="60" font-family="'Inter', sans-serif" font-size="12" font-weight="700" fill="#3730a3" text-anchor="middle">H = ${h}</text>
            </svg>
            <div style="font-size:0.9rem; font-weight:700; color:#3730a3;">Find the ${qType}</div>
          </div>
        `;

        return {
          badge: '3rd Grade • Geometry',
          leftHtml: `<span class="op" style="font-size:0.65em;">${qType} (${w} by ${h})</span><span class="equals">=</span>`,
          answerHtml: `${ans}`,
          answerRaw: `${ans}`,
          hasVisualDots: false,
          customVisualHtml: svg,
          stepExplanation: `${formula}.`
        };
      }
    }

    if (topic.startsWith('g4_')) {
      let subMode = topic;
      if (subMode === 'g4_mix') {
        const list = ['g4_mult', 'g4_div', 'g4_frac', 'g4_prime', 'g4_dec'];
        subMode = list[getRandomInt(0, list.length - 1)];
      }

      if (subMode === 'g4_mult') {
        const isTens = Math.random() < 0.35;
        if (isTens) {
          const a = getRandomInt(2, 8) * 10;
          const b = getRandomInt(2, 9) * 10;
          return {
            badge: '4th Grade • Multi-Digit Multiplication',
            leftHtml: `<span class="num">${a}</span><span class="op">×</span><span class="num">${b}</span><span class="equals">=</span>`,
            answerHtml: `${a * b}`,
            answerRaw: `${a * b}`,
            hasVisualDots: false,
            stepExplanation: `Multiply leading digits: ${(a/10)} × ${(b/10)} = ${(a/10)*(b/10)}, then append two zeros = ${a * b}.`
          };
        } else {
          const a = getRandomInt(14, 65);
          const b = getRandomInt(3, 8);
          return {
            badge: '4th Grade • Multi-Digit Multiplication',
            leftHtml: `<span class="num">${a}</span><span class="op">×</span><span class="num">${b}</span><span class="equals">=</span>`,
            answerHtml: `${a * b}`,
            answerRaw: `${a * b}`,
            hasVisualDots: false,
            stepExplanation: `(${Math.floor(a/10)*10} × ${b}) + (${(a%10)} × ${b}) = ${Math.floor(a/10)*10*b} + ${(a%10)*b} = ${a * b}.`
          };
        }
      } else if (subMode === 'g4_div') {
        const div = getRandomInt(3, 8);
        const hasRemainder = Math.random() < 0.6;
        if (hasRemainder) {
          const quotient = getRandomInt(4, 15);
          const rem = getRandomInt(1, div - 1);
          const dividend = quotient * div + rem;
          return {
            badge: '4th Grade • Division with Remainders',
            leftHtml: `<span class="num">${dividend}</span><span class="op">÷</span><span class="num">${div}</span><span class="equals">=</span>`,
            answerHtml: `${quotient} R ${rem}`,
            answerRaw: `${quotient} R ${rem}`,
            hasVisualDots: false,
            stepExplanation: `${div} goes into ${dividend} ${quotient} times with a remainder of ${rem} (${quotient} × ${div} + ${rem} = ${dividend}).`
          };
        } else {
          const quotient = getRandomInt(12, 28);
          const dividend = quotient * div;
          return {
            badge: '4th Grade • Division',
            leftHtml: `<span class="num">${dividend}</span><span class="op">÷</span><span class="num">${div}</span><span class="equals">=</span>`,
            answerHtml: `${quotient}`,
            answerRaw: `${quotient}`,
            hasVisualDots: false,
            stepExplanation: `${dividend} ÷ ${div} divides evenly to ${quotient}.`
          };
        }
      } else if (subMode === 'g4_frac') {
        const den = [4, 5, 6, 8, 10, 12][getRandomInt(0, 5)];
        const isAdd = Math.random() < 0.5;
        if (isAdd) {
          const a = getRandomInt(1, den - 2);
          const b = getRandomInt(1, den - 1 - a);
          const sum = a + b;
          return {
            badge: '4th Grade • Like Fractions',
            leftHtml: `${renderFraction(a, den)} <span class="op">+</span> ${renderFraction(b, den)} <span class="equals">=</span>`,
            answerHtml: `${renderFraction(sum, den)}`,
            answerRaw: `${sum}/${den}`,
            hasVisualDots: false,
            stepExplanation: `With matching denominators (${den}), add the numerators: ${a} + ${b} = ${sum} (${sum}/${den}).`
          };
        } else {
          const a = getRandomInt(3, den - 1);
          const b = getRandomInt(1, a - 1);
          const diff = a - b;
          return {
            badge: '4th Grade • Like Fractions',
            leftHtml: `${renderFraction(a, den)} <span class="op">-</span> ${renderFraction(b, den)} <span class="equals">=</span>`,
            answerHtml: `${renderFraction(diff, den)}`,
            answerRaw: `${diff}/${den}`,
            hasVisualDots: false,
            stepExplanation: `Keep the denominator ${den} and subtract the numerators: ${a} - ${b} = ${diff} (${diff}/${den}).`
          };
        }
      } else if (subMode === 'g4_prime') {
        const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];
        const composites = [4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20, 21, 22, 24, 25, 27, 28, 30];
        const isPrimeQ = Math.random() < 0.5;
        const num = isPrimeQ ? primes[getRandomInt(0, primes.length - 1)] : composites[getRandomInt(0, composites.length - 1)];

        return {
          badge: '4th Grade • Factors & Primes',
          leftHtml: `<span style="font-size:0.6em; color:#0f172a; font-weight:700;">Is <span style="color:#2563eb; font-size:1.35em;">${num}</span> prime?</span><span class="equals">=</span>`,
          answerHtml: `${isPrimeQ ? 'YES' : 'NO'}`,
          answerRaw: isPrimeQ ? 'yes' : 'no',
          answersAccepted: isPrimeQ ? ['yes', 'y', 'prime'] : ['no', 'n', 'composite'],
          hasVisualDots: false,
          stepExplanation: isPrimeQ ? `${num} is prime because its only factors are 1 and ${num}.` : `${num} is composite because it has factors other than 1 and itself.`
        };
      } else if (subMode === 'g4_dec') {
        const isAdd = Math.random() < 0.5;
        if (isAdd) {
          const a = (getRandomInt(1, 25) / 10).toFixed(1);
          const b = (getRandomInt(2, 25) / 10).toFixed(1);
          const sum = (parseFloat(a) + parseFloat(b)).toFixed(1);
          return {
            badge: '4th Grade • Decimals',
            leftHtml: `<span class="num">${a}</span><span class="op">+</span><span class="num">${b}</span><span class="equals">=</span>`,
            answerHtml: `${sum}`,
            answerRaw: `${sum}`,
            hasVisualDots: false,
            stepExplanation: `${a} + ${b} = ${sum}.`
          };
        } else {
          const a = (getRandomInt(15, 50) / 10).toFixed(1);
          const b = (getRandomInt(5, parseFloat(a) * 10 - 2) / 10).toFixed(1);
          const diff = (parseFloat(a) - parseFloat(b)).toFixed(1);
          return {
            badge: '4th Grade • Decimals',
            leftHtml: `<span class="num">${a}</span><span class="op">-</span><span class="num">${b}</span><span class="equals">=</span>`,
            answerHtml: `${diff}`,
            answerRaw: `${diff}`,
            hasVisualDots: false,
            stepExplanation: `${a} - ${b} = ${diff}.`
          };
        }
      }
    }

    if (topic.startsWith('g5_')) {
      let subMode = topic;
      if (subMode === 'g5_mix') {
        const list = ['g5_pemdas', 'g5_frac_unlike', 'g5_frac_mult', 'g5_dec_ops', 'g5_volume'];
        subMode = list[getRandomInt(0, list.length - 1)];
      }

      if (subMode === 'g5_pemdas') {
        const template = getRandomInt(1, 3);
        if (template === 1) {
          const a = getRandomInt(2, 12);
          const b = getRandomInt(2, 7);
          const c = getRandomInt(2, 6);
          const ans = a + b * c;
          return {
            badge: '5th Grade • Order of Operations',
            leftHtml: `<span class="num">${a}</span><span class="op">+</span><span class="num">${b}</span><span class="op">×</span><span class="num">${c}</span><span class="equals">=</span>`,
            answerHtml: `${ans}`,
            answerRaw: `${ans}`,
            hasVisualDots: false,
            stepExplanation: `1. Multiply first: ${b} × ${c} = ${b * c}. 2. Add: ${a} + ${b * c} = ${ans}.`
          };
        } else if (template === 2) {
          const a = getRandomInt(2, 8);
          const b = getRandomInt(2, 8);
          const c = getRandomInt(2, 6);
          const ans = (a + b) * c;
          return {
            badge: '5th Grade • Order of Operations',
            leftHtml: `<span class="num">(${a}</span><span class="op">+</span><span class="num">${b})</span><span class="op">×</span><span class="num">${c}</span><span class="equals">=</span>`,
            answerHtml: `${ans}`,
            answerRaw: `${ans}`,
            hasVisualDots: false,
            stepExplanation: `1. Parentheses first: (${a} + ${b}) = ${a + b}. 2. Multiply: ${a + b} × ${c} = ${ans}.`
          };
        } else {
          const c = getRandomInt(2, 5);
          const divResult = getRandomInt(2, 6);
          const b = c * divResult;
          const a = b + getRandomInt(5, 20);
          const ans = a - divResult;
          return {
            badge: '5th Grade • Order of Operations',
            leftHtml: `<span class="num">${a}</span><span class="op">-</span><span class="num">${b}</span><span class="op">÷</span><span class="num">${c}</span><span class="equals">=</span>`,
            answerHtml: `${ans}`,
            answerRaw: `${ans}`,
            hasVisualDots: false,
            stepExplanation: `1. Divide first: ${b} ÷ ${c} = ${divResult}. 2. Subtract: ${a} - ${divResult} = ${ans}.`
          };
        }
      } else if (subMode === 'g5_frac_unlike') {
        const pairs = [
          { d1: 2, d2: 4, lcd: 4 },
          { d1: 3, d2: 6, lcd: 6 },
          { d1: 2, d2: 3, lcd: 6 },
          { d1: 4, d2: 8, lcd: 8 },
          { d1: 2, d2: 5, lcd: 10 },
          { d1: 3, d2: 4, lcd: 12 },
          { d1: 2, d2: 6, lcd: 6 }
        ];
        const pair = pairs[getRandomInt(0, pairs.length - 1)];
        const n1 = getRandomInt(1, pair.d1 - 1);
        const n2 = getRandomInt(1, pair.d2 - 1);
        const conv1 = n1 * (pair.lcd / pair.d1);
        const conv2 = n2 * (pair.lcd / pair.d2);
        const sumNum = conv1 + conv2;
        const simp = simplifyFraction(sumNum, pair.lcd);
        const ansFormatted = simp.den === 1 ? `${simp.num}` : `${renderFraction(simp.num, simp.den)}`;
        const simpStr = simp.den === 1 ? `${simp.num}` : `${simp.num}/${simp.den}`;

        return {
          badge: '5th Grade • Unlike Fractions',
          leftHtml: `${renderFraction(n1, pair.d1)} <span class="op">+</span> ${renderFraction(n2, pair.d2)} <span class="equals">=</span>`,
          answerHtml: `${ansFormatted}`,
          answerRaw: simp.den === 1 ? `${simp.num}` : `${simp.num}/${simp.den}`,
          answersAccepted: simp.den === 1 ? [`${simp.num}`, `${simp.num}/1`] : [`${simp.num}/${simp.den}`],
          hasVisualDots: false,
          stepExplanation: `Common denominator is ${pair.lcd}: ${conv1}/${pair.lcd} + ${conv2}/${pair.lcd} = ${sumNum}/${pair.lcd}${simp.den !== pair.lcd ? ` (simplified to ${simpStr})` : ''}.`
        };
      } else if (subMode === 'g5_frac_mult') {
        const n1 = getRandomInt(1, 3);
        const d1 = getRandomInt(n1 + 1, 5);
        const n2 = getRandomInt(1, 4);
        const d2 = getRandomInt(n2 + 1, 6);
        const prodNum = n1 * n2;
        const prodDen = d1 * d2;
        const simp = simplifyFraction(prodNum, prodDen);
        const ansFormatted = simp.den === 1 ? `${simp.num}` : `${renderFraction(simp.num, simp.den)}`;

        return {
          badge: '5th Grade • Multiplying Fractions',
          leftHtml: `${renderFraction(n1, d1)} <span class="op">×</span> ${renderFraction(n2, d2)} <span class="equals">=</span>`,
          answerHtml: `${ansFormatted}`,
          answerRaw: `${simp.num}/${simp.den}`,
          hasVisualDots: false,
          stepExplanation: `Multiply numerators (${n1} × ${n2} = ${prodNum}) and denominators (${d1} × ${d2} = ${prodDen}) to get ${prodNum}/${prodDen}${simp.den !== prodDen ? ` = ${simp.num}/${simp.den}` : ''}.`
        };
      } else if (subMode === 'g5_dec_ops') {
        const isMult = Math.random() < 0.6;
        if (isMult) {
          const a = (getRandomInt(11, 45) / 10).toFixed(1);
          const b = getRandomInt(2, 5);
          const ans = (parseFloat(a) * b).toFixed(1);
          return {
            badge: '5th Grade • Decimal Multiplication',
            leftHtml: `<span class="num">${a}</span><span class="op">×</span><span class="num">${b}</span><span class="equals">=</span>`,
            answerHtml: `${ans}`,
            answerRaw: `${ans}`,
            hasVisualDots: false,
            stepExplanation: `${a} × ${b} = ${ans}.`
          };
        } else {
          const div = getRandomInt(2, 6);
          const res = (getRandomInt(11, 40) / 10).toFixed(1);
          const a = (parseFloat(res) * div).toFixed(1);
          return {
            badge: '5th Grade • Decimal Division',
            leftHtml: `<span class="num">${a}</span><span class="op">÷</span><span class="num">${div}</span><span class="equals">=</span>`,
            answerHtml: `${res}`,
            answerRaw: `${res}`,
            hasVisualDots: false,
            stepExplanation: `${a} ÷ ${div} = ${res}.`
          };
        }
      } else if (subMode === 'g5_volume') {
        const isExp = Math.random() < 0.35;
        if (isExp) {
          const exp = getRandomInt(2, 6);
          const ans = Math.pow(10, exp).toLocaleString();
          return {
            badge: '5th Grade • Powers of 10',
            leftHtml: `<span class="num">10<sup>${exp}</sup></span><span class="equals">=</span>`,
            answerHtml: `${ans}`,
            answerRaw: `${Math.pow(10, exp)}`,
            hasVisualDots: false,
            stepExplanation: `10 raised to the power of ${exp} is 1 followed by ${exp} zeros (${ans}).`
          };
        } else {
          const l = getRandomInt(2, 6);
          const w = getRandomInt(2, 5);
          const h = getRandomInt(2, 4);
          const vol = l * w * h;

          const svg = `
            <div class="geom-container">
              <svg viewBox="0 0 220 110" width="100%" height="90">
                <polygon points="60,40 120,20 170,35 110,55" fill="#c7d2fe" stroke="#3730a3" stroke-width="2" />
                <polygon points="60,40 110,55 110,95 60,80" fill="#818cf8" stroke="#3730a3" stroke-width="2" />
                <polygon points="110,55 170,35 170,75 110,95" fill="#4f46e5" stroke="#312e81" stroke-width="2" />
                <text x="85" y="98" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#0f172a" text-anchor="middle">L = ${l}</text>
                <text x="150" y="92" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#0f172a" text-anchor="middle">W = ${w}</text>
                <text x="45" y="62" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#0f172a" text-anchor="middle">H = ${h}</text>
              </svg>
              <div style="font-size:0.9rem; font-weight:700; color:#3730a3;">Find Volume: Length × Width × Height</div>
            </div>
          `;

          return {
            badge: '5th Grade • Volume',
            leftHtml: `<span class="op" style="font-size:0.65em;">Volume (${l} × ${w} × ${h})</span><span class="equals">=</span>`,
            answerHtml: `${vol}`,
            answerRaw: `${vol}`,
            hasVisualDots: false,
            customVisualHtml: svg,
            stepExplanation: `Volume = Length × Width × Height = ${l} × ${w} × ${h} = ${vol} cubic units.`
          };
        }
      }
    }

    return {
      badge: 'Math Fact',
      leftHtml: `<span class="num">5</span><span class="op">+</span><span class="num">5</span><span class="equals">=</span>`,
      answerHtml: `10`,
      answerRaw: `10`,
      hasVisualDots: false,
      stepExplanation: '5 + 5 = 10.'
    };
  }

// Global Exports
(typeof window !== "undefined" ? window : global).getRandomInt = getRandomInt;
(typeof window !== "undefined" ? window : global).gcd = gcd;
(typeof window !== "undefined" ? window : global).simplifyFraction = simplifyFraction;
(typeof window !== "undefined" ? window : global).renderFraction = renderFraction;
(typeof window !== "undefined" ? window : global).GRADE_TOPICS = GRADE_TOPICS;
(typeof window !== "undefined" ? window : global).FINITE_MATH_SETS = FINITE_MATH_SETS;
(typeof window !== "undefined" ? window : global).isFiniteMathTopic = isFiniteMathTopic;
(typeof window !== "undefined" ? window : global).getGradeLabel = getGradeLabel;
(typeof window !== "undefined" ? window : global).generateRandomMathProblemOnce = generateRandomMathProblemOnce;
