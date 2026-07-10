import React from 'react';

type Point = {
  label: string;
  t: number;
  color: string;
  parent?: string;
};

type Props = {
  points: Point[];
  type: 'main' | 'sub';
  isDark?: boolean;
};

export const LineChart: React.FC<Props> = ({ points, type, isDark = false }) => {
  const isMain = type === 'main';
  const n = points.length;

  const W = isMain ? 720 : 1240;
  const PAD = { t: 36, r: 18, b: isMain ? 62 : 122, l: 46 };
  const plotH = isMain ? 210 : 220;
  const H = PAD.t + plotH + PAD.b;
  const plotW = W - PAD.l - PAD.r;
  const xStep = plotW / (n > 1 ? n - 1 : 1);

  const minT = 20, maxT = 80;
  const yt = (t: number) => PAD.t + plotH - ((t - minT) / (maxT - minT)) * plotH;
  const xp = (i: number) => PAD.l + i * xStep;

  const bands = [
    { from: 20, to: 35, color: isDark ? "#7f1d1d" : "#f5c6c6", label: "بسیار پایین", lc: isDark ? "#fca5a5" : "#c0392b" },
    { from: 35, to: 45, color: isDark ? "#7c2d12" : "#fde8c8", label: "پایین", lc: isDark ? "#fdba74" : "#d35400" },
    { from: 45, to: 55, color: isDark ? "#1e293b" : "#fafafa", label: "متوسط", lc: isDark ? "#cbd5e1" : "#7f8c8d" },
    { from: 55, to: 65, color: isDark ? "#14532d" : "#d5efd5", label: "بالا", lc: isDark ? "#86efac" : "#27ae60" },
    { from: 65, to: 80, color: isDark ? "#064e3b" : "#b8e6c8", label: "بسیار بالا", lc: isDark ? "#6ee7b7" : "#1e8449" },
  ];
  
  const gridTs = [20, 30, 40, 50, 60, 70, 80];
  const fs = isMain ? 11 : (n > 25 ? 8.5 : 9.5);
  const mX = isMain ? 66 : 58;

  let d = "";
  points.forEach((p, i) => {
    d += (i === 0 ? "M " : "L ") + `${xp(i).toFixed(1)} ${yt(p.t).toFixed(1)} `;
  });

  const xBaseY = PAD.t + plotH + 12;

  const gridLineColor = isDark ? "#475569" : "#aaa";
  const gridTextColor = isDark ? "#94a3b8" : "#444";
  const mainLineColor = isDark ? "#38bdf8" : "#2c7a7a";
  const textColor = isDark ? "#e2e8f0" : "#111";
  const rectStrokeColor = isDark ? "#475569" : "#999";
  const vLineMain = isDark ? "#0284c7" : "#5599bb";
  const vLineSub = isDark ? "#475569" : "#ccc";

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 overflow-x-auto transition-colors duration-300" dir="ltr">
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox={`${-mX} 0 ${W + 2 * mX} ${H}`} 
        className="w-full block font-sans"
      >
        {bands.map((b, i) => {
          const y1 = yt(b.to);
          const y2 = yt(b.from);
          return (
            <g key={`band-${i}`}>
              <rect x={PAD.l} y={y1.toFixed(1)} width={plotW} height={(y2 - y1).toFixed(1)} fill={b.color} opacity={isDark ? "0.3" : "1"} />
              <text 
                x={(PAD.l + plotW / 2).toFixed(1)} 
                y={(yt((b.from + b.to) / 2) + 5).toFixed(1)} 
                fontSize="13" 
                fill={b.lc} 
                textAnchor="middle" 
                opacity={isDark ? "0.5" : "0.32"} 
                fontWeight="bold"
              >
                {b.label}
              </text>
            </g>
          );
        })}

        {gridTs.map(t => {
          const y = yt(t);
          return (
            <g key={`grid-${t}`}>
              <line x1={PAD.l} y1={y.toFixed(1)} x2={PAD.l + plotW} y2={y.toFixed(1)} stroke={gridLineColor} strokeWidth="0.7" strokeDasharray="5,4" />
              <text x={(PAD.l - 6).toFixed(1)} y={(y + 4).toFixed(1)} fontSize="10.5" fill={gridTextColor} textAnchor="end">
                {t}
              </text>
            </g>
          );
        })}

        {isMain ? (
          points.map((_, i) => (
            i !== 0 && i !== n - 1 && (
              <line 
                key={`vline-${i}`} 
                x1={xp(i).toFixed(1)} 
                y1={PAD.t} 
                x2={xp(i).toFixed(1)} 
                y2={PAD.t + plotH} 
                stroke={vLineMain} 
                strokeWidth="0.8" 
                opacity="0.4" 
              />
            )
          ))
        ) : (
          points.map((_, i) => (
            <line 
              key={`vline-${i}`} 
              x1={xp(i).toFixed(1)} 
              y1={PAD.t} 
              x2={xp(i).toFixed(1)} 
              y2={PAD.t + plotH} 
              stroke={vLineSub} 
              strokeWidth="0.5" 
            />
          ))
        )}

        <path d={d.trim()} fill="none" stroke={mainLineColor} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />

        {points.map((p, i) => {
          const x = xp(i);
          const y = yt(p.t);
          return (
            <g key={`point-${i}`}>
              <text x={x.toFixed(1)} y={(y - 9).toFixed(1)} fontSize={isMain ? 11 : 9.5} fill={textColor} textAnchor="middle" fontWeight="bold">
                {p.t}
              </text>
              <circle cx={x.toFixed(1)} cy={y.toFixed(1)} r="4" fill={mainLineColor} stroke={isDark ? "#1e293b" : "#fff"} strokeWidth="1.8" />
              
              {isMain ? (
                <text x={x.toFixed(1)} y={(xBaseY + 6).toFixed(1)} fontSize={fs} fill={textColor} textAnchor="middle">
                  {p.label}
                </text>
              ) : (
                <text transform={`translate(${x.toFixed(1)},${xBaseY}) rotate(-45)`} fontSize={fs} fill={textColor} textAnchor="end">
                  {p.label}
                </text>
              )}
            </g>
          );
        })}

        <rect x={PAD.l} y={PAD.t} width={plotW} height={plotH} fill="none" stroke={rectStrokeColor} strokeWidth="0.8" />
      </svg>
    </div>
  );
};
