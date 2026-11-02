import type { ChapterMindMap } from '../types.ts';

export const ALL_CHAPTER_MIND_MAPS: ChapterMindMap[] = [
  // =========================================================================
  // PHYSICS (21 Chapters)
  // =========================================================================
  {
    id: 'units-and-measurements',
    chapterNumber: 1,
    subject: 'Physics',
    title: 'Units and Measurements',
    tagline: 'Dimensional Analysis, Errors in Measurement & Significant Figures',
    centerConcept: {
      title: 'Units & Error Propagation',
      coreDefinition: 'Quantitative measurement of physical quantities via standard fundamental units, dimensional homogeneity, and error analysis.',
      keyLaw: 'Principle of Homogeneity: Dimensions of all terms on both sides of a physical equation must be identical.'
    },
    weightage: '4 Marks (1 Question guaranteed)',
    difficulty: 'Easy',
    estimatedRevisionTime: '1 min Quick / 8 min Deep',
    oneMinuteSummary: {
      keyFormulas: [
        { name: 'Relative & Percentage Error', formula: '\\frac{\\Delta Z}{Z} = a\\frac{\\Delta A}{A} + b\\frac{\\Delta B}{B}', note: 'For Z = A^a B^b' },
        { name: 'Vernier Caliper LC', formula: 'LC = 1\\text{ MSD} - 1\\text{ VSD} = \\frac{1\\text{ MSD}}{N}', note: 'N = Total VSD divisions' },
        { name: 'Screw Gauge LC', formula: 'LC = \\frac{\\text{Pitch}}{\\text{Total Circular Scale Divisions}}', note: 'Pitch = linear advance per rev' }
      ],
      mustRememberPoints: [
        'Principle of Homogeneity: trigonometric, exponential and logarithmic arguments are dimensionless.',
        'Maximum permissible fractional error in Z = A^a / B^b is always additive: ΔZ/Z = a(ΔA/A) + b(ΔB/B).',
        'Leading zeroes are never significant; trailing zeroes after decimal are significant.'
      ],
      commonPitfalls: [
        'Never subtract percentage errors even if terms are divided or subtracted.',
        'Zero error must be subtracted algebraically from measured reading (Observed = Main + Coinciding × LC - Zero Error).'
      ],
      speedTricks: [
        'If percentage error in radius r is x%, percentage error in volume V (4/3 π r³) is directly 3x% (for x < 5%).'
      ]
    },
    branches: [
      {
        id: 'dim-analysis',
        title: 'Dimensional Analysis',
        color: 'blue',
        summary: 'M, L, T, I, θ dimensions and physical constants',
        nodes: [
          { id: 'dim-const', title: 'Frequently Asked Constants', formula: '[G] = M^{-1}L^3T^{-2},\\ [h] = ML^2T^{-1},\\ [\\mu_0\\epsilon_0] = L^{-2}T^2', details: 'Dimensional constants often matched in JEE Section A.' },
          { id: 'homogeneity', title: 'Principle of Homogeneity', details: 'Arguments of sin(kx - ωt) are dimensionless: [k] = L⁻¹, [ω] = T⁻¹.' }
        ]
      },
      {
        id: 'error-analysis',
        title: 'Errors & Instruments',
        color: 'emerald',
        summary: 'Absolute, relative, percentage errors and instrument least counts',
        nodes: [
          { id: 'vernier', title: 'Vernier Calipers', formula: '\\text{Reading} = \\text{MSR} + (\\text{VSR} \\times \\text{LC}) - (\\pm \\text{Zero Error})', details: 'Positive zero error has 0 of VSR right of 0 of MSR.' },
          { id: 'screw-gauge', title: 'Screw Gauge', formula: '\\text{Reading} = \\text{PSR} + (\\text{CSR} \\times \\text{LC}) - (\\pm \\text{Zero Error})', details: 'Backlash error eliminated by rotating in one single direction.' }
        ]
      }
    ]
  },
  {
    id: 'kinematics',
    chapterNumber: 2,
    subject: 'Physics',
    title: 'Kinematics',
    tagline: 'Rectilinear Motion, Projectile Motion & Relative Velocity in 1D/2D',
    centerConcept: {
      title: 'Equations of Motion & Trajectories',
      coreDefinition: 'Description of motion without reference to forces; rate of change of displacement, velocity, and acceleration.',
      keyLaw: 'Equations of motion apply strictly when acceleration vector a is constant in magnitude and direction.'
    },
    weightage: '4 - 8 Marks (1-2 Questions)',
    difficulty: 'High-Yield',
    estimatedRevisionTime: '1 min Quick / 12 min Deep',
    oneMinuteSummary: {
      keyFormulas: [
        { name: 'Displacement in n-th second', formula: 'S_n = u + \\frac{a}{2}(2n - 1)', note: 'Valid only for uniform acceleration' },
        { name: 'Projectile Range & Max Height', formula: 'R = \\frac{u^2 \\sin 2\\theta}{g},\\ H_{\\max} = \\frac{u^2 \\sin^2\\theta}{2g},\\ T = \\frac{2u\\sin\\theta}{g}', note: 'Maximum range at θ = 45°' },
        { name: 'Trajectory Equation', formula: 'y = x\\tan\\theta\\left(1 - \\frac{x}{R}\\right)', note: 'Ultra fast for solving landing coords' }
      ],
      mustRememberPoints: [
        'Area under v-t graph gives displacement; slope of v-t graph gives instantaneous acceleration.',
        'For complementary angles of projection (θ and 90°-θ), Range R is identical: R = 4√(H1·H2).',
        'Relative velocity: v_AB = v_A - v_B. Relative acceleration in free fall: a_rel = 0.'
      ],
      commonPitfalls: [
        'Do not use v = u + at when acceleration depends on time or position; use v = dx/dt and a = v(dv/dx).',
        'River-boat problem: shortest path requires crossing with resultant velocity perpendicular to river banks (sin α = v_r / v_b).'
      ],
      speedTricks: [
        'R = 4 H cot θ. If R = n H, then tan θ = 4/n.',
        'Height fallen in successive seconds from rest follows ratio 1 : 3 : 5 : 7 : ... (Galileo odd number law).'
      ]
    },
    branches: [
      {
        id: '1d-motion',
        title: '1D Rectilinear Motion',
        color: 'sky',
        summary: 'Kinematic formulas with constant and variable acceleration',
        nodes: [
          { id: 'diff-accel', title: 'Variable Acceleration', formula: 'a = \\frac{dv}{dt} = v\\frac{dv}{dx},\\quad v = \\int a\\,dt,\\quad x = \\int v\\,dt', details: 'Integrate between definite limits.' },
          { id: 'stopping-dist', title: 'Stopping Distance', formula: 'd_s = \\frac{u^2}{2a}', details: 'Distance is proportional to square of initial speed.' }
        ]
      },
      {
        id: 'projectile',
        title: '2D & Projectile Motion',
        color: 'purple',
        summary: 'Ground-to-ground, inclined planes and relative trajectories',
        nodes: [
          { id: 'incline-proj', title: 'Projection on Incline', formula: 'T = \\frac{2u\\sin(\\alpha - \\beta)}{g\\cos\\beta},\\quad R = \\frac{u^2}{g\\cos^2\\beta}[\\sin(2\\alpha - \\beta) - \\sin\\beta]', details: 'α = angle with horizontal, β = incline angle.' }
        ]
      }
    ]
  },
  {
    id: 'laws-of-motion',
    chapterNumber: 3,
    subject: 'Physics',
    title: 'Laws of Motion',
    tagline: 'Newton\'s Laws, Free Body Diagrams, Friction & Circular Dynamics',
    centerConcept: {
      title: 'Net Force & Inertial Dynamics',
      coreDefinition: 'Forces as interactions causing momentum changes; equilibrium and non-inertial pseudo force analysis.',
      keyLaw: 'F_net = dp/dt = m(dv/dt) for constant mass systems.'
    },
    weightage: '4 - 8 Marks (1-2 Questions)',
    difficulty: 'Conceptual',
    estimatedRevisionTime: '1 min Quick / 10 min Deep',
    oneMinuteSummary: {
      keyFormulas: [
        { name: 'Limiting & Kinetic Friction', formula: 'f_s \\le \\mu_s N,\\quad f_k = \\mu_k N', note: 'Static friction is self-adjusting' },
        { name: 'Banking of Road (With Friction)', formula: 'v_{\\max} = \\sqrt{rg\\left(\\frac{\\tan\\theta + \\mu}{1 - \\mu\\tan\\theta}\\right)}', note: 'Without friction: v = √(rg tan θ)' },
        { name: 'Pseudo Force in Non-Inertial Frame', formula: '\\vec{F}_{\\text{pseudo}} = -m\\vec{a}_{\\text{frame}}', note: 'Acts through center of mass opposite to acceleration' }
      ],
      mustRememberPoints: [
        'Normal force is not always mg cos θ; draw strict FBD along perpendicular to surface.',
        'Pulley constraint: sum of (T · a) = 0 for ideal inextensible strings.',
        'Critical velocity at top of vertical circle for string: v_top = √(gl); bottom: v_bottom = √(5gl).'
      ],
      commonPitfalls: [
        'Friction always opposes relative sliding motion between contacting surfaces, not necessarily the actual motion.',
        'In two-block systems, check whether static friction can support common acceleration before assuming slipping.'
      ],
      speedTricks: [
        'Atwood machine: a = (m1 - m2)g / (m1 + m2), T = 2 m1 m2 g / (m1 + m2).'
      ]
    },
    branches: [
      {
        id: 'fbd-constraints',
        title: 'FBD & Constraint Equations',
        color: 'amber',
        summary: 'String and wedge constraints, tension methods',
        nodes: [
          { id: 'wedge-constr', title: 'Wedge Constraint', formula: 'v_{1\\perp} = v_{2\\perp}', details: 'Components of velocities along common normal must be equal.' }
        ]
      },
      {
        id: 'circular-dyn',
        title: 'Circular Dynamics',
        color: 'rose',
        summary: 'Centripetal force, vertical circle tension',
        nodes: [
          { id: 'vert-circle', title: 'Vertical Circle Tension', formula: 'T_{\\text{bottom}} - T_{\\text{top}} = 6mg', details: 'Independent of initial speed as long as loop is completed.' }
        ]
      }
    ]
  },
  {
    id: 'work-energy-power',
    chapterNumber: 4,
    subject: 'Physics',
    title: 'Work, Energy and Power',
    tagline: 'Work-Energy Theorem, Conservative Forces, Potential Energy & Collisions',
    centerConcept: {
      title: 'Work-Energy Theorem & Conservation Laws',
      coreDefinition: 'Work done by all forces equals change in kinetic energy: W_net = ΔK.',
      keyLaw: 'Mechanical Energy is conserved when work done by non-conservative forces is zero: ΔK + ΔU = 0.'
    },
    weightage: '4 - 8 Marks (1-2 Questions)',
    difficulty: 'High-Yield',
    estimatedRevisionTime: '1 min Quick / 10 min Deep',
    oneMinuteSummary: {
      keyFormulas: [
        { name: 'Work-Energy Theorem', formula: 'W_{\\text{all forces}} = K_f - K_i = \\Delta K', note: 'Applies to both conservative and non-conservative' },
        { name: 'Conservative Force & Potential Energy', formula: 'F = -\\frac{dU}{dx},\\quad U(x) = -\\int F\\,dx', note: 'Stable equilibrium when d²U/dx² > 0' },
        { name: '1D Elastic Collision Velocities', formula: 'v_1 = \\frac{m_1 - m_2}{m_1 + m_2}u_1 + \\frac{2m_2}{m_1 + m_2}u_2', note: 'Coefficient of restitution e = (v2 - v1)/(u1 - u2) = 1' }
      ],
      mustRememberPoints: [
        'Power is scalar product P = F · v = dW/dt.',
        'Spring potential energy: U_s = 1/2 k x². Work done by spring = -1/2 k (x_f² - x_i²).',
        'In completely inelastic collision (e = 0), maximum kinetic energy is lost: ΔK = 1/2 μ (u1 - u2)², where μ = m1 m2 / (m1 + m2).'
      ],
      commonPitfalls: [
        'Do not confuse force with power when calculating speed from constant power: P = Fv = m v (dv/dt) gives v ∝ t^(1/2) and x ∝ t^(3/2).'
      ],
      speedTricks: [
        'If m1 = m2 in 1D head-on elastic collision, the bodies simply exchange their velocities.'
      ]
    },
    branches: [
      {
        id: 'work-power',
        title: 'Work & Power Equations',
        color: 'blue',
        summary: 'Work integral and instantaneous vs average power',
        nodes: [
          { id: 'var-work', title: 'Work by Variable Force', formula: 'W = \\int_{x_1}^{x_2} F_x\\,dx + \\int_{y_1}^{y_2} F_y\\,dy', details: 'Area under F-x curve equals work.' }
        ]
      },
      {
        id: 'collisions',
        title: 'Collision Mechanics',
        color: 'emerald',
        summary: 'Elastic, inelastic and coefficient of restitution',
        nodes: [
          { id: 'restitution', title: 'Restitution Formula', formula: 'e = \\frac{\\text{Velocity of Separation}}{\\text{Velocity of Approach}} = \\frac{v_2 - v_1}{u_1 - u_2}', details: 'e = 1 (elastic), 0 < e < 1 (inelastic), e = 0 (perfectly inelastic).' }
        ]
      }
    ]
  },
  {
    id: 'rotational-motion',
    chapterNumber: 5,
    subject: 'Physics',
    title: 'Rotational Motion',
    tagline: 'Center of Mass, Moment of Inertia, Torque, Angular Momentum & Pure Rolling',
    centerConcept: {
      title: 'Rigid Body Dynamics & Rolling',
      coreDefinition: 'Rotation of extended bodies governed by torque τ = Iα and angular momentum conservation L = Iω.',
      keyLaw: 'Pure rolling condition on stationary ground: v_cm = Rω, a_cm = Rα. Point of contact has zero instantaneous velocity.'
    },
    weightage: '8 Marks (2 Questions consistently)',
    difficulty: 'Conceptual',
    estimatedRevisionTime: '1 min Quick / 12 min Deep',
    oneMinuteSummary: {
      keyFormulas: [
        { name: 'Parallel Axis Theorem', formula: 'I = I_{\\text{cm}} + M d^2', note: 'Applies to any rigid body' },
        { name: 'Perpendicular Axis Theorem', formula: 'I_z = I_x + I_y', note: 'Strictly valid for 2D laminar planar bodies only' },
        { name: 'Acceleration in Pure Rolling on Incline', formula: 'a = \\frac{g\\sin\\theta}{1 + \\frac{I_{\\text{cm}}}{MR^2}} = \\frac{g\\sin\\theta}{1 + \\frac{k^2}{R^2}}', note: 'Solid sphere (k²/R² = 2/5) rolls down fastest' }
      ],
      mustRememberPoints: [
        'Ring: I = MR²; Disc/Solid Cylinder: I = 1/2 MR²; Solid Sphere: I = 2/5 MR²; Hollow Sphere: I = 2/3 MR²; Rod about center: 1/12 ML².',
        'Torque equation: τ_ext = dL/dt. In pure rolling, work done by static friction is ZERO.',
        'Total kinetic energy in rolling: K_total = 1/2 M v_cm² + 1/2 I_cm ω² = 1/2 M v_cm² [1 + k²/R²].'
      ],
      commonPitfalls: [
        'Perpendicular axis theorem does NOT apply to spheres, cylinders or 3D objects.',
        'Angular momentum is conserved about a point ONLY if external torque about that specific point is zero.'
      ],
      speedTricks: [
        'Order of reaching bottom on incline: Solid Sphere > Disc > Hollow Sphere > Ring (lowest k²/R² reaches first).'
      ]
    },
    branches: [
      {
        id: 'moi-calc',
        title: 'Moment of Inertia',
        color: 'purple',
        summary: 'Standard shapes, cut-out portions and theorems',
        nodes: [
          { id: 'cut-out', title: 'Cavity Method', formula: 'I_{\\text{remaining}} = I_{\\text{total}} - I_{\\text{removed}}', details: 'Compute mass of removed portion proportionally to area or volume.' }
        ]
      },
      {
        id: 'ang-mom',
        title: 'Angular Momentum & Rolling',
        color: 'rose',
        summary: 'Conservation of L and toppling conditions',
        nodes: [
          { id: 'toppling', title: 'Toppling Condition', formula: 'F h > M g \\frac{b}{2}', details: 'Topples before sliding if F_topple < μ Mg.' }
        ]
      }
    ]
  },
  {
    id: 'gravitation',
    chapterNumber: 6,
    subject: 'Physics',
    title: 'Gravitation',
    tagline: 'Newton\'s Law, Variation of g, Gravitational Potential & Kepler\'s Laws',
    centerConcept: {
      title: 'Gravitational Fields & Planetary Motion',
      coreDefinition: 'Universal inverse-square central force mediating orbital mechanics and gravitational potential wells.',
      keyLaw: 'Kepler\'s 3rd Law: T² ∝ r³ (Square of orbital period is proportional to cube of semi-major axis).'
    },
    weightage: '4 Marks (1 Question)',
    difficulty: 'Easy',
    estimatedRevisionTime: '1 min Quick / 8 min Deep',
    oneMinuteSummary: {
      keyFormulas: [
        { name: 'Variation of g with Altitude & Depth', formula: 'g_h \\approx g\\left(1 - \\frac{2h}{R}\\right)\\ [h \\ll R],\\quad g_d = g\\left(1 - \\frac{d}{R}\\right)', note: 'At center (d = R), g = 0' },
        { name: 'Escape Velocity & Orbital Velocity', formula: 'v_e = \\sqrt{\\frac{2GM}{R}} = \\sqrt{2gR} \\approx 11.2\\text{ km/s},\\quad v_o = \\sqrt{\\frac{GM}{r}}', note: 'v_e = √2 · v_o' },
        { name: 'Total Energy of Satellite', formula: 'E = -\\frac{GMm}{2r} = -K = \\frac{1}{2}U', note: 'Negative total energy indicates bound system' }
      ],
      mustRememberPoints: [
        'Gravitational potential is always negative: V(r) = -GM/r.',
        'Variation with latitude: g_θ = g - R ω² cos²θ. At equator (θ = 0), g is minimum; at poles (θ = 90°), g is maximum.',
        'Kepler\'s Second Law (Areal velocity dA/dt = L / 2m = constant) is a direct consequence of conservation of angular momentum.'
      ],
      commonPitfalls: [
        'Do not use g_h = g(1 - 2h/R) when h is comparable to R; use exact formula g_h = g R² / (R + h)².'
      ],
      speedTricks: [
        'If radius of earth shrinks by 1% with mass constant, g increases by 2% (Δg/g = -2 ΔR/R).'
      ]
    },
    branches: [
      {
        id: 'potential-field',
        title: 'Gravitational Potential & Field',
        color: 'sky',
        summary: 'Solid sphere vs spherical shell potentials',
        nodes: [
          { id: 'shell-field', title: 'Spherical Shell', formula: 'E_{\\text{in}} = 0,\\quad V_{\\text{in}} = -\\frac{GM}{R} = \\text{constant}', details: 'Inside a uniform shell, potential is constant and field is zero.' }
        ]
      }
    ]
  },
  {
    id: 'properties-of-solids-and-liquids',
    chapterNumber: 7,
    subject: 'Physics',
    title: 'Properties of Solids and Liquids',
    tagline: 'Hooke\'s Law, Fluid Statics, Viscosity, Surface Tension & Bernoulli\'s Theorem',
    centerConcept: {
      title: 'Elasticity & Hydrodynamics',
      coreDefinition: 'Mechanical deformation of solids under stress, hydrostatic pressure, streamline fluid flow and surface phenomena.',
      keyLaw: 'Bernoulli\'s Equation: P + 1/2 ρ v² + ρgh = constant along a streamline.'
    },
    weightage: '4 - 8 Marks (1-2 Questions)',
    difficulty: 'Moderate',
    estimatedRevisionTime: '1 min Quick / 10 min Deep',
    oneMinuteSummary: {
      keyFormulas: [
        { name: 'Young\'s Modulus & Energy Density', formula: 'Y = \\frac{\\text{Stress}}{\\text{Strain}} = \\frac{FL}{A\\Delta L},\\quad u = \\frac{1}{2} \\times \\text{Stress} \\times \\text{Strain}', note: 'u = 1/2 Y (strain)²' },
        { name: 'Stokes\' Law & Terminal Velocity', formula: 'F_v = 6\\pi\\eta r v,\\quad v_t = \\frac{2r^2(\\rho - \\sigma)g}{9\\eta}', note: 'vt ∝ r² (terminal velocity depends on square of radius)' },
        { name: 'Excess Pressure & Capillary Rise', formula: '\\Delta P_{\\text{drop}} = \\frac{2T}{R},\\ \\Delta P_{\\text{bubble}} = \\frac{4T}{R},\\quad h = \\frac{2T\\cos\\theta}{\\rho g r}', note: 'Soap bubble has 2 free surfaces' }
      ],
      mustRememberPoints: [
        'Torricelli\'s Law for efflux velocity: v = √(2gh). Range x = 2√(h(H - h)); max range x_max = H at h = H/2.',
        'Equation of continuity: A1 v1 = A2 v2 (incompressible, non-viscous fluid).',
        'Surface energy = Surface Tension × Increase in surface area: W = T × ΔA.'
      ],
      commonPitfalls: [
        'A liquid drop in air has ONE free surface (ΔP = 2T/R), but a soap bubble has TWO free surfaces (ΔP = 4T/R).'
      ],
      speedTricks: [
        'When n identical droplets of radius r coalesce into a big drop of radius R, R = n^(1/3) r. Energy released ΔU = 4π T R³ [1/r - 1/R].'
      ]
    },
    branches: [
      {
        id: 'elasticity',
        title: 'Elasticity & Stress-Strain',
        color: 'amber',
        summary: 'Hooke\'s law, Poisson\'s ratio, thermal stress',
        nodes: [
          { id: 'thermal-stress', title: 'Thermal Stress', formula: 'F = Y A \\alpha \\Delta T', details: 'Independent of the length of the rod if ends are rigidly fixed.' }
        ]
      },
      {
        id: 'fluids',
        title: 'Hydrodynamics & Surface Tension',
        color: 'emerald',
        summary: 'Bernoulli, Venturimeter, Capillarity',
        nodes: [
          { id: 'venturi', title: 'Venturimeter Rate of Flow', formula: 'Q = A_1 A_2 \\sqrt{\\frac{2gh}{A_1^2 - A_2^2}}', details: 'Used to measure flow rate of fluid in a pipe.' }
        ]
      }
    ]
  },
  {
    id: 'thermodynamics-physics',
    chapterNumber: 8,
    subject: 'Physics',
    title: 'Thermodynamics',
    tagline: 'First Law of Thermodynamics, PV Indicator Diagrams, Heat Engines & Carnot Cycle',
    centerConcept: {
      title: 'First & Second Laws of Thermodynamics',
      coreDefinition: 'Energy transfers through heat and work; state functions and theoretical limits of thermal efficiency.',
      keyLaw: 'First Law: ΔQ = ΔU + ΔW, where ΔU = n C_v ΔT depends only on initial and final temperatures.'
    },
    weightage: '4 - 8 Marks (1-2 Questions)',
    difficulty: 'High-Yield',
    estimatedRevisionTime: '1 min Quick / 10 min Deep',
    oneMinuteSummary: {
      keyFormulas: [
        { name: 'First Law & Work in Processes', formula: 'W_{\\text{iso}} = nRT\\ln\\frac{V_2}{V_1},\\quad W_{\\text{adia}} = \\frac{P_1V_1 - P_2V_2}{\\gamma - 1} = \\frac{nR(T_1 - T_2)}{\\gamma - 1}', note: 'Isochoric: W = 0' },
        { name: 'Carnot Engine Efficiency', formula: '\\eta = 1 - \\frac{T_L}{T_H} = \\frac{W}{Q_H} = 1 - \\frac{Q_L}{Q_H}', note: 'Temperatures must be in Kelvin' },
        { name: 'Refrigerator COP', formula: '\\beta = \\frac{Q_L}{W} = \\frac{T_L}{T_H - T_L} = \\frac{1 - \\eta}{\\eta}', note: 'Coefficient of Performance' }
      ],
      mustRememberPoints: [
        'Internal energy U of an ideal gas is a function of temperature ONLY: ΔU = n C_v ΔT.',
        'Mayer\'s relation: C_p - C_v = R. Ratio γ = C_p / C_v = 1 + 2/f.',
        'In cyclic process, ΔU = 0, so Q_net = W_net = Area enclosed by PV loop (clockwise = positive work, counter-clockwise = negative work).'
      ],
      commonPitfalls: [
        'Always convert Celsius to Kelvin in Carnot engine calculations; ratio with °C gives completely wrong answer.'
      ],
      speedTricks: [
        'Slope of adiabatic curve = γ × slope of isothermal curve on PV indicator diagram.'
      ]
    },
    branches: [
      {
        id: 'thermo-proc',
        title: 'Thermodynamic Processes',
        color: 'rose',
        summary: 'Isothermal, Adiabatic, Isobaric, Isochoric',
        nodes: [
          { id: 'adia-rel', title: 'Adiabatic Relations', formula: 'PV^\\gamma = \\text{const},\\quad TV^{\\gamma-1} = \\text{const},\\quad P^{1-\\gamma}T^\\gamma = \\text{const}', details: 'No heat exchange (dQ = 0).' }
        ]
      }
    ]
  },
  {
    id: 'kinetic-theory-of-gases',
    chapterNumber: 9,
    subject: 'Physics',
    title: 'Kinetic Theory of Gases',
    tagline: 'Ideal Gas Equation, RMS Speeds, Equipartition of Energy & Mean Free Path',
    centerConcept: {
      title: 'Microscopic Molecular Model',
      coreDefinition: 'Relating microscopic molecular kinetic energies to macroscopic pressure and temperature.',
      keyLaw: 'Pressure of ideal gas: P = 1/3 ρ v_rms² = 2/3 E_v, where E_v is translational kinetic energy per unit volume.'
    },
    weightage: '4 Marks (1 Question)',
    difficulty: 'Easy',
    estimatedRevisionTime: '1 min Quick / 8 min Deep',
    oneMinuteSummary: {
      keyFormulas: [
        { name: 'Molecular Speeds', formula: 'v_{\\text{rms}} = \\sqrt{\\frac{3RT}{M}},\\quad v_{\\text{avg}} = \\sqrt{\\frac{8RT}{\\pi M}},\\quad v_{\\text{mp}} = \\sqrt{\\frac{2RT}{M}}', note: 'v_rms : v_avg : v_mp ≈ 1.224 : 1.128 : 1' },
        { name: 'Equipartition Law & Energy', formula: 'E_{\\text{molecule}} = \\frac{f}{2}k_B T,\\quad U_{\\text{mole}} = \\frac{f}{2}RT', note: 'Monoatomic f = 3, Diatomic f = 5 (at room temp)' },
        { name: 'Mean Free Path', formula: '\\lambda = \\frac{1}{\\sqrt{2}\\pi n d^2} = \\frac{k_B T}{\\sqrt{2}\\pi P d^2}', note: 'λ ∝ T/P' }
      ],
      mustRememberPoints: [
        'Translational kinetic energy of any ideal gas (mono, dia, poly) is ALWAYS 3/2 k_B T per molecule.',
        'Degrees of freedom f: Monoatomic = 3 (translational), Diatomic = 5 (3 trans + 2 rot), Non-linear polyatomic = 6.',
        'At high temperatures, vibrational modes become active (+2 degrees of freedom per mode).'
      ],
      commonPitfalls: [
        'M in √(3RT/M) is molar mass in kg/mol (e.g. for O2, M = 32 × 10⁻³ kg/mol), not grams.'
      ],
      speedTricks: [
        'Mixture of gases: C_v,mix = (n1 C_v1 + n2 C_v2) / (n1 + n2).'
      ]
    },
    branches: [
      {
        id: 'ktg-speeds',
        title: 'Molecular Speeds & Distributions',
        color: 'blue',
        summary: 'Maxwell-Boltzmann distribution and mean free path',
        nodes: [
          { id: 'mb-dist', title: 'Maxwell Distribution Peak', formula: 'v_{\\text{mp}} = \\sqrt{\\frac{2k_B T}{m}}', details: 'Peak shifts to right and flattens as temperature increases.' }
        ]
      }
    ]
  },
  {
    id: 'oscillations-and-waves',
    chapterNumber: 10,
    subject: 'Physics',
    title: 'Oscillations and Waves',
    tagline: 'Simple Harmonic Motion, Springs, Waves on String, Sound & Resonance',
    centerConcept: {
      title: 'SHM & Wave Mechanics',
      coreDefinition: 'Linear restoring force motion F = -kx and spatial propagation of disturbance y = A sin(kx - ωt).',
      keyLaw: 'SHM equation: d²x/dt² + ω²x = 0, where ω = √(k/m).'
    },
    weightage: '4 - 8 Marks (1-2 Questions)',
    difficulty: 'Moderate',
    estimatedRevisionTime: '1 min Quick / 10 min Deep',
    oneMinuteSummary: {
      keyFormulas: [
        { name: 'Velocity & Acceleration in SHM', formula: 'v = \\omega\\sqrt{A^2 - x^2},\\quad a = -\\omega^2 x', note: 'v_max = ωA at x = 0; a_max = ω²A at x = ±A' },
        { name: 'Time Period of Spring & Pendulum', formula: 'T_{\\text{spring}} = 2\\pi\\sqrt{\\frac{m}{k}},\\quad T_{\\text{pendulum}} = 2\\pi\\sqrt{\\frac{L}{g}}', note: 'Spring in series: 1/k_eq = 1/k1 + 1/k2' },
        { name: 'Speed of Transverse Wave on String', formula: 'v = \\sqrt{\\frac{T}{\\mu}},\\quad v_{\\text{sound}} = \\sqrt{\\frac{\\gamma P}{\\rho}} = \\sqrt{\\frac{\\gamma RT}{M}}', note: 'μ = mass per unit length' }
      ],
      mustRememberPoints: [
        'Total energy in SHM: E = 1/2 m ω² A² = 1/2 k A² (constant). At x = A/√2, K = U = E/2.',
        'Organ pipes: Closed pipe produces ONLY odd harmonics (f_n = (2n-1) v / 4L). Open pipe produces all harmonics (f_n = n v / 2L).',
        'End correction: e = 0.6 r. Effective length L_eff = L + e (closed), L + 2e (open).'
      ],
      commonPitfalls: [
        'When cutting a spring of constant k into two parts of ratio 1:2, the smaller piece has constant 3k, larger has 3k/2 (k × L = constant).'
      ],
      speedTricks: [
        'Beat frequency: f_beat = |f1 - f2|. If tuning fork frequency decreases upon waxing, compare frequency shifts systematically.'
      ]
    },
    branches: [
      {
        id: 'shm-dynamics',
        title: 'SHM Mechanics',
        color: 'purple',
        summary: 'Energy graphs, phase, combinations of SHM',
        nodes: [
          { id: 'shm-combo', title: 'Perpendicular SHMs', formula: 'x = A_1\\sin\\omega t,\\ y = A_2\\sin(\\omega t + \\phi)', details: 'φ = 0 (straight line), φ = π/2 (ellipse or circle if A1 = A2).' }
        ]
      },
      {
        id: 'wave-pipes',
        title: 'Standing Waves & Sound',
        color: 'emerald',
        summary: 'Nodes, antinodes, organ pipes and Doppler effect',
        nodes: [
          { id: 'pipes', title: 'Open vs Closed Pipe', formula: 'f_{\\text{open}} = \\frac{v}{2L},\\ f_{\\text{closed}} = \\frac{v}{4L}', details: 'Ratio of fundamental frequencies: f_open = 2 f_closed.' }
        ]
      }
    ]
  },
  {
    id: 'electrostatics',
    chapterNumber: 11,
    subject: 'Physics',
    title: 'Electrostatics',
    tagline: 'Coulomb\'s Law, Gauss\'s Law, Electric Potential, Dipoles & Capacitors',
    centerConcept: {
      title: 'Electric Fields & Capacitive Storage',
      coreDefinition: 'Stationary charge interactions governed by Coulomb force, conservative electric potential, and energy storage in electric fields.',
      keyLaw: 'Gauss\'s Law: ∮ E · dA = q_enclosed / ε₀.'
    },
    weightage: '8 Marks (2 Questions consistently)',
    difficulty: 'High-Yield',
    estimatedRevisionTime: '1 min Quick / 12 min Deep',
    oneMinuteSummary: {
      keyFormulas: [
        { name: 'Field & Potential of Point Charge & Dipole', formula: 'E = \\frac{kq}{r^2},\\ V = \\frac{kq}{r},\\quad E_{\\text{axial}} = \\frac{2kp}{r^3},\\ E_{\\text{equatorial}} = \\frac{kp}{r^3}', note: 'Dipole moment p = q × 2a' },
        { name: 'Parallel Plate Capacitor & Dielectric', formula: 'C = \\frac{\\varepsilon_0 A}{d},\\quad C_k = \\frac{k\\varepsilon_0 A}{d}', note: 'Energy U = 1/2 C V² = Q² / 2C' },
        { name: 'Common Potential on Sharing Charge', formula: 'V_{\\text{common}} = \\frac{C_1V_1 + C_2V_2}{C_1 + C_2},\\quad \\Delta U = \\frac{C_1C_2(V_1 - V_2)^2}{2(C_1 + C_2)}', note: 'Energy lost as heat/radiation' }
      ],
      mustRememberPoints: [
        'Electric field inside a conductor in electrostatic equilibrium is ZERO; potential is constant throughout its volume.',
        'Battery connected vs disconnected with dielectric inserted: Battery connected → V constant, Q increases (k Q0), C increases (k C0), E constant. Battery disconnected → Q constant, C increases (k C0), V decreases (V0/k), E decreases (E0/k).',
        'Gauss Law applications: Infinite line of charge E = λ / (2πε₀r); Infinite conducting plate E = σ / ε₀; Infinite non-conducting sheet E = σ / 2ε₀.'
      ],
      commonPitfalls: [
        'Electric potential is a scalar: simply sum V_i algebraically without resolving into directional components.'
      ],
      speedTricks: [
        'Force between plates of a capacitor: F = Q² / (2 ε₀ A) = 1/2 Q E. Note the factor of 1/2.'
      ]
    },
    branches: [
      {
        id: 'fields-pot',
        title: 'Fields & Gauss\'s Law',
        color: 'sky',
        summary: 'Continuous charge distributions and flux theorems',
        nodes: [
          { id: 'gauss-spheres', title: 'Non-conducting Solid Sphere', formula: 'E_{\\text{in}} = \\frac{\\rho r}{3\\varepsilon_0} = \\frac{kQr}{R^3},\\quad E_{\\text{out}} = \\frac{kQ}{r^2}', details: 'Linear inside, inverse-square outside.' }
        ]
      },
      {
        id: 'capacitance',
        title: 'Capacitors & Circuits',
        color: 'purple',
        summary: 'Series, parallel, dielectric insertion, RC charging',
        nodes: [
          { id: 'rc-charging', title: 'RC Charging Equation', formula: 'q(t) = Q_0\\left(1 - e^{-t/RC}\\right),\\quad i(t) = I_0 e^{-t/RC}', details: 'Time constant τ = RC (at t = τ, q = 0.63 Q0).' }
        ]
      }
    ]
  },
  {
    id: 'current-electricity',
    chapterNumber: 12,
    subject: 'Physics',
    title: 'Current Electricity',
    tagline: 'Drift Velocity, Ohm\'s Law, Kirchhoff\'s Laws, Potentiometer & RC Circuits',
    centerConcept: {
      title: 'Current Flow & Circuit Laws',
      coreDefinition: 'Directed drift of mobile charge carriers through resistive media governed by Kirchhoff\'s junction and loop theorems.',
      keyLaw: 'Kirchhoff\'s Rules: KCL (∑ I_in = 0, charge conservation) and KVL (∑ ΔV = 0, energy conservation).'
    },
    weightage: '8 Marks (2 Questions consistently)',
    difficulty: 'High-Yield',
    estimatedRevisionTime: '1 min Quick / 10 min Deep',
    oneMinuteSummary: {
      keyFormulas: [
        { name: 'Drift Velocity & Current Density', formula: 'I = n e A v_d,\\quad v_d = \\frac{e E \\tau}{m},\\quad j = \\sigma E = \\frac{E}{\\rho}', note: 'τ = relaxation time' },
        { name: 'Temperature Dependence of Resistance', formula: 'R_T = R_0(1 + \\alpha \\Delta T)', note: 'α positive for metals, negative for semiconductors' },
        { name: 'Potentiometer Principle', formula: 'V_1 / V_2 = l_1 / l_2,\\quad r = R\\left(\\frac{l_1}{l_2} - 1\\right)', note: 'No current drawn at null point' }
      ],
      mustRememberPoints: [
        'Cells in parallel: E_eq = (E1/r1 + E2/r2) / (1/r1 + 1/r2), r_eq = (1/r1 + 1/r2)⁻¹.',
        'Maximum power transfer theorem: P_load is maximum when load resistance equals internal resistance (R = r). Max power P_max = E² / 4r.',
        'Wheatstone bridge balanced condition: R1 / R2 = R3 / R4 → no current through central galvanometer.'
      ],
      commonPitfalls: [
        'When wire is stretched to n times its length, its area becomes A/n, so resistance becomes n² times the original resistance (R ∝ L² for constant volume).'
      ],
      speedTricks: [
        'Nodal analysis with 0V reference is 3× faster than writing multiple mesh KVL loops.'
      ]
    },
    branches: [
      {
        id: 'dc-circuits',
        title: 'DC Networks & Theorems',
        color: 'emerald',
        summary: 'Nodal analysis, symmetry reduction, delta-star',
        nodes: [
          { id: 'cube-res', title: 'Resistor Cube Resistances', formula: 'R_{\\text{body diag}} = \\frac{5}{6}R,\\ R_{\\text{face diag}} = \\frac{3}{4}R,\\ R_{\\text{edge}} = \\frac{7}{12}R', details: '12 identical resistors along edges of a cube.' }
        ]
      }
    ]
  },
  {
    id: 'magnetic-effects-and-magnetism',
    chapterNumber: 13,
    subject: 'Physics',
    title: 'Magnetic Effects of Current and Magnetism',
    tagline: 'Biot-Savart Law, Ampere\'s Circuital Law, Lorentz Force & Magnetic Materials',
    centerConcept: {
      title: 'Magnetic Fields & Forces',
      coreDefinition: 'Magnetic fields created by moving charges and magnetic forces acting perpendicular to velocity: F = q(v × B).',
      keyLaw: 'Ampere\'s Circuital Law: ∮ B · dl = μ₀ I_enclosed.'
    },
    weightage: '4 - 8 Marks (1-2 Questions)',
    difficulty: 'Moderate',
    estimatedRevisionTime: '1 min Quick / 10 min Deep',
    oneMinuteSummary: {
      keyFormulas: [
        { name: 'Magnetic Force & Cyclotron Radius', formula: '\\vec{F} = q(\\vec{v} \\times \\vec{B}),\\quad r = \\frac{mv}{qB} = \\frac{\\sqrt{2mK}}{qB}', note: 'Time period T = 2πm/qB (independent of speed)' },
        { name: 'Biot-Savart Law Standard Fields', formula: 'B_{\\text{wire}} = \\frac{\\mu_0 I}{2\\pi d},\\quad B_{\\text{center ring}} = \\frac{\\mu_0 I}{2R},\\quad B_{\\text{solenoid}} = \\mu_0 n I', note: 'n = turns per unit length' },
        { name: 'Magnetic Dipole & Torque', formula: '\\vec{\\tau} = \\vec{M} \\times \\vec{B},\\quad U = -\\vec{M} \\cdot \\vec{B}', note: 'M = N I A' }
      ],
      mustRememberPoints: [
        'Magnetic force does NO work on a moving charge because F ⊥ v always; kinetic energy and speed remain constant.',
        'Helical path: pitch p = v_parallel × T = (v cos θ) × (2πm / qB).',
        'Magnetic materials: Diamagnetic (χ < 0, μ_r < 1, repelled); Paramagnetic (χ > 0 small, Curie\'s law χ ∝ 1/T); Ferromagnetic (χ ≫ 1, hysteresis).'
      ],
      commonPitfalls: [
        'Do not forget factor of 1/2 at ends of a long solenoid: B_end = 1/2 μ₀ n I.'
      ],
      speedTricks: [
        'Galvanometer into Ammeter: shunt S = I_g G / (I - I_g) in parallel. Into Voltmeter: high resistance R = (V / I_g) - G in series.'
      ]
    },
    branches: [
      {
        id: 'biot-ampere',
        title: 'Field Calculations',
        color: 'rose',
        summary: 'Circular coils, helmholtz coils, toroid fields',
        nodes: [
          { id: 'axis-coil', title: 'Axial Field of Circular Coil', formula: 'B_x = \\frac{\\mu_0 I R^2}{2(R^2 + x^2)^{3/2}}', details: 'At center (x = 0), reduces to μ₀I / 2R.' }
        ]
      }
    ]
  },
  {
    id: 'electromagnetic-induction',
    chapterNumber: 14,
    subject: 'Physics',
    title: 'Electromagnetic Induction',
    tagline: 'Faraday\'s Laws, Lenz\'s Law, Motional EMF, Eddy Currents & Inductance',
    centerConcept: {
      title: 'Flux Variation & Induced EMF',
      coreDefinition: 'Changing magnetic flux generates an induced electromotive force opposing the flux change.',
      keyLaw: 'Faraday-Lenz Law: ε = -dΦ_B/dt = -d(B · A)/dt.'
    },
    weightage: '4 Marks (1 Question)',
    difficulty: 'Moderate',
    estimatedRevisionTime: '1 min Quick / 8 min Deep',
    oneMinuteSummary: {
      keyFormulas: [
        { name: 'Motional EMF & Rotating Rod', formula: '\\varepsilon = B v L\\sin\\theta,\\quad \\varepsilon_{\\text{rotating}} = \\frac{1}{2}B\\omega L^2', note: 'Opposes motion by Lenz\'s Law' },
        { name: 'Self & Mutual Inductance', formula: '\\Phi = L I,\\quad \\varepsilon = -L\\frac{dI}{dt},\\quad L_{\\text{solenoid}} = \\mu_0 n^2 A l', note: 'Energy stored U = 1/2 L I²' },
        { name: 'Growth of Current in LR Circuit', formula: 'I(t) = I_0\\left(1 - e^{-t/\\tau}\\right),\\quad \\tau = \\frac{L}{R}', note: 'At t = 0, inductor behaves as open circuit' }
      ],
      mustRememberPoints: [
        'Total charge flown through circuit during flux change: Δq = |ΔΦ| / R (independent of time taken!).',
        'Coupling coefficient: M = k √(L1 L2), where 0 ≤ k ≤ 1.',
        'At steady state (t → ∞), an ideal inductor behaves as a zero-resistance connecting wire (short circuit).'
      ],
      commonPitfalls: [
        'Remember that in a moving conductor, the polarity of induced EMF is given by (v × B) pointing towards positive potential terminal.'
      ],
      speedTricks: [
        'Terminal velocity of falling metallic rod on vertical rails under gravity: v_t = m g R / (B² L²).'
      ]
    },
    branches: [
      {
        id: 'motional-emf',
        title: 'Motional EMF & Inductance',
        color: 'amber',
        summary: 'Translational rods, rotating discs, LR transient circuits',
        nodes: [
          { id: 'eddy-loss', title: 'Energy Density in Magnetic Field', formula: 'u_B = \\frac{B^2}{2\\mu_0}', details: 'Analogous to u_E = 1/2 ε₀ E².' }
        ]
      }
    ]
  },
  {
    id: 'alternating-current',
    chapterNumber: 15,
    subject: 'Physics',
    title: 'Alternating Current',
    tagline: 'AC Phasors, LCR Series Resonance, Quality Factor, Power & Transformers',
    centerConcept: {
      title: 'Impedance & Resonance',
      coreDefinition: 'Sinusoidally varying electromotive force driving reactive and resistive circuit components characterized by phasor relationships.',
      keyLaw: 'At resonance: X_L = X_C, Z_min = R, current is maximum and in phase with voltage.'
    },
    weightage: '4 Marks (1 Question)',
    difficulty: 'Moderate',
    estimatedRevisionTime: '1 min Quick / 8 min Deep',
    oneMinuteSummary: {
      keyFormulas: [
        { name: 'Series LCR Impedance', formula: 'Z = \\sqrt{R^2 + (X_L - X_C)^2},\\quad \\tan\\phi = \\frac{X_L - X_C}{R}', note: 'XL = ωL, XC = 1/ωC' },
        { name: 'Resonant Frequency & Q-Factor', formula: '\\omega_0 = \\frac{1}{\\sqrt{LC}},\\quad Q = \\frac{\\omega_0 L}{R} = \\frac{1}{R}\\sqrt{\\frac{L}{C}} = \\frac{\\omega_0}{\\Delta \\omega}', note: 'Higher Q means sharper resonance' },
        { name: 'Average Power & Power Factor', formula: 'P_{\\text{avg}} = V_{\\text{rms}} I_{\\text{rms}} \\cos\\phi,\\quad \\cos\\phi = \\frac{R}{Z}', note: 'For purely reactive circuit, cos φ = 0 (Wattless current)' }
      ],
      mustRememberPoints: [
        'RMS values for sine wave: V_rms = V_0 / √2 ≈ 0.707 V_0; I_rms = I_0 / √2.',
        'Voltage leads current by 90° across pure inductor; current leads voltage by 90° across pure capacitor.',
        'Transformer: V_s / V_p = N_s / N_p = I_p / I_s (assuming 100% efficiency).'
      ],
      commonPitfalls: [
        'AC meters (voltmeters and ammeters) read RMS values, NEVER peak or average values.'
      ],
      speedTricks: [
        'Wattless current: I_w = I_rms sin φ. It consumes zero average power.'
      ]
    },
    branches: [
      {
        id: 'phasors-lcr',
        title: 'Phasors & LCR Circuit',
        color: 'blue',
        summary: 'Impedance triangles and sharp resonance curves',
        nodes: [
          { id: 'sharpness', title: 'Bandwidth & Sharpness', formula: '\\Delta\\omega = \\frac{R}{L}', details: 'Narrower bandwidth means higher selectivity.' }
        ]
      }
    ]
  },
  {
    id: 'electromagnetic-waves',
    chapterNumber: 16,
    subject: 'Physics',
    title: 'Electromagnetic Waves',
    tagline: 'Displacement Current, Maxwell\'s Equations, EM Spectrum & Radiation Pressure',
    centerConcept: {
      title: 'Transverse Electromagnetic Propagation',
      coreDefinition: 'Self-sustaining perpendicular oscillating electric and magnetic fields propagating through space at speed of light c.',
      keyLaw: 'Speed of light: c = 1 / √(μ₀ ε₀) = E₀ / B₀.'
    },
    weightage: '4 Marks (1 Question guaranteed)',
    difficulty: 'Easy',
    estimatedRevisionTime: '1 min Quick / 6 min Deep',
    oneMinuteSummary: {
      keyFormulas: [
        { name: 'Displacement Current', formula: 'I_d = \\varepsilon_0 \\frac{d\\Phi_E}{dt} = C\\frac{dV}{dt}', note: 'Equals conduction current during capacitor charging' },
        { name: 'Poynting Vector & Energy Density', formula: '\\vec{S} = \\frac{1}{\\mu_0}(\\vec{E} \\times \\vec{B}),\\quad u_{\\text{avg}} = \\frac{1}{2}\\varepsilon_0 E_0^2 = \\frac{B_0^2}{2\\mu_0}', note: 'Intensity I = u_avg · c' },
        { name: 'Radiation Pressure', formula: 'P_{\\text{rad}} = \\frac{I}{c}\\text{ (absorbing)},\\quad P_{\\text{rad}} = \\frac{2I}{c}\\text{ (reflecting)}', note: 'Force F = P_rad × Area' }
      ],
      mustRememberPoints: [
        'EM wave direction is given by unit vector in direction of (E × B).',
        'EM Spectrum order of increasing frequency: Radio < Microwave < Infrared < Visible < Ultraviolet < X-rays < Gamma rays.',
        'Electric field and magnetic field oscillate in the exact same phase in an EM wave.'
      ],
      commonPitfalls: [
        'Electric and magnetic energy densities are EQUAL: u_E = u_B = 1/4 ε₀ E₀².'
      ],
      speedTricks: [
        'Ratio of amplitudes: E₀ = c B₀. In SI units, E₀ is numerically 3 × 10⁸ times larger than B₀.'
      ]
    },
    branches: [
      {
        id: 'maxwell-waves',
        title: 'Maxwell Equations & Spectrum',
        color: 'purple',
        summary: 'Frequency wavelengths and applications of radio to gamma',
        nodes: [
          { id: 'spectrum-uses', title: 'Key Applications', details: 'Microwaves: Radar & Ovens; Infrared: Night vision & greenhouse; UV: Water purifier; X-rays: Bone fractures.' }
        ]
      }
    ]
  },
  {
    id: 'optics',
    chapterNumber: 17,
    subject: 'Physics',
    title: 'Optics',
    tagline: 'Ray Optics (Snell\'s Law, Lenses, Prisms) & Wave Optics (YDSE, Diffraction)',
    centerConcept: {
      title: 'Geometrical & Physical Optics',
      coreDefinition: 'Light behavior described via ray paths (reflection/refraction) and wave fronts (interference/diffraction).',
      keyLaw: 'Snell\'s Law: n1 sin θ1 = n2 sin θ2; YDSE fringe width: β = λD / d.'
    },
    weightage: '8 - 12 Marks (2-3 Questions)',
    difficulty: 'High-Yield',
    estimatedRevisionTime: '1 min Quick / 14 min Deep',
    oneMinuteSummary: {
      keyFormulas: [
        { name: 'Lens Maker\'s Formula & Thin Lens', formula: '\\frac{1}{f} = (\\mu - 1)\\left(\\frac{1}{R_1} - \\frac{1}{R_2}\\right),\\quad \\frac{1}{v} - \\frac{1}{u} = \\frac{1}{f}', note: 'Sign convention is mandatory' },
        { name: 'Prism Refractive Index', formula: '\\mu = \\frac{\\sin\\left(\\frac{A + \\delta_m}{2}\\right)}{\\sin(A/2)}', note: 'At min deviation, r1 = r2 = A/2 and i = e' },
        { name: 'Young\'s Double Slit (YDSE)', formula: '\\beta = \\frac{\\lambda D}{d},\\quad y_n = n\\frac{\\lambda D}{d}\\text{ (Bright)},\\ y_n = (2n-1)\\frac{\\lambda D}{2d}\\text{ (Dark)}', note: 'I_max = (√I1 + √I2)², I_min = (√I1 - √I2)²' }
      ],
      mustRememberPoints: [
        'Total Internal Reflection: sin θ_c = n2 / n1 (where n1 > n2). Critical angle for glass-air is ~42°, water-air ~49°.',
        'Single slit diffraction first minimum condition: a sin θ = λ (central maximum width = 2λD / a).',
        'When YDSE apparatus is submerged in liquid of index μ, fringe width decreases to β\' = β / μ.'
      ],
      commonPitfalls: [
        'Diffraction minimum condition is a sin θ = nλ, while YDSE interference maximum condition is d sin θ = nλ. Do not invert!'
      ],
      speedTricks: [
        'Shift due to thin glass slab in one slit: Δy = (μ - 1) t D / d = (μ - 1) t (β / λ).'
      ]
    },
    branches: [
      {
        id: 'ray-optics',
        title: 'Ray Optics & Instruments',
        color: 'emerald',
        summary: 'Compound microscope, astronomical telescope, lenses',
        nodes: [
          { id: 'microscope', title: 'Compound Microscope Magnification', formula: 'm = -\\frac{v_o}{u_o}\\left(1 + \\frac{D}{f_e}\\right)\\ [\\text{at D}],\\quad m = -\\frac{L}{f_o}\\frac{D}{f_e}\\ [\\text{at }\\infty]', details: 'D = 25 cm least distance of distinct vision.' }
        ]
      },
      {
        id: 'wave-optics',
        title: 'Wave Optics & YDSE',
        color: 'sky',
        summary: 'Interference fringes, phase difference, resolving power',
        nodes: [
          { id: 'ydse-intensity', title: 'Resultant Intensity in YDSE', formula: 'I = 4I_0\\cos^2\\left(\\frac{\\phi}{2}\\right),\\quad \\phi = \\frac{2\\pi}{\\lambda}\\Delta x', details: 'For two identical coherent sources of intensity I0.' }
        ]
      }
    ]
  },
  {
    id: 'dual-nature-of-matter',
    chapterNumber: 18,
    subject: 'Physics',
    title: 'Dual Nature of Matter and Radiation',
    tagline: 'Photoelectric Effect, Einstein\'s Equation, Work Function & de Broglie Wavelength',
    centerConcept: {
      title: 'Wave-Particle Duality & Photons',
      coreDefinition: 'Light exhibits particle nature in absorption/emission (E = hν) while particles exhibit wave nature (λ = h/p).',
      keyLaw: 'Einstein\'s Photoelectric Equation: K_max = hν - Φ = e V_s.'
    },
    weightage: '4 - 8 Marks (1-2 Questions)',
    difficulty: 'Easy',
    estimatedRevisionTime: '1 min Quick / 8 min Deep',
    oneMinuteSummary: {
      keyFormulas: [
        { name: 'Einstein\'s Photoelectric Equation', formula: 'K_{\\max} = e V_s = h\\nu - \\phi_0 = hc\\left(\\frac{1}{\\lambda} - \\frac{1}{\\lambda_0}\\right)', note: 'Stopping potential Vs is independent of intensity' },
        { name: 'de Broglie Wavelength of Particle', formula: '\\lambda = \\frac{h}{p} = \\frac{h}{\\sqrt{2mK}} = \\frac{h}{\\sqrt{2mqV}}', note: 'For electron: λ = 12.27 / √V Å' },
        { name: 'Thermal Neutron Wavelength', formula: '\\lambda = \\frac{h}{\\sqrt{3m k_B T}}', note: 'K_avg = 3/2 k_B T' }
      ],
      mustRememberPoints: [
        'Photoelectric emission is instantaneous (< 10⁻⁹ s) and occurs only if incident frequency ν ≥ ν₀ (threshold frequency).',
        'Saturation photocurrent is directly proportional to incident intensity; stopping potential depends ONLY on frequency.',
        'Slope of V_s versus ν graph is a universal constant: h/e (Planck\'s constant divided by electron charge).'
      ],
      commonPitfalls: [
        'Do not confuse intensity (number of photons per second per unit area) with energy of individual photons (hν).'
      ],
      speedTricks: [
        'Useful constant product: hc ≈ 1240 eV·nm = 12400 eV·Å.'
      ]
    },
    branches: [
      {
        id: 'photoelectric-curves',
        title: 'Photoelectric Graphs',
        color: 'rose',
        summary: 'Vs vs frequency, photocurrent vs collector potential',
        nodes: [
          { id: 'stopping-pot-graph', title: 'V_s vs Frequency Graph', formula: 'V_s = \\frac{h}{e}\\nu - \\frac{\\phi_0}{e}', details: 'Slope = h/e, y-intercept = -Φ₀/e, x-intercept = ν₀.' }
        ]
      }
    ]
  },
  {
    id: 'atoms-and-nuclei',
    chapterNumber: 19,
    subject: 'Physics',
    title: 'Atoms and Nuclei',
    tagline: 'Bohr\'s Model, Hydrogen Spectrum, Mass Defect, Binding Energy & Radioactivity',
    centerConcept: {
      title: 'Bohr Hydrogen Model & Nuclear Stability',
      coreDefinition: 'Quantized electron orbits with angular momentum L = nh/2π and nuclear mass defect conversions via E = Δm c².',
      keyLaw: 'Bohr Energy: E_n = -13.6 Z² / n² eV; Rydberg Formula: 1/λ = R_H Z² (1/n₁² - 1/n₂²).'
    },
    weightage: '4 - 8 Marks (1-2 Questions)',
    difficulty: 'Easy',
    estimatedRevisionTime: '1 min Quick / 8 min Deep',
    oneMinuteSummary: {
      keyFormulas: [
        { name: 'Bohr Radius & Velocity', formula: 'r_n = 0.529\\frac{n^2}{Z}\\text{ \\AA},\\quad v_n = 2.18 \\times 10^6\\frac{Z}{n}\\text{ m/s}', note: 'rn ∝ n²/Z, vn ∝ Z/n' },
        { name: 'Nuclear Radius & Density', formula: 'R = R_0 A^{1/3}\\ (R_0 \\approx 1.2\\text{ fm}),\\quad \\rho_{\\text{nucleus}} \\approx 2.3 \\times 10^{17}\\text{ kg/m}^3', note: 'Nuclear density is independent of mass number A' },
        { name: 'Binding Energy & Mass Defect', formula: 'BE = \\Delta m \\times 931.5\\text{ MeV},\\quad \\Delta m = [Z m_p + (A - Z)m_n] - M_{\\text{nucleus}}', note: 'Higher BE/nucleon means higher nuclear stability' }
      ],
      mustRememberPoints: [
        'Hydrogen spectral series: Lyman (n₁=1, UV), Balmer (n₁=2, Visible), Paschen (n₁=3, IR), Brackett (n₁=4, IR), Pfund (n₁=5, IR).',
        'Total number of spectral lines emitted when electron de-excites from state n to ground state: N = n(n - 1) / 2.',
        'Nuclear force is short-range, charge-independent, and shows saturation property.'
      ],
      commonPitfalls: [
        'Ground state corresponds to n = 1; first excited state is n = 2; second excited state is n = 3.'
      ],
      speedTricks: [
        'In hydrogen atom: Total Energy E = -K = U / 2. (K = +13.6/n², U = -27.2/n², E = -13.6/n²).'
      ]
    },
    branches: [
      {
        id: 'bohr-atom',
        title: 'Bohr Atom & Transitions',
        color: 'purple',
        summary: 'De-excitation lines, ionization energy, Rydberg constant',
        nodes: [
          { id: 'rydberg', title: 'Rydberg Transitions', formula: '\\frac{1}{\\lambda} = R_H Z^2\\left(\\frac{1}{n_1^2} - \\frac{1}{n_2^2}\\right)', details: 'Shortest wavelength in any series corresponds to n₂ = ∞.' }
        ]
      }
    ]
  },
  {
    id: 'electronic-devices',
    chapterNumber: 20,
    subject: 'Physics',
    title: 'Electronic Devices',
    tagline: 'Semiconductors, p-n Junction Diode, Zener Diode & Logic Gates',
    centerConcept: {
      title: 'Semiconductor Physics & Digital Logic',
      coreDefinition: 'Valence/conduction energy bands, majority/minority carrier doping (p-type and n-type), rectifying junctions and Boolean logic.',
      keyLaw: 'Mass-Action Law: n_e · n_h = n_i² (holds at thermal equilibrium).'
    },
    weightage: '4 - 8 Marks (1-2 Questions guaranteed)',
    difficulty: 'Easy',
    estimatedRevisionTime: '1 min Quick / 8 min Deep',
    oneMinuteSummary: {
      keyFormulas: [
        { name: 'Carrier Concentrations', formula: 'n_e \\cdot n_h = n_i^2,\\quad I = e A (n_e v_e + n_h v_h)', note: 'n-type: ne ≈ Nd; p-type: nh ≈ Na' },
        { name: 'Dynamic Resistance of Diode', formula: 'r_d = \\frac{\\Delta V}{\\Delta I}', note: 'Forward biased ~ small (tens of Ω); Reverse biased ~ MΩ' },
        { name: 'Zener Diode Voltage Regulator', formula: 'V_{\\text{out}} = V_Z,\\quad I_S = \\frac{V_{\\text{in}} - V_Z}{R_S} = I_Z + I_L', note: 'Operates in reverse breakdown region' }
      ],
      mustRememberPoints: [
        'p-n Junction: Forward bias reduces barrier height & depletion width; Reverse bias increases barrier height & depletion width.',
        'Half-wave rectifier ripple factor = 1.21, efficiency = 40.6%. Full-wave rectifier ripple factor = 0.482, efficiency = 81.2%.',
        'Logic Gate Truth Tables: NAND and NOR are Universal Gates. De Morgan\'s laws: (A · B)\' = A\' + B\', (A + B)\' = A\' · B\'.'
      ],
      commonPitfalls: [
        'Zener diode MUST be connected in REVERSE BIAS with cathode to positive supply to act as voltage stabilizer.'
      ],
      speedTricks: [
        'A + AB = A; A + A\'B = A + B; A(A\' + B) = AB. Use Boolean theorems to simplify gate diagrams quickly.'
      ]
    },
    branches: [
      {
        id: 'logic-gates',
        title: 'Logic Gates & Truth Tables',
        color: 'emerald',
        summary: 'AND, OR, NOT, NAND, NOR, XOR circuits',
        nodes: [
          { id: 'xor-gate', title: 'XOR & XNOR Gates', formula: 'Y_{\\text{XOR}} = A\\bar{B} + \\bar{A}B,\\quad Y_{\\text{XNOR}} = AB + \\bar{A}\\bar{B}', details: 'XOR outputs 1 only when inputs are distinct.' }
        ]
      }
    ]
  },
  {
    id: 'experimental-skills',
    chapterNumber: 21,
    subject: 'Physics',
    title: 'Experimental Skills',
    tagline: 'Practical Instruments, Calipers, Screw Gauge, Spherometer, Metre Bridge & Prism',
    centerConcept: {
      title: 'Laboratory Physics & Error Bounds',
      coreDefinition: 'Operating principles, least counts, zero error compensations and graphical analysis for prescribed lab experiments.',
      keyLaw: 'Observed Reading = Main Scale Reading + (Coinciding Division × Least Count) - (Zero Error).'
    },
    weightage: '4 - 8 Marks (1-2 Questions in current syllabus)',
    difficulty: 'Moderate',
    estimatedRevisionTime: '1 min Quick / 8 min Deep',
    oneMinuteSummary: {
      keyFormulas: [
        { name: 'Metre Bridge Resistance', formula: 'X = R\\left(\\frac{100 - l}{l}\\right)', note: 'Balance point preferred near 50 cm for minimal error' },
        { name: 'Spherometer Radius of Curvature', formula: 'R = \\frac{l^2}{6h} + \\frac{h}{2}', note: 'l = mean distance between legs, h = sagitta' },
        { name: 'Frequency of Sonometer Wire', formula: 'f = \\frac{1}{2L}\\sqrt{\\frac{T}{\\mu}} = \\frac{1}{2L}\\sqrt{\\frac{Mg}{\\pi r^2 \\rho}}', note: 'Law of length: f × L = constant' }
      ],
      mustRememberPoints: [
        'End resistance correction in Metre Bridge: caused by copper strip resistance and solder contact resistances.',
        'Resonance tube: first resonance l1 + e = λ/4, second resonance l2 + e = 3λ/4 → λ = 2(l2 - l1) and end correction e = (l2 - 3l1)/2.',
        'Ohm\'s law verification: Voltmeter connected in parallel (high resistance), Ammeter in series (low resistance).'
      ],
      commonPitfalls: [
        'If zero mark on circular scale is ABOVE reference line, it is negative zero error (must be ADDED to observed value).'
      ],
      speedTricks: [
        'In resonance tube experiment, speed of sound v = 2 f (l2 - l1). End correction is completely eliminated!'
      ]
    },
    branches: [
      {
        id: 'lab-instruments',
        title: 'Prescribed Instruments',
        color: 'sky',
        summary: 'Metre bridge, resonance tube, sonometer, prism i-δ curves',
        nodes: [
          { id: 'prism-exp', title: 'Angle of Minimum Deviation', formula: '\\delta_m = 2i - A', details: 'Ray passes symmetrically through prism parallel to base.' }
        ]
      }
    ]
  },

  // =========================================================================
  // CHEMISTRY (20 Chapters)
  // =========================================================================
  // --- Physical Chemistry (8 Chapters) ---
  {
    id: 'some-basic-concepts-in-chemistry',
    chapterNumber: 22,
    subject: 'Chemistry',
    category: 'Physical Chemistry',
    title: 'Some Basic Concepts in Chemistry',
    tagline: 'Mole Concept, Stoichiometry, Limiting Reagent & Concentration Terms',
    centerConcept: {
      title: 'Mole Concept & Chemical Equivalence',
      coreDefinition: 'Quantitative chemistry bridging microscopic atoms/molecules to macroscopic laboratory masses and stoichiometric coefficients.',
      keyLaw: '1 Mole = 6.022 × 10²³ entities = Molar mass in grams = 22.4 L of ideal gas at standard STP.'
    },
    weightage: '4 - 8 Marks (1-2 Questions)',
    difficulty: 'High-Yield',
    estimatedRevisionTime: '1 min Quick / 8 min Deep',
    oneMinuteSummary: {
      keyFormulas: [
        { name: 'Molarity & Molality', formula: 'M = \\frac{n_{\\text{solute}}}{V_{\\text{solution}}(\\text{L})},\\quad m = \\frac{n_{\\text{solute}}}{W_{\\text{solvent}}(\\text{kg})}', note: 'Molality is temperature-independent' },
        { name: 'Normality & n-factor', formula: 'N = M \\times n\\text{-factor},\\quad \\text{Equivalents} = n \\times n\\text{-factor}', note: 'For redox, n-factor = electrons exchanged per mole' },
        { name: 'Mole Fraction to Molality', formula: 'm = \\frac{\\chi_{\\text{solute}}}{1 - \\chi_{\\text{solute}}} \\times \\frac{1000}{M_{\\text{solvent}}}', note: 'Super-fast conversion shortcut' }
      ],
      mustRememberPoints: [
        'Limiting Reagent: The reactant that yields the least moles of product (divide given moles by stoichiometric coefficient; smallest ratio is LR).',
        'Empirical formula gives simplest whole number atom ratio; Molecular formula = (Empirical formula)_n, where n = Molar mass / Empirical mass.',
        'Dilution Law: M1 V1 = M2 V2; Mixture molarity: M_mix = (M1V1 + M2V2) / (V1 + V2).'
      ],
      commonPitfalls: [
        'Molality involves mass of SOLVENT in kg, NOT mass of solution.'
      ],
      speedTricks: [
        'Molarity from % (w/w) and density d (g/mL): M = (10 × % × d) / M_solute.'
      ]
    },
    branches: [
      {
        id: 'conc-terms',
        title: 'Concentration Units',
        color: 'blue',
        summary: 'Molarity, Molality, Normality, ppm, mole fraction',
        nodes: [
          { id: 'ppm-calc', title: 'Parts Per Million (ppm)', formula: '\\text{ppm} = \\frac{\\text{Mass of solute}}{\\text{Total mass of solution}} \\times 10^6', details: 'Used for hardness of water and air pollutants.' }
        ]
      }
    ]
  },
  {
    id: 'atomic-structure',
    chapterNumber: 23,
    subject: 'Chemistry',
    category: 'Physical Chemistry',
    title: 'Atomic Structure',
    tagline: 'Quantum Numbers, Orbitals, de Broglie, Heisenberg & Electronic Configuration',
    centerConcept: {
      title: 'Quantum Mechanical Model of Atom',
      coreDefinition: 'Wave-mechanical description of electrons localized as probability amplitude distributions defined by 4 quantum numbers.',
      keyLaw: 'Heisenberg Uncertainty: Δx · Δp ≥ h / (4π); de Broglie: λ = h / mv.'
    },
    weightage: '4 - 8 Marks (1-2 Questions)',
    difficulty: 'Moderate',
    estimatedRevisionTime: '1 min Quick / 8 min Deep',
    oneMinuteSummary: {
      keyFormulas: [
        { name: 'Bohr Energy & Radius', formula: 'E_n = -13.6\\frac{Z^2}{n^2}\\text{ eV},\\quad r_n = 0.529\\frac{n^2}{Z}\\text{ \\AA}', note: 'Holds for single-electron species (H, He+, Li2+)' },
        { name: 'Radial & Angular Nodes', formula: '\\text{Radial nodes} = n - l - 1,\\quad \\text{Angular nodes} = l,\\quad \\text{Total nodes} = n - 1', note: 'l = 0(s), 1(p), 2(d), 3(f)' },
        { name: 'Spin-only Magnetic Moment', formula: '\\mu = \\sqrt{n(n + 2)}\\text{ BM}', note: 'n = number of unpaired electrons' }
      ],
      mustRememberPoints: [
        'Quantum numbers: Principal n (size, shell), Azimuthal l (0 to n-1, shape, subshell), Magnetic m_l (-l to +l, spatial orientation), Spin m_s (±1/2).',
        'Aufbau Principle ((n + l) rule for filling energy order), Pauli Exclusion Principle (no two electrons have identical 4 quantum numbers), Hund\'s Rule of maximum multiplicity.',
        'Cr (3d⁵ 4s¹) and Cu (3d¹⁰ 4s¹) have anomalous configurations due to extra stability of half-filled and fully-filled subshells.'
      ],
      commonPitfalls: [
        'For single-electron species (H-atom), energy depends ONLY on n (3s, 3p, 3d have identical degenerate energy in H).'
      ],
      speedTricks: [
        'Orbital angular momentum: L = √(l(l + 1)) · (h / 2π). For s-orbital (l = 0), L is always 0.'
      ]
    },
    branches: [
      {
        id: 'quantum-nos',
        title: 'Quantum Numbers & Nodes',
        color: 'purple',
        summary: 'Wavefunctions, radial distribution functions, degenerate levels',
        nodes: [
          { id: 'radial-curves', title: 'Radial Probability Function 4πr²R²(r)', details: 'Starts from 0 at r = 0 for all orbitals; passes through zero at radial nodes.' }
        ]
      }
    ]
  },
  {
    id: 'chemical-bonding',
    chapterNumber: 24,
    subject: 'Chemistry',
    category: 'Physical Chemistry',
    title: 'Chemical Bonding and Molecular Structure',
    tagline: 'VSEPR Theory, Hybridisation, MOT, Dipole Moments & Hydrogen Bonding',
    centerConcept: {
      title: 'Orbital Overlap & Molecular Geometry',
      coreDefinition: 'Formation of covalent bonds through valence bond hybridization and delocalized molecular orbital linear combinations (LCAO).',
      keyLaw: 'Bond Order = 1/2 (N_b - N_a). Molecule is stable if N_b > N_a; paramagnetic if unpaired electrons exist.'
    },
    weightage: '8 - 12 Marks (2-3 Questions guaranteed)',
    difficulty: 'High-Yield',
    estimatedRevisionTime: '1 min Quick / 12 min Deep',
    oneMinuteSummary: {
      keyFormulas: [
        { name: 'Steric Number (Hybridisation)', formula: 'SN = \\text{Bond pairs} + \\text{Lone pairs} = \\frac{1}{2}[V + M - C + A]', note: 'V = valence e⁻, M = monovalent atoms, C = cation, A = anion' },
        { name: 'MOT Electron Configurations (≤ 14 e⁻)', formula: '\\sigma 1s < \\sigma^* 1s < \\sigma 2s < \\sigma^* 2s < (\\pi 2p_x = \\pi 2p_y) < \\sigma 2p_z', note: 'For > 14 e⁻ (O2, F2), σ 2pz is lower than π 2px, π 2py' },
        { name: 'Dipole Moment & % Ionic Character', formula: '\\mu = q \\times d,\\quad \\%\\text{ Ionic character} = \\frac{\\mu_{\\text{obs}}}{\\mu_{\\text{calc}}} \\times 100\\%', note: '1 Debye = 3.335 × 10⁻³⁰ C·m' }
      ],
      mustRememberPoints: [
        'VSEPR shapes with lone pairs: sp³ with 1 LP = Trigonal Pyramidal (NH3); 2 LP = Bent/V-shaped (H2O); sp³d with 1 LP = See-saw (SF4); 2 LP = T-shaped (ClF3); 3 LP = Linear (XeF2); sp³d² with 2 LP = Square Planar (XeF4).',
        'Paramagnetic species in MOT: B2 (BO = 1, 2 unpaired in π2p), O2 (BO = 2, 2 unpaired in π*2p), NO (BO = 2.5), O2⁺ (BO = 2.5).',
        'Hydrogen bonding strength: F-H···F > O-H···O > N-H···N. Intramolecular H-bonding decreases boiling point (o-nitrophenol vs p-nitrophenol).'
      ],
      commonPitfalls: [
        'XeF4 has sp³d² hybridisation with 2 lone pairs placed trans to each other, making its net dipole moment ZERO.'
      ],
      speedTricks: [
        'Bond Order shortcut for 14 e⁻: 14 e⁻ → BO = 3.0. Each addition or subtraction of 1 e⁻ decreases BO by 0.5 (13 e⁻ → 2.5, 15 e⁻ → 2.5, 16 e⁻ → 2.0).'
      ]
    },
    branches: [
      {
        id: 'mot-diagrams',
        title: 'Molecular Orbital Theory',
        color: 'emerald',
        summary: 'Bond order, magnetic property, bond length comparison',
        nodes: [
          { id: 'o2-species', title: 'O2 Series Comparison', formula: 'O_2^{2+} (3.0) > O_2^+ (2.5) > O_2 (2.0) > O_2^- (1.5) > O_2^{2-} (1.0)', details: 'Bond length order is exact inverse of bond order.' }
        ]
      }
    ]
  },
  {
    id: 'chemical-thermodynamics',
    chapterNumber: 25,
    subject: 'Chemistry',
    category: 'Physical Chemistry',
    title: 'Chemical Thermodynamics',
    tagline: 'Enthalpy, Hess\'s Law, Entropy, Gibbs Energy & Spontaneity Criterion',
    centerConcept: {
      title: 'Spontaneity & Gibbs Free Energy',
      coreDefinition: 'State functions governing heat exchange, disorder (entropy), and criterion for spontaneity at constant temperature and pressure.',
      keyLaw: 'Gibbs-Helmholtz: ΔG = ΔH - TΔS. Spontaneous when ΔG < 0; at equilibrium ΔG = 0.'
    },
    weightage: '4 - 8 Marks (1-2 Questions)',
    difficulty: 'High-Yield',
    estimatedRevisionTime: '1 min Quick / 10 min Deep',
    oneMinuteSummary: {
      keyFormulas: [
        { name: 'Enthalpy & Work Relation', formula: '\\Delta H = \\Delta U + \\Delta n_g R T,\\quad \\Delta n_g = \\sum n_{g,\\text{products}} - \\sum n_{g,\\text{reactants}}', note: 'Applies to ideal gas reactions' },
        { name: 'Gibbs Free Energy & Equilibrium', formula: '\\Delta G^\\circ = -RT\\ln K_{\\text{eq}} = -2.303 RT\\log K_{\\text{eq}}', note: 'If K > 1, ΔG° < 0' },
        { name: 'Entropy of Universe', formula: '\\Delta S_{\\text{total}} = \\Delta S_{\\text{system}} + \\Delta S_{\\text{surroundings}} > 0\\text{ (Spontaneous)}', note: 'ΔS_surr = -ΔH_sys / T' }
      ],
      mustRememberPoints: [
        'Standard enthalpy of formation (ΔH_f°) of pure elements in their reference standard state is ZERO (e.g. O2(g), C(graphite), Br2(l), I2(s), S(rhombic)).',
        'Hess\'s Law of constant heat summation: Enthalpy change is independent of route.',
        'Spontaneity matrix: ΔH < 0, ΔS > 0 → Spontaneous at all temperatures; ΔH > 0, ΔS < 0 → Non-spontaneous at all temperatures; ΔH > 0, ΔS > 0 → Spontaneous at HIGH temperatures; ΔH < 0, ΔS < 0 → Spontaneous at LOW temperatures.'
      ],
      commonPitfalls: [
        'ΔH_f° for C(diamond) is NOT zero (ΔH_f° = +1.9 kJ/mol); graphite is the standard thermodynamic state.'
      ],
      speedTricks: [
        'Temperature of equilibrium transition: T_eq = ΔH / ΔS.'
      ]
    },
    branches: [
      {
        id: 'thermochem',
        title: 'Thermochemical Calculations',
        color: 'rose',
        summary: 'Enthalpy of combustion, neutralization, atomization, bond enthalpies',
        nodes: [
          { id: 'bond-enthalpy', title: 'Reaction Enthalpy from Bond Energies', formula: '\\Delta_r H = \\sum BE_{\\text{reactants}} - \\sum BE_{\\text{products}}', details: 'Notice it is Reactants minus Products (unlike formation enthalpies).' }
        ]
      }
    ]
  },
  {
    id: 'solutions',
    chapterNumber: 26,
    subject: 'Chemistry',
    category: 'Physical Chemistry',
    title: 'Solutions',
    tagline: 'Raoult\'s Law, Ideal & Non-Ideal Solutions, Colligative Properties & Van \'t Hoff Factor',
    centerConcept: {
      title: 'Colligative Properties & Solute Dissociation',
      coreDefinition: 'Properties of dilute solutions depending exclusively on the number of solute particles relative to total molecules present.',
      keyLaw: 'Raoult\'s Law: P_total = P_A° χ_A + P_B° χ_B.'
    },
    weightage: '4 - 8 Marks (1-2 Questions)',
    difficulty: 'Moderate',
    estimatedRevisionTime: '1 min Quick / 8 min Deep',
    oneMinuteSummary: {
      keyFormulas: [
        { name: 'Relative Lowering of Vapor Pressure', formula: '\\frac{P_A^\\circ - P_s}{P_A^\\circ} = i\\,\\chi_{\\text{solute}} \\approx i\\frac{n_B}{n_A} = i\\frac{w_B M_A}{M_B w_A}', note: 'RLVP' },
        { name: 'Elevation in BP & Depression in FP', formula: '\\Delta T_b = i\\,K_b\\,m,\\quad \\Delta T_f = i\\,K_f\\,m', note: 'Kb = ebullioscopic constant, Kf = cryoscopic constant' },
        { name: 'Osmotic Pressure & Van \'t Hoff Factor', formula: '\\pi = i\\,C R T,\\quad i = 1 + (n - 1)\\alpha\\text{ (Dissoc)},\\ i = 1 + \\left(\\frac{1}{n} - 1\\right)\\beta\\text{ (Assoc)}', note: 'α = degree of dissociation, β = association' }
      ],
      mustRememberPoints: [
        'Positive deviation from Raoult\'s law (A-B interaction < A-A, B-B): ΔH_mix > 0, ΔV_mix > 0, P_obs > P_calc. Example: Ethanol + Acetone, CS2 + Acetone (forms minimum boiling azeotrope).',
        'Negative deviation (A-B interaction > A-A, B-B): ΔH_mix < 0, ΔV_mix < 0, P_obs < P_calc. Example: Chloroform + Acetone, HNO3 + H2O (forms maximum boiling azeotrope).',
        'Abnormal molar mass: M_exp = M_normal / i.'
      ],
      commonPitfalls: [
        'Do not forget the van \'t Hoff factor i for ionic electrolytes (NaCl i=2, BaCl2 i=3, K4[Fe(CN)6] i=5 for 100% dissociation).'
      ],
      speedTricks: [
        'For acetic acid dimerization in benzene: 2 CH3COOH ⇌ (CH3COOH)2, i = 1 - β/2. If β = 100%, i = 0.5.'
      ]
    },
    branches: [
      {
        id: 'azeotropes',
        title: 'Azeotropes & Deviations',
        color: 'sky',
        summary: 'Vapor-liquid equilibrium curves and Henry\'s Law (P = K_H · χ)',
        nodes: [
          { id: 'henry-law', title: 'Henry\'s Law', formula: 'P = K_H \\cdot \\chi', details: 'Solubility of gas in liquid decreases with temperature; higher KH means lower solubility.' }
        ]
      }
    ]
  },
  {
    id: 'equilibrium',
    chapterNumber: 27,
    subject: 'Chemistry',
    category: 'Physical Chemistry',
    title: 'Equilibrium',
    tagline: 'Chemical Equilibrium, Le Chatelier\'s Principle, Ionic pH, Buffers & Ksp',
    centerConcept: {
      title: 'Dynamic Equilibrium & Acid-Base Dissociation',
      coreDefinition: 'Dynamic balance between forward and reverse reaction rates; dissociation equilibria of weak electrolytes in aqueous systems.',
      keyLaw: 'Kp = Kc (RT)^Δn_g; Le Chatelier: system shifts to counteract imposed stress.'
    },
    weightage: '8 Marks (2 Questions: 1 Chemical + 1 Ionic)',
    difficulty: 'High-Yield',
    estimatedRevisionTime: '1 min Quick / 12 min Deep',
    oneMinuteSummary: {
      keyFormulas: [
        { name: 'K_p and K_c Relation', formula: 'K_p = K_c (RT)^{\\Delta n_g}', note: 'If Δng = 0, Kp = Kc' },
        { name: 'pH of Weak Acid & Ostwald Dilution', formula: '\\text{pH} = \\frac{1}{2}(\\text{p}K_a - \\log C),\\quad \\alpha = \\sqrt{\\frac{K_a}{C}}', note: 'Valid when α < 0.05 (5%)' },
        { name: 'Buffer Solutions (Henderson Equation)', formula: '\\text{pH} = \\text{p}K_a + \\log\\frac{[\\text{Conjugate Base}]}{[\\text{Acid}]},\\quad \\text{pOH} = \\text{p}K_b + \\log\\frac{[\\text{Conjugate Acid}]}{[\\text{Base}]}', note: 'Max buffer capacity when [Salt] = [Acid]' }
      ],
      mustRememberPoints: [
        'Le Chatelier: Adding inert gas at constant volume has NO effect on equilibrium. Adding inert gas at constant pressure shifts towards side with MORE gas moles (Δn_g > 0).',
        'Salt hydrolysis pH: Weak Acid + Strong Base: pH = 7 + 1/2(pK_a + log C); Strong Acid + Weak Base: pH = 7 - 1/2(pK_b + log C); Weak Acid + Weak Base: pH = 7 + 1/2(pK_a - pK_b) (independent of concentration!).',
        'Solubility product: Precipitation occurs if Reaction Quotient Q_sp > K_sp.'
      ],
      commonPitfalls: [
        'Never include pure solids or pure liquids in the expression of K_eq (their activities are taken as unity).'
      ],
      speedTricks: [
        'For salt Ax By: K_sp = x^x · y^y · s^(x+y). For AgCl (AB): K_sp = s²; for PbCl2 (AB2): K_sp = 4s³; for Al(OH)3 (AB3): K_sp = 27s⁴.'
      ]
    },
    branches: [
      {
        id: 'ionic-buffer',
        title: 'Ionic & Buffer Solutions',
        color: 'purple',
        summary: 'Common ion effect, pH curves, solubility product',
        nodes: [
          { id: 'common-ion', title: 'Common Ion Suppression', details: 'Solubility of AgCl is suppressed in 0.1 M NaCl: s\' = K_sp / 0.1.' }
        ]
      }
    ]
  },
  {
    id: 'redox-and-electrochemistry',
    chapterNumber: 28,
    subject: 'Chemistry',
    category: 'Physical Chemistry',
    title: 'Redox Reactions and Electrochemistry',
    tagline: 'Balancing, Galvanic Cells, Nernst Equation, Kohlrausch\'s Law & Faraday\'s Laws',
    centerConcept: {
      title: 'Electrochemical Cells & Redox Potentials',
      coreDefinition: 'Interconversion of chemical and electrical energy; electrode potentials, electrolytic conductance and Faraday stoichiometry.',
      keyLaw: 'Nernst Equation: E_cell = E°_cell - (0.0591 / n) log Q at 298 K.'
    },
    weightage: '8 Marks (2 Questions consistently)',
    difficulty: 'High-Yield',
    estimatedRevisionTime: '1 min Quick / 10 min Deep',
    oneMinuteSummary: {
      keyFormulas: [
        { name: 'Nernst Equation at 298 K', formula: 'E_{\\text{cell}} = E^\\circ_{\\text{cell}} - \\frac{0.0591}{n}\\log_{10} Q', note: 'At equilibrium, E_cell = 0 → E°_cell = (0.0591/n) log K_eq' },
        { name: 'Gibbs Energy of Cell', formula: '\\Delta G^\\circ = -n F E^\\circ_{\\text{cell}},\\quad \\Delta G = -n F E_{\\text{cell}}', note: '1 Faraday F ≈ 96500 C/mol' },
        { name: 'Kohlrausch\'s Law & Conductance', formula: '\\Lambda_m^\\circ = \\nu_+ \\lambda_+^\\circ + \\nu_- \\lambda_-^\\circ,\\quad \\alpha = \\frac{\\Lambda_m}{\\Lambda_m^\\circ},\\quad \\kappa = \\frac{1}{R}\\left(\\frac{l}{A}\\right)', note: 'κ = conductivity, l/A = cell constant' }
      ],
      mustRememberPoints: [
        'E°_cell = E°_cathode(reduction) - E°_anode(reduction). A spontaneous cell has E°_cell > 0 and ΔG° < 0.',
        'Molar conductivity (Λ_m) increases upon dilution for both strong and weak electrolytes; conductivity (κ) DECREASES upon dilution.',
        'Faraday\'s First Law: w = Z I t = (E / 96500) I t, where equivalent weight E = Molar mass / n-factor.'
      ],
      commonPitfalls: [
        'Electrode potentials (E°) are INTENSIVE properties and do not double when the chemical equation is multiplied by 2.'
      ],
      speedTricks: [
        'Combining half-cells: ΔG°_3 = ΔG°_1 + ΔG°_2 → n3 E°_3 = n1 E°_1 + n2 E°_2. Never add E° directly!'
      ]
    },
    branches: [
      {
        id: 'electrolysis-cond',
        title: 'Electrolytic Conductance',
        color: 'amber',
        summary: 'Debye-Huckel-Onsager equation, batteries (lead storage, fuel cell)',
        nodes: [
          { id: 'dho-eqn', title: 'Debye-Hückel-Onsager', formula: '\\Lambda_m = \\Lambda_m^\\circ - A\\sqrt{C}', details: 'Linear plot of Λm vs √C for strong electrolytes.' }
        ]
      }
    ]
  },
  {
    id: 'chemical-kinetics',
    chapterNumber: 29,
    subject: 'Chemistry',
    category: 'Physical Chemistry',
    title: 'Chemical Kinetics',
    tagline: 'Rate Laws, Integrated Rate Equations, Half-Life, Arrhenius Equation & Catalysis',
    centerConcept: {
      title: 'Reaction Rates & Activation Barriers',
      coreDefinition: 'Factors affecting chemical reaction rates, order/molecularity of reactions and temperature dependence via activation energy.',
      keyLaw: 'Arrhenius Equation: k = A e^(-E_a / RT); ln(k2/k1) = (E_a/R) [1/T1 - 1/T2].'
    },
    weightage: '4 - 8 Marks (1-2 Questions)',
    difficulty: 'High-Yield',
    estimatedRevisionTime: '1 min Quick / 8 min Deep',
    oneMinuteSummary: {
      keyFormulas: [
        { name: 'First Order Kinetics', formula: 'k = \\frac{2.303}{t}\\log\\frac{[A]_0}{[A]},\\quad t_{1/2} = \\frac{\\ln 2}{k} = \\frac{0.693}{k}', note: 't_1/2 is independent of initial concentration' },
        { name: 'Zero Order Kinetics', formula: '[A] = [A]_0 - kt,\\quad t_{1/2} = \\frac{[A]_0}{2k}', note: 'Rate = k (constant with time)' },
        { name: 'Arrhenius Two-Temperature Form', formula: '\\log\\frac{k_2}{k_1} = \\frac{E_a}{2.303 R}\\left[\\frac{T_2 - T_1}{T_1 T_2}\\right]', note: 'Slope of ln k vs 1/T is -E_a / R' }
      ],
      mustRememberPoints: [
        'Order of reaction is experimentally determined and can be fractional, zero or negative; Molecularity is theoretical integer (1, 2, 3) for elementary step.',
        'Units of rate constant k: (mol/L)^(1 - n) · s⁻¹, where n is overall reaction order.',
        'For 1st order reaction: t_75% = 2 × t_50%; t_87.5% = 3 × t_50%; t_99.9% ≈ 10 × t_50%.'
      ],
      commonPitfalls: [
        'Catalyst increases rate of BOTH forward and backward reactions equally by lowering activation energy E_a; it does NOT alter ΔH, ΔG or K_eq.'
      ],
      speedTricks: [
        'Half-life dependency: t_1/2 ∝ 1 / [A]₀^(n - 1). For n=0 → t_1/2 ∝ [A]₀; n=1 → constant; n=2 → t_1/2 ∝ 1/[A]₀.'
      ]
    },
    branches: [
      {
        id: 'order-determination',
        title: 'Order & Collision Theory',
        color: 'emerald',
        summary: 'Initial rate method, pseudo first-order, steric factor P',
        nodes: [
          { id: 'pseudo-first', title: 'Pseudo-First Order', formula: 'k_{\\text{obs}} = k [\\text{Solvent}]', details: 'Acid hydrolysis of ester with excess water.' }
        ]
      }
    ]
  },

  // --- Inorganic Chemistry (4 Chapters) ---
  {
    id: 'classification-of-elements',
    chapterNumber: 30,
    subject: 'Chemistry',
    category: 'Inorganic Chemistry',
    title: 'Classification of Elements and Periodicity in Properties',
    tagline: 'Modern Periodic Table, Atomic Radii, Ionisation Enthalpy, Electron Gain & Electronegativity',
    centerConcept: {
      title: 'Periodic Trends & Effective Nuclear Charge',
      coreDefinition: 'Systematic variation in physical and chemical properties governed by effective nuclear charge (Z_eff) and screening effects.',
      keyLaw: 'Slater\'s Rules: Z_eff = Z - σ. Ionisation energy increases across period, decreases down group.'
    },
    weightage: '4 Marks (1 Question)',
    difficulty: 'Easy',
    estimatedRevisionTime: '1 min Quick / 8 min Deep',
    oneMinuteSummary: {
      keyFormulas: [
        { name: 'Effective Nuclear Charge', formula: 'Z_{\\text{eff}} = Z - \\sigma', note: 'Increases left to right across a period' },
        { name: 'Mulliken & Pauling Electronegativity', formula: '\\chi_{\\text{Mulliken}} = \\frac{IE + EA}{2}\\ (\\text{in eV}),\\quad \\chi_A - \\chi_B = 0.208\\sqrt{\\Delta}', note: 'Pauling scale: F = 4.0, O = 3.5, N = Cl = 3.0' }
      ],
      mustRememberPoints: [
        'Ionisation Enthalpy Exceptions: Be > B (full 2s² vs 2p¹); N > O (half-filled 2p³ vs 2p⁴); Mg > Al; P > S.',
        'Electron Gain Enthalpy (most negative): Cl > F (due to small size of F and interelectronic repulsions in compact 2p subshell); S > O.',
        'Isoelectronic species: More positive nuclear charge = smaller ionic radius: Al³⁺ < Mg²⁺ < Na⁺ < F⁻ < O²⁻ < N³⁻.'
      ],
      commonPitfalls: [
        'Second electron gain enthalpy is ALWAYS positive (endothermic) for all elements due to strong electrostatic repulsion with existing anion (e.g. O⁻ + e⁻ → O²⁻).'
      ],
      speedTricks: [
        'Diagonal relationships: Li-Mg, Be-Al, B-Si (similar charge-to-radius ratio and electronegativity).'
      ]
    },
    branches: [
      {
        id: 'periodic-trends',
        title: 'Periodic Property Anomalies',
        color: 'blue',
        summary: 'Atomic/ionic radii, ionization energies, electron gain enthalpies',
        nodes: [
          { id: 'inert-pair', title: 'Inert Pair Effect', details: 'Reluctance of outer s-electrons to participate in bonding in heavier p-block elements (Tl⁺ > Tl³⁺, Pb²⁺ > Pb⁴⁺, Bi³⁺ > Bi⁵⁺).' }
        ]
      }
    ]
  },
  {
    id: 'p-block-elements',
    chapterNumber: 31,
    subject: 'Chemistry',
    category: 'Inorganic Chemistry',
    title: 'p-Block Elements',
    tagline: 'Groups 13 to 18 Trends, Inert Pair Effect, Oxoacids & Interhalogen Compounds',
    centerConcept: {
      title: 'p-Block Chemistry & Variable Valence',
      coreDefinition: 'Valence electron configurations ns² np¹⁻⁶ exhibiting allotropy, catenation, multiple bonding, and anomalous first-row behaviors.',
      keyLaw: 'Inert pair effect stabilizes lower oxidation state by 2 units for heavier elements down the group.'
    },
    weightage: '4 - 8 Marks (1-2 Questions in current syllabus)',
    difficulty: 'Moderate',
    estimatedRevisionTime: '1 min Quick / 10 min Deep',
    oneMinuteSummary: {
      keyFormulas: [
        { name: 'Oxidation States Stability Order', formula: '\\text{Tl}^+ > \\text{Tl}^{3+},\\quad \\text{Pb}^{2+} > \\text{Pb}^{4+},\\quad \\text{Bi}^{3+} > \\text{Bi}^{5+}', note: 'Result of inert pair effect' },
        { name: 'Xenon Fluoride Hydrolysis', formula: 'XeF_6 + 3H_2O \\rightarrow XeO_3 + 6HF,\\quad 6XeF_4 + 12H_2O \\rightarrow 2XeO_3 + 4Xe + 24HF + 3O_2', note: 'XeF4 undergoes disproportionation' }
      ],
      mustRememberPoints: [
        'Borax bead test: Na2B4O7·10H2O on heating forms glassy transparent bead of NaBO2 + B2O3. Copper gives blue bead in oxidizing flame.',
        'Oxoacids of Phosphorus: H3PO2 (1 P-OH, monoprotic, strong reducing), H3PO3 (2 P-OH, diprotic), H3PO4 (3 P-OH, triprotic).',
        'Noble gas geometry: XeF2 (sp³d, Linear, 3 LP), XeF4 (sp³d², Square planar, 2 LP), XeO3 (sp³, Pyramidal, 1 LP), XeOF4 (sp³d², Square pyramidal, 1 LP).'
      ],
      commonPitfalls: [
        'H3PO2 has TWO P-H bonds and ONE P-OH bond; its basicity is 1, not 3!'
      ],
      speedTricks: [
        'Interhalogen compound geometry: IF7 is Pentagonal Bipyramidal (sp³d³), ClF3 is T-shaped (sp³d), BrF5 is Square Pyramidal (sp³d²).'
      ]
    },
    branches: [
      {
        id: 'pblock-reactions',
        title: 'Group Trends & Reagents',
        color: 'emerald',
        summary: 'Nitrogen family, Chalcogens, Halogens and Noble gas compounds',
        nodes: [
          { id: 'halogen-oxidizing', title: 'Oxidizing Power of Halogens', formula: 'F_2 > Cl_2 > Br_2 > I_2', details: 'F2 is strongest oxidizer due to low bond dissociation enthalpy and high hydration enthalpy of F⁻.' }
        ]
      }
    ]
  },
  {
    id: 'd-and-f-block-elements',
    chapterNumber: 32,
    subject: 'Chemistry',
    category: 'Inorganic Chemistry',
    title: 'd- and f-Block Elements',
    tagline: 'Transition Metals, Lanthanoid Contraction, KMnO4, K2Cr2O7 & Magnetic Properties',
    centerConcept: {
      title: 'Variable Oxidation & Coordination Catalysts',
      coreDefinition: 'Partially filled d- and f-orbitals imparting colored ions, catalytic activities, interstitial alloys, and magnetic moments.',
      keyLaw: 'Lanthanoid Contraction: poor shielding by 4f electrons causes nearly identical atomic radii for 4d and 5d elements (Zr ≈ Hf).'
    },
    weightage: '8 Marks (2 Questions consistently)',
    difficulty: 'High-Yield',
    estimatedRevisionTime: '1 min Quick / 10 min Deep',
    oneMinuteSummary: {
      keyFormulas: [
        { name: 'KMnO4 in Different Media (n-factors)', formula: '\\text{Acidic: } MnO_4^- \\rightarrow Mn^{2+}\\ (n=5);\\ \\text{Basic: } MnO_4^- \\rightarrow MnO_4^{2-}\\ (n=1);\\ \\text{Neutral: } MnO_4^- \\rightarrow MnO_2\\ (n=3)', note: 'Remember n-factor code: 5, 1, 3' },
        { name: 'K2Cr2O7 Acidic Titration', formula: 'Cr_2O_7^{2-} + 14H^+ + 6e^- \\rightarrow 2Cr^{3+} + 7H_2O\\ (n=6)', note: 'Equivalent weight = M / 6' },
        { name: 'Spin-only Formula', formula: '\\mu = \\sqrt{n(n + 2)}\\text{ BM}', note: 'Fe³⁺ (d⁵, n=5) → 5.92 BM' }
      ],
      mustRememberPoints: [
        'Lanthanoid Contraction consequence: Pairs with identical radii and chemistry: Zr/Hf (160 pm), Nb/Ta, Mo/W.',
        'Chromyl chloride test for chloride ions: Salt + K2Cr2O7 + conc. H2SO4 → Red-orange vapors of CrO2Cl2 (absorbed in NaOH → yellow Na2CrO4; + lead acetate → yellow PbCrO4 ppt).',
        'Interstitial compounds: Small atoms (H, B, C, N) trapped in crystal lattice; very hard, high melting points, retain metallic conductivity.'
      ],
      commonPitfalls: [
        'Chlorides of Hg²⁺, Ag⁺, Pb²⁺, Sn⁴⁺ do NOT respond to the chromyl chloride test due to their covalent nature.'
      ],
      speedTricks: [
        'Highest oxidation states: Ru and Os exhibit +8 in RuO4 and OsO4; Mn exhibits +7 in KMnO4.'
      ]
    },
    branches: [
      {
        id: 'redox-reagents-df',
        title: 'KMnO4 & K2Cr2O7 Reactions',
        color: 'purple',
        summary: 'Acidic, neutral and basic oxidation pathways',
        nodes: [
          { id: 'permanganate-ox', title: 'KMnO4 Oxidations', details: 'Fe²⁺ → Fe³⁺; C2O4²⁻ → CO2; I⁻ → I2 (acidic) or IO3⁻ (neutral/faintly alkaline).' }
        ]
      }
    ]
  },
  {
    id: 'coordination-compounds',
    chapterNumber: 33,
    subject: 'Chemistry',
    category: 'Inorganic Chemistry',
    title: 'Coordination Compounds',
    tagline: 'Werner\'s Theory, IUPAC Nomenclature, Isomerism, CFT & Spectrochemical Series',
    centerConcept: {
      title: 'Crystal Field Splitting & Ligand Field Theory',
      coreDefinition: 'Coordination complex formation with central metal d-orbitals split into t_2g and e_g sets by electrostatic ligand fields.',
      keyLaw: 'Crystal Field Splitting: Octahedral Δ_o = 10 Dq; Tetrahedral Δ_t = (4/9) Δ_o.'
    },
    weightage: '8 - 12 Marks (2-3 Questions guaranteed)',
    difficulty: 'High-Yield',
    estimatedRevisionTime: '1 min Quick / 12 min Deep',
    oneMinuteSummary: {
      keyFormulas: [
        { name: 'Octahedral CFSE', formula: '\\text{CFSE} = [-0.4\\,n(t_{2g}) + 0.6\\,n(e_g)]\\Delta_o + m P', note: 'P = pairing energy' },
        { name: 'Tetrahedral Splitting', formula: '\\Delta_t = \\frac{4}{9}\\Delta_o', note: 'Tetrahedral complexes are almost always high spin' },
        { name: 'Spectrochemical Series (Field Strength)', formula: 'I^- < Br^- < S^{2-} < Cl^- < NO_3^- < F^- < OH^- < H_2O < NCS^- < EDTA^{4-} < NH_3 < en < CN^- < CO', note: 'CO and CN⁻ are strong field ligands' }
      ],
      mustRememberPoints: [
        'Werner\'s Theory: Primary valency = Oxidation state (ionizable, non-directional); Secondary valency = Coordination number (non-ionizable, directional).',
        'Strong field ligands (Δ_o > P): Pairing occurs before filling e_g (low spin complex, diamagnetic or low paramagnetism).',
        'Weak field ligands (Δ_o < P): Hund\'s rule followed (high spin complex).',
        'Isomerism: Geometrical (cis/trans in square planar [MA2B2], fac/mer in octahedral [MA3B3]); Optical (cis-[M(AA)2B2] is optically active with non-superimposable mirror image; trans is optically inactive with plane of symmetry).'
      ],
      commonPitfalls: [
        'Square planar complexes [MA4], [MA3B], [MAB3] do NOT show geometrical isomerism; tetrahedral complexes never show geometrical isomerism.'
      ],
      speedTricks: [
        'Synergic bonding in metal carbonyls [M(CO)x]: M → C π back-bonding strengthens M-C bond and weakens/lengthens the C-O bond (decreases C-O stretching frequency).'
      ]
    },
    branches: [
      {
        id: 'cft-isomerism',
        title: 'CFT & Complex Isomerism',
        color: 'rose',
        summary: 'Inner vs outer orbital complexes, color of complexes, linkage/ionization isomerism',
        nodes: [
          { id: 'optical-activity', title: 'Optical Activity in Coordination', formula: '[M(en)_3]^{3+}\\text{ and cis-}[M(en)_2Cl_2]^+', details: 'Lack plane or center of inversion; exist as d- and l- enantiomers.' }
        ]
      }
    ]
  },

  // --- Organic Chemistry (8 Chapters) ---
  {
    id: 'purification-and-characterisation',
    chapterNumber: 34,
    subject: 'Chemistry',
    category: 'Organic Chemistry',
    title: 'Purification and Characterisation of Organic Compounds',
    tagline: 'Crystallisation, Distillation, Chromatography, Dumas & Kjeldahl Methods',
    centerConcept: {
      title: 'Organic Analysis & Quantitative Estimation',
      coreDefinition: 'Separation and purification techniques alongside quantitative estimation of carbon, hydrogen, nitrogen, halogens, and sulfur.',
      keyLaw: 'Kjeldahl: %N = (1.4 × N × V) / w; Dumas: %N = (28 × V_STP) / (22400 × w) × 100.'
    },
    weightage: '4 Marks (1 Question guaranteed)',
    difficulty: 'Easy',
    estimatedRevisionTime: '1 min Quick / 8 min Deep',
    oneMinuteSummary: {
      keyFormulas: [
        { name: 'Kjeldahl Nitrogen Estimation', formula: '\\%N = \\frac{1.4 \\times N_{\\text{acid}} \\times V_{\\text{acid}}}{w_{\\text{sample}}}', note: 'V = volume of standard acid neutralized by NH3' },
        { name: 'Carius Halogen Estimation', formula: '\\%X = \\frac{\\text{At. wt of }X}{\\text{Molar mass of }AgX} \\times \\frac{w_{AgX}}{w_{\\text{sample}}} \\times 100', note: 'AgCl (143.5), AgBr (188), AgI (235)' },
        { name: 'Carius Sulfur & Phosphorus', formula: '\\%S = \\frac{32}{233} \\times \\frac{w_{BaSO_4}}{w} \\times 100,\\quad \\%P = \\frac{62}{222} \\times \\frac{w_{Mg_2P_2O_7}}{w} \\times 100', note: 'Precipitated as BaSO4 and Mg2P2O7' }
      ],
      mustRememberPoints: [
        'Kjeldahl method FAILS for: Nitro (-NO2), Azo (-N=N-), and nitrogen in pyridine/ring compounds because their nitrogen does not convert to (NH4)2SO4.',
        'Distillation types: Fractional (boiling points differ by < 25°C); Steam distillation (for steam-volatile and water-immiscible liquids like aniline); Vacuum distillation (liquids decomposing near normal boiling points like glycerol).',
        'Chromatography: Thin Layer (TLC) Retention factor R_f = (Distance by substance) / (Distance by solvent front).'
      ],
      commonPitfalls: [
        'Remember Dumas method is applicable to ALL nitrogen-containing organic compounds without exception (unlike Kjeldahl).'
      ],
      speedTricks: [
        'Steam distillation condition: P_total = P_water + P_organic = 1 atm. Hence liquid boils at a temperature LOWER than its normal boiling point.'
      ]
    },
    branches: [
      {
        id: 'purif-tech',
        title: 'Separation & Detection',
        color: 'sky',
        summary: 'Lassaigne\'s extract tests (N, S, Halogens) and estimations',
        nodes: [
          { id: 'lassaigne-tests', title: 'Lassaigne Test Color Indicators', details: 'Nitrogen: Prussian blue Fe4[Fe(CN)6]3; Sulfur: Blood red [Fe(SCN)]²⁺ or purple with sodium nitroprusside [Fe(CN)5NOS]⁴⁻.' }
        ]
      }
    ]
  },
  {
    id: 'basic-principles-organic-chemistry',
    chapterNumber: 35,
    subject: 'Chemistry',
    category: 'Organic Chemistry',
    title: 'Some Basic Principles of Organic Chemistry',
    tagline: 'IUPAC Nomenclature, Electronic Effects (Inductive, Resonance, Hyperconjugation) & Reaction Intermediates',
    centerConcept: {
      title: 'Electronic Displacements & Intermediate Stability',
      coreDefinition: 'Ground-state and reaction-state electron delocalizations dictating carbocation, carbanion, and free radical stability hierarchies.',
      keyLaw: 'Stability orders: 3° > 2° > 1° for Carbocations and Radicals; 1° > 2° > 3° for Carbanions.'
    },
    weightage: '8 - 12 Marks (2-3 Questions guaranteed)',
    difficulty: 'High-Yield',
    estimatedRevisionTime: '1 min Quick / 12 min Deep',
    oneMinuteSummary: {
      keyFormulas: [
        { name: 'Carbocation Stability Order', formula: '\\text{Tropylium} > \\text{Triphenylmethyl} > \\text{Cyclopropylmethyl (CPM)} > \\text{Benzyl} \\approx \\text{Allyl} > 3^\\circ > 2^\\circ > 1^\\circ > \\text{Methyl}', note: 'CPM is exceptionally stable due to dancing resonance' },
        { name: 'Hyperconjugation (Baker-Nathan Effect)', formula: '\\text{No. of hyperconjugative structures} = \\alpha\\text{-Hydrogens}', note: 'More α-H = higher alkene / carbocation stability' },
        { name: 'Aromaticity (Hückel\'s Rule)', formula: '(4n + 2)\\;\\pi\\;\\text{electrons (Aromatic)},\\quad 4n\\;\\pi\\;\\text{electrons (Anti-aromatic)}', note: 'Ring must be planar, cyclic, fully conjugated' }
      ],
      mustRememberPoints: [
        'Acidic strength increases with -M and -I effects; basic strength increases with +M and +I effects.',
        'Carbocation rearrangements: Always check for hydride, methyl or phenyl shifts to achieve greater stability (e.g. 2° → 3° or ring expansion from 4-membered to 5-membered, 5-membered to 6-membered).',
        'Stereoisomerism: Number of optical isomers for n chiral carbons with no plane of symmetry = 2ⁿ.'
      ],
      commonPitfalls: [
        'Anti-aromatic rings (e.g. 1,3-cyclobutadiene, cyclooctatetraene tub shape) are extremely unstable compared to open-chain analogs.'
      ],
      speedTricks: [
        'Acidic strength of substituted benzoic acid: ortho-substituted benzoic acid is ALWAYS stronger than meta and para due to the Ortho Effect (steric inhibition of resonance).'
      ]
    },
    branches: [
      {
        id: 'goc-effects',
        title: 'Electronic Effects & Acidity',
        color: 'emerald',
        summary: 'Resonance structures, mesomeric vs inductive orders, basicity of amines',
        nodes: [
          { id: 'amine-basicity', title: 'Aliphatic Amines Basicity in Water', formula: '(\\text{CH}_3)_2\\text{NH} > \\text{CH}_3\\text{NH}_2 > (\\text{CH}_3)_3\\text{N} > \\text{NH}_3\\text{ (2° > 1° > 3°)}', details: 'For ethyl group: 2° > 3° > 1° (due to combined inductive, solvation and steric effects).' }
        ]
      }
    ]
  },
  {
    id: 'hydrocarbons',
    chapterNumber: 36,
    subject: 'Chemistry',
    category: 'Organic Chemistry',
    title: 'Hydrocarbons',
    tagline: 'Alkanes, Alkenes, Alkynes, Aromaticity & Electrophilic Aromatic Substitution',
    centerConcept: {
      title: 'Hydrocarbon Synthesis & Reaction Mechanisms',
      coreDefinition: 'Radical substitution in alkanes, electrophilic addition to alkenes/alkynes, and electrophilic aromatic substitution (EAS) in benzenoids.',
      keyLaw: 'Markovnikov\'s Rule: Electrophile H⁺ adds to double bond carbon with more hydrogens, generating more stable carbocation.'
    },
    weightage: '8 Marks (2 Questions consistently)',
    difficulty: 'High-Yield',
    estimatedRevisionTime: '1 min Quick / 10 min Deep',
    oneMinuteSummary: {
      keyFormulas: [
        { name: 'Wurtz & Kolbe Electrolytic Synthesis', formula: '2R-X + 2Na \\xrightarrow{\\text{dry ether}} R-R + 2NaX,\\quad 2RCOO^- \\xrightarrow{\\text{anode}} R-R + 2CO_2 + 2e^-', note: 'Gives symmetrical alkanes with even carbons' },
        { name: 'Ozonolysis of Alkenes', formula: 'R-CH=CH-R\' \\xrightarrow[\\text{Zn / }H_2O]{O_3} R-CHO + R\'-CHO', note: 'Cleaves double bond completely into carbonyls' },
        { name: 'Anti-Markovnikov Addition (Peroxide Effect)', formula: 'R-CH=CH_2 + HBr \\xrightarrow{\\text{Peroxide}} R-CH_2-CH_2-Br', note: 'Applies ONLY to HBr (free radical mechanism)' }
      ],
      mustRememberPoints: [
        'EAS (Electrophilic Aromatic Substitution): Nitration (conc. HNO3 + H2SO4, electrophile NO2⁺); Sulfonation (fuming H2SO4, electrophile SO3); Friedel-Crafts Alkylation (RCl + anh. AlCl3, electrophile R⁺).',
        'Activating groups (-OH, -NH2, -OCH3, -CH3) are ortho/para directing. Deactivating groups (-NO2, -CN, -COOH, -CHO) are meta directing.',
        'Halogens (-F, -Cl, -Br, -I) are deactivating due to strong -I effect, BUT ortho/para directing due to +M resonance effect!'
      ],
      commonPitfalls: [
        'Peroxide effect (Kharasch effect) is valid strictly for HBr; it does NOT work with HCl or HI because one of the propagation steps is endothermic.'
      ],
      speedTricks: [
        'Hydration of Alkynes: Propyne + H2SO4/HgSO4 gives ACETONE (via enol tautomerization), whereas Ethyne gives ACETALDEHYDE.'
      ]
    },
    branches: [
      {
        id: 'eas-reactions',
        title: 'Electrophilic Aromatic Substitution',
        color: 'purple',
        summary: 'Nitration, halogenation, Friedel-Crafts, directive influence',
        nodes: [
          { id: 'fc-limits', title: 'Friedel-Crafts Limitations', details: 'Does not occur on strongly deactivated rings (nitrobenzene, benzoic acid) or on aniline (forms complex with AlCl3 catalyst).' }
        ]
      }
    ]
  },
  {
    id: 'haloalkanes-and-haloarenes',
    chapterNumber: 37,
    subject: 'Chemistry',
    category: 'Organic Chemistry',
    title: 'Organic Compounds Containing Halogens',
    tagline: 'SN1, SN2 Mechanisms, Elimination (E1, E2), Grignard Reagent & Haloarenes',
    centerConcept: {
      title: 'Nucleophilic Substitution & Elimination Dynamics',
      coreDefinition: 'Polar C-X bond cleavage via carbocation-mediated SN1 (racemization) vs concerted backside displacement SN2 (Walden inversion).',
      keyLaw: 'SN1 rate ∝ [Substrate] (3° > 2° > 1°); SN2 rate ∝ [Substrate][Nucleophile] (1° > 2° > 3°).'
    },
    weightage: '4 - 8 Marks (1-2 Questions)',
    difficulty: 'High-Yield',
    estimatedRevisionTime: '1 min Quick / 10 min Deep',
    oneMinuteSummary: {
      keyFormulas: [
        { name: 'SN2 Mechanism Kinetics & Stereochemistry', formula: '\\text{Rate} = k[R-X][\\text{Nu}^-],\\quad \\text{100\\% Walden Inversion}', note: 'Favored by polar aprotic solvents (DMSO, DMF, Acetone)' },
        { name: 'SN1 Mechanism Kinetics & Stereochemistry', formula: '\\text{Rate} = k[R-X],\\quad \\text{Racemization with partial inversion}', note: 'Favored by polar protic solvents (H2O, EtOH)' },
        { name: 'Saytzeff vs Hoffmann Elimination', formula: '\\text{Saytzeff: More substituted alkene},\\quad \\text{Hoffmann: Less substituted alkene (bulky bases)}', note: 'Bulky base: t-BuOK' }
      ],
      mustRememberPoints: [
        'Aryl halides and vinyl halides are extremely unreactive towards nucleophilic substitution due to: resonance C-X double bond character, sp² carbon electronegativity, and instability of phenyl cation.',
        'Grignard Reagent (RMgX): Acts as strong base and strong nucleophile; reacts with active hydrogen (H2O, ROH, RCOOH, amines) to form alkane R-H.',
        'Swarts reaction: R-Cl/Br + AgF (or CoF3, SbF3) → R-F; Finkelstein reaction: R-Cl/Br + NaI / acetone → R-I.'
      ],
      commonPitfalls: [
        'Haloarenes undergo nucleophilic substitution ONLY when strong electron-withdrawing groups (-NO2) are present at ORTHO and PARA positions.'
      ],
      speedTricks: [
        'Reaction with KCN gives Cyanide (R-CN, C-attack); with AgCN gives Isocyanide (R-NC, N-attack). With KNO2 gives Nitrite (R-ONO); with AgNO2 gives Nitroalkane (R-NO2).'
      ]
    },
    branches: [
      {
        id: 'substitution-elim',
        title: 'Substitution vs Elimination Competition',
        color: 'rose',
        summary: 'Substrate structure, base strength, temperature effects on E2/SN2',
        nodes: [
          { id: 'ambident-nu', title: 'Ambident Nucleophiles', details: 'CN⁻, NO2⁻ have two nucleophilic centers depending on covalent/ionic reagent nature.' }
        ]
      }
    ]
  },
  {
    id: 'oxygen-containing-compounds',
    chapterNumber: 38,
    subject: 'Chemistry',
    category: 'Organic Chemistry',
    title: 'Organic Compounds Containing Oxygen',
    tagline: 'Alcohols, Phenols, Ethers, Aldehydes, Ketones & Carboxylic Acids',
    centerConcept: {
      title: 'Carbonyl Chemistry & Nucleophilic Addition',
      coreDefinition: 'Electrophilic carbonyl carbon reactivity undergoing nucleophilic additions, condensation cascades, and oxidation-reduction interconversions.',
      keyLaw: 'Nucleophilic addition to carbonyls: Aldehydes are more reactive than Ketones due to steric and electronic (+I) factors.'
    },
    weightage: '8 - 12 Marks (2-3 Questions guaranteed)',
    difficulty: 'High-Yield',
    estimatedRevisionTime: '1 min Quick / 14 min Deep',
    oneMinuteSummary: {
      keyFormulas: [
        { name: 'Aldol Condensation', formula: '2\\,\\text{CH}_3\\text{CHO} \\xrightarrow{\\text{dil. NaOH}} \\text{CH}_3\\text{-CH(OH)-CH}_2\\text{CHO} \\xrightarrow{\\Delta} \\text{CH}_3\\text{-CH=CH-CHO}', note: 'Requires α-hydrogen' },
        { name: 'Cannizzaro Reaction (No α-H)', formula: '2\\,\\text{HCHO} \\xrightarrow{50\\%\\text{ KOH}} \\text{CH}_3\\text{OH} + \\text{HCOOK}', note: 'Disproportionation (self redox)' },
        { name: 'Lucas Test for Alcohols', formula: '\\text{Alcohol} + \\text{conc. HCl / anh. ZnCl}_2 \\rightarrow \\text{Cloudiness / Turbidity}', note: '3° immediate, 2° in 5 mins, 1° on heating' }
      ],
      mustRememberPoints: [
        'Reimer-Tiemann Reaction: Phenol + CHCl3 + aq. NaOH → Salicylaldehyde (electrophile :CCl2, dichlorocarbene).',
        'Kolbe-Schmitt Reaction: Phenol + NaOH + CO2 (4-7 atm, 400 K) → Salicylic acid.',
        'Williamson Ether Synthesis: R-ONa + R\'-X → R-O-R\' (strictly SN2; R\'-X must be PRIMARY, otherwise 3° halide gives alkene by E2 elimination).',
        'Tests for Aldehydes: Tollens\' Test (Silver mirror), Fehling\'s Test (Red Cu2O ppt). Ketones do not reduce Tollens\' or Fehling\'s (except α-hydroxy ketones).'
      ],
      commonPitfalls: [
        'Iodoform test (NaOH + I2 → yellow CHI3 ppt) is given by compounds with CH3-C=O group or CH3-CH(OH)- group (acetaldehyde, all methyl ketones, ethanol, 2-propanol).'
      ],
      speedTricks: [
        'Clemmensen Reduction (Zn-Hg / conc. HCl) and Wolff-Kishner Reduction (NH2NH2 / KOH, glycol, Δ) convert >C=O directly into >CH2.'
      ]
    },
    branches: [
      {
        id: 'named-reactions-oxy',
        title: 'Core Named Reactions',
        color: 'emerald',
        summary: 'Aldol, Cannizzaro, Hell-Volhard-Zelinsky (HVZ), Williamson',
        nodes: [
          { id: 'hvz-reaction', title: 'HVZ Reaction', formula: 'R\\text{-CH}_2\\text{-COOH} + X_2 \\xrightarrow{\\text{Red P}} R\\text{-CH(X)-COOH}', details: 'Halogenation at α-position of carboxylic acids.' }
        ]
      }
    ]
  },
  {
    id: 'nitrogen-containing-compounds',
    chapterNumber: 39,
    subject: 'Chemistry',
    category: 'Organic Chemistry',
    title: 'Organic Compounds Containing Nitrogen',
    tagline: 'Amines, Basicity, Gabriel Phthalimide, Hoffmann Bromamide & Diazonium Salts',
    centerConcept: {
      title: 'Amine Nucleophilicity & Diazonium Couplings',
      coreDefinition: 'Nitrogen lone-pair nucleophilicity/basicity and synthetic utility of aryl diazonium salts as gateway to substituted benzenes.',
      keyLaw: 'Hoffmann Bromamide Degradation: R-CONH2 + Br2 + 4KOH → R-NH2 + K2CO3 + 2KBr + 2H2O (loss of one carbon atom).'
    },
    weightage: '4 - 8 Marks (1-2 Questions guaranteed)',
    difficulty: 'High-Yield',
    estimatedRevisionTime: '1 min Quick / 10 min Deep',
    oneMinuteSummary: {
      keyFormulas: [
        { name: 'Hoffmann Bromamide Degradation', formula: 'R\\text{-CONH}_2 + \\text{Br}_2 + 4\\text{KOH} \\rightarrow R\\text{-NH}_2 + \\text{K}_2\\text{CO}_3 + 2\\text{KBr} + 2\\text{H}_2\\text{O}', note: 'Intermediate is isocyanate R-N=C=O' },
        { name: 'Gabriel Phthalimide Synthesis', formula: '\\text{Phthalimide} \\xrightarrow{\\text{KOH}} \\text{K-Phthalimide} \\xrightarrow{R\\text{-X}} N\\text{-alkyl phthalimide} \\xrightarrow{\\text{H}_2\\text{O/OH}^-} R\\text{-NH}_2', note: 'Prepares PURE 1° aliphatic amines only' },
        { name: 'Sandmeyer & Gattermann Reactions', formula: '\\text{Ar-N}_2^+\\text{Cl}^- \\xrightarrow{\\text{CuCl / HCl}} \\text{Ar-Cl},\\quad \\text{Ar-N}_2^+\\text{Cl}^- \\xrightarrow{\\text{Cu / HCl}} \\text{Ar-Cl}', note: 'Sandmeyer uses Cu(I) salt; Gattermann uses Cu powder' }
      ],
      mustRememberPoints: [
        'Carbylamine Test (Isocyanide test): 1° amine (aliphatic or aromatic) + CHCl3 + 3KOH(alc) → foul-smelling R-NC (2° and 3° amines do NOT show this test).',
        'Hinsberg Test (benzenesulfonyl chloride C6H5SO2Cl): 1° amine gives precipitate soluble in alkali; 2° amine gives precipitate insoluble in alkali; 3° amine does not react.',
        'Azo Dye Coupling: Ar-N2⁺Cl⁻ + Phenol (basic pH 9-10) → p-hydroxyazobenzene (orange dye); with Aniline (acidic pH 4-5) → p-aminoazobenzene (yellow dye).'
      ],
      commonPitfalls: [
        'Aromatic primary amines (aniline) CANNOT be synthesized by Gabriel Phthalimide because aryl halides do not undergo SN2 displacement with phthalimide anion.'
      ],
      speedTricks: [
        'Reduction of Nitrobenzene: Fe / HCl gives Aniline; LiAlH4 gives Azobenzene; Zn / NH4Cl gives Phenylhydroxylamine (C6H5NHOH).'
      ]
    },
    branches: [
      {
        id: 'diazonium-synth',
        title: 'Diazonium Transformations',
        color: 'purple',
        summary: 'Replacement by -H (H3PO2 or EtOH), -OH (H2O, Δ), -I (KI), -F (HBF4, Balz-Schiemann)',
        nodes: [
          { id: 'balz-schiemann', title: 'Balz-Schiemann Reaction', formula: '\\text{Ar-N}_2^+\\text{Cl}^- + \\text{HBF}_4 \\rightarrow \\text{Ar-N}_2^+\\text{BF}_4^- \\xrightarrow{\\Delta} \\text{Ar-F} + \\text{BF}_3 + \\text{N}_2', details: 'Preparation of fluorobenzene.' }
        ]
      }
    ]
  },
  {
    id: 'biomolecules',
    chapterNumber: 40,
    subject: 'Chemistry',
    category: 'Organic Chemistry',
    title: 'Biomolecules',
    tagline: 'Carbohydrates, Amino Acids, Peptides, Proteins, Nucleic Acids & Vitamins',
    centerConcept: {
      title: 'Biological Macromolecules & Structures',
      coreDefinition: 'Structure and linkage patterns of carbohydrates (glycosidic), proteins (peptide), and nucleic acids (phosphodiester).',
      keyLaw: 'All naturally occurring amino acids (except glycine) are chiral and have L-configuration at α-carbon.'
    },
    weightage: '4 - 8 Marks (1-2 Questions)',
    difficulty: 'Easy',
    estimatedRevisionTime: '1 min Quick / 8 min Deep',
    oneMinuteSummary: {
      keyFormulas: [
        { name: 'Reducing vs Non-reducing Sugars', formula: '\\text{Maltose, Lactose = Reducing;}\\quad \\text{Sucrose = Non-reducing (C1-C2 glycosidic linkage)}', note: 'Free hemiacetal/hemiketal OH group' },
        { name: 'Isoelectric Point (pI) of Amino Acids', formula: '\\text{pI} = \\frac{\\text{p}K_{a1} + \\text{p}K_{a2}}{2}', note: 'Zero net electric charge (Zwitterion)' },
        { name: 'Nucleotide Structure', formula: '\\text{Nucleotide} = \\text{Nitrogenous Base} + \\text{Pentose Sugar} + \\text{Phosphate Group}', note: 'Nucleoside lacks phosphate' }
      ],
      mustRememberPoints: [
        'Glucose structure: D-(+)-glucose is an aldohexose with 4 chiral carbons; forms 6-membered pyranose ring (α and β anomers differ at C1 anomeric carbon).',
        'Protein structures: Primary (amino acid sequence), Secondary (α-helix, β-pleated sheet stabilized by H-bonds), Tertiary (overall 3D folding), Quaternary (multi-subunit spatial arrangement).',
        'Denaturation of protein destroys 2°, 3°, and 4° structures; the 1° structure (peptide sequence) remains completely intact!',
        'DNA bases: Adenine (A), Guanine (G), Cytosine (C), Thymine (T). In RNA, Uracil (U) replaces Thymine. A pairs with T (2 H-bonds); G pairs with C (3 H-bonds).'
      ],
      commonPitfalls: [
        'Glycine (H2N-CH2-COOH) is the ONLY natural amino acid that is achiral and optically inactive.'
      ],
      speedTricks: [
        'Vitamins solubility: Fat-soluble = A, D, E, K; Water-soluble = B-complex and C. Vitamin B12 contains Cobalt.'
      ]
    },
    branches: [
      {
        id: 'sugar-protein',
        title: 'Sugars & Peptide Bonds',
        color: 'amber',
        summary: 'Mutarotation, Haworth projections, essential vs non-essential amino acids',
        nodes: [
          { id: 'inversion-sucrose', title: 'Inversion of Cane Sugar', details: 'Sucrose is dextrorotatory (+66.5°); hydrolysed mixture (glucose +52.5° and fructose -92.4°) is levorotatory (-19.9°).' }
        ]
      }
    ]
  },
  {
    id: 'principles-related-to-practical-chemistry',
    chapterNumber: 41,
    subject: 'Chemistry',
    category: 'Organic Chemistry',
    title: 'Principles Related to Practical Chemistry',
    tagline: 'Qualitative Salt Analysis (Cations & Anions), Titrations & Functional Group Tests',
    centerConcept: {
      title: 'Qualitative Inorganic & Organic Analysis',
      coreDefinition: 'Group separation of basic radicals (cations) based on solubility products, anion confirmatory tests, and organic functional detection.',
      keyLaw: 'Cations grouped by K_sp: Group I chlorides (Pb²⁺), Group II sulfides in acidic medium (Cu²⁺, As³⁺), Group III hydroxides (Fe³⁺, Al³⁺).'
    },
    weightage: '4 - 8 Marks (1-2 Questions in current syllabus)',
    difficulty: 'Moderate',
    estimatedRevisionTime: '1 min Quick / 8 min Deep',
    oneMinuteSummary: {
      keyFormulas: [
        { name: 'Brown Ring Test for Nitrate', formula: '[\\text{Fe}(\\text{H}_2\\text{O})_5(\\text{NO})]^{2+}', note: 'Iron oxidation state is +1, NO is +1' },
        { name: 'Group Reagents for Cations', formula: '\\text{Gr I: dil. HCl; Gr II: H}_2\\text{S + dil. HCl; Gr III: NH}_4\\text{OH + NH}_4\\text{Cl; Gr IV: H}_2\\text{S + NH}_4\\text{OH}', note: 'Gr V: (NH4)2CO3 + NH4OH' },
        { name: 'Nessler\'s Reagent for Ammonium', formula: '\\text{K}_2[\\text{HgI}_4] + \\text{NH}_4^+ \\rightarrow \\text{Brown ppt of Iodide of Millon\'s base}', note: 'K2HgI4 in alkaline medium' }
      ],
      mustRememberPoints: [
        'Anion tests: Carbonate (effervescence with dil. acid), Sulfate (white BaSO4 ppt insoluble in conc. HCl), Nitrate (brown ring test), Chloride (white AgCl ppt soluble in aq. NH3).',
        'Organic tests: Unsaturation (decolorization of bromine water and Baeyer\'s reagent cold dil. alkaline KMnO4); Phenol (neutral FeCl3 gives violet complex); Carboxylic acid (NaHCO3 effervescence of CO2).',
        'Flame test colors: Crimson red (Sr²⁺), Golden yellow (Na⁺), Violet/Lilac (K⁺), Brick red (Ca²⁺), Apple green (Ba²⁺).'
      ],
      commonPitfalls: [
        'In the brown ring test for NO3⁻, the iron complex [Fe(H2O)5(NO)]SO4 has iron in +1 oxidation state (d⁷ system) with 3 unpaired electrons.'
      ],
      speedTricks: [
        'Precipitate colors in salt analysis: CuS, PbS, FeS, NiS, CoS are BLACK; CdS is YELLOW; MnS is BUFF/FLESH; ZnS is WHITE.'
      ]
    },
    branches: [
      {
        id: 'salt-analysis',
        title: 'Systematic Cation Separation',
        color: 'rose',
        summary: 'Group 0 to VI reagent scheme and selective precipitation',
        nodes: [
          { id: 'prussian-blue', title: 'Turnbull\'s vs Prussian Blue', details: 'Fe³⁺ + [Fe(CN)6]⁴⁻ gives Prussian Blue Fe4[Fe(CN)6]3; identical to Turnbull\'s blue.' }
        ]
      }
    ]
  },

  // =========================================================================
  // MATHEMATICS (14 Chapters)
  // =========================================================================
  {
    id: 'sets-relations-and-functions',
    chapterNumber: 42,
    subject: 'Mathematics',
    title: 'Sets, Relations and Functions',
    tagline: 'Types of Relations, Injective/Surjective Functions, Domain, Range & Composition',
    centerConcept: {
      title: 'Equivalence Relations & Function Mappings',
      coreDefinition: 'Reflexive, symmetric, transitive relations and bijection criteria for function invertibility.',
      keyLaw: 'Bijective Function: f is invertible if and only if it is both one-one (injective) and onto (surjective).'
    },
    weightage: '4 - 8 Marks (1-2 Questions)',
    difficulty: 'Moderate',
    estimatedRevisionTime: '1 min Quick / 8 min Deep',
    oneMinuteSummary: {
      keyFormulas: [
        { name: 'Number of Relations & Functions', formula: '\\text{Total relations} = 2^{mn},\\quad \\text{Reflexive relations} = 2^{n(n-1)},\\quad \\text{Symmetric} = 2^{n(n+1)/2}', note: 'For sets of cardinality m and n' },
        { name: 'Number of Injective Functions (One-One)', formula: '^n P_m = \\frac{n!}{(n - m)!}\\ (n \\ge m)', note: 'Zero if n < m' },
        { name: 'Number of Onto Functions (Surjective)', formula: '\\sum_{r=0}^n (-1)^{n-r} \\,^nC_r \\, r^m', note: 'For mapping from m elements to n elements' }
      ],
      mustRememberPoints: [
        'Equivalence relation: must be Reflexive (aRa ∀a), Symmetric (aRb ⇒ bRa), and Transitive (aRb & bRc ⇒ aRc).',
        'Domain and Range rules: for √f(x), f(x) ≥ 0; for 1/f(x), f(x) ≠ 0; for log_g(x) f(x), f(x) > 0, g(x) > 0, g(x) ≠ 1.',
        'Composite function domain: Domain of (g ∘ f) is {x ∈ Domain(f) : f(x) ∈ Domain(g)}.'
      ],
      commonPitfalls: [
        'Transitive condition: if aRb holds and NO pair exists starting with b, the relation is VACUOUSLY transitive (not violating transitivity!).'
      ],
      speedTricks: [
        'Horizontal Line Test: Any horizontal line intersecting graph at most once proves injectivity.'
      ]
    },
    branches: [
      {
        id: 'rel-func-types',
        title: 'Classification of Functions',
        color: 'blue',
        summary: 'Even/Odd, Periodic functions, functional equations',
        nodes: [
          { id: 'func-eqn', title: 'Standard Functional Equations', formula: 'f(x+y) = f(x)f(y) \\Rightarrow f(x) = a^x;\\quad f(xy) = f(x)+f(y) \\Rightarrow f(x) = k\\ln x', details: 'f(x) + f(1/x) = f(x)f(1/x) ⇒ f(x) = 1 ± xⁿ.' }
        ]
      }
    ]
  },
  {
    id: 'complex-numbers-and-quadratic',
    chapterNumber: 43,
    subject: 'Mathematics',
    title: 'Complex Numbers and Quadratic Equations',
    tagline: 'Argand Plane, Modulus, Argument, De Moivre\'s, Cube Roots of Unity & Roots of Quadratic',
    centerConcept: {
      title: 'Geometry of Complex Plane & Roots of Polynomials',
      coreDefinition: 'Algebraic operations in ℂ, polar Euler representation z = r e^(iθ), and quadratic root discriminant theory.',
      keyLaw: 'Cube roots of unity: 1 + ω + ω² = 0, ω³ = 1; Triangle inequality: ||z1| - |z2|| ≤ |z1 + z2| ≤ |z1| + |z2|.'
    },
    weightage: '8 Marks (2 Questions guaranteed)',
    difficulty: 'High-Yield',
    estimatedRevisionTime: '1 min Quick / 10 min Deep',
    oneMinuteSummary: {
      keyFormulas: [
        { name: 'Euler Formula & De Moivre\'s Theorem', formula: 'e^{i\\theta} = \\cos\\theta + i\\sin\\theta,\\quad (\\cos\\theta + i\\sin\\theta)^n = \\cos(n\\theta) + i\\sin(n\\theta)', note: 'Valid for integer and rational n' },
        { name: 'Locus Equations in Complex Plane', formula: '|z - z_1| = |z - z_2|\\text{ (Perp. bisector)},\\quad |z - z_1| + |z - z_2| = 2a\\text{ (Ellipse if } 2a > |z_1 - z_2|)', note: '|z - z1| / |z - z2| = k (Circle for k ≠ 1)' },
        { name: 'Common Roots of Two Quadratics', formula: '(a_1 b_2 - a_2 b_1)(b_1 c_2 - b_2 c_1) = (c_1 a_2 - c_2 a_1)^2', note: 'Condition for one common root' }
      ],
      mustRememberPoints: [
        'Cube roots of unity properties: ω = (-1 + i√3)/2, ω² = (-1 - i√3)/2; 1 + ωⁿ + ω²ⁿ = 3 (if n is multiple of 3), 0 (otherwise).',
        'Quadratic ax² + bx + c = 0: Sum of roots α + β = -b/a; Product αβ = c/a. |α - β| = √D / |a|.',
        'Location of roots: Both roots > k ⇒ D ≥ 0, -b/2a > k, a·f(k) > 0.'
      ],
      commonPitfalls: [
        '√a · √b = √(ab) is TRUE ONLY when at least one of a or b is non-negative; √(-1) · √(-1) = i · i = -1 ≠ √1.'
      ],
      speedTricks: [
        'Newton\'s Sums for S_n = αⁿ + βⁿ: a S_n + b S_{n-1} + c S_{n-2} = 0. Extremely fast for computing (α¹⁰ - 2β¹⁰) / 2α⁸.'
      ]
    },
    branches: [
      {
        id: 'argand-geometry',
        title: 'Argand Plane Geometry',
        color: 'purple',
        summary: 'Rotation theorem, Apollonius circle, dot and cross in complex',
        nodes: [
          { id: 'rotation-thm', title: 'Rotation Formula', formula: '\\frac{z_3 - z_1}{z_2 - z_1} = \\left|\\frac{z_3 - z_1}{z_2 - z_1}\\right| e^{i\\alpha}', details: 'Rotating vector z2 - z1 by angle α about z1.' }
        ]
      }
    ]
  },
  {
    id: 'matrices-and-determinants',
    chapterNumber: 44,
    subject: 'Mathematics',
    title: 'Matrices and Determinants',
    tagline: 'Matrix Operations, Adjoint, Inverse, Determinant Properties & System of Equations (Cramer\'s Rule)',
    centerConcept: {
      title: 'Linear Transformations & Systems of Equations',
      coreDefinition: 'Matrix algebra, determinant expansion theorems, invertibility via adj(A), and consistency of linear systems.',
      keyLaw: 'Adjoint Identity: A · adj(A) = |A| I_n; det(adj(A)) = |A|^(n - 1).'
    },
    weightage: '8 Marks (2 Questions guaranteed)',
    difficulty: 'High-Yield',
    estimatedRevisionTime: '1 min Quick / 10 min Deep',
    oneMinuteSummary: {
      keyFormulas: [
        { name: 'Adjoint & Inverse Properties', formula: '|\\text{adj}(A)| = |A|^{n-1},\\quad |\\text{adj}(\\text{adj}(A))| = |A|^{(n-1)^2},\\quad A^{-1} = \\frac{\\text{adj}(A)}{|A|}', note: 'For n × n non-singular matrix' },
        { name: 'Determinant Scaling', formula: '|kA| = k^n |A|,\\quad |AB| = |A||B|,\\quad |A^T| = |A|', note: 'n = order of matrix' },
        { name: 'Cramer\'s Rule (3 Equations)', formula: 'x = \\frac{\\Delta_x}{\\Delta},\\ y = \\frac{\\Delta_y}{\\Delta},\\ z = \\frac{\\Delta_z}{\\Delta}', note: 'Unique solution if Δ ≠ 0' }
      ],
      mustRememberPoints: [
        'Consistency conditions for system AX = B: If Δ ≠ 0 → Unique consistent solution; If Δ = 0 and at least one of Δx, Δy, Δz ≠ 0 → No solution (Inconsistent); If Δ = Δx = Δy = Δz = 0 → Infinitely many solutions or no solution.',
        'Symmetric matrix: A^T = A; Skew-symmetric: A^T = -A (diagonal elements are 0; determinant of odd order skew-symmetric is ALWAYS ZERO).',
        'Orthogonal matrix: A A^T = I ⇒ |A| = ±1.'
      ],
      commonPitfalls: [
        'Matrix multiplication is associative A(BC) = (AB)C, but NOT commutative (AB ≠ BA in general).'
      ],
      speedTricks: [
        'Cayley-Hamilton Theorem: Every square matrix satisfies its own characteristic equation |A - λI| = 0. Use to compute higher powers A¹⁰ or inverse A⁻¹ in 30 seconds!'
      ]
    },
    branches: [
      {
        id: 'system-linear',
        title: 'System of Linear Equations',
        color: 'emerald',
        summary: 'Homogeneous systems (AX = 0) and non-homogeneous systems',
        nodes: [
          { id: 'homo-system', title: 'Homogeneous System AX = 0', formula: '\\Delta = 0 \\Rightarrow \\text{Non-trivial (infinitely many) solutions}', details: 'If Δ ≠ 0, only trivial zero solution (x=y=z=0) exists.' }
        ]
      }
    ]
  },
  {
    id: 'permutations-and-combinations',
    chapterNumber: 45,
    subject: 'Mathematics',
    title: 'Permutations and Combinations',
    tagline: 'Fundamental Counting, nPr, nCr, Division into Groups, Dearrangements & Multinomial',
    centerConcept: {
      title: 'Combinatorial Counting & Arrangements',
      coreDefinition: 'Systematic enumeration of selections and permutations of distinct or identical objects under constraints.',
      keyLaw: 'nCr = n! / (r! (n - r)!); Pascal\'s identity: ^nCr + ^nC_{r-1} = ^{n+1}Cr.'
    },
    weightage: '4 - 8 Marks (1-2 Questions)',
    difficulty: 'Moderate',
    estimatedRevisionTime: '1 min Quick / 8 min Deep',
    oneMinuteSummary: {
      keyFormulas: [
        { name: 'Beggar\'s Method (Identical Objects to Distinct Persons)', formula: '^{n + r - 1}C_{r - 1}', note: 'Number of non-negative integer solutions to x1 + x2 + ... + xr = n' },
        { name: 'Dearrangement Theorem', formula: 'D_n = n!\\left[1 - \\frac{1}{1!} + \\frac{1}{2!} - \\frac{1}{3!} + \\dots + \\frac{(-1)^n}{n!}\\right]', note: 'D1=0, D2=1, D3=2, D4=9, D5=44' },
        { name: 'Division into Groups', formula: '\\frac{(m + n + p)!}{m! n! p!}\\text{ (unequal)},\\quad \\frac{(3m)!}{(m!)^3 3!}\\text{ (3 equal groups)}', note: 'Divide by k! if k groups have equal size' }
      ],
      mustRememberPoints: [
        'Circular permutations: (n - 1)! for distinct arrangements; (n - 1)! / 2 for necklaces/garlands (clockwise and anticlockwise indistinguishable).',
        'Gap method: Used when two particular items must NEVER be together (arrange remaining items first, place restricted items in the gaps).',
        'Tie method: Used when items must ALWAYS be together (bundle them as one single unit).'
      ],
      commonPitfalls: [
        'When distribution is among distinct persons, multiply grouped formation by the number of permutations of the groups.'
      ],
      speedTricks: [
        'Sum of all numbers formed by n distinct digits: (n - 1)! × (Sum of digits) × (111...1 n times).'
      ]
    },
    branches: [
      {
        id: 'pnc-methods',
        title: 'Advanced Counting Techniques',
        color: 'sky',
        summary: 'Multinomial theorem, exponent of prime in n! (Legendre formula)',
        nodes: [
          { id: 'legendre', title: 'Legendre\'s Formula for E_p(n!)', formula: 'E_p(n!) = \\left\\lfloor\\frac{n}{p}\\right\\rfloor + \\left\\lfloor\\frac{n}{p^2}\\right\\rfloor + \\left\\lfloor\\frac{n}{p^3}\\right\\rfloor + \\dots', details: 'Finds power of prime p in n! and number of trailing zeroes (p = 5).' }
        ]
      }
    ]
  },
  {
    id: 'binomial-theorem',
    chapterNumber: 46,
    subject: 'Mathematics',
    title: 'Binomial Theorem',
    tagline: 'Binomial Expansion, General Term, Middle Term, Remainder Problems & Series Sums',
    centerConcept: {
      title: 'Binomial Series & Coefficients',
      coreDefinition: 'Expansion of powers of sums (x + y)ⁿ and properties of combinatorial coefficients C_r.',
      keyLaw: 'General Term: T_{r+1} = ^nC_r x^{n-r} y^r; Sum of coefficients: (1 + 1)ⁿ = 2ⁿ.'
    },
    weightage: '4 - 8 Marks (1-2 Questions)',
    difficulty: 'Moderate',
    estimatedRevisionTime: '1 min Quick / 8 min Deep',
    oneMinuteSummary: {
      keyFormulas: [
        { name: 'General Term & Middle Term', formula: 'T_{r+1} = \\,^nC_r a^{n-r} b^r,\\quad T_{\\frac{n}{2} + 1}\\text{ (for even } n)', note: 'For odd n, two middle terms: (n+1)/2 and (n+3)/2' },
        { name: 'Derivative & Integral of Coefficients', formula: '\\sum_{r=1}^n r\\,^nC_r = n 2^{n-1},\\quad \\sum_{r=0}^n \\frac{^nC_r}{r + 1} = \\frac{2^{n+1} - 1}{n + 1}', note: 'Standard series sums' },
        { name: 'Remainder & Divisibility', formula: '(1 + a)^n = 1 + na + \\frac{n(n-1)}{2}a^2 + \\dots', note: 'Express base as (multiple ± 1)' }
      ],
      mustRememberPoints: [
        'Term independent of x: Equate total power of x in T_{r+1} to ZERO and solve for integer r.',
        'Greatest binomial coefficient is the middle one: ^nC_{n/2} for even n; Numerically greatest term found via |T_{r+1} / T_r| ≥ 1.',
        'Negative and fractional index binomial expansion: (1 - x)⁻¹ = 1 + x + x² + x³ + ... (|x| < 1); (1 - x)⁻² = 1 + 2x + 3x² + 4x³ + ...'
      ],
      commonPitfalls: [
        'Fractional/negative index expansion is valid ONLY when |x| < 1.'
      ],
      speedTricks: [
        'Remainder when 7¹⁰³ is divided by 25: 7¹⁰³ = 7 × (49)⁵¹ = 7 × (50 - 1)⁵¹ = 7 × (50k - 1) = 350k - 7 ≡ -7 ≡ 18 (mod 25).'
      ]
    },
    branches: [
      {
        id: 'binomial-series',
        title: 'Coefficient Identities',
        color: 'rose',
        summary: 'Vandermonde identity, product of coefficients, remainder theorems',
        nodes: [
          { id: 'vandermonde', title: 'Vandermonde Identity', formula: '\\sum_{r=0}^k \\,^mC_r \\,^nC_{k-r} = \\,^{m+n}C_k', details: 'Used to sum products of two binomial coefficients.' }
        ]
      }
    ]
  },
  {
    id: 'sequences-and-series',
    chapterNumber: 47,
    subject: 'Mathematics',
    title: 'Sequences and Series',
    tagline: 'Arithmetic Progression (AP), Geometric Progression (GP), AGP & Telescoping Series',
    centerConcept: {
      title: 'Progressions & Series Convergence',
      coreDefinition: 'Explicit progression terms, sum formulas, and telescoping decomposition methods.',
      keyLaw: 'AM ≥ GM ≥ HM (equality holds if and only if all terms are identical).'
    },
    weightage: '8 Marks (2 Questions consistently)',
    difficulty: 'High-Yield',
    estimatedRevisionTime: '1 min Quick / 8 min Deep',
    oneMinuteSummary: {
      keyFormulas: [
        { name: 'AP & GP Sum Formulas', formula: 'S_n(AP) = \\frac{n}{2}[2a + (n-1)d],\\quad S_n(GP) = \\frac{a(r^n - 1)}{r - 1},\\quad S_\\infty(GP) = \\frac{a}{1 - r}\\ (|r| < 1)', note: 'T_n(AP) = a + (n-1)d, T_n(GP) = a r^(n-1)' },
        { name: 'AM-GM Inequality', formula: '\\frac{a + b}{2} \\ge \\sqrt{ab} \\ge \\frac{2}{\\frac{1}{a} + \\frac{1}{b}}', note: 'Key for finding minimum/maximum of positive quantities' },
        { name: 'Standard Sum of Powers', formula: '\\sum n = \\frac{n(n+1)}{2},\\quad \\sum n^2 = \\frac{n(n+1)(2n+1)}{6},\\quad \\sum n^3 = \\left[\\frac{n(n+1)}{2}\\right]^2', note: 'Sum n³ = (Sum n)²' }
      ],
      mustRememberPoints: [
        'Telescoping series method: Express T_n as difference of two terms V_n - V_{n-1} so intermediate terms cancel upon summation.',
        'Arithmetico-Geometric Progression (AGP): Multiply whole series by common ratio r and subtract: S - rS to isolate GP.',
        'If a, b, c are in AP: 2b = a + c; in GP: b² = ac; in HP: b = 2ac / (a + c).'
      ],
      commonPitfalls: [
        'AM-GM inequality applies STRICTLY to positive real numbers only!'
      ],
      speedTricks: [
        'If sum of n terms of two APs are in ratio (7n + 1) : (4n + 27), the ratio of their n-th terms is obtained instantly by replacing n with (2n - 1).'
      ]
    },
    branches: [
      {
        id: 'agp-telescope',
        title: 'AGP & Telescoping Sums',
        color: 'amber',
        summary: 'Vn method, infinite AGP sums, partial fraction series',
        nodes: [
          { id: 'agp-sum', title: 'Infinite AGP Sum', formula: 'S_\\infty = \\frac{a}{1 - r} + \\frac{dr}{(1 - r)^2}', details: 'Series: a + (a+d)r + (a+2d)r² + ...' }
        ]
      }
    ]
  },
  {
    id: 'limits-continuity-and-differentiability',
    chapterNumber: 48,
    subject: 'Mathematics',
    title: 'Limits, Continuity and Differentiability',
    tagline: 'Standard Limits, L\'Hopital\'s Rule, Continuity Conditions & Differentiability Theorems (Rolle\'s, LMVT)',
    centerConcept: {
      title: 'Infinitesimal Behavior & Function Smoothness',
      coreDefinition: 'Limits of indeterminate forms (0/0, ∞/∞, 1^∞), removable/essential discontinuities, and differentiability criteria.',
      keyLaw: '1^∞ Form: lim [f(x)]^(g(x)) = e^(lim g(x)[f(x) - 1]) as f(x) → 1, g(x) → ∞.'
    },
    weightage: '8 - 12 Marks (2-3 Questions guaranteed)',
    difficulty: 'High-Yield',
    estimatedRevisionTime: '1 min Quick / 12 min Deep',
    oneMinuteSummary: {
      keyFormulas: [
        { name: '1^∞ Indeterminate Form Shortcut', formula: '\\lim_{x \\to a} [f(x)]^{g(x)} = e^{\\lim_{x \\to a} g(x)[f(x) - 1]}', note: 'Standard for JEE Main' },
        { name: 'Standard Limit Expansions', formula: '\\sin x = x - \\frac{x^3}{6} + \\dots,\\quad e^x = 1 + x + \\frac{x^2}{2} + \\dots,\\quad \\ln(1+x) = x - \\frac{x^2}{2} + \\dots', note: 'Maclaurin expansions solve limits faster than 3 L\'Hopital steps' },
        { name: 'LMVT (Lagrange Mean Value Theorem)', formula: 'f\'(c) = \\frac{f(b) - f(a)}{b - a}\\quad (c \\in (a, b))', note: 'Rolle\'s Theorem is special case when f(a) = f(b)' }
      ],
      mustRememberPoints: [
        'Differentiability ⇒ Continuity. The converse is FALSE (e.g. f(x) = |x| is continuous at 0 but not differentiable).',
        'L\'Hopital\'s rule applies ONLY to 0/0 and ∞/∞ forms; differentiate numerator and denominator independently.',
        'Points of non-differentiability in |f(x)| occur where f(x) = 0, provided f\'(x) ≠ 0 at those roots.'
      ],
      commonPitfalls: [
        'Do not apply L\'Hopital\'s rule when the form is NOT indeterminate (e.g. 0/1 or 1/0).'
      ],
      speedTricks: [
        'lim (x → 0) (1 - cos x) / x² = 1/2. Replace (1 - cos f(x)) with [f(x)]² / 2 directly whenever f(x) → 0.'
      ]
    },
    branches: [
      {
        id: 'diff-mvt',
        title: 'Mean Value Theorems',
        color: 'emerald',
        summary: 'Rolle\'s, LMVT, Cauchy MVT, corner points',
        nodes: [
          { id: 'rolles-roots', title: 'Rolle\'s Theorem on Polynomial Roots', details: 'Between any two real roots of f(x) = 0, there lies at least one real root of f\'(x) = 0.' }
        ]
      }
    ]
  },
  {
    id: 'integral-calculus',
    chapterNumber: 49,
    subject: 'Mathematics',
    title: 'Integral Calculus',
    tagline: 'Definite Integral Properties (King\'s Rule), Leibniz Rule, Integration by Parts & Area Under Curves',
    centerConcept: {
      title: 'Accumulation, Properties & Enclosed Areas',
      coreDefinition: 'Anti-derivatives, definite integral symmetry properties, differentiation under integral sign, and planar area computations.',
      keyLaw: 'King\'s Property: ∫_a^b f(x) dx = ∫_a^b f(a + b - x) dx.'
    },
    weightage: '8 - 12 Marks (2-3 Questions guaranteed)',
    difficulty: 'High-Yield',
    estimatedRevisionTime: '1 min Quick / 12 min Deep',
    oneMinuteSummary: {
      keyFormulas: [
        { name: 'King\'s Property (Definite Integral)', formula: '\\int_a^b f(x)\\,dx = \\int_a^b f(a + b - x)\\,dx,\\quad \\int_0^a f(x)\\,dx = \\int_0^a f(a - x)\\,dx', note: 'Add I + I to eliminate complicated denominators' },
        { name: 'Newton-Leibniz Differentiation Rule', formula: '\\frac{d}{dx}\\int_{u(x)}^{v(x)} f(t)\\,dt = f(v(x))\\,v\'(x) - f(u(x))\\,u\'(x)', note: 'Differentiating definite integral with variable limits' },
        { name: 'Area Between Parabola and Line', formula: '\\text{Area enclosed by } y^2 = 4ax \\text{ and } y = mx \\text{ is } \\frac{8a^2}{3m^3}', note: 'Between y² = 4ax and x² = 4by is 16ab/3' }
      ],
      mustRememberPoints: [
        'Odd function: ∫_{-a}^a f(x) dx = 0 if f(-x) = -f(x); Even function: 2 ∫_0^a f(x) dx if f(-x) = f(x).',
        'Periodic function with period T: ∫_0^{nT} f(x) dx = n ∫_0^T f(x) dx.',
        'Integration by parts (ILATE rule): ∫ u v dx = u ∫ v dx - ∫ [u\' (∫ v dx)] dx.'
      ],
      commonPitfalls: [
        'When evaluating area, always integrate |f(x) - g(x)| so areas below x-axis are counted positive.'
      ],
      speedTricks: [
        'Wallis Formula: ∫_0^{π/2} sinⁿx dx = [(n-1)(n-3)... / (n(n-2)...)] × (π/2 if n is even, 1 if odd).'
      ]
    },
    branches: [
      {
        id: 'def-properties',
        title: 'Definite Integral Properties',
        color: 'sky',
        summary: 'Queen\'s rule, limit as sum, reduction formulas',
        nodes: [
          { id: 'limit-as-sum', title: 'Limit of a Sum as Definite Integral', formula: '\\lim_{n \\to \\infty} \\frac{1}{n}\\sum_{r=1}^n f\\left(\\frac{r}{n}\\right) = \\int_0^1 f(x)\\,dx', details: 'Replace r/n with x, 1/n with dx, ∑ with ∫.' }
        ]
      }
    ]
  },
  {
    id: 'differential-equations',
    chapterNumber: 50,
    subject: 'Mathematics',
    title: 'Differential Equations',
    tagline: 'Order & Degree, Variable Separable, Homogeneous & Linear Differential Equations (IF)',
    centerConcept: {
      title: 'Rate Equations & Integrating Factors',
      coreDefinition: 'Formation and solution of ODEs expressing dynamic relationships via integrating factor methods.',
      keyLaw: 'Linear Differential Equation: dy/dx + P(x) y = Q(x); Solution: y · IF = ∫ Q(x) · IF dx + C, where IF = e^(∫ P(x) dx).'
    },
    weightage: '4 - 8 Marks (1-2 Questions)',
    difficulty: 'Moderate',
    estimatedRevisionTime: '1 min Quick / 8 min Deep',
    oneMinuteSummary: {
      keyFormulas: [
        { name: 'First Order Linear Differential Equation', formula: '\\frac{dy}{dx} + P(x)y = Q(x),\\quad \\text{IF} = e^{\\int P(x)\\,dx},\\quad y \\cdot \\text{IF} = \\int Q(x)\\cdot \\text{IF}\\,dx + C', note: 'Standard form' },
        { name: 'Linear in x Form', formula: '\\frac{dx}{dy} + P(y)x = Q(y),\\quad \\text{IF} = e^{\\int P(y)\\,dy},\\quad x \\cdot \\text{IF} = \\int Q(y)\\cdot \\text{IF}\\,dy + C', note: 'When dy/dx cannot be separated' },
        { name: 'Exact Differential Shortcuts', formula: 'd(xy) = x\\,dy + y\\,dx,\\quad d\\left(\\frac{y}{x}\\right) = \\frac{x\\,dy - y\\,dx}{x^2},\\quad d(\\ln(xy)) = \\frac{dx}{x} + \\frac{dy}{y}', note: 'Instant integration without standard steps' }
      ],
      mustRememberPoints: [
        'Order is the highest derivative present in the equation.',
        'Degree is the power of the highest derivative AFTER the equation is made free from radicals and fractions in derivatives (if derivatives appear in sin, e, log, degree is undefined).',
        'Homogeneous differential equations: dy/dx = f(y/x) solved by substitution y = vx → dy/dx = v + x(dv/dx).'
      ],
      commonPitfalls: [
        'Degree is defined ONLY when the differential equation is a polynomial equation in derivatives!'
      ],
      speedTricks: [
        'Orthogonal trajectories: Replace dy/dx with -dx/dy in the differential equation of the given curve family.'
      ]
    },
    branches: [
      {
        id: 'de-methods',
        title: 'ODE Solution Methods',
        color: 'rose',
        summary: 'Bernoulli equation, Clairaut equation, variable separable',
        nodes: [
          { id: 'bernoulli-eqn', title: 'Bernoulli\'s Equation (Reducible to Linear)', formula: '\\frac{dy}{dx} + Py = Qy^n \\Rightarrow \\frac{1}{y^n}\\frac{dy}{dx} + P y^{1-n} = Q', details: 'Substitute z = y^(1-n) to convert into standard linear form.' }
        ]
      }
    ]
  },
  {
    id: 'coordinate-geometry',
    chapterNumber: 51,
    subject: 'Mathematics',
    title: 'Coordinate Geometry',
    tagline: 'Straight Lines, Circles, Parabola, Ellipse & Hyperbola Standard Equations & Tangents',
    centerConcept: {
      title: 'Conic Sections & Loci',
      coreDefinition: 'Planar curves defined by focus-directrix eccentricity: e = 0 (circle), e = 1 (parabola), e < 1 (ellipse), e > 1 (hyperbola).',
      keyLaw: 'Tangent Equation T = 0: replace x² with xx1, y² with yy1, 2x with x + x1, 2y with y + y1.'
    },
    weightage: '12 - 16 Marks (3-4 Questions guaranteed)',
    difficulty: 'High-Yield',
    estimatedRevisionTime: '1 min Quick / 14 min Deep',
    oneMinuteSummary: {
      keyFormulas: [
        { name: 'Slope Tangent to Circle & Parabola', formula: 'y = mx \\pm a\\sqrt{1 + m^2}\\text{ (Circle)},\\quad y = mx + \\frac{a}{m}\\text{ (Parabola } y^2 = 4ax)', note: 'Condition of tangency' },
        { name: 'Slope Tangent to Ellipse & Hyperbola', formula: 'y = mx \\pm \\sqrt{a^2 m^2 + b^2}\\text{ (Ellipse)},\\quad y = mx \\pm \\sqrt{a^2 m^2 - b^2}\\text{ (Hyperbola)}', note: 'Real tangents exist if a²m² ≥ b²' },
        { name: 'Eccentricity & Latus Rectum', formula: 'e_{\\text{ellipse}} = \\sqrt{1 - \\frac{b^2}{a^2}},\\ e_{\\text{hyperbola}} = \\sqrt{1 + \\frac{b^2}{a^2}},\\quad \\text{LR} = \\frac{2b^2}{a}', note: 'Rectangular hyperbola: e = √2' }
      ],
      mustRememberPoints: [
        'Director Circle (Locus of point of intersection of perpendicular tangents): Circle: x² + y² = 2a²; Parabola: Directrix x = -a; Ellipse: x² + y² = a² + b²; Hyperbola: x² + y² = a² - b².',
        'Pair of straight lines ax² + 2hxy + by² = 0: Angle tan θ = 2√(h² - ab) / |a + b|. Lines are perpendicular if a + b = 0.',
        'Common tangents: Count of common tangents between two circles with radii r1, r2 and distance between centers d: d > r1 + r2 (4 tangents); d = r1 + r2 (3 tangents); |r1 - r2| < d < r1 + r2 (2 tangents); d = |r1 - r2| (1 tangent); d < |r1 - r2| (0 tangents).'
      ],
      commonPitfalls: [
        'For vertical line tangents (m → ∞), slope form fails; check vertical tangents x = ±a separately.'
      ],
      speedTricks: [
        'Equation of chord with given midpoint (x1, y1): T = S1 for all conics.'
      ]
    },
    branches: [
      {
        id: 'conic-tangents',
        title: 'Conic Tangents & Normals',
        color: 'purple',
        summary: 'Parametric points, focal chords, reflection property',
        nodes: [
          { id: 'focal-chord', title: 'Focal Chord of Parabola', formula: 't_1 t_2 = -1,\\quad \\text{Length} = a\\left(t + \\frac{1}{t}\\right)^2 \\ge 4a', details: 'Semi-latus rectum is harmonic mean of focal segments.' }
        ]
      }
    ]
  },
  {
    id: 'three-dimensional-geometry',
    chapterNumber: 52,
    subject: 'Mathematics',
    title: 'Three-Dimensional Geometry',
    tagline: 'Direction Cosines/Ratios, Lines in 3D Space, Skew Lines & Shortest Distance',
    centerConcept: {
      title: 'Lines & Spatial Coordinates in 3D',
      coreDefinition: 'Direction cosines (l² + m² + n² = 1), vector line equations r = a + λ b, and shortest distance between skew lines.',
      keyLaw: 'Shortest Distance between skew lines: d = |(a2 - a1) · (b1 × b2)| / |b1 × b2|.'
    },
    weightage: '8 Marks (2 Questions consistently)',
    difficulty: 'High-Yield',
    estimatedRevisionTime: '1 min Quick / 10 min Deep',
    oneMinuteSummary: {
      keyFormulas: [
        { name: 'Shortest Distance Between Skew Lines', formula: 'd = \\frac{|(\\vec{a}_2 - \\vec{a}_1) \\cdot (\\vec{b}_1 \\times \\vec{b}_2)|}{|\\vec{b}_1 \\times \\vec{b}_2|}', note: 'Lines intersect if numerator is 0' },
        { name: 'Angle Between Two Lines', formula: '\\cos\\theta = \\frac{a_1 a_2 + b_1 b_2 + c_1 c_2}{\\sqrt{a_1^2 + b_1^2 + c_1^2}\\sqrt{a_2^2 + b_2^2 + c_2^2}}', note: 'Perpendicular if a1 a2 + b1 b2 + c1 c2 = 0' },
        { name: 'Distance Between Parallel Lines', formula: 'd = \\frac{|(\\vec{a}_2 - \\vec{a}_1) \\times \\vec{b}|}{|\\vec{b}|}', note: 'Both have common direction vector b' }
      ],
      mustRememberPoints: [
        'Direction cosines: l = cos α, m = cos β, n = cos γ ⇒ l² + m² + n² = 1 and sin²α + sin²β + sin²γ = 2.',
        'Symmetric equation of line through (x1, y1, z1): (x - x1)/a = (y - y1)/b = (z - z1)/c = λ.',
        'Foot of perpendicular from point P to line: Find general point on line Q(λ), enforce dot product PQ · b = 0 to solve for λ.'
      ],
      commonPitfalls: [
        'Do not confuse direction ratios (a, b, c) with direction cosines (l, m, n). Direction ratios do NOT need to satisfy a² + b² + c² = 1.'
      ],
      speedTricks: [
        'Coplanarity of two lines: Determinant with rows (x2-x1, y2-y1, z2-z1), (a1, b1, c1), (a2, b2, c2) must equal 0.'
      ]
    },
    branches: [
      {
        id: '3d-lines',
        title: 'Spatial Lines',
        color: 'blue',
        summary: 'Intersection of lines, foot of perpendicular, image of a point',
        nodes: [
          { id: 'image-point', title: 'Image of a Point in a Line', formula: '\\vec{r}_{\\text{image}} = 2\\vec{r}_{\\text{foot}} - \\vec{r}_{\\text{point}}', details: 'Foot of perpendicular is midpoint of point and its image.' }
        ]
      }
    ]
  },
  {
    id: 'vector-algebra',
    chapterNumber: 53,
    subject: 'Mathematics',
    title: 'Vector Algebra',
    tagline: 'Dot Product, Cross Product, Scalar Triple Product & Vector Triple Product',
    centerConcept: {
      title: 'Vector Operations & Spatial Products',
      coreDefinition: 'Linear combination of vectors, projections, scalar triple product [a b c] (volume) and vector triple product.',
      keyLaw: 'Vector Triple Product (BAC-CAB): a × (b × c) = (a · c) b - (a · b) c.'
    },
    weightage: '4 - 8 Marks (1-2 Questions)',
    difficulty: 'Moderate',
    estimatedRevisionTime: '1 min Quick / 8 min Deep',
    oneMinuteSummary: {
      keyFormulas: [
        { name: 'Projection & Dot Product', formula: '\\text{Proj}_{\\vec{b}} \\vec{a} = \\frac{\\vec{a} \\cdot \\vec{b}}{|\\vec{b}|},\\quad \\vec{a} \\cdot \\vec{b} = |a||b|\\cos\\theta', note: 'Zero if vectors are perpendicular' },
        { name: 'Cross Product (Area)', formula: '\\text{Area of Triangle} = \\frac{1}{2}|\\vec{a} \\times \\vec{b}|,\\quad \\text{Area of Parallelogram} = |\\vec{a} \\times \\vec{b}| = \\frac{1}{2}|\\vec{d}_1 \\times \\vec{d}_2|', note: 'd1, d2 are diagonals' },
        { name: 'Scalar Triple Product (Volume of Parallelepiped)', formula: '[\\vec{a}\\; \\vec{b}\\; \\vec{c}] = \\vec{a} \\cdot (\\vec{b} \\times \\vec{c}) = \\begin{vmatrix} a_1 & a_2 & a_3 \\\\ b_1 & b_2 & b_3 \\\\ c_1 & c_2 & c_3 \\end{vmatrix}', note: 'Zero if vectors are coplanar' }
      ],
      mustRememberPoints: [
        'Cyclic permutation in STP: [a b c] = [b c a] = [c a b] = -[b a c].',
        'Lagrange\'s Identity: |a × b|² = |a|² |b|² - (a · b)².',
        'BAC-CAB rule: a × (b × c) = (a · c) b - (a · b) c. Note that (a × b) × c = (a · c) b - (b · c) a.'
      ],
      commonPitfalls: [
        'Vector cross product is NOT associative: a × (b × c) ≠ (a × b) × c.'
      ],
      speedTricks: [
        '[a+b  b+c  c+a] = 2 [a b c]; [a×b  b×c  c×a] = [a b c]².'
      ]
    },
    branches: [
      {
        id: 'vector-products',
        title: 'Triple Products & Collinearity',
        color: 'emerald',
        summary: 'Coplanarity, linear independence, reciprocal vector system',
        nodes: [
          { id: 'reciprocal-system', title: 'Reciprocal System of Vectors', formula: '\\vec{a}\' = \\frac{\\vec{b} \\times \\vec{c}}{[\\vec{a}\\;\\vec{b}\\;\\vec{c}]}', details: 'Satisfies a · a\' = 1, a · b\' = 0.' }
        ]
      }
    ]
  },
  {
    id: 'statistics-and-probability',
    chapterNumber: 54,
    subject: 'Mathematics',
    title: 'Statistics and Probability',
    tagline: 'Mean, Variance, Standard Deviation, Conditional Probability, Bayes\' Theorem & Independent Events',
    centerConcept: {
      title: 'Statistical Dispersion & Conditional Likelihood',
      coreDefinition: 'Measures of central tendency/spread (variance σ²) and conditional probability distributions P(A|B) = P(A ∩ B) / P(B).',
      keyLaw: 'Variance formula: σ² = (∑ x_i² / n) - (x̄)²; Bayes\' Theorem: P(E_i | A) = P(E_i)P(A|E_i) / ∑ P(E_j)P(A|E_j).'
    },
    weightage: '8 Marks (2 Questions: 1 Statistics + 1 Probability)',
    difficulty: 'High-Yield',
    estimatedRevisionTime: '1 min Quick / 10 min Deep',
    oneMinuteSummary: {
      keyFormulas: [
        { name: 'Variance & Standard Deviation', formula: '\\sigma^2 = \\frac{\\sum x_i^2}{n} - (\\bar{x})^2 = \\frac{1}{n}\\sum (x_i - \\bar{x})^2,\\quad \\sigma = \\sqrt{\\sigma^2}', note: 'Independent of change of origin; scales by a² if multiplied by a' },
        { name: 'Bayes\' Theorem', formula: 'P(B_i | A) = \\frac{P(B_i)P(A | B_i)}{\\sum_{k=1}^m P(B_k)P(A | B_k)}', note: 'Posterior probability calculation' },
        { name: 'Independent Events & Total Probability', formula: 'P(A \\cap B) = P(A) \\cdot P(B),\\quad P(A \\cup B) = P(A) + P(B) - P(A \\cap B)', note: 'For independent events P(A|B) = P(A)' }
      ],
      mustRememberPoints: [
        'Effect of transformation on Statistics: If each observation is increased by a, mean increases by a, variance UNCHANGED. If each multiplied by a, mean becomes a·x̄, variance becomes a²·σ².',
        'Coefficient of Variation: CV = (σ / x̄) × 100. Lower CV indicates higher consistency.',
        'Poisson and Binomial Probability: P(X = r) = ⁿC_r pʳ qⁿ⁻ʳ (Mean = np, Variance = npq).'
      ],
      commonPitfalls: [
        'Mutually exclusive events (P(A ∩ B) = 0) are NOT independent (unless one has probability zero).'
      ],
      speedTricks: [
        'Variance of first n natural numbers: σ² = (n² - 1) / 12. For first 10 natural numbers: (100 - 1)/12 = 99/12 = 8.25.'
      ]
    },
    branches: [
      {
        id: 'stats-prob-details',
        title: 'Probability Distributions',
        color: 'purple',
        summary: 'Bernoulli trials, random variables, expectation E(X) = ∑ x P(x)',
        nodes: [
          { id: 'variance-rv', title: 'Variance of Random Variable', formula: '\\text{Var}(X) = E(X^2) - [E(X)]^2', details: 'E(X) = mean μ, E(X²) = ∑ x² P(x).' }
        ]
      }
    ]
  },
  {
    id: 'trigonometry',
    chapterNumber: 55,
    subject: 'Mathematics',
    title: 'Trigonometry',
    tagline: 'Compound Angles, Multiple/Submultiple, Transformation Formulas & Inverse Trigonometric Functions (ITF)',
    centerConcept: {
      title: 'Circular Functions & Principal Branch Inverses',
      coreDefinition: 'Trigonometric identities, maximum/minimum of a sin x + b cos x, and principal value branches of inverse circular functions.',
      keyLaw: 'Range of a sin x + b cos x: [-√(a² + b²), +√(a² + b²)]; ITF principal branches: sin⁻¹x ∈ [-π/2, π/2], cos⁻¹x ∈ [0, π].'
    },
    weightage: '4 - 8 Marks (1-2 Questions)',
    difficulty: 'Moderate',
    estimatedRevisionTime: '1 min Quick / 8 min Deep',
    oneMinuteSummary: {
      keyFormulas: [
        { name: 'Max / Min of a sin x + b cos x + c', formula: 'c - \\sqrt{a^2 + b^2} \\le a\\sin x + b\\cos x + c \\le c + \\sqrt{a^2 + b^2}', note: 'Standard extreme value bounds' },
        { name: 'Inverse Trig Complementary Identities', formula: '\\sin^{-1}x + \\cos^{-1}x = \\frac{\\pi}{2},\\quad \\tan^{-1}x + \\cot^{-1}x = \\frac{\\pi}{2},\\quad \\sec^{-1}x + \\csc^{-1}x = \\frac{\\pi}{2}', note: 'Valid within respective domains' },
        { name: 'Sum of Tan Inverse', formula: '\\tan^{-1}x + \\tan^{-1}y = \\tan^{-1}\\left(\\frac{x + y}{1 - xy}\\right)\\ (xy < 1)', note: 'If xy > 1 and x, y > 0: add π' }
      ],
      mustRememberPoints: [
        'Principal value branches: sin⁻¹x ∈ [-π/2, π/2], cos⁻¹x ∈ [0, π], tan⁻¹x ∈ (-π/2, π/2), cot⁻¹x ∈ (0, π), sec⁻¹x ∈ [0, π] \\ {π/2}, csc⁻¹x ∈ [-π/2, π/2] \\ {0}.',
        'sin⁻¹(-x) = -sin⁻¹x; cos⁻¹(-x) = π - cos⁻¹x; cot⁻¹(-x) = π - cot⁻¹x; sec⁻¹(-x) = π - sec⁻¹x.',
        'Product-to-sum transformations: 2 sin A cos B = sin(A+B) + sin(A-B); 2 cos A sin B = sin(A+B) - sin(A-B); 2 cos A cos B = cos(A+B) + cos(A-B); 2 sin A sin B = cos(A-B) - cos(A+B).'
      ],
      commonPitfalls: [
        'sin⁻¹(sin x) = x ONLY when x ∈ [-π/2, π/2]. For x = 2π/3, sin⁻¹(sin 2π/3) = π - 2π/3 = π/3.'
      ],
      speedTricks: [
        'If A + B + C = π: tan A + tan B + tan C = tan A tan B tan C; cot A cot B + cot B cot C + cot C cot A = 1.'
      ]
    },
    branches: [
      {
        id: 'itf-graphs',
        title: 'ITF Graphs & Domain-Range',
        color: 'sky',
        summary: 'Graphs of sin⁻¹(sin x), cos⁻¹(cos x), telescoping tan⁻¹ series',
        nodes: [
          { id: 'itf-telescoping', title: 'Telescoping Tan Inverse', formula: '\\tan^{-1}\\left(\\frac{x - y}{1 + xy}\\right) = \\tan^{-1}x - \\tan^{-1}y', details: 'Used to sum series like ∑ tan⁻¹(1 / (1 + n + n²)).' }
        ]
      }
    ]
  }
];

export const getMindMapsBySubject = (subject: 'Physics' | 'Chemistry' | 'Mathematics') => {
  return ALL_CHAPTER_MIND_MAPS.filter(c => c.subject === subject);
};

export const getMindMapById = (id: string): ChapterMindMap | undefined => {
  return ALL_CHAPTER_MIND_MAPS.find(c => c.id === id);
};
