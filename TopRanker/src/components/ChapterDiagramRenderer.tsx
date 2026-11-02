import React from 'react';
import type { ChapterDiagram } from '../types.ts';
import { MathRenderer } from './MathRenderer.tsx';

interface ChapterDiagramRendererProps {
  diagram: ChapterDiagram;
  className?: string;
}

export const ChapterDiagramRenderer: React.FC<ChapterDiagramRendererProps> = ({
  diagram,
  className = ''
}) => {
  const renderSvgContent = () => {
    switch (diagram.svgType) {
      // -------------------------------------------------------------
      // 1. KINEMATICS - PROJECTILE MOTION
      // -------------------------------------------------------------
      case 'kinematics-projectile':
        return (
          <svg viewBox="0 0 520 280" className="w-full h-auto text-slate-800 dark:text-slate-100">
            {/* Coordinate Axes */}
            <line x1="40" y1="240" x2="480" y2="240" stroke="currentColor" strokeWidth="2" strokeDasharray="" />
            <polygon points="480,240 472,236 472,244" fill="currentColor" />
            <text x="485" y="244" className="text-xs font-mono font-bold" fill="currentColor">X</text>

            <line x1="40" y1="240" x2="40" y2="20" stroke="currentColor" strokeWidth="2" />
            <polygon points="40,20 36,28 44,28" fill="currentColor" />
            <text x="35" y="15" className="text-xs font-mono font-bold" fill="currentColor">Y</text>

            {/* Parabolic Trajectory */}
            <path
              d="M 40,240 Q 240,10 440,240"
              fill="none"
              stroke="#0284c7"
              strokeWidth="3.5"
            />

            {/* Initial Velocity Vector */}
            <line x1="40" y1="240" x2="110" y2="140" stroke="#16a34a" strokeWidth="2.5" markerEnd="url(#arrow-green)" />
            <polygon points="110,140 102,148 108,154" fill="#16a34a" />
            <text x="115" y="135" className="text-xs font-bold font-mono" fill="#16a34a">u</text>

            {/* Angle Theta */}
            <path d="M 70,240 A 30 30 0 0 0 65,220" fill="none" stroke="#eab308" strokeWidth="2" />
            <text x="75" y="230" className="text-xs font-bold" fill="#eab308">θ</text>

            {/* Peak / H_max */}
            <line x1="240" y1="68" x2="240" y2="240" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 4" />
            <circle cx="240" cy="68" r="4.5" fill="#ef4444" />
            <line x1="240" y1="68" x2="290" y2="68" stroke="#16a34a" strokeWidth="2" />
            <polygon points="290,68 284,65 284,71" fill="#16a34a" />
            <text x="295" y="72" className="text-xs font-bold" fill="#16a34a">u_x = u cos θ (v_y = 0)</text>
            <text x="245" y="150" className="text-xs font-bold" fill="#ef4444">H_max = u²sin²θ / 2g</text>

            {/* Range R */}
            <line x1="40" y1="258" x2="440" y2="258" stroke="#3b82f6" strokeWidth="1.5" />
            <line x1="40" y1="252" x2="40" y2="264" stroke="#3b82f6" strokeWidth="1.5" />
            <line x1="440" y1="252" x2="440" y2="264" stroke="#3b82f6" strokeWidth="1.5" />
            <text x="200" y="272" className="text-xs font-bold" fill="#3b82f6">Range R = (u² sin 2θ) / g</text>
          </svg>
        );

      // -------------------------------------------------------------
      // 2. LAWS OF MOTION - FBD ON INCLINED PLANE
      // -------------------------------------------------------------
      case 'fbd-incline':
        return (
          <svg viewBox="0 0 500 280" className="w-full h-auto text-slate-800 dark:text-slate-100">
            {/* Wedge */}
            <polygon points="40,240 440,240 440,80" fill="#e2e8f0" className="dark:fill-slate-800" stroke="currentColor" strokeWidth="2" />
            <text x="90" y="230" className="text-xs font-bold" fill="currentColor">θ</text>
            <path d="M 80,240 A 40 40 0 0 0 74,226" fill="none" stroke="currentColor" strokeWidth="1.5" />

            {/* Block on Incline */}
            <g transform="translate(240, 160) rotate(-22)">
              <rect x="-35" y="-30" width="70" height="40" fill="#0284c7" rx="4" />
              <text x="-12" y="-8" fill="white" className="text-xs font-black">m</text>

              {/* Normal Force N */}
              <line x1="0" y1="-30" x2="0" y2="-90" stroke="#16a34a" strokeWidth="2.5" />
              <polygon points="0,-90 -4,-82 4,-82" fill="#16a34a" />
              <text x="6" y="-75" fill="#16a34a" className="text-xs font-bold">N</text>

              {/* Perpendicular Gravity Component mg cos θ */}
              <line x1="0" y1="10" x2="0" y2="70" stroke="#ef4444" strokeWidth="2" strokeDasharray="3 3" />
              <text x="6" y="60" fill="#ef4444" className="text-xs font-bold">mg cos θ</text>

              {/* Down-plane Gravity Component mg sin θ */}
              <line x1="-35" y1="-10" x2="-100" y2="-10" stroke="#ef4444" strokeWidth="2.5" />
              <polygon points="-100,-10 -92,-14 -92,-6" fill="#ef4444" />
              <text x="-140" y="-8" fill="#ef4444" className="text-xs font-bold">mg sin θ</text>

              {/* Friction Force f */}
              <line x1="35" y1="-10" x2="80" y2="-10" stroke="#eab308" strokeWidth="2" />
              <polygon points="80,-10 72,-14 72,-6" fill="#eab308" />
              <text x="85" y="-8" fill="#eab308" className="text-xs font-bold">f_k = μ N</text>
            </g>

            {/* True Gravity mg */}
            <line x1="240" y1="160" x2="240" y2="235" stroke="#ef4444" strokeWidth="2.5" />
            <polygon points="240,235 236,227 244,227" fill="#ef4444" />
            <text x="246" y="215" fill="#ef4444" className="text-xs font-black">mg</text>
          </svg>
        );

      // -------------------------------------------------------------
      // 3. THERMODYNAMICS - CARNOT CYCLE (PV INDICATOR)
      // -------------------------------------------------------------
      case 'carnot-pv':
        return (
          <svg viewBox="0 0 520 280" className="w-full h-auto text-slate-800 dark:text-slate-100">
            {/* Axes */}
            <line x1="60" y1="240" x2="480" y2="240" stroke="currentColor" strokeWidth="2" />
            <text x="485" y="244" className="text-xs font-mono font-bold" fill="currentColor">V (Volume)</text>
            <line x1="60" y1="240" x2="60" y2="30" stroke="currentColor" strokeWidth="2" />
            <text x="50" y="20" className="text-xs font-mono font-bold" fill="currentColor">P (Pressure)</text>

            {/* Carnot Closed Loop */}
            <path
              d="M 120,60 Q 200,90 280,105 Q 350,160 380,210 Q 280,200 200,190 Q 140,120 120,60 Z"
              fill="#38bdf8"
              fillOpacity="0.15"
              stroke="#0284c7"
              strokeWidth="2.5"
            />

            {/* 4 States Points */}
            <circle cx="120" cy="60" r="4.5" fill="#16a34a" />
            <text x="95" y="55" className="text-xs font-bold" fill="#16a34a">1 (P₁, V₁, T_H)</text>

            <circle cx="280" cy="105" r="4.5" fill="#3b82f6" />
            <text x="288" y="105" className="text-xs font-bold" fill="#3b82f6">2 (P₂, V₂, T_H)</text>

            <circle cx="380" cy="210" r="4.5" fill="#ef4444" />
            <text x="388" y="215" className="text-xs font-bold" fill="#ef4444">3 (P₃, V₃, T_L)</text>

            <circle cx="200" cy="190" r="4.5" fill="#a855f7" />
            <text x="145" y="205" className="text-xs font-bold" fill="#a855f7">4 (P₄, V₄, T_L)</text>

            {/* Labels on Curves */}
            <text x="180" y="80" className="text-[11px] font-bold text-sky-600 dark:text-sky-300">1→2 Isothermal Exp (Q_in = W₁)</text>
            <text x="330" y="150" className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">2→3 Adiabatic Exp (dQ=0)</text>
            <text x="250" y="210" className="text-[11px] font-bold text-rose-600 dark:text-rose-400">3→4 Isothermal Comp (Q_out)</text>
            <text x="115" y="145" className="text-[11px] font-bold text-purple-600 dark:text-purple-400">4→1 Adiabatic Comp</text>

            {/* Center Efficiency Formula */}
            <rect x="200" y="125" width="140" height="30" rx="8" fill="white" className="dark:fill-slate-900" stroke="#0284c7" strokeWidth="1" />
            <text x="210" y="145" className="text-xs font-black font-mono" fill="#0284c7">η = 1 - T_L / T_H</text>
          </svg>
        );

      // -------------------------------------------------------------
      // 4. RAY OPTICS - LENS & PRISM DISPERSION
      // -------------------------------------------------------------
      case 'optics-diagram':
        return (
          <svg viewBox="0 0 520 280" className="w-full h-auto text-slate-800 dark:text-slate-100">
            {/* Principal Axis */}
            <line x1="20" y1="140" x2="500" y2="140" stroke="currentColor" strokeWidth="1.5" strokeDasharray="6 3" />

            {/* Convex Lens */}
            <path d="M 260,30 Q 280,140 260,250 Q 240,140 260,30 Z" fill="#38bdf8" fillOpacity="0.3" stroke="#0284c7" strokeWidth="2.5" />
            <circle cx="260" cy="140" r="3" fill="currentColor" />
            <text x="255" y="155" className="text-[10px] font-bold" fill="currentColor">O</text>

            {/* Focal Points */}
            <circle cx="160" cy="140" r="3" fill="#ef4444" />
            <text x="155" y="155" className="text-[10px] font-bold" fill="#ef4444">F₁</text>
            <circle cx="60" cy="140" r="3" fill="#ef4444" />
            <text x="52" y="155" className="text-[10px] font-bold" fill="#ef4444">2F₁</text>

            <circle cx="360" cy="140" r="3" fill="#16a34a" />
            <text x="355" y="155" className="text-[10px] font-bold" fill="#16a34a">F₂</text>
            <circle cx="460" cy="140" r="3" fill="#16a34a" />
            <text x="452" y="155" className="text-[10px] font-bold" fill="#16a34a">2F₂</text>

            {/* Object at 2F₁ */}
            <line x1="100" y1="140" x2="100" y2="80" stroke="#f59e0b" strokeWidth="3" />
            <polygon points="100,80 96,88 104,88" fill="#f59e0b" />
            <text x="85" y="75" className="text-xs font-bold" fill="#f59e0b">Object</text>

            {/* Ray 1: Parallel to Axis -> passes through F2 */}
            <line x1="100" y1="80" x2="260" y2="80" stroke="#3b82f6" strokeWidth="2" />
            <line x1="260" y1="80" x2="420" y2="200" stroke="#3b82f6" strokeWidth="2" />

            {/* Ray 2: Through Optical Center undeviated */}
            <line x1="100" y1="80" x2="420" y2="200" stroke="#a855f7" strokeWidth="2" />

            {/* Image Formed */}
            <line x1="420" y1="140" x2="420" y2="200" stroke="#ef4444" strokeWidth="3" />
            <polygon points="420,200 416,192 424,192" fill="#ef4444" />
            <text x="428" y="200" className="text-xs font-bold" fill="#ef4444">Real Inverted Image</text>

            {/* Lens Formula Box */}
            <rect x="180" y="235" width="160" height="30" rx="8" fill="white" className="dark:fill-slate-900" stroke="currentColor" strokeWidth="1" />
            <text x="195" y="255" className="text-xs font-bold font-mono" fill="#0284c7">1/v - 1/u = 1/f</text>
          </svg>
        );

      // -------------------------------------------------------------
      // 5. ATOMIC STRUCTURE - RADIAL PROBABILITY & ORBITALS
      // -------------------------------------------------------------
      case 'atomic-radial':
        return (
          <svg viewBox="0 0 520 280" className="w-full h-auto text-slate-800 dark:text-slate-100">
            {/* Axes */}
            <line x1="50" y1="240" x2="480" y2="240" stroke="currentColor" strokeWidth="2" />
            <text x="470" y="255" className="text-xs font-mono font-bold" fill="currentColor">r (radius)</text>
            <line x1="50" y1="240" x2="50" y2="30" stroke="currentColor" strokeWidth="2" />
            <text x="15" y="25" className="text-xs font-mono font-bold" fill="currentColor">4πr²R²(r)</text>

            {/* 1s curve: 0 radial nodes */}
            <path
              d="M 50,240 Q 90,60 160,240"
              fill="none"
              stroke="#0284c7"
              strokeWidth="3"
            />
            <text x="110" y="100" className="text-xs font-bold" fill="#0284c7">1s (0 nodes)</text>

            {/* 2s curve: 1 radial node */}
            <path
              d="M 50,240 Q 90,200 120,240 Q 180,50 300,240"
              fill="none"
              stroke="#16a34a"
              strokeWidth="2.5"
            />
            <circle cx="120" cy="240" r="4" fill="#ef4444" />
            <text x="125" y="230" className="text-[10px] font-bold" fill="#ef4444">Node (n-l-1 = 1)</text>
            <text x="210" y="90" className="text-xs font-bold" fill="#16a34a">2s (1 node)</text>

            {/* 3s curve: 2 radial nodes */}
            <path
              d="M 50,240 Q 80,225 100,240 Q 150,180 200,240 Q 280,30 460,240"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="2"
              strokeDasharray="4 2"
            />
            <text x="350" y="70" className="text-xs font-bold" fill="#f59e0b">3s (2 nodes)</text>
          </svg>
        );

      // -------------------------------------------------------------
      // 6. ELECTROCHEMICAL CELL - DANIELL CELL
      // -------------------------------------------------------------
      case 'daniell-cell':
        return (
          <svg viewBox="0 0 520 280" className="w-full h-auto text-slate-800 dark:text-slate-100">
            {/* Left Beaker (ZnSO4) */}
            <rect x="70" y="110" width="130" height="130" rx="6" fill="#e0f2fe" className="dark:fill-slate-800/80" stroke="currentColor" strokeWidth="2" />
            <rect x="110" y="70" width="25" height="130" fill="#94a3b8" stroke="#475569" strokeWidth="1.5" />
            <text x="113" y="60" className="text-xs font-bold dark:fill-slate-300" fill="#334155">Zn (s)</text>
            <text x="80" y="210" className="text-[11px] font-semibold" fill="#0284c7">ZnSO₄ (aq)</text>
            <text x="80" y="230" className="text-[10px] font-bold text-rose-600">Anode (-) Oxidation</text>

            {/* Right Beaker (CuSO4) */}
            <rect x="320" y="110" width="130" height="130" rx="6" fill="#dbeafe" className="dark:fill-slate-800/80" stroke="currentColor" strokeWidth="2" />
            <rect x="375" y="70" width="25" height="130" fill="#f97316" stroke="#c2410c" strokeWidth="1.5" />
            <text x="378" y="60" className="text-xs font-bold text-amber-600">Cu (s)</text>
            <text x="330" y="210" className="text-[11px] font-semibold" fill="#0284c7">CuSO₄ (aq)</text>
            <text x="330" y="230" className="text-[10px] font-bold text-emerald-600">Cathode (+) Reduction</text>

            {/* Inverted U-tube Salt Bridge */}
            <path
              d="M 160,180 L 160,100 Q 160,80 180,80 L 340,80 Q 360,80 360,100 L 360,180"
              fill="none"
              stroke="#a855f7"
              strokeWidth="12"
              strokeLinecap="round"
            />
            <text x="220" y="70" className="text-xs font-bold" fill="#a855f7">Salt Bridge (KCl / Agar-agar)</text>

            {/* Connecting Wire & Voltmeter */}
            <line x1="122" y1="70" x2="122" y2="30" stroke="#3b82f6" strokeWidth="2" />
            <line x1="122" y1="30" x2="235" y2="30" stroke="#3b82f6" strokeWidth="2" />
            <circle cx="260" cy="30" r="16" fill="white" className="dark:fill-slate-900" stroke="#3b82f6" strokeWidth="2" />
            <text x="256" y="35" className="text-xs font-black" fill="#3b82f6">V</text>
            <line x1="285" y1="30" x2="387" y2="30" stroke="#3b82f6" strokeWidth="2" />
            <line x1="387" y1="30" x2="387" y2="70" stroke="#3b82f6" strokeWidth="2" />
            <text x="235" y="15" className="text-[11px] font-mono font-bold text-emerald-600">E° = +1.10 V</text>
          </svg>
        );

      // -------------------------------------------------------------
      // 7. MATHEMATICS - CONIC SECTIONS (PARABOLA & ELLIPSE)
      // -------------------------------------------------------------
      case 'conic-parabola':
        return (
          <svg viewBox="0 0 520 280" className="w-full h-auto text-slate-800 dark:text-slate-100">
            {/* Axes */}
            <line x1="40" y1="140" x2="480" y2="140" stroke="currentColor" strokeWidth="2" />
            <text x="485" y="145" className="text-xs font-mono font-bold" fill="currentColor">X</text>
            <line x1="220" y1="260" x2="220" y2="20" stroke="currentColor" strokeWidth="2" />
            <text x="215" y="15" className="text-xs font-mono font-bold" fill="currentColor">Y</text>

            {/* Parabola Curve y^2 = 4ax */}
            <path
              d="M 440,20 Q 220,140 440,260"
              fill="none"
              stroke="#0284c7"
              strokeWidth="3"
            />

            {/* Focus S(a, 0) */}
            <circle cx="300" cy="140" r="5" fill="#ef4444" />
            <text x="295" y="160" className="text-xs font-bold" fill="#ef4444">Focus S(a, 0)</text>

            {/* Directrix x = -a */}
            <line x1="140" y1="20" x2="140" y2="260" stroke="#a855f7" strokeWidth="2" strokeDasharray="5 4" />
            <text x="75" y="40" className="text-xs font-bold" fill="#a855f7">Directrix x = -a</text>

            {/* Latus Rectum Length = 4a */}
            <line x1="300" y1="60" x2="300" y2="220" stroke="#16a34a" strokeWidth="2.5" />
            <circle cx="300" cy="60" r="3.5" fill="#16a34a" />
            <circle cx="300" cy="220" r="3.5" fill="#16a34a" />
            <text x="310" y="80" className="text-xs font-bold" fill="#16a34a">Latus Rectum = 4a</text>

            {/* Point P on parabola & Tangent */}
            <circle cx="360" cy="90" r="4.5" fill="#f59e0b" />
            <text x="370" y="90" className="text-xs font-bold" fill="#f59e0b">P(at², 2at)</text>
            <line x1="220" y1="180" x2="440" y2="40" stroke="#f59e0b" strokeWidth="1.5" />
            <text x="230" y="200" className="text-[11px] font-bold" fill="#f59e0b">Tangent: ty = x + at²</text>
          </svg>
        );

      // Default Standard High-Yield Concept Diagram
      default:
        return (
          <svg viewBox="0 0 520 280" className="w-full h-auto text-slate-800 dark:text-slate-100">
            <rect x="40" y="30" width="440" height="220" rx="16" fill="#f8fafc" className="dark:fill-slate-900" stroke="#0284c7" strokeWidth="2" />
            <circle cx="260" cy="120" r="45" fill="#38bdf8" fillOpacity="0.2" stroke="#0284c7" strokeWidth="3" />
            <text x="215" y="125" className="text-sm font-black" fill="#0284c7">{diagram.title}</text>
            <line x1="260" y1="75" x2="260" y2="40" stroke="#16a34a" strokeWidth="2.5" />
            <line x1="260" y1="165" x2="260" y2="210" stroke="#ef4444" strokeWidth="2.5" />
            <line x1="215" y1="120" x2="100" y2="120" stroke="#a855f7" strokeWidth="2.5" />
            <line x1="305" y1="120" x2="420" y2="120" stroke="#f59e0b" strokeWidth="2.5" />
            <text x="180" y="235" className="text-xs font-mono font-bold" fill="currentColor">JEE Main Verified Visualization</text>
          </svg>
        );
    }
  };

  return (
    <div className={`p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4 ${className}`}>
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-sky-400">
            {diagram.category}
          </span>
          <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
            {diagram.title}
          </h4>
        </div>
        <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
          Official Graphic
        </span>
      </div>

      {/* Render SVG */}
      <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200/70 dark:border-slate-800/80 flex items-center justify-center overflow-hidden">
        {renderSvgContent()}
      </div>

      {diagram.caption && (
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          {diagram.caption}
        </p>
      )}

      {diagram.formula && (
        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 overflow-x-auto text-xs">
          <MathRenderer content={`$$${diagram.formula}$$`} />
        </div>
      )}

      {/* Label Descriptions */}
      {diagram.labels && diagram.labels.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-slate-100 dark:border-slate-800 text-xs">
          {diagram.labels.map((lbl, idx) => (
            <div key={idx} className="flex items-start gap-1.5">
              <span className="font-bold text-blue-600 dark:text-sky-400">•</span>
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200">{lbl.label}: </span>
                <span className="text-slate-500 dark:text-slate-400">{lbl.description}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
