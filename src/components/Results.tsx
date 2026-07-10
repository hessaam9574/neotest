import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Radar, RadarChart, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ReferenceArea, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { UserData, ResultsData } from '../types';
import { MAIN, SORD, SCC, LVC } from '../data/constants';
import { AN } from '../data/analysisData';
import { StyleGraph } from "./StyleGraph";
import { GRAPHS } from "../data/graphs";
import { LineChart } from './LineChart';
import { getDimensionInterpretation } from '../utils';

type Props = {
  isHRView?: boolean;
  user: UserData;
  results: ResultsData;
  warnings?: string[];
  onReset: () => void;
  isDark?: boolean;
};

export const Results: React.FC<Props> = ({ user, results, warnings = [], onReset, isDark = false, isHRView = false }) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'charts' | 'behavior' | 'work' | 'hr'>('summary');
  const [expandedFactor, setExpandedFactor] = useState<string | null>(null);
  const [isExpert, setIsExpert] = useState(false);
  const now = new Date().toLocaleDateString("fa-IR");

  const renderSummary = () => {
    return (
      <div className="space-y-6">
        {warnings.length > 0 && (
          <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700/50 rounded-xl p-6 mb-8">
            <h3 className="text-amber-800 dark:text-amber-400 font-bold mb-3 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              توجه: بررسی اعتبار پاسخ‌ها
            </h3>
            <ul className="list-disc list-inside space-y-2 text-amber-700 dark:text-amber-500 text-sm font-medium">
              {warnings.map((warn, i) => (
                <li key={i}>{warn}</li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl p-6 lg:p-8 border border-white/60 dark:border-slate-700/60 shadow-xl shadow-slate-200/40 dark:shadow-none mb-8 transition-colors duration-300">
          <h3 className="text-sm font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-widest mb-6">پروفایل کلی شخصیت (۵ عامل اصلی)</h3>
          <div className="h-64" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={MAIN.map(sc => ({ name: sc, T: results[sc]?.t || 0, fill: SCC[sc] || '#94a3b8' }))}
                margin={{ top: 20, right: 20, left: -20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#334155' : '#e2e8f0'} />
                <XAxis dataKey="name" tick={{ fill: isDark ? '#94a3b8' : '#475569', fontSize: 11, fontFamily: 'sans-serif' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: isDark ? '#94a3b8' : '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
                <RechartsTooltip 
                  cursor={{ fill: isDark ? '#1e293b' : '#f1f5f9' }}
                  contentStyle={{ backgroundColor: isDark ? '#1e293b' : '#fff', borderColor: isDark ? '#334155' : '#e2e8f0', borderRadius: '8px' }} 
                  itemStyle={{ color: isDark ? '#e2e8f0' : '#334155' }}
                />
                <ReferenceArea y1={0} y2={44} fill={isDark ? "#fca5a5" : "#fee2e2"} fillOpacity={0.15} />
                <ReferenceArea y1={44} y2={55} fill={isDark ? "#fde047" : "#fef08a"} fillOpacity={0.15} />
                <ReferenceArea y1={55} y2={100} fill={isDark ? "#86efac" : "#dcfce3"} fillOpacity={0.15} />
                <Bar dataKey="T" radius={[4, 4, 0, 0]} maxBarSize={48} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold"><div className="w-3 h-3 bg-red-100 dark:bg-red-900/30 rounded border border-red-200 dark:border-red-800"></div> پایین (T ≤ 44)</div>
            <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold"><div className="w-3 h-3 bg-yellow-100 dark:bg-yellow-900/30 rounded border border-yellow-200 dark:border-yellow-800"></div> متوسط (45-55)</div>
            <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold"><div className="w-3 h-3 bg-green-100 dark:bg-green-900/30 rounded border border-green-200 dark:border-green-800"></div> بالا (T &gt; 55)</div>
          </div>
        </div>

        {MAIN.map((sc, i) => {
          const rv = results[sc];
          if (!rv) return null;
          const cc = SCC[sc] || "#533483";
          const lc = LVC[rv.l5];
          const pct = Math.min(rv.t, 80) / 80 * 100;
          const subs = SORD[sc] || [];

          return (
            <motion.div 
              key={sc} 
              className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm transition-colors duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <div className="h-1.5 w-full" style={{ backgroundColor: cc }} />
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-bold text-white px-3 py-1 rounded-full" style={{ backgroundColor: lc }}>
                    {rv.l5}
                  </span>
                  <span className="text-lg font-bold" style={{ color: cc }}>{sc}</span>
                </div>
                
                <div className="text-[11px] uppercase font-semibold text-slate-400 dark:text-slate-500 tracking-wider mb-5 flex gap-4 justify-end">
                  <span>سطح: <strong className="text-slate-700 dark:text-slate-300">{rv.l3}</strong></span>
                  <span>تراز (T): <strong className="text-slate-700 dark:text-slate-300">{rv.t}</strong></span>
                  <span>خام: <strong className="text-slate-700 dark:text-slate-300">{rv.raw}</strong></span>
                </div>

                <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full mb-6 overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: cc }} />
                </div>

                <div className="flex flex-col border-t border-slate-100 dark:border-slate-700/50 pt-4 mt-2">
                  <button 
                    onClick={() => setExpandedFactor(expandedFactor === sc ? null : sc)}
                    className="flex items-center justify-between text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className={`w-4 h-4 transition-transform ${expandedFactor === sc ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                      جزئیات خرده‌مقیاس‌ها (۶ مورد)
                    </span>
                  </button>
                  
                  <AnimatePresence>
                    {expandedFactor === sc && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/50">
                          {subs.map(sub => {
                            const sv = results[sub];
                            if (!sv) return null;
                            return (
                              <div key={sub} className="flex flex-col p-3 rounded-lg border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 shadow-sm border border-slate-200/60 dark:border-slate-700/60">
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-sm font-bold text-slate-800 dark:text-slate-300">{sub}</span>
                                  <span className="text-[10px] text-white px-2 py-0.5 rounded-full font-bold" style={{ backgroundColor: LVC[sv.l5] }}>
                                    {sv.l5}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center text-[11px] text-slate-500 dark:text-slate-400">
                                  <span>تراز (T): <strong className="text-slate-700 dark:text-slate-300">{sv.t}</strong></span>
                                  <span>خام: <strong className="text-slate-700 dark:text-slate-300">{sv.raw}</strong></span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          );
        })}
      
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h3 className="text-sm font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-widest mb-4 mt-12 border-b border-slate-200 dark:border-slate-700 pb-2">۱۰ نمودار سبک شخصیتی</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
            {GRAPHS.map((graph: any) => (
              <StyleGraph key={graph.key} graph={graph} results={results} isExpert={isExpert} />
            ))}
          </div>
        </motion.div>
      </div>
    );
  };

  const renderCharts = () => {
    const mainPoints = MAIN.map(sc => ({
      label: sc,
      t: results[sc]?.t || 50,
      color: SCC[sc] || "#999"
    }));

    const radarData = MAIN.map(sc => ({
      subject: sc,
      A: results[sc]?.t || 50,
      fullMark: 100,
    }));

    const allSubs: any[] = [];
    MAIN.forEach(sc => {
      (SORD[sc] || []).forEach(sub => {
        allSubs.push({
          label: sub,
          t: results[sub]?.t || 50,
          color: SCC[sc] || "#999",
          parent: sc
        });
      });
    });

    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="text-sm font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-widest mb-4">پروفایل شخصیت (رادار)</h3>
            <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 h-[284px] shadow-sm flex items-center justify-center transition-colors duration-300" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                  <PolarGrid stroke={isDark ? "#334155" : "#e2e8f0"} />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: isDark ? '#94a3b8' : '#475569', fontSize: 11, fontWeight: 600, fontFamily: 'sans-serif' }} />
                  <PolarRadiusAxis angle={90} domain={[0, 80]} tick={{ fill: isDark ? '#64748b' : '#94a3b8', fontSize: 10 }} />
                  <Radar name="شخصیت" dataKey="A" stroke={isDark ? "#60a5fa" : "#1d4ed8"} fill="#3b82f6" fillOpacity={isDark ? 0.4 : 0.3} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-8 space-y-4">
              <h3 className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">تفسیر ابعاد اصلی</h3>
              {MAIN.map((sc, i) => {
                const rv = results[sc];
                if (!rv) return null;
                const desc = getDimensionInterpretation(sc, rv.l5);
                const color = SCC[sc] || (isDark ? "#60a5fa" : "#1d4ed8");
                return (
                  <motion.div 
                    key={`interp-${sc}`} 
                    className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 border border-slate-100 dark:border-slate-800 flex flex-col gap-1.5 shadow-sm transition-colors duration-300"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                      <span className="text-sm font-bold text-slate-900 dark:text-white">{sc}</span>
                      <span className="text-[10px] text-white px-2 py-0.5 rounded-full mr-2 font-bold" style={{ backgroundColor: LVC[rv.l5] }}>{rv.l5}</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed mt-1 pr-4">{desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="text-sm font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-widest mb-4">وضعیت در ۵ مقیاس اصلی</h3>
            <LineChart points={mainPoints} type="main" isDark={isDark} />
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h3 className="text-sm font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-widest mb-4">وضعیت در خرده‌مقیاس‌ها</h3>
          <LineChart points={allSubs} type="sub" isDark={isDark} />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h3 className="text-sm font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-widest mb-4 mt-12 border-b border-slate-200 dark:border-slate-700 pb-2">۱۰ نمودار سبک شخصیتی</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
            {GRAPHS.map((graph: any) => (
              <StyleGraph key={graph.key} graph={graph} results={results} isExpert={isExpert} />
            ))}
          </div>
        </motion.div>
      </div>
    );
  };

  const findAnalysis = (arr: any[], name: string, level: string, nameKey = "name") => {
    return (arr || []).find(r => r[nameKey] === name && r.level === level) || {};
  };

  const renderAnalysis = (isWork: boolean) => {
    return (
      <div className="space-y-8">
        {MAIN.map((sc, i) => {
          const rv = results[sc];
          if (!rv) return null;
          const cc = SCC[sc] || "#533483";
          const lc = LVC[rv.l3];
          
          const info = isWork 
            ? findAnalysis(AN.work_main || [], sc, rv.l3) 
            : findAnalysis(AN.beh_main || [], sc, rv.l3);

          return (
            <motion.div 
               key={sc} 
               className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm transition-colors duration-300"
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <div className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex justify-between items-center" style={{ borderRightWidth: '4px', borderRightColor: cc }}>
                <div className="font-bold text-base" style={{ color: cc }}>{sc}</div>
                <div className="flex items-center gap-4">
                  <span className="text-xs uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 tracking-wider">T={rv.t} · خام:{rv.raw}</span>
                  <span className="text-xs font-bold text-white px-3 py-1 rounded-full" style={{ backgroundColor: lc }}>{rv.l3}</span>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                {info.desc && (
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">● {isWork ? 'شغلی' : 'رفتاری'}</h4>
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">{info.desc}</p>
                  </div>
                )}
                {info.traits && (
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">● ویژگی‌های روانی {isWork ? 'در محیط کار' : 'و رفتاری'}</h4>
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">{info.traits}</p>
                  </div>
                )}
                {info.challenges && (
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">● چالش‌ها</h4>
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">{info.challenges}</p>
                  </div>
                )}
                {info.performance && (
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">● ویژگی / عملکرد در کار</h4>
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">{info.performance}</p>
                  </div>
                )}

                {/* Subscales */}
                <div className="mt-8 pr-6 border-r-2 space-y-6" style={{ borderRightColor: cc }}>
                  {(SORD[sc] || []).map(sub => {
                    const sv = results[sub];
                    if (!sv) return null;
                    const slc = LVC[sv.l3];
                    const si = isWork 
                      ? findAnalysis(AN.work_sub || [], sub, sv.l3, "name") 
                      : findAnalysis(AN.beh_sub || [], sub, sv.l3, "name");

                    if (!si.desc && !si.traits) return null; // Skip if no data

                    return (
                      <div key={sub} className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm transition-colors duration-300">
                        <div className="bg-white dark:bg-slate-800 px-5 py-3 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center transition-colors duration-300">
                          <span className="text-sm font-bold" style={{ color: cc }}>{sub}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-xs uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 tracking-wider">T={sv.t}</span>
                            <span className="text-[10px] font-bold text-white px-2.5 py-0.5 rounded-full" style={{ backgroundColor: slc }}>{sv.l3}</span>
                          </div>
                        </div>
                        <div className="p-5 space-y-4">
                           {si.desc && (
                            <div>
                              <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">● توضیح</h4>
                              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">{si.desc}</p>
                            </div>
                          )}
                          {si.traits && (
                            <div>
                              <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">● ویژگی‌ها</h4>
                              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">{si.traits}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  };

  
  
  const renderHR = () => {
    return (
      <div className="space-y-8">
        <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-indigo-900 dark:text-indigo-300 mb-2">گزارش محرمانه منابع انسانی (HR)</h3>
          <p className="text-sm text-indigo-700 dark:text-indigo-400 mb-6">
            این بخش شامل تحلیل‌های تخصصی است که برای ارزیابان، مدیران منابع انسانی و روان‌شناسان صنعتی-سازمانی طراحی شده است.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-indigo-100 dark:border-slate-700">
              <span className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">اطلاعات کاندیدا</span>
              <div className="text-slate-900 dark:text-white font-medium">{user.name} ({user.gender === 'female' ? 'زن' : 'مرد'})</div>
              <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">{user.age} ساله • تحصیلات: {user.education}</div>
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-indigo-100 dark:border-slate-700">
              <span className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">شاخص روایی آزمون</span>
              {warnings.length === 0 ? (
                <div className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
                  پاسخ‌دهی معتبر و قابل اتکا
                </div>
              ) : (
                <div className="text-amber-600 dark:text-amber-500 font-medium flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                  مشکوک به سوگیری یا بی‌دقتی
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-6 border-b border-slate-100 dark:border-slate-700 pb-3">پروفایل استعدادیابی (نقاط قوت و ریسک‌ها)</h3>
          
          <div className="space-y-6">
            <div>
              <h4 className="text-emerald-600 dark:text-emerald-400 font-bold mb-3 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                نقاط قوت سازمانی
              </h4>
              <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                {(results['با وجدان بودن']?.t >= 55) && <li>• <strong className="text-slate-900 dark:text-white">وظیفه‌شناسی بالا:</strong> دارای انضباط شخصی، پیگیری امور تا حصول نتیجه، و قابلیت اتکای بالا.</li>}
                {(results['انعطاف پذیری']?.t >= 55) && <li>• <strong className="text-slate-900 dark:text-white">تفکر نوآورانه:</strong> توانایی حل خلاقانه مسائل، استقبال از تغییرات سازمانی، و یادگیری مستمر.</li>}
                {(results['دلپذیر بودن']?.t >= 55) && <li>• <strong className="text-slate-900 dark:text-white">کار تیمی سازنده:</strong> ایجاد جو مثبت در تیم، همدلی با همکاران و مشتریان، و حل مسالمت‌آمیز تعارضات.</li>}
                {(results['روان نژندی']?.t <= 45) && <li>• <strong className="text-slate-900 dark:text-white">ثبات هیجانی:</strong> مقاومت بالا در برابر استرس‌های محیط کار و تصمیم‌گیری منطقی در شرایط بحرانی.</li>}
                {(results['برونگرایی']?.t >= 55) && <li>• <strong className="text-slate-900 dark:text-white">انرژی و روابط عمومی:</strong> توانایی شبکه‌سازی، متقاعدسازی، و ایجاد شور و شوق در محیط کار.</li>}
                
                {(!Object.keys(results).some(k => MAIN.includes(k) && ((k==='روان نژندی' && results[k].t<=45) || (k!=='روان نژندی' && results[k].t>=55)))) && (
                  <li className="text-slate-500 italic">نیاز به مصاحبه عمیق‌تر برای کشف نقاط قوت پنهان.</li>
                )}
              </ul>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
              <h4 className="text-rose-600 dark:text-rose-400 font-bold mb-3 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                ریسک‌های بالقوه (نیاز به مدیریت)
              </h4>
              <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                {(results['روان نژندی']?.t >= 55) && <li>• <strong className="text-slate-900 dark:text-white">آسیب‌پذیری به استرس:</strong> ممکن است در محیط‌های پرفشار و ضرب‌الاجل‌های فشرده دچار فرسودگی شغلی شود.</li>}
                {(results['با وجدان بودن']?.t <= 45) && <li>• <strong className="text-slate-900 dark:text-white">چالش‌های نظم‌پذیری:</strong> نیاز به نظارت بیشتر و ساختارهای کنترلی مشخص؛ مناسب برای کارهای چارچوب‌دار نیست.</li>}
                {(results['دلپذیر بودن']?.t <= 45) && <li>• <strong className="text-slate-900 dark:text-white">ریسک تعارضات:</strong> رویکرد انتقادی صریح ممکن است باعث ایجاد اصطکاک در کار تیمی شود (هرچند برای مذاکرات سخت مفید است).</li>}
                {(results['انعطاف پذیری']?.t <= 45) && <li>• <strong className="text-slate-900 dark:text-white">مقاومت در برابر تغییر:</strong> ترجیح می‌دهد در چارچوب‌های آشنا و روتین کار کند؛ تطبیق با سیستم‌های جدید زمان‌بر است.</li>}
                
                {(!Object.keys(results).some(k => MAIN.includes(k) && ((k==='روان نژندی' && results[k].t>=55) || (k!=='روان نژندی' && results[k].t<=45)))) && (
                  <li className="text-slate-500 italic">ریسک جدی و برجسته‌ای بر اساس پروفایل پایه مشاهده نشد.</li>
                )}
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-6 border-b border-slate-100 dark:border-slate-700 pb-3">توصیه‌های جایگذاری و تیم‌سازی</h3>
          <p className="text-sm leading-8 text-slate-700 dark:text-slate-300 text-justify">
            این فرد در محیط‌هایی که 
            {results['با وجدان بودن']?.t >= 55 ? " ساختارمند و هدف‌گرا هستند " : " نیازمند انعطاف و آزادی عمل هستند "}
            عملکرد بهتری خواهد داشت. 
            با توجه به سطح برونگرایی ({results['برونگرایی']?.l5})، 
            {results['برونگرایی']?.t >= 55 ? " مشاغلی با تعاملات انسانی گسترده و پویایی بالا " : " مشاغل متمرکز، تحلیلی و با نیاز به تمرکز فردی "}
            به شدت توصیه می‌شود.
            همچنین با در نظر گرفتن سطح دلپذیر بودن، در یک تیم 
            {results['دلپذیر بودن']?.t >= 55 ? " به عنوان عامل چسبندگی و پشتیبان همکاران " : " به عنوان صدای منتقد و واقع‌گرای تیم، که از تفکر گروهی جلوگیری می‌کند، "}
            نقش مفیدی ایفا خواهد کرد.
          </p>
        </div>

      </div>
    );
  };

  const tabs = (isHRView 
    ? [
        { id: 'summary', label: 'پروفایل من' },
        { id: 'charts', label: 'نمودارها' },
        { id: 'behavior', label: 'تحلیل رفتاری' },
        { id: 'work', label: 'تحلیل شغلی' },
        { id: 'hr', label: 'گزارش منابع انسانی (HR)' }
      ]
    : [
        { id: 'summary', label: 'پروفایل من' },
        { id: 'charts', label: 'نمودارها' },
        { id: 'behavior', label: 'تحلیل رفتاری' },
        { id: 'work', label: 'تحلیل شغلی' }
      ]) as { id: 'summary' | 'charts' | 'behavior' | 'work' | 'hr'; label: string }[];


  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans pb-24 transition-colors duration-300">
      {/* Header */}
      

      {/* Tabs */}
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800 sticky top-[65px] z-40 shadow-sm transition-colors duration-300">
        <div className="max-w-5xl mx-auto flex justify-between items-center px-6">
          <div className="flex overflow-x-auto hide-scrollbar">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  px-6 py-4 text-sm font-bold whitespace-nowrap transition-colors border-b-2
                  ${activeTab === tab.id 
                    ? 'border-indigo-600 text-indigo-700 dark:border-indigo-400 dark:text-indigo-400' 
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600'
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 shrink-0 mr-4">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">نمای تخصصی</span>
            <button 
              onClick={() => setIsExpert(!isExpert)}
              className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none ${isExpert ? 'bg-blue-600 dark:bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'}`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${isExpert ? 'left-1' : 'left-6'}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'summary' && renderSummary()}
              {activeTab === 'charts' && renderCharts()}
              {activeTab === 'behavior' && renderAnalysis(false)}
              {activeTab === 'work' && renderAnalysis(true)}
              {activeTab === 'hr' && renderHR()}
            </motion.div>
          </AnimatePresence>

          <div className="mt-16 mb-8 bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-8 border-l-4 border-slate-300 dark:border-slate-600 shadow-sm text-slate-600 dark:text-slate-400">
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
              ملاحظات علمی و اخلاقی (متدولوژی)
            </h4>
            <p className="text-sm leading-8 font-medium text-justify mb-4 text-slate-600 dark:text-slate-400">
              <strong>مبنای محاسبه:</strong> نمرات تراز (T) در این گزارش مستقیماً بر اساس جداول هنجاری تفکیک‌شده بر حسب جنسیت (جداول <strong>{user.gender === 'female' ? 'زنان' : 'مردان'}</strong>) استخراج شده است تا دقت سنجش حفظ شود. نمرات نشان‌دهنده‌ی جایگاه فرد نسبت به جمعیت هنجار هستند.
            </p>
            <p className="text-sm leading-8 font-medium text-justify text-slate-600 dark:text-slate-400">
              <strong>سلب مسئولیت بالینی:</strong> این سامانه تنها یک ابزار ارزیابی روان‌سنجی است و نتایج آن در حکم <em>فرضیه‌هایی درباره سبک شخصیتی</em> می‌باشند. این نتایج <strong>به هیچ‌وجه جایگزین تشخیص بالینی، مشاوره تخصصی یا ارزیابی روان‌شناختی جامع نیستند</strong>. تصمیم‌گیری‌های حساس (درمان، استخدام و غیره) نباید صرفاً بر مبنای این گزارش انجام شود.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 p-6 z-20 shrink-0 transition-colors duration-300">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button 
            onClick={onReset}
            className="px-6 py-2.5 rounded-lg text-sm font-semibold text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-700 dark:hover:text-slate-200 shadow-sm transition-all"
          >
            {isHRView ? 'بازگشت به پنل مدیر' : 'بازگشت به پروفایل من'}
          </button>
          <div className="flex items-center gap-3">
            <a 
              href={`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(`آزمون شخصیت نئو (NEO) - نتایج من\n\n${MAIN.map(sc => `${sc}: ${results[sc]?.l5} (${results[sc]?.t})`).join('\n')}\n\nشما هم می‌توانید در این آزمون شرکت کنید!`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 border border-sky-100 dark:border-sky-900 rounded-lg shadow-sm hover:bg-sky-100 dark:hover:bg-sky-900/50 transition-colors flex items-center gap-2"
              title="اشتراک‌گذاری در تلگرام"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
            </a>
            <a 
              href={`https://wa.me/?text=${encodeURIComponent(`آزمون شخصیت نئو (NEO) - نتایج من\n\n${MAIN.map(sc => `${sc}: ${results[sc]?.l5} (${results[sc]?.t})`).join('\n')}\n\nشما هم می‌توانید در این آزمون شرکت کنید! \n ${window.location.href}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900 rounded-lg shadow-sm hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors flex items-center gap-2"
              title="اشتراک‌گذاری در واتس‌اپ"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"/><path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z"/><path d="M14 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z"/><path d="M9.5 13.5c1.5 1 3.5 1 5 0"/></svg>
            </a>
            <button 
              onClick={() => window.print()}
              className="px-8 py-3 bg-blue-700 dark:bg-blue-600 text-white rounded-lg text-sm font-bold shadow-lg shadow-blue-200 dark:shadow-none hover:bg-blue-800 dark:hover:bg-blue-700 transition-colors"
            >
              دانلود گزارش PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

