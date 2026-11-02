import type { ChapterDiagram, DetailedFormula, DetailedTopicNote } from '../types.ts';

interface ChapterEnrichmentData {
  formulaSheet: DetailedFormula[];
  diagrams: ChapterDiagram[];
  detailedNotes: DetailedTopicNote[];
}

export const CHAPTER_ENRICHMENTS: Record<string, ChapterEnrichmentData> = {
  // =========================================================================
  // PHYSICS
  // =========================================================================
  'units-and-measurements': {
    formulaSheet: [
      {
        name: 'Principle of Homogeneity',
        formula: '[\\text{LHS}] = [\\text{RHS}]',
        conditions: 'Valid for all physically correct equations without exception.',
        variables: [{ symbol: 'LHS/RHS', meaning: 'Dimensional powers of M, L, T, I, θ' }],
        commonMistake: 'Arguments of trigonometric (sin θ), logarithmic (ln x), and exponential (e^x) functions are dimensionless.'
      },
      {
        name: 'Percentage Error in Power Products',
        formula: '\\frac{\\Delta Z}{Z} = a\\frac{\\Delta A}{A} + b\\frac{\\Delta B}{B} + c\\frac{\\Delta C}{C}',
        conditions: 'Applicable for Z = (A^a · B^b) / C^c for small fractional errors (< 5%).',
        variables: [
          { symbol: 'ΔZ/Z', meaning: 'Fractional error in dependent quantity' },
          { symbol: 'a, b, c', meaning: 'Exponents of independent quantities' }
        ],
        commonMistake: 'Fractional errors are ALWAYS added, never subtracted even when variables appear in denominator.'
      },
      {
        name: 'Vernier Caliper Reading & Least Count',
        formula: 'LC = 1\\text{ MSD} - 1\\text{ VSD} = \\frac{1\\text{ MSD}}{N},\\quad \\text{Reading} = \\text{MSR} + (\\text{VSR} \\times LC) - (\\pm Z_e)',
        siUnit: 'm (or cm/mm)',
        dimensions: 'L',
        conditions: 'Linear scales aligned without tilt; temperature within calibration standard.',
        variables: [
          { symbol: 'MSD', meaning: 'Main Scale Division length' },
          { symbol: 'VSD', meaning: 'Vernier Scale Division length' },
          { symbol: 'Ze', meaning: 'Zero Error (+ve if 0 of VSR is right of 0 of MSR)' }
        ],
        commonMistake: 'Positive zero error must be SUBTRACTED; negative zero error must be ADDED.'
      },
      {
        name: 'Screw Gauge Reading & Pitch',
        formula: 'LC = \\frac{\\text{Pitch}}{N_{\\text{circular divisions}}},\\quad \\text{Reading} = \\text{PSR} + (\\text{CSR} \\times LC) - (\\pm Z_e)',
        siUnit: 'm (or mm)',
        dimensions: 'L',
        conditions: 'Ratcheted spindle rotation; backlash error avoided by turning in single direction.',
        variables: [
          { symbol: 'Pitch', meaning: 'Linear distance moved in 1 full rotation' },
          { symbol: 'N', meaning: 'Total divisions on circular thimble' }
        ]
      }
    ],
    diagrams: [
      {
        id: 'vernier-diag',
        title: 'Vernier Calipers & Zero Error Alignment',
        category: 'Instruments',
        caption: 'Measurement principle showing Main Scale Reading (MSR) and Coinciding Vernier Division (VSR). Positive and negative zero error offsets illustrated.',
        svgType: 'vernier-screw-gauge',
        labels: [
          { label: 'MSR', description: 'Main scale reading before the zero of vernier' },
          { label: 'VSR', description: 'Coinciding division multiplied by Least Count' }
        ],
        formula: '\\text{Observed} = \\text{MSR} + (\\text{VSR} \\times LC) - \\text{Zero Error}'
      }
    ],
    detailedNotes: [
      {
        title: 'Dimensional Analysis & Applications',
        summary: 'Dimensions represent the fundamental powers of base quantities (M, L, T, I, Θ, N, J) defining any physical quantity.',
        keyPoints: [
          'Checking dimensional consistency of equations.',
          'Converting numerical values across unit systems: n1 [u1] = n2 [u2].',
          'Deducing functional relations between interdependent physical variables.'
        ],
        derivationSnippet: 'n_2 = n_1 \\left[\\frac{M_1}{M_2}\\right]^a \\left[\\frac{L_1}{L_2}\\right]^b \\left[\\frac{T_1}{T_2}\\right]^c',
        examTip: 'Remember: Quantities with identical dimensions include: Work, Energy, Torque [ML²T⁻²]; Angular momentum, Planck constant [ML²T⁻¹]; Frequency, Angular velocity, Velocity gradient [T⁻¹].'
      }
    ]
  },

  'kinematics': {
    formulaSheet: [
      {
        name: 'Displacement in n-th Second',
        formula: 'S_n = u + \\frac{a}{2}(2n - 1)',
        siUnit: 'm',
        dimensions: 'L',
        conditions: 'Valid strictly for constant, uniform acceleration along a straight line.',
        variables: [
          { symbol: 'u', meaning: 'Initial velocity at t = 0' },
          { symbol: 'a', meaning: 'Uniform acceleration' },
          { symbol: 'n', meaning: 'Specific second index (1, 2, 3...)' }
        ],
        commonMistake: 'Do not confuse total displacement in n seconds S(n) = un + 1/2 a n² with displacement in the n-th second Sn.'
      },
      {
        name: 'Horizontal Projectile Range & Max Height',
        formula: 'R = \\frac{u^2\\sin 2\\theta}{g},\\quad H_{\\max} = \\frac{u^2\\sin^2\\theta}{2g},\\quad T = \\frac{2u\\sin\\theta}{g}',
        siUnit: 'm (Range, Height), s (Time)',
        dimensions: 'L (R, H), T (Time)',
        conditions: 'Flat ground-to-ground projection with negligible air resistance and constant downward g.',
        variables: [
          { symbol: 'u', meaning: 'Initial speed of projection' },
          { symbol: 'θ', meaning: 'Angle of projection with horizontal' },
          { symbol: 'g', meaning: 'Acceleration due to gravity (9.8 or 10 m/s²)' }
        ],
        specialCase: 'Maximum range R_max = u² / g occurs at θ = 45°. At complementary angles (θ and 90°-θ), Range R is identical.'
      },
      {
        name: 'Trajectory Equation (Direct Range Form)',
        formula: 'y = x\\tan\\theta\\left(1 - \\frac{x}{R}\\right)',
        conditions: 'Origin chosen at point of projection with flat ground landing at x = R.',
        variables: [
          { symbol: 'x, y', meaning: 'Instantaneous coordinates of the projectile' },
          { symbol: 'R', meaning: 'Total horizontal range' }
        ],
        commonMistake: 'Super-fast formula to find coordinates or angle of projection when range R and one coordinate (x, y) are given.'
      },
      {
        name: 'Relative Velocity in 2D',
        formula: '\\vec{v}_{AB} = \\vec{v}_A - \\vec{v}_B,\\quad \\vec{a}_{AB} = \\vec{a}_A - \\vec{a}_B',
        siUnit: 'm/s',
        dimensions: 'LT⁻¹',
        conditions: 'Valid in all inertial and relative reference frames.',
        variables: [
          { symbol: 'v_AB', meaning: 'Velocity of body A with respect to body B' }
        ]
      }
    ],
    diagrams: [
      {
        id: 'proj-diag',
        title: 'Projectile Motion Trajectory & Coordinate Vectors',
        category: 'Kinematics',
        caption: 'Parabolic path illustrating initial velocity components, highest point horizontal velocity (vy = 0), maximum height, and horizontal range R.',
        svgType: 'kinematics-projectile',
        labels: [
          { label: 'H_max', description: 'Maximum vertical elevation reached by projectile' },
          { label: 'Range R', description: 'Total horizontal displacement along ground' },
          { label: 'Apex', description: 'Velocity is purely horizontal: v = u cos θ' }
        ],
        formula: 'y = x\\tan\\theta - \\frac{g x^2}{2u^2\\cos^2\\theta}'
      }
    ],
    detailedNotes: [
      {
        title: 'Kinematics of Variable Acceleration',
        summary: 'When acceleration is a function of time a(t), position a(x), or velocity a(v), calculus integrals must be used instead of standard kinematic formulas.',
        keyPoints: [
          'If a = f(t): integrate dv = a(t) dt to find v(t).',
          'If a = f(x): express a = v (dv/dx), leading to ∫ v dv = ∫ f(x) dx.',
          'If a = f(v): express dt = dv / f(v) or dx = v dv / f(v).'
        ],
        derivationSnippet: 'a = \\frac{dv}{dt} = \\frac{dv}{dx}\\frac{dx}{dt} = v\\frac{dv}{dx} \\implies \\int_{v_0}^v v\\,dv = \\int_{x_0}^x a(x)\\,dx',
        examTip: 'Area under a-t graph gives CHANGE in velocity (Δv = v_f - v_i), not velocity itself.'
      }
    ]
  },

  'laws-of-motion': {
    formulaSheet: [
      {
        name: 'Limiting & Kinetic Friction',
        formula: 'f_s \\le \\mu_s N,\\quad f_k = \\mu_k N',
        siUnit: 'N (Newton)',
        dimensions: 'MLT⁻²',
        conditions: 'Normal reaction N acts perpendicular to contact surface; static friction is self-adjusting between 0 and μs N.',
        variables: [
          { symbol: 'μs, μk', meaning: 'Coefficients of static and kinetic friction (μs > μk)' },
          { symbol: 'N', meaning: 'Normal contact force' }
        ]
      },
      {
        name: 'Maximum Safe Speed on Banked Road (with Friction)',
        formula: 'v_{\\max} = \\sqrt{rg\\left(\\frac{\\tan\\theta + \\mu}{1 - \\mu\\tan\\theta}\\right)},\\quad v_{\\min} = \\sqrt{rg\\left(\\frac{\\tan\\theta - \\mu}{1 + \\mu\\tan\\theta}\\right)}',
        siUnit: 'm/s',
        dimensions: 'LT⁻¹',
        conditions: 'Road inclined at angle θ with horizontal; curve radius r; friction coefficient μ.',
        variables: [{ symbol: 'r', meaning: 'Radius of circular turn' }, { symbol: 'θ', meaning: 'Banking angle' }]
      },
      {
        name: 'Vertical Circle Critical Velocities (String)',
        formula: 'v_{\\text{bottom}} = \\sqrt{5gl},\\quad v_{\\text{top}} = \\sqrt{gl},\\quad T_{\\text{bottom}} - T_{\\text{top}} = 6mg',
        siUnit: 'm/s (velocity), N (tension)',
        conditions: 'Inextensible massless string of length l supporting point mass m under constant downward gravity.',
        variables: [{ symbol: 'l', meaning: 'String length/radius' }]
      }
    ],
    diagrams: [
      {
        id: 'fbd-diag',
        title: 'Free Body Diagram of Block on Inclined Plane',
        category: 'Dynamics',
        caption: 'Resolution of gravity into normal (mg cos θ) and tangential (mg sin θ) components alongside normal reaction N and friction force f.',
        svgType: 'fbd-incline',
        labels: [
          { label: 'Normal Force N', description: 'Perpendicular support force balancing mg cos θ' },
          { label: 'Driving Force', description: 'Downhill tangential component mg sin θ' },
          { label: 'Friction f', description: 'Opposes relative sliding motion along incline' }
        ],
        formula: 'N = mg\\cos\\theta,\\quad a = g(\\sin\\theta - \\mu\\cos\\theta)'
      }
    ],
    detailedNotes: [
      {
        title: 'Constraint Relations & Non-Inertial Reference Frames',
        summary: 'String and wedge constraints reduce degrees of freedom. In accelerating reference frames, pseudo forces must be applied.',
        keyPoints: [
          'Work method for string constraints: ∑ (T_i · a_i) = 0 for ideal taut inextensible strings.',
          'Wedge constraint: components of velocity/acceleration perpendicular to the contacting surface are equal.',
          'Pseudo force acts through center of mass in direction opposite to frame acceleration: F_pseudo = -m a_frame.'
        ],
        examTip: 'To decide whether two stacked blocks slide together, compute common acceleration assuming no slip: a = F / (m1 + m2). If required friction exceeds μs N, blocks slip!'
      }
    ]
  },

  'thermodynamics-physics': {
    formulaSheet: [
      {
        name: 'First Law of Thermodynamics',
        formula: '\\Delta Q = \\Delta U + \\Delta W,\\quad \\Delta U = n C_v \\Delta T',
        siUnit: 'J (Joule)',
        dimensions: 'ML²T⁻²',
        conditions: 'Valid for all closed thermodynamic processes; U is a state function depending only on temperature.',
        variables: [
          { symbol: 'ΔQ', meaning: 'Heat added to the system (+ve if absorbed)' },
          { symbol: 'ΔW', meaning: 'Work done by the system (+ve for expansion)' },
          { symbol: 'Cv', meaning: 'Molar heat capacity at constant volume = R / (γ - 1)' }
        ]
      },
      {
        name: 'Work Done in Thermodynamic Processes',
        formula: 'W_{\\text{iso}} = nRT\\ln\\frac{V_2}{V_1},\\quad W_{\\text{adia}} = \\frac{P_1V_1 - P_2V_2}{\\gamma - 1} = \\frac{nR(T_1 - T_2)}{\\gamma - 1}',
        siUnit: 'J',
        dimensions: 'ML²T⁻²',
        conditions: 'Ideal gas undergoing quasi-static reversible expansion or compression.',
        variables: [{ symbol: 'γ', meaning: 'Heat capacity ratio Cp/Cv = 1 + 2/f' }]
      },
      {
        name: 'Carnot Engine Efficiency & Refrigerator COP',
        formula: '\\eta = 1 - \\frac{T_L}{T_H} = \\frac{W}{Q_H},\\quad \\beta = \\frac{Q_L}{W} = \\frac{T_L}{T_H - T_L} = \\frac{1 - \\eta}{\\eta}',
        conditions: 'Reversible Carnot cycle operating between high reservoir TH and low reservoir TL (Kelvin only).',
        variables: [{ symbol: 'TH, TL', meaning: 'Source and sink temperatures in Kelvin' }]
      }
    ],
    diagrams: [
      {
        id: 'carnot-diag',
        title: 'Carnot Cycle on PV Indicator Diagram',
        category: 'Thermodynamics',
        caption: 'Four reversible stages: 1-2 Isothermal Expansion (TH), 2-3 Adiabatic Expansion, 3-4 Isothermal Compression (TL), 4-1 Adiabatic Compression.',
        svgType: 'carnot-pv',
        labels: [
          { label: 'Enclosed Area', description: 'Net work output W per complete cycle' },
          { label: 'Isothermal Stages', description: 'Heat exchange occurs at constant temperature' },
          { label: 'Adiabatic Stages', description: 'Zero heat exchange (dQ = 0); temperature changes' }
        ],
        formula: '\\eta = 1 - \\frac{T_L}{T_H}'
      }
    ],
    detailedNotes: [
      {
        title: 'Second Law & Entropy Relationships',
        summary: 'Heat cannot spontaneously flow from colder to hotter body without external work. In reversible cycle ∮ dQ/T = 0.',
        keyPoints: [
          'Entropy change in ideal gas: ΔS = n Cv ln(T2/T1) + n R ln(V2/V1).',
          'Adiabatic process has ΔS = 0 (isentropic process).',
          'Slope of adiabatic curve on PV diagram is steeper than isothermal: (dP/dV)_adia = γ (dP/dV)_iso.'
        ],
        examTip: 'Carnot efficiency depends ONLY on absolute temperatures TH and TL, never on the working substance.'
      }
    ]
  },

  'optics': {
    formulaSheet: [
      {
        name: 'Lens Maker\'s Formula & Thin Lens Equation',
        formula: '\\frac{1}{f} = (\\mu - 1)\\left(\\frac{1}{R_1} - \\frac{1}{R_2}\\right),\\quad \\frac{1}{v} - \\frac{1}{u} = \\frac{1}{f}',
        siUnit: 'm (focal length), Dioptre (Power P = 1/f in meters)',
        dimensions: 'L',
        conditions: 'Thin spherical lenses in paraxial approximation with Cartesian sign convention.',
        variables: [
          { symbol: 'μ', meaning: 'Relative refractive index of lens with respect to medium' },
          { symbol: 'R1, R2', meaning: 'Radii of curvature of first and second refracting surfaces' }
        ]
      },
      {
        name: 'Prism Refractive Index & Minimum Deviation',
        formula: '\\mu = \\frac{\\sin\\left(\\frac{A + \\delta_m}{2}\\right)}{\\sin(A/2)},\\quad \\delta_m = 2i - A',
        conditions: 'Symmetric ray path at minimum deviation: angle of incidence i equals angle of emergence e.',
        variables: [{ symbol: 'A', meaning: 'Angle of prism' }, { symbol: 'δm', meaning: 'Angle of minimum deviation' }]
      },
      {
        name: 'Young\'s Double Slit Interference (YDSE)',
        formula: '\\beta = \\frac{\\lambda D}{d},\\quad y_n = n\\frac{\\lambda D}{d}\\text{ (Bright)},\\quad y_n = \\left(n - \\frac{1}{2}\\right)\\frac{\\lambda D}{d}\\text{ (Dark)}',
        siUnit: 'm (Fringe width β)',
        dimensions: 'L',
        conditions: 'Coherent monochromatic light sources; d << D; paraxial approximation (y << D).',
        variables: [
          { symbol: 'd', meaning: 'Distance between slits' },
          { symbol: 'D', meaning: 'Distance from slits to screen' },
          { symbol: 'λ', meaning: 'Wavelength of light' }
        ]
      }
    ],
    diagrams: [
      {
        id: 'optics-diag',
        title: 'Convex Lens Image Formation & Ray Geometry',
        category: 'Geometrical Optics',
        caption: 'Ray tracing through convex lens: parallel ray refracts through principal focus F2; central ray passes undeviated through optical center O.',
        svgType: 'optics-diagram',
        labels: [
          { label: 'Object at 2F1', description: 'Produces equal-sized real inverted image at 2F2' },
          { label: 'Focal Length f', description: 'Distance from optical center O to principal focus' }
        ],
        formula: '\\frac{1}{v} - \\frac{1}{u} = \\frac{1}{f},\\quad m = \\frac{v}{u}'
      }
    ],
    detailedNotes: [
      {
        title: 'Wave Optics: Interference & Diffraction Bounds',
        summary: 'Interference arises from superposition of waves from coherent sources; diffraction is bending of light around obstacles.',
        keyPoints: [
          'Shift due to thin mica sheet of thickness t in YDSE: Δy = (μ - 1) t D / d.',
          'Single slit diffraction first minimum condition: a sin θ = λ; central bright fringe width W = 2λD / a.',
          'Resolving power of telescope = D / (1.22 λ); microscope = 2μ sin θ / λ.'
        ],
        examTip: 'Remember: In YDSE, if white light is used, the central fringe is white, while colored fringes appear on either side (violet closest, red farthest).'
      }
    ]
  },

  // =========================================================================
  // CHEMISTRY
  // =========================================================================
  'atomic-structure': {
    formulaSheet: [
      {
        name: 'Bohr Hydrogen Orbit Energy & Radius',
        formula: 'E_n = -13.6\\frac{Z^2}{n^2}\\text{ eV},\\quad r_n = 0.529\\frac{n^2}{Z}\\text{ \\AA}',
        siUnit: 'eV (or Joules: 1 eV = 1.6 × 10⁻¹⁹ J)',
        conditions: 'Strictly valid for single-electron hydrogenic ions (H, He+, Li2+, Be3+).',
        variables: [{ symbol: 'Z', meaning: 'Atomic number' }, { symbol: 'n', meaning: 'Principal quantum number' }]
      },
      {
        name: 'Rydberg Formula for Spectral Transitions',
        formula: '\\frac{1}{\\lambda} = R_H Z^2\\left(\\frac{1}{n_1^2} - \\frac{1}{n_2^2}\\right)',
        siUnit: 'm⁻¹ (Wavenumber ν̄ = 1/λ)',
        conditions: 'Strictly valid for transitions with n2 > n1 in hydrogen-like one-electron atoms/ions.',
        variables: [{ symbol: 'RH', meaning: 'Rydberg constant = 1.097 × 10⁷ m⁻¹' }]
      },
      {
        name: 'Radial & Angular Nodes Formula',
        formula: '\\text{Radial Nodes} = n - l - 1,\\quad \\text{Angular Nodes} = l,\\quad \\text{Total Nodes} = n - 1',
        conditions: 'Atomic orbitals defined by quantum numbers n and l.',
        variables: [{ symbol: 'l', meaning: 'Azimuthal quantum number (s=0, p=1, d=2, f=3)' }]
      }
    ],
    diagrams: [
      {
        id: 'atomic-diag',
        title: 'Radial Probability Distribution Curves 4πr²R²(r)',
        category: 'Atomic Orbitals',
        caption: 'Radial probability density curves for 1s, 2s, and 3s orbitals illustrating the emergence of radial nodes where probability of finding electron drops to zero.',
        svgType: 'atomic-radial',
        labels: [
          { label: '1s Orbital', description: 'Zero radial nodes (n-l-1 = 0)' },
          { label: '2s Orbital', description: 'One radial node at r ≈ 2 a0' },
          { label: '3s Orbital', description: 'Two radial nodes' }
        ],
        formula: '\\text{Radial Nodes} = n - l - 1'
      }
    ],
    detailedNotes: [
      {
        title: 'Quantum Mechanical Principles & Rules',
        summary: 'Four quantum numbers (n, l, m, s) define electronic states governed by Aufbau, Pauli Exclusion, and Hund rules.',
        keyPoints: [
          'Aufbau: Fill orbitals in increasing order of (n + l); if identical, lower n fills first.',
          'Pauli: No two electrons in an atom can have the same four quantum numbers.',
          'Hund: Pairing does not occur in degenerate orbitals until each orbital has one electron with parallel spin.'
        ],
        examTip: 'Half-filled and fully-filled subshells have extra stability due to symmetrical distribution and maximum exchange energy: Cr is [Ar] 3d⁵ 4s¹, Cu is [Ar] 3d¹⁰ 4s¹.'
      }
    ]
  },

  'redox-and-electrochemistry': {
    formulaSheet: [
      {
        name: 'Nernst Equation at 298 K',
        formula: 'E_{\\text{cell}} = E^\\circ_{\\text{cell}} - \\frac{0.0591}{n}\\log_{10} Q',
        siUnit: 'V (Volts)',
        conditions: 'Valid at standard ambient temperature T = 298.15 K (25°C).',
        variables: [
          { symbol: 'E°cell', meaning: 'Standard cell potential = E°cathode - E°anode' },
          { symbol: 'n', meaning: 'Number of electrons transferred in balanced cell reaction' },
          { symbol: 'Q', meaning: 'Reaction quotient [Products]^p / [Reactants]^r' }
        ],
        commonMistake: 'Pure solids and pure liquids have unit activity and must be omitted from Q.'
      },
      {
        name: 'Gibbs Free Energy & Cell Potential',
        formula: '\\Delta G^\\circ = -n F E^\\circ_{\\text{cell}},\\quad \\Delta G^\\circ = -2.303 RT\\log K_{\\text{eq}}',
        siUnit: 'J/mol',
        conditions: 'Equilibrium reached when E_cell = 0 and ΔG = 0.',
        variables: [{ symbol: 'F', meaning: 'Faraday constant ≈ 96485 C/mol' }]
      },
      {
        name: 'Kohlrausch\'s Law of Independent Migration',
        formula: '\\Lambda_m^\\circ = \\nu_+ \\lambda_+^\\circ + \\nu_- \\lambda_-^\\circ,\\quad \\alpha = \\frac{\\Lambda_m}{\\Lambda_m^\\circ}',
        siUnit: 'S·cm²·mol⁻¹',
        conditions: 'Applies at infinite dilution where interionic interactions become negligible.',
        variables: [{ symbol: 'α', meaning: 'Degree of dissociation of weak electrolyte' }]
      }
    ],
    diagrams: [
      {
        id: 'cell-diag',
        title: 'Galvanic Daniell Cell Architecture',
        category: 'Electrochemistry',
        caption: 'Zinc anode in ZnSO4 and Copper cathode in CuSO4 linked by external circuit and inverted salt bridge maintaining electrical neutrality.',
        svgType: 'daniell-cell',
        labels: [
          { label: 'Anode (Zn)', description: 'Zn(s) → Zn²⁺ + 2e⁻ (Oxidation occurs here)' },
          { label: 'Cathode (Cu)', description: 'Cu²⁺ + 2e⁻ → Cu(s) (Reduction occurs here)' },
          { label: 'Salt Bridge', description: 'Contains inert KCl or KNO3 in agar-agar to eliminate liquid junction potential' }
        ],
        formula: 'E^\\circ_{\\text{cell}} = E^\\circ_{\\text{cathode}} - E^\\circ_{\\text{anode}} = +0.34 - (-0.76) = +1.10\\text{ V}'
      }
    ],
    detailedNotes: [
      {
        title: 'Electrolytic Conductance & Electrolysis Laws',
        summary: 'Conductivity κ decreases upon dilution, but molar conductivity Λm increases due to decrease in interionic friction.',
        keyPoints: [
          'Faraday 1st Law: Mass deposited w = Z I t = (E / 96500) I t.',
          'Debye-Hückel-Onsager equation for strong electrolytes: Λm = Λm° - A √C.',
          'Primary batteries (Leclanché dry cell) cannot be recharged; Secondary batteries (Lead storage battery) are rechargeable.'
        ],
        examTip: 'During recharging of lead storage battery, reactions are reversed: PbSO4 on both electrodes is converted back into Pb and PbO2.'
      }
    ]
  },

  // =========================================================================
  // MATHEMATICS
  // =========================================================================
  'coordinate-geometry': {
    formulaSheet: [
      {
        name: 'Slope Form Tangents to Conics',
        formula: 'y = mx \\pm a\\sqrt{1 + m^2}\\text{ (Circle)},\\quad y = mx + \\frac{a}{m}\\text{ (Parabola } y^2=4ax)',
        conditions: 'm is real slope of tangent (m ≠ 0 for parabola).',
        variables: [{ symbol: 'm', meaning: 'Slope of tangent line' }, { symbol: 'a', meaning: 'Radius or focal parameter' }],
        specialCase: 'For ellipse x²/a² + y²/b² = 1: y = mx ± √(a²m² + b²); For hyperbola: y = mx ± √(a²m² - b²).'
      },
      {
        name: 'Eccentricity & Latus Rectum of Conics',
        formula: 'e_{\\text{ellipse}} = \\sqrt{1 - \\frac{b^2}{a^2}},\\quad e_{\\text{hyperbola}} = \\sqrt{1 + \\frac{b^2}{a^2}},\\quad \\text{LR} = \\frac{2b^2}{a}',
        conditions: 'Standard conics centered at origin with major/transverse axis along x-axis.',
        variables: [{ symbol: 'e', meaning: 'Eccentricity (Ellipse e < 1, Parabola e = 1, Hyperbola e > 1)' }]
      },
      {
        name: 'Chord with Given Midpoint (x1, y1)',
        formula: 'T = S_1',
        conditions: 'Universal formula for circle, parabola, ellipse, and hyperbola.',
        variables: [
          { symbol: 'T', meaning: 'Tangent expression at (x1, y1)' },
          { symbol: 'S1', meaning: 'Curve equation evaluated at (x1, y1)' }
        ]
      }
    ],
    diagrams: [
      {
        id: 'conic-diag',
        title: 'Parabola y² = 4ax & Geometric Attributes',
        category: 'Conic Sections',
        caption: 'Focus S(a, 0), directrix x = -a, latus rectum length 4a, and parametric tangent ty = x + at².',
        svgType: 'conic-parabola',
        labels: [
          { label: 'Focus S(a, 0)', description: 'Fixed point of the conic' },
          { label: 'Directrix', description: 'Fixed line x = -a; distance to curve equals distance to focus (e = 1)' },
          { label: 'Latus Rectum', description: 'Focal chord perpendicular to axis of length 4a' }
        ],
        formula: 'y^2 = 4ax,\\quad e = 1'
      }
    ],
    detailedNotes: [
      {
        title: 'Director Circle & Orthogonal Tangents',
        summary: 'Locus of intersection point of mutually perpendicular tangents to a conic section.',
        keyPoints: [
          'Circle x² + y² = a²: Director circle is x² + y² = 2a².',
          'Parabola y² = 4ax: Director circle degenerates into the Directrix x = -a.',
          'Ellipse x²/a² + y²/b² = 1: Director circle is x² + y² = a² + b².',
          'Hyperbola x²/a² - y²/b² = 1: Director circle is x² + y² = a² - b² (real if a > b).'
        ],
        examTip: 'Perpendicular tangents to a parabola ALWAYS intersect on its directrix x = -a!'
      }
    ]
  }
};

export const getEnrichmentForChapter = (chapterId: string): ChapterEnrichmentData | undefined => {
  return CHAPTER_ENRICHMENTS[chapterId];
};
