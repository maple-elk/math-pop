  // SCIENCE SLIDES DATA (16 CURATED NUMBERED PROBLEMS)
  // ========================================================
  const SCIENCE_SLIDES = {
    // TRACK 1: SPACE, GRAVITY & ORBITS (4 Problems)
    space: [
      {
        question: 'On the Moon where there is no air (a vacuum), Apollo 15 astronaut David Scott dropped a 3-lb steel hammer and a falcon feather at the same moment. What happened?',
        answerRaw: 'hit together',
        answersAccepted: ['same', 'together', 'both', 'at the same time', 'same time', 'they hit together', 'hit at the same time', 'both hit', 'hit together', 'fell together'],
        answerTitle: 'Answer: They Hit the Ground at the Exact Same Time',
        explanation: 'In a vacuum with no air resistance, gravity accelerates all objects at the same rate regardless of mass. On Earth, air drag slows the feather; on the airless Moon, both land together.',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 210" width="100%" height="210" xmlns="http://www.w3.org/2000/svg">`;
          svg += `<rect x="0" y="160" width="460" height="50" fill="#94a3b8" />`;
          svg += `<ellipse cx="90" cy="180" rx="30" ry="10" fill="#64748b" />`;
          svg += `<ellipse cx="360" cy="175" rx="40" ry="12" fill="#64748b" />`;
          svg += `<rect x="0" y="0" width="460" height="160" fill="#0f172a" />`;
          svg += `<circle cx="50" cy="30" r="1.5" fill="#fff" /><circle cx="120" cy="50" r="1" fill="#fff" /><circle cx="210" cy="20" r="1.5" fill="#fff" /><circle cx="390" cy="40" r="1" fill="#fff" />`;
          svg += `<circle cx="400" cy="35" r="18" fill="#3b82f6" />`;
          svg += `<path d="M390,30 Q400,25 410,32 Q405,45 395,40 Z" fill="#10b981" />`;

          if (!isRevealed) {
            svg += `<text x="140" y="65" font-size="34" text-anchor="middle">🔨</text>`;
            svg += `<text x="140" y="90" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#93c5fd" text-anchor="middle">3 lb Steel Hammer</text>`;
            svg += `<text x="320" y="65" font-size="34" text-anchor="middle">🪶</text>`;
            svg += `<text x="320" y="90" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#93c5fd" text-anchor="middle">0.03 oz Feather</text>`;
            svg += `<line x1="230" y1="20" x2="230" y2="150" stroke="#334155" stroke-dasharray="4,4" stroke-width="2" />`;
            svg += `<rect x="175" y="110" width="110" height="26" rx="6" fill="#1e293b" stroke="#3b82f6" stroke-width="1.5" />`;
            svg += `<text x="230" y="127" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#38bdf8" text-anchor="middle">VACUUM DROP</text>`;
          } else {
            svg += `<line x1="140" y1="40" x2="140" y2="145" stroke="#38bdf8" stroke-width="2" stroke-dasharray="3,3" />`;
            svg += `<line x1="320" y1="40" x2="320" y2="145" stroke="#38bdf8" stroke-width="2" stroke-dasharray="3,3" />`;
            svg += `<text x="140" y="158" font-size="32" text-anchor="middle">🔨</text>`;
            svg += `<text x="320" y="158" font-size="32" text-anchor="middle">🪶</text>`;
            svg += `<rect x="150" y="55" width="160" height="40" rx="8" fill="#059669" />`;
            svg += `<text x="230" y="73" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#fff" text-anchor="middle">EQUAL ACCELERATION</text>`;
            svg += `<text x="230" y="89" font-family="'Inter', sans-serif" font-size="12" font-weight="700" fill="#fef08a" text-anchor="middle">Both Land Together</text>`;
          }
          svg += `</svg>`;
          return svg;
        }
      },

      {
        question: 'Sound travels as a pressure wave through matter. In the vacuum of outer space, could you hear a nearby asteroid collision?',
        answerRaw: 'no',
        answersAccepted: ['no', 'nothing', 'silence', 'silent', 'nope', 'cannot', 'cant', 'you cant hear', 'complete silence', 'total silence'],
        answerTitle: 'Answer: No — Space Is Silent',
        explanation: 'Sound waves require a physical medium (atoms or molecules of gas, liquid, or solid) to transmit vibrations. Deep space is a vacuum with virtually no particles to carry sound.',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 210" width="100%" height="210" xmlns="http://www.w3.org/2000/svg">`;
          svg += `<rect x="15" y="15" width="205" height="180" rx="12" fill="#eff6ff" stroke="#93c5fd" stroke-width="2" />`;
          svg += `<rect x="240" y="15" width="205" height="180" rx="12" fill="#0f172a" stroke="#334155" stroke-width="2" />`;

          svg += `<text x="117" y="42" font-family="'Inter', sans-serif" font-size="12" font-weight="700" fill="#0369a1" text-anchor="middle">ON EARTH (Air Medium)</text>`;
          svg += `<text x="60" y="95" font-size="28" text-anchor="middle">💥</text>`;
          svg += `<path d="M85,85 Q110,65 110,95 Q110,125 85,105" fill="none" stroke="#0284c7" stroke-width="2.5" />`;
          svg += `<path d="M100,75 Q135,55 135,95 Q135,135 100,115" fill="none" stroke="#0284c7" stroke-width="2.5" />`;
          svg += `<text x="165" y="95" font-size="28" text-anchor="middle">👂</text>`;
          svg += `<rect x="50" y="145" width="135" height="24" rx="6" fill="#059669" />`;
          svg += `<text x="117" y="161" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#fff" text-anchor="middle">Air Transmits Waves</text>`;

          svg += `<text x="342" y="42" font-family="'Inter', sans-serif" font-size="12" font-weight="700" fill="#93c5fd" text-anchor="middle">IN SPACE (Vacuum)</text>`;
          svg += `<text x="285" y="95" font-size="28" text-anchor="middle">💥</text>`;
          if (!isRevealed) {
            svg += `<text x="355" y="98" font-family="'Inter', sans-serif" font-size="24" font-weight="700" fill="#94a3b8" text-anchor="middle">? 👂</text>`;
          } else {
            svg += `<line x1="315" y1="75" x2="365" y2="115" stroke="#ef4444" stroke-width="3.5" stroke-linecap="round" />`;
            svg += `<line x1="365" y1="75" x2="315" y2="115" stroke="#ef4444" stroke-width="3.5" stroke-linecap="round" />`;
            svg += `<text x="390" y="95" font-size="26" text-anchor="middle">🔇</text>`;
            svg += `<rect x="275" y="145" width="135" height="24" rx="6" fill="#dc2626" />`;
            svg += `<text x="342" y="161" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#fff" text-anchor="middle">No Sound Transmission</text>`;
          }
          svg += `</svg>`;
          return svg;
        }
      },

      {
        question: 'Astronauts float inside the International Space Station. Is there zero gravity at the altitude of the Space Station?',
        answerRaw: 'there is gravity',
        answersAccepted: ['gravity exists', 'there is gravity', 'gravity', 'still gravity', 'myth', 'false', 'yes there is gravity', 'no'],
        answerTitle: 'Answer: Gravity Is About 90% as Strong There (Continuous Free-Fall)',
        explanation: 'Earth gravity is still strong in low Earth orbit. Astronauts experience weightlessness because the station travels sideways at ~17,500 mph while falling around the curved Earth.',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 210" width="100%" height="210" xmlns="http://www.w3.org/2000/svg">`;
          svg += `<circle cx="100" cy="230" r="160" fill="#1e3a8a" stroke="#3b82f6" stroke-width="3" />`;
          svg += `<path d="M50,140 Q100,110 140,150 Q160,200 110,220 Z" fill="#10b981" />`;
          svg += `<text x="100" y="195" font-family="'Inter', sans-serif" font-size="13" font-weight="700" fill="#ffffff" text-anchor="middle">EARTH</text>`;
          svg += `<path d="M80,30 Q240,30 350,150" fill="none" stroke="#f59e0b" stroke-width="2.5" stroke-dasharray="6,6" />`;
          svg += `<text x="180" y="38" font-size="30" text-anchor="middle">🛰️</text>`;

          if (isRevealed) {
            svg += `<line x1="180" y1="20" x2="270" y2="20" stroke="#10b981" stroke-width="3" />`;
            svg += `<text x="230" y="14" font-family="'Inter', sans-serif" font-size="10" font-weight="700" fill="#059669">17,500 mph Sideways</text>`;
            svg += `<line x1="180" y1="30" x2="180" y2="85" stroke="#ef4444" stroke-width="3" />`;
            svg += `<text x="188" y="70" font-family="'Inter', sans-serif" font-size="10" font-weight="700" fill="#dc2626">Gravity Pulling Down</text>`;
            svg += `<rect x="255" y="85" width="185" height="48" rx="8" fill="#1e293b" />`;
            svg += `<text x="347" y="105" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#f59e0b" text-anchor="middle">ORBITAL FREE-FALL</text>`;
            svg += `<text x="347" y="122" font-family="'Inter', sans-serif" font-size="10" font-weight="600" fill="#cbd5e1" text-anchor="middle">Falling around Earth's curve</text>`;
          } else {
            svg += `<rect x="260" y="85" width="170" height="40" rx="8" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5" />`;
            svg += `<text x="345" y="109" font-family="'Inter', sans-serif" font-size="12" font-weight="700" fill="#475569" text-anchor="middle">Zero-G or Free-Fall?</text>`;
          }
          svg += `</svg>`;
          return svg;
        }
      },

      {
        question: 'The Moon has 1/6th of Earth’s surface gravity. If an object weighs 60 lbs on Earth, how much does it weigh on the Moon?',
        answerRaw: '10',
        answersAccepted: ['10', '10 lbs', '10 pounds', 'ten', 'ten pounds', '1/6'],
        answerTitle: 'Answer: 10 Pounds (60 ÷ 6 = 10)',
        explanation: 'Mass stays constant everywhere, but weight depends on surface gravity. One-sixth of 60 lbs is 10 lbs.',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 210" width="100%" height="210" xmlns="http://www.w3.org/2000/svg">`;
          svg += `<rect x="20" y="20" width="195" height="170" rx="12" fill="#f0fdf4" stroke="#86efac" stroke-width="2" />`;
          svg += `<text x="117" y="45" font-family="'Inter', sans-serif" font-size="13" font-weight="700" fill="#166534" text-anchor="middle">ON EARTH (1g)</text>`;
          svg += `<text x="117" y="90" font-size="34" text-anchor="middle">🧑‍🚀</text>`;
          svg += `<rect x="82" y="115" width="70" height="34" rx="6" fill="#15803d" />`;
          svg += `<text x="117" y="137" font-family="'Inter', sans-serif" font-size="15" font-weight="700" fill="#fff" text-anchor="middle">60 lbs</text>`;

          svg += `<rect x="245" y="20" width="195" height="170" rx="12" fill="#0f172a" stroke="#334155" stroke-width="2" />`;
          svg += `<text x="342" y="45" font-family="'Inter', sans-serif" font-size="13" font-weight="700" fill="#93c5fd" text-anchor="middle">ON THE MOON (1/6g)</text>`;
          svg += `<text x="342" y="90" font-size="34" text-anchor="middle">🧑‍🚀</text>`;
          if (!isRevealed) {
            svg += `<rect x="307" y="115" width="70" height="34" rx="6" fill="#334155" />`;
            svg += `<text x="342" y="137" font-family="'Inter', sans-serif" font-size="16" font-weight="700" fill="#94a3b8" text-anchor="middle">? lbs</text>`;
          } else {
            svg += `<rect x="307" y="115" width="70" height="34" rx="6" fill="#2563eb" />`;
            svg += `<text x="342" y="137" font-family="'Inter', sans-serif" font-size="15" font-weight="700" fill="#fff" text-anchor="middle">10 lbs</text>`;
            svg += `<text x="342" y="170" font-family="'Inter', sans-serif" font-size="11" font-weight="600" fill="#fbbf24" text-anchor="middle">60 ÷ 6 = 10 lbs</text>`;
          }
          svg += `</svg>`;
          return svg;
        }
      }
    ],

    // TRACK 2: AIR RESISTANCE & FRICTION (4 Problems)
    air: [
      {
        question: 'Two identical sheets of paper have the exact same mass. One is left flat and the other is crumpled into a tight ball. When dropped from the same height, which reaches the floor first?',
        answerRaw: 'ball',
        answersAccepted: ['ball', 'crumpled', 'crumpled ball', 'the ball', 'the crumpled paper', 'crumpled paper', 'paper ball'],
        answerTitle: 'Answer: The Crumpled Paper Ball',
        explanation: 'Both sheets have the same weight, but the flat sheet has a much larger cross-sectional surface area, experiencing greater upward air resistance (drag).',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 210" width="100%" height="210" xmlns="http://www.w3.org/2000/svg">`;
          svg += `<line x1="30" y1="185" x2="430" y2="185" stroke="#475569" stroke-width="3" stroke-linecap="round" />`;
          svg += `<text x="120" y="30" font-family="'Inter', sans-serif" font-size="12" font-weight="700" fill="#0369a1" text-anchor="middle">FLAT SHEET</text>`;
          if (!isRevealed) {
            svg += `<rect x="70" y="55" width="100" height="28" rx="4" fill="#ffffff" stroke="#94a3b8" stroke-width="2" />`;
          } else {
            svg += `<rect x="70" y="80" width="100" height="28" rx="4" fill="#ffffff" stroke="#94a3b8" stroke-width="2" />`;
            svg += `<path d="M80,130 L80,115 M75,122 L80,115 L85,122" stroke="#dc2626" stroke-width="2.5" />`;
            svg += `<path d="M120,130 L120,115 M115,122 L120,115 L125,122" stroke="#dc2626" stroke-width="2.5" />`;
            svg += `<path d="M160,130 L160,115 M155,122 L160,115 L165,122" stroke="#dc2626" stroke-width="2.5" />`;
            svg += `<text x="120" y="150" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#dc2626" text-anchor="middle">High Air Drag</text>`;
          }

          svg += `<text x="340" y="30" font-family="'Inter', sans-serif" font-size="12" font-weight="700" fill="#15803d" text-anchor="middle">CRUMPLED BALL</text>`;
          if (!isRevealed) {
            svg += `<circle cx="340" cy="70" r="18" fill="#ffffff" stroke="#94a3b8" stroke-width="2" />`;
          } else {
            svg += `<circle cx="340" cy="167" r="18" fill="#dcfce7" stroke="#16a34a" stroke-width="2.5" />`;
            svg += `<rect x="290" y="70" width="100" height="24" rx="6" fill="#059669" />`;
            svg += `<text x="340" y="86" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#fff" text-anchor="middle">Lands First</text>`;
          }
          svg += `</svg>`;
          return svg;
        }
      },

      {
        question: 'How does opening a wide parachute canopy slow a skydiver’s descent?',
        answerRaw: 'air resistance',
        answersAccepted: ['air resistance', 'drag', 'air', 'slows down', 'catches air', 'traps air', 'surface area'],
        answerTitle: 'Answer: Large Surface Area Increases Upward Air Drag',
        explanation: 'The wide canopy intercepts a large volume of air molecules, creating an upward drag force that opposes downward gravity.',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 210" width="100%" height="210" xmlns="http://www.w3.org/2000/svg">`;
          svg += `<path d="M150,80 C150,20 310,20 310,80 Z" fill="#ef4444" stroke="#b91c1c" stroke-width="2.5" />`;
          svg += `<path d="M190,80 C190,28 270,28 270,80 Z" fill="#fef08a" stroke="#ca8a04" stroke-width="2" />`;
          svg += `<line x1="150" y1="80" x2="230" y2="150" stroke="#94a3b8" stroke-width="1.5" />`;
          svg += `<line x1="190" y1="80" x2="230" y2="150" stroke="#94a3b8" stroke-width="1.5" />`;
          svg += `<line x1="270" y1="80" x2="230" y2="150" stroke="#94a3b8" stroke-width="1.5" />`;
          svg += `<line x1="310" y1="80" x2="230" y2="150" stroke="#94a3b8" stroke-width="1.5" />`;
          svg += `<circle cx="230" cy="155" r="8" fill="#1e293b" />`;
          svg += `<line x1="230" y1="163" x2="230" y2="185" stroke="#1e293b" stroke-width="3" />`;

          if (isRevealed) {
            svg += `<path d="M180,120 L180,90 M173,98 L180,90 L187,98" stroke="#2563eb" stroke-width="3.5" />`;
            svg += `<path d="M230,120 L230,90 M223,98 L230,90 L237,98" stroke="#2563eb" stroke-width="3.5" />`;
            svg += `<path d="M280,120 L280,90 M273,98 L280,90 L287,98" stroke="#2563eb" stroke-width="3.5" />`;
            svg += `<rect x="330" y="45" width="115" height="40" rx="6" fill="#2563eb" />`;
            svg += `<text x="387" y="63" font-family="'Inter', sans-serif" font-size="10" font-weight="700" fill="#fff" text-anchor="middle">UPWARD AIR DRAG</text>`;
            svg += `<text x="387" y="78" font-family="'Inter', sans-serif" font-size="10" font-weight="600" fill="#dbeafe" text-anchor="middle">Opposes Gravity</text>`;
          }
          svg += `</svg>`;
          return svg;
        }
      },

      {
        question: 'Why does a sled slide easily down an icy slope, but stop quickly on rough dry grass?',
        answerRaw: 'friction',
        answersAccepted: ['friction', 'friction stops it', 'ice is slippery', 'grass has friction', 'smooth vs rough', 'more friction'],
        answerTitle: 'Answer: Surface Friction',
        explanation: 'Rough grass blades create high sliding friction against the sled base, while smooth ice offers very low friction.',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 210" width="100%" height="210" xmlns="http://www.w3.org/2000/svg">`;
          svg += `<polygon points="20,180 215,80 215,180" fill="#e0f2fe" stroke="#38bdf8" stroke-width="2" />`;
          svg += `<text x="100" y="170" font-family="'Inter', sans-serif" font-size="12" font-weight="700" fill="#0284c7">Smooth Ice (Low Friction)</text>`;
          svg += `<rect x="110" y="110" width="45" height="14" rx="4" fill="#dc2626" transform="rotate(-25 110 110)" />`;

          svg += `<polygon points="245,180 440,80 440,180" fill="#dcfce7" stroke="#22c55e" stroke-width="2" />`;
          svg += `<text x="340" y="170" font-family="'Inter', sans-serif" font-size="12" font-weight="700" fill="#15803d" text-anchor="middle">Rough Grass (High Friction)</text>`;
          svg += `<rect x="335" y="110" width="45" height="14" rx="4" fill="#dc2626" transform="rotate(-25 335 110)" />`;
          if (isRevealed) {
            svg += `<rect x="155" y="20" width="150" height="30" rx="6" fill="#1e293b" />`;
            svg += `<text x="230" y="39" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#ffffff" text-anchor="middle">FRICTION RESISTS MOTION</text>`;
          }
          svg += `</svg>`;
          return svg;
        }
      },

      {
        question: 'Why is rolling a heavy crate on wheels much easier than dragging it flat across the floor?',
        answerRaw: 'rolling friction',
        answersAccepted: ['wheels', 'rolling', 'rolling friction', 'less friction', 'rotation', 'bearings'],
        answerTitle: 'Answer: Rolling Friction Is Much Lower Than Sliding Friction',
        explanation: 'Dragging scrapes the entire bottom surface across the floor. Wheels rotate so only a narrow line of contact touches the floor without scraping.',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 210" width="100%" height="210" xmlns="http://www.w3.org/2000/svg">`;
          svg += `<line x1="20" y1="165" x2="440" y2="165" stroke="#64748b" stroke-width="4" />`;
          svg += `<rect x="60" y="85" width="80" height="80" rx="4" fill="#d97706" stroke="#78350f" stroke-width="2" />`;
          svg += `<text x="100" y="130" font-family="'Inter', sans-serif" font-size="13" font-weight="700" fill="#fff" text-anchor="middle">200 LB</text>`;
          svg += `<text x="100" y="65" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#dc2626" text-anchor="middle">SLIDING</text>`;

          svg += `<rect x="280" y="85" width="80" height="60" rx="4" fill="#d97706" stroke="#78350f" stroke-width="2" />`;
          svg += `<text x="320" y="120" font-family="'Inter', sans-serif" font-size="13" font-weight="700" fill="#fff" text-anchor="middle">200 LB</text>`;
          svg += `<circle cx="295" cy="155" r="10" fill="#1e293b" stroke="#2563eb" stroke-width="2.5" />`;
          svg += `<circle cx="345" cy="155" r="10" fill="#1e293b" stroke="#2563eb" stroke-width="2.5" />`;
          svg += `<text x="320" y="65" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#059669" text-anchor="middle">ROLLING</text>`;
          if (isRevealed) {
            svg += `<text x="100" y="185" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#dc2626" text-anchor="middle">High Friction</text>`;
            svg += `<text x="320" y="185" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#059669" text-anchor="middle">Low Rolling Resistance</text>`;
          }
          svg += `</svg>`;
          return svg;
        }
      }
    ],

    // TRACK 3: DENSITY & FLUIDS (4 Problems)
    density: [
      {
        question: 'A small 1-oz pebble sinks in water, while a steel ship weighing thousands of tons floats. Why?',
        answerRaw: 'density',
        answersAccepted: ['density', 'buoyancy', 'air', 'hollow', 'air inside', 'displaces water', 'archimedes', 'water displacement'],
        answerTitle: 'Answer: Average Density & Water Displacement',
        explanation: 'The ship’s hull encloses a large volume of air, making its overall average density less than water so it displaces enough water to support its weight.',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 210" width="100%" height="210" xmlns="http://www.w3.org/2000/svg">`;
          svg += `<rect x="20" y="90" width="420" height="110" rx="10" fill="#bae6fd" stroke="#0284c7" stroke-width="2" />`;
          svg += `<text x="40" y="115" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#0369a1">WATER</text>`;
          svg += `<circle cx="80" cy="175" r="8" fill="#475569" />`;
          svg += `<text x="80" y="65" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#475569" text-anchor="middle">Solid Pebble</text>`;
          svg += `<line x1="80" y1="75" x2="80" y2="160" stroke="#dc2626" stroke-width="2" stroke-dasharray="3,3" />`;

          svg += `<polygon points="180,90 380,90 350,140 210,140" fill="#e2e8f0" stroke="#1e293b" stroke-width="2" />`;
          svg += `<text x="280" y="120" font-family="'Inter', sans-serif" font-size="12" font-weight="700" fill="#0284c7" text-anchor="middle">HOLLOW AIR VOLUME</text>`;
          svg += `<rect x="230" y="65" width="100" height="25" fill="#f8fafc" stroke="#1e293b" stroke-width="2" />`;

          if (isRevealed) {
            svg += `<path d="M240,165 L240,145 M235,152 L240,145 L245,152" stroke="#0284c7" stroke-width="2.5" />`;
            svg += `<path d="M280,165 L280,145 M275,152 L280,145 L285,152" stroke="#0284c7" stroke-width="2.5" />`;
            svg += `<path d="M320,165 L320,145 M315,152 L320,145 L325,152" stroke="#0284c7" stroke-width="2.5" />`;
            svg += `<text x="280" y="185" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#0369a1" text-anchor="middle">Upward Buoyant Force</text>`;
          }
          svg += `</svg>`;
          return svg;
        }
      },

      {
        question: 'When vegetable oil and water are poured into the same glass, they separate into two layers. Which liquid floats on top?',
        answerRaw: 'oil',
        answersAccepted: ['oil', 'cooking oil', 'vegetable oil', 'oil floats', 'oil is lighter', 'oil is less dense'],
        answerTitle: 'Answer: Oil Floats on Top of Water',
        explanation: 'Oil has a lower density (~0.92 g/cm³) than water (1.0 g/cm³), so denser water settles at the bottom while oil rises to the top.',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 210" width="100%" height="210" xmlns="http://www.w3.org/2000/svg">`;
          svg += `<rect x="80" y="25" width="120" height="160" rx="8" fill="#f8fafc" stroke="#475569" stroke-width="2.5" />`;
          if (!isRevealed) {
            svg += `<rect x="83" y="105" width="114" height="77" fill="#60a5fa" opacity="0.8" />`;
            svg += `<rect x="83" y="35" width="114" height="70" fill="#fde047" opacity="0.8" />`;
            svg += `<text x="140" y="75" font-family="'Inter', sans-serif" font-size="22" font-weight="700" fill="#854d0e" text-anchor="middle">?</text>`;
            svg += `<text x="140" y="145" font-family="'Inter', sans-serif" font-size="22" font-weight="700" fill="#1e3a8a" text-anchor="middle">?</text>`;
          } else {
            svg += `<rect x="83" y="35" width="114" height="70" fill="#fde047" opacity="0.9" />`;
            svg += `<text x="140" y="74" font-family="'Inter', sans-serif" font-size="12" font-weight="700" fill="#854d0e" text-anchor="middle">OIL (0.92 g/cm³)</text>`;
            svg += `<rect x="83" y="105" width="114" height="77" fill="#2563eb" opacity="0.9" />`;
            svg += `<text x="140" y="145" font-family="'Inter', sans-serif" font-size="12" font-weight="700" fill="#fff" text-anchor="middle">WATER (1.0 g/cm³)</text>`;
            svg += `<rect x="235" y="55" width="190" height="100" rx="10" fill="#ffffff" stroke="#cbd5e1" stroke-width="2" />`;
            svg += `<text x="330" y="85" font-family="'Inter', sans-serif" font-size="12" font-weight="700" fill="#0f172a" text-anchor="middle">DENSITY COMPARISON</text>`;
            svg += `<text x="330" y="112" font-family="'Inter', sans-serif" font-size="11" font-weight="600" fill="#475569" text-anchor="middle">Oil is less dense than water</text>`;
            svg += `<text x="330" y="134" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#059669" text-anchor="middle">Less dense liquid floats</text>`;
          }
          svg += `</svg>`;
          return svg;
        }
      },

      {
        question: 'When poured down a tilted ramp, water flows rapidly while honey moves slowly. What fluid property explains this difference?',
        answerRaw: 'viscosity',
        answersAccepted: ['viscosity', 'thick', 'thickness', 'honey is sticky', 'sticky', 'internal friction', 'viscous'],
        answerTitle: 'Answer: Viscosity (Internal Fluid Friction)',
        explanation: 'Viscosity measures a liquid’s resistance to flow. Honey has high viscosity due to friction between its concentrated sugar molecules.',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 210" width="100%" height="210" xmlns="http://www.w3.org/2000/svg">`;
          svg += `<polygon points="40,170 380,40 380,170" fill="#f1f5f9" stroke="#94a3b8" stroke-width="2" />`;
          svg += `<text x="340" y="30" font-family="'Inter', sans-serif" font-size="12" font-weight="700" fill="#0284c7">Water</text>`;
          svg += `<text x="340" y="65" font-family="'Inter', sans-serif" font-size="12" font-weight="700" fill="#b45309">Honey</text>`;

          if (!isRevealed) {
            svg += `<circle cx="320" cy="65" r="10" fill="#2563eb" />`;
            svg += `<circle cx="320" cy="90" r="10" fill="#d97706" />`;
          } else {
            svg += `<circle cx="70" cy="160" r="12" fill="#2563eb" />`;
            svg += `<text x="70" y="140" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#0369a1" text-anchor="middle">Low Viscosity</text>`;
            svg += `<path d="M290,75 Q270,85 250,90" stroke="#d97706" stroke-width="10" stroke-linecap="round" fill="none" />`;
            svg += `<text x="270" y="115" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#b45309">High Viscosity</text>`;
          }
          svg += `</svg>`;
          return svg;
        }
      },

      {
        question: 'Most substances become denser when they freeze into a solid. Why does solid ice float on liquid water?',
        answerRaw: 'less dense',
        answersAccepted: ['less dense', 'ice is less dense', 'ice expands', 'expands', 'crystals', 'air', 'density', 'hexagonal'],
        answerTitle: 'Answer: Water Expands Into a Crystalline Lattice When Frozen',
        explanation: 'Freezing water molecules arrange into a hexagonal crystal structure with open space between molecules, expanding volume by ~9% and making ice less dense than liquid water.',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 210" width="100%" height="210" xmlns="http://www.w3.org/2000/svg">`;
          svg += `<path d="M60,40 L90,180 L210,180 L240,40" fill="#f0f9ff" stroke="#38bdf8" stroke-width="2.5" />`;
          svg += `<polygon points="68,75 232,75 208,175 92,175" fill="#bae6fd" opacity="0.8" />`;
          svg += `<rect x="120" y="60" width="60" height="50" rx="6" fill="#ffffff" stroke="#0284c7" stroke-width="2" />`;
          svg += `<text x="150" y="90" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#0284c7" text-anchor="middle">ICE</text>`;

          if (isRevealed) {
            svg += `<rect x="270" y="30" width="165" height="155" rx="12" fill="#ffffff" stroke="#cbd5e1" stroke-width="2" />`;
            svg += `<text x="352" y="55" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#0369a1" text-anchor="middle">HEXAGONAL LATTICE</text>`;
            const hx = 352, hy = 110, hr = 34;
            let hexPts = '';
            for (let i = 0; i < 6; i++) {
              const a = (i * 60) * Math.PI / 180;
              hexPts += `${hx + hr * Math.cos(a)},${hy + hr * Math.sin(a)} `;
            }
            svg += `<polygon points="${hexPts}" fill="#e0f2fe" stroke="#0284c7" stroke-width="2" />`;
            svg += `<text x="352" y="170" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#059669" text-anchor="middle">Lower Density → Floats</text>`;
          }
          svg += `</svg>`;
          return svg;
        }
      }
    ],

    // TRACK 4: CHEMISTRY & MECHANICS (4 Problems)
    chemistry: [
      {
        question: 'When vinegar is mixed with baking soda inside a bottle capped with a balloon, what causes the balloon to inflate?',
        answerRaw: 'gas',
        answersAccepted: ['inflates', 'blows up', 'fills with gas', 'expands', 'gas', 'co2', 'carbon dioxide', 'balloon inflates', 'fills up'],
        answerTitle: 'Answer: Carbon Dioxide (CO₂) Gas Produced by the Reaction',
        explanation: 'Mixing an acid (vinegar) and a base (baking soda) triggers a chemical reaction that releases carbon dioxide gas, which expands to fill the balloon.',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 210" width="100%" height="210" xmlns="http://www.w3.org/2000/svg">`;
          svg += `<rect x="185" y="95" width="70" height="90" rx="8" fill="#f8fafc" stroke="#475569" stroke-width="2" />`;
          svg += `<rect x="205" y="60" width="30" height="40" fill="#f8fafc" stroke="#475569" stroke-width="2" />`;

          if (!isRevealed) {
            svg += `<path d="M210,60 C200,45 205,30 220,30 C235,30 230,45 225,60" fill="#db2777" />`;
            svg += `<rect x="188" y="160" width="64" height="22" rx="4" fill="#f1f5f9" />`;
            svg += `<text x="220" y="175" font-family="'Inter', sans-serif" font-size="10" font-weight="700" fill="#64748b" text-anchor="middle">Baking Soda</text>`;
          } else {
            svg += `<rect x="188" y="140" width="64" height="42" rx="4" fill="#dbeafe" />`;
            svg += `<circle cx="200" cy="155" r="4" fill="#2563eb" /><circle cx="215" cy="165" r="5" fill="#2563eb" /><circle cx="235" cy="150" r="4" fill="#2563eb" />`;
            svg += `<ellipse cx="220" cy="35" rx="45" ry="30" fill="#db2777" />`;
            svg += `<text x="220" y="40" font-family="'Inter', sans-serif" font-size="13" font-weight="700" fill="#fff" text-anchor="middle">CO₂ GAS</text>`;
          }
          svg += `</svg>`;
          return svg;
        }
      },

      {
        question: 'How can a 50-lb person balance a 200-lb person on a seesaw lever?',
        answerRaw: 'sit farther',
        answersAccepted: ['lever', 'sit further', 'sit farther', 'farther back', 'leverage', 'torque', 'distance', 'sit at the end', 'move back'],
        answerTitle: 'Answer: Sit 4 Times Farther from the Pivot (Fulcrum)',
        explanation: 'Torque equals Force × Distance from the fulcrum. Sitting 8 ft away with 50 lbs balances 200 lbs sitting 2 ft away (50 × 8 = 200 × 2 = 400).',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 210" width="100%" height="210" xmlns="http://www.w3.org/2000/svg">`;
          svg += `<line x1="30" y1="180" x2="430" y2="180" stroke="#475569" stroke-width="3" />`;
          svg += `<polygon points="230,130 210,180 250,180" fill="#64748b" />`;
          svg += `<line x1="50" y1="130" x2="410" y2="130" stroke="#d97706" stroke-width="7" stroke-linecap="round" />`;
          if (!isRevealed) {
            svg += `<rect x="65" y="95" width="50" height="30" rx="6" fill="#2563eb" />`;
            svg += `<text x="90" y="114" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#fff" text-anchor="middle">50 lb</text>`;
            svg += `<rect x="345" y="85" width="60" height="40" rx="6" fill="#475569" />`;
            svg += `<text x="375" y="109" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#fff" text-anchor="middle">200 lb</text>`;
          } else {
            svg += `<rect x="55" y="95" width="55" height="30" rx="6" fill="#059669" />`;
            svg += `<text x="82" y="114" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#fff" text-anchor="middle">50 lb</text>`;
            svg += `<text x="82" y="150" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#047857" text-anchor="middle">8 ft × 50 = 400</text>`;
            svg += `<rect x="260" y="85" width="60" height="40" rx="6" fill="#475569" />`;
            svg += `<text x="290" y="109" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#fff" text-anchor="middle">200 lb</text>`;
            svg += `<text x="290" y="150" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#b45309" text-anchor="middle">2 ft × 200 = 400</text>`;
          }
          svg += `</svg>`;
          return svg;
        }
      },

      {
        question: 'A burning candle sits in a shallow dish of water and is covered by an inverted glass jar. What happens to the water level after the flame goes out?',
        answerRaw: 'water rises',
        answersAccepted: ['water rises', 'water goes up', 'sucks water', 'rises', 'vacuum', 'pressure', 'water gets sucked up'],
        answerTitle: 'Answer: Water Rises Inside the Jar',
        explanation: 'When the flame goes out, the heated gas inside cools and contracts, lowering the pressure inside the jar so outside atmospheric pressure pushes water up.',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 210" width="100%" height="210" xmlns="http://www.w3.org/2000/svg">`;
          svg += `<ellipse cx="230" cy="180" rx="140" ry="18" fill="#e0f2fe" stroke="#38bdf8" stroke-width="2" />`;
          svg += `<rect x="175" y="45" width="110" height="135" rx="10" fill="rgba(255,255,255,0.7)" stroke="#64748b" stroke-width="2" />`;
          svg += `<rect x="218" y="130" width="24" height="40" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5" />`;
          if (!isRevealed) {
            svg += `<circle cx="230" cy="120" r="7" fill="#f97316" />`;
          } else {
            svg += `<rect x="177" y="125" width="106" height="53" fill="#3b82f6" opacity="0.65" />`;
            svg += `<text x="230" y="90" font-family="'Inter', sans-serif" font-size="12" font-weight="700" fill="#1d4ed8" text-anchor="middle">Water Level Rises ⬆</text>`;
          }
          svg += `</svg>`;
          return svg;
        }
      },

      {
        question: 'When sugar crystals are stirred into warm water until they are no longer visible, what has happened to the sugar?',
        answerRaw: 'dissolved',
        answersAccepted: ['dissolved', 'in the water', 'in the tea', 'still there', 'it dissolved', 'molecules', 'separated'],
        answerTitle: 'Answer: The Sugar Dissolved Into Individual Molecules',
        explanation: 'The sugar is still present in the solution; water molecules surround and separate the sugar molecules so they are evenly dispersed.',
        render: (isRevealed) => {
          let svg = `<svg viewBox="0 0 460 210" width="100%" height="210" xmlns="http://www.w3.org/2000/svg">`;
          svg += `<path d="M70,80 L80,160 L160,160 L170,80" fill="#fef3c7" stroke="#d97706" stroke-width="2" />`;
          if (!isRevealed) {
            svg += `<rect x="110" y="50" width="20" height="20" rx="3" fill="#ffffff" stroke="#94a3b8" stroke-width="2" />`;
            svg += `<text x="120" y="35" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#475569" text-anchor="middle">Sugar Cube</text>`;
          } else {
            svg += `<circle cx="320" cy="110" r="72" fill="#f0f9ff" stroke="#2563eb" stroke-width="2.5" />`;
            svg += `<text x="320" y="60" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#0369a1" text-anchor="middle">MOLECULAR SOLUTION</text>`;
            svg += `<circle cx="300" cy="100" r="10" fill="#db2777" /><circle cx="340" cy="120" r="10" fill="#db2777" />`;
            svg += `<circle cx="280" cy="95" r="5" fill="#2563eb" /><circle cx="315" cy="85" r="5" fill="#2563eb" /><circle cx="305" cy="120" r="5" fill="#2563eb" /><circle cx="355" cy="105" r="5" fill="#2563eb" /><circle cx="330" cy="140" r="5" fill="#2563eb" />`;
            svg += `<text x="320" y="165" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#059669" text-anchor="middle">Evenly Dissolved</text>`;
          }
          svg += `</svg>`;
          return svg;
        }
      }
    ]
  };


// Global Exports
(typeof window !== "undefined" ? window : global).SCIENCE_SLIDES = SCIENCE_SLIDES;
