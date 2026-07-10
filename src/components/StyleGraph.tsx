import { motion, AnimatePresence } from 'motion/react';
import React, { useState } from 'react';
import { SCC } from '../data/constants';

type StyleGraphProps = {
  graph: any;
  results: any;
  isExpert: boolean;
};

export const StyleGraph: React.FC<StyleGraphProps> = ({ graph, results, isExpert }) => {
  const ty = results[graph.y]?.t || 50;
  const tx = results[graph.x]?.t || 50;
  const rawY = results[graph.y]?.raw || 0;
  const rawX = results[graph.x]?.raw || 0;
  const ys = ty >= 50 ? "+" : "-";
  const xs = tx >= 50 ? "+" : "-";
  
  const [activeQuad, setActiveQuad] = useState<string>(ys + xs);

  const W = 340;
  const H = 330;
  const cx = 170;
  const cy = 165;
  const R = 125;
  
  const map01 = (t: number) => Math.max(0, Math.min(1, (t - 20) / 60));
  const mx = cx + (map01(tx) - 0.5) * 2 * R;
  const my = cy - (map01(ty) - 0.5) * 2 * R;
  
  const qcol = (c: string) => c === "cool" ? "#3f6d8c" : "#c2703d";
  const uid = "clip_" + graph.key;
  
  const quadrants = [
    { k: "+-", x: cx - R, y: cy - R },
    { k: "++", x: cx, y: cy - R },
    { k: "--", x: cx - R, y: cy },
    { k: "-+", x: cx, y: cy }
  ];

  const qL: Record<string, [number, number]> = {
    "+-": [cx - R * 0.62, cy - R * 0.72],
    "++": [cx + R * 0.30, cy - R * 0.72],
    "--": [cx - R * 0.62, cy + R * 0.80],
    "-+": [cx + R * 0.30, cy + R * 0.80]
  };

  const getTint = (k: string) => {
    if (k === activeQuad) {
      return graph.q[k][1] === "cool" ? "#e6eff5" : "#f6e9df";
    }
    return "transparent";
  };
  
  const a = graph.q[activeQuad];

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 shadow-md shadow-slate-200/30 dark:shadow-none rounded-xl overflow-hidden shadow-sm flex flex-col transition-colors duration-300">
      <div className="p-4 border-b border-slate-100/80 dark:border-slate-700/80">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="w-6 h-6 rounded-full bg-slate-900 dark:bg-slate-700 text-white flex items-center justify-center text-xs font-bold shrink-0">{graph.num}</span>
          <h3 className="text-lg font-bold">{graph.fa}</h3>
          <span className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-widest">{graph.en}</span>
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">
          عمودی: <strong className="text-slate-800 dark:text-slate-200">{graph.y}</strong> · افقی: <strong className="text-slate-800 dark:text-slate-200">{graph.x}</strong>
        </div>
      </div>
      
      <div className="p-4 flex justify-center relative">
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={graph.fa} className="w-full max-w-sm h-auto select-none">
          <defs>
            <clipPath id={uid}><circle cx={cx} cy={cy} r={R}/></clipPath>
          </defs>
          <g clipPath={`url(#${uid})`}>
            {quadrants.map(({ k, x, y }) => (
              <rect 
                key={k} 
                x={x} 
                y={y} 
                width={R} 
                height={R} 
                fill={getTint(k)} 
                className="transition-colors duration-300 cursor-pointer"
                onMouseEnter={() => setActiveQuad(k)}
                onClick={() => setActiveQuad(k)}
                onMouseLeave={() => setActiveQuad(ys + xs)}
              />
            ))}
            <line x1={cx} y1={cy - R} x2={cx} y2={cy + R} stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3 3"/>
            <line x1={cx - R} y1={cy} x2={cx + R} y2={cy} stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3 3"/>
            
            {Object.entries(qL).map(([k, [x, y]]) => {
              const isActive = k === activeQuad;
              const isTrueQuad = k === (ys + xs);
              const color = isTrueQuad || isActive ? qcol(graph.q[k][1]) : '#94a3b8';
              return (
                <text key={k} x={x} y={y} fontSize="11" fontWeight="700" fill={color} className="transition-colors pointer-events-none">
                  {graph.q[k][0]}
                </text>
              );
            })}
          </g>
          
          <circle cx={cx} cy={cy} r={R} fill="none" stroke="#94a3b8" strokeWidth="1.5" className="pointer-events-none" />
          
          <text x={cx} y={18} textAnchor="middle" fontSize="11" fontWeight="700" fill={SCC[graph.y]}>{graph.y}↑</text>
          <text x={cx} y={H - 8} textAnchor="middle" fontSize="11" fontWeight="700" fill={SCC[graph.y]}>{graph.y}↓</text>
          <text x={W - 6} y={cy - 6} textAnchor="end" fontSize="11" fontWeight="700" fill={SCC[graph.x]}>{graph.x}↑</text>
          <text x={6} y={cy - 6} fontSize="11" fontWeight="700" fill={SCC[graph.x]}>{graph.x}↓</text>
          
          {/* Marker */}
          <circle cx={mx} cy={my} r="14" fill="none" stroke={qcol(graph.q[ys+xs][1])} strokeWidth="1" opacity=".4" className="pointer-events-none" />
          <line x1={mx - 6} y1={my - 6} x2={mx + 6} y2={my + 6} stroke="#b1330f" strokeWidth="2.5" strokeLinecap="round" className="pointer-events-none" />
          <line x1={mx - 6} y1={my + 6} x2={mx + 6} y2={my - 6} stroke="#b1330f" strokeWidth="2.5" strokeLinecap="round" className="pointer-events-none" />
        </svg>
      </div>

      <div className="px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 transition-colors">
        <div className="flex items-center gap-2 mb-2">
          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${a[1] === 'cool' ? 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-900/30 dark:text-sky-400 dark:border-sky-800' : 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800'}`}>
            {activeQuad === (ys + xs) ? 'ربع فعال کاربر' : `نمایش ربع ${activeQuad}`}
          </span>
        </div>
        <h4 className="text-base font-extrabold mb-2 dark:text-white">{a[0]}</h4>
        <p className="text-[15px] text-slate-700 dark:text-slate-300 leading-9 font-medium text-justify">{a[2]}</p>
      </div>

      <AnimatePresence>
        {isExpert && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900">
              <div className="font-mono text-left text-[11px] text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 shadow-md shadow-slate-200/30 dark:shadow-none p-2.5 rounded-md break-words" dir="ltr">
                Y({graph.y}): T={ty} (raw:{rawY}) &rarr; <strong className={ty >= 50 ? 'text-rose-500' : 'text-blue-500'}>{ty >= 50 ? 'HIGH(+)' : 'LOW(-)'}</strong><br/>
                X({graph.x}): T={tx} (raw:{rawX}) &rarr; <strong className={tx >= 50 ? 'text-rose-500' : 'text-blue-500'}>{tx >= 50 ? 'HIGH(+)' : 'LOW(-)'}</strong><br/>
                QUADRANT: <strong className="text-slate-800 dark:text-slate-200">{ys}{xs}</strong> ({graph.q[ys+xs][0]})<br/>
                <hr className="my-2 border-slate-200/60 dark:border-slate-700/60 shadow-md shadow-slate-200/30 dark:shadow-none"/>
                All Quads:<br/>
                ++ : {graph.q["++"][0]}<br/>
                +- : {graph.q["+-"][0]}<br/>
                -+ : {graph.q["-+"][0]}<br/>
                -- : {graph.q["--"][0]}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
