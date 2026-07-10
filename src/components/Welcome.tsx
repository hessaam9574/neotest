import React from 'react';
import { motion } from 'motion/react';
import { BrainCircuit } from 'lucide-react';

type Props = {
  onHR?: () => void;
  onNext: () => void;
};

export const Welcome: React.FC<Props> = ({ onNext, onHR }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 dark:from-slate-900 dark:via-slate-800 dark:to-slate-950 font-sans transition-colors duration-500"
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        className="max-w-xl w-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-10 shadow-2xl border border-white/50 dark:border-slate-700/50 transition-colors duration-300 relative overflow-hidden"
      >
        {/* Decorative elements */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl"></div>

        <div className="mb-8 flex justify-center relative z-10">
          <div className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-700/50 dark:to-slate-600/50 rounded-2xl shadow-inner border border-white dark:border-slate-600">
            <BrainCircuit className="w-16 h-16 text-blue-600 dark:text-blue-400" strokeWidth={1.5} />
          </div>
        </div>
        
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight relative z-10">آزمون شخصیت نئو</h1>
        <h2 className="text-slate-500 dark:text-slate-400 mb-8 font-medium text-lg relative z-10">NEO Personality Inventory – Revised (NEO-PI-R)</h2>
        
        <div className="w-20 h-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto rounded-full mb-8 relative z-10"></div>
        
        <div className="text-slate-600 dark:text-slate-300 leading-relaxed mb-10 space-y-4 text-base relative z-10">
          <p>
            این آزمون جامع شامل <strong className="text-blue-700 dark:text-blue-400 text-lg">۲۴۰ سوال</strong> است که دقیق‌ترین تصویر از ویژگی‌های شخصیتی شما را ارائه می‌دهد.
          </p>
          <p className="text-sm opacity-90">
            با پاسخگویی صادقانه، شناخت عمیق‌تری از نقاط قوت، سبک ارتباطی، و تمایلات درونی خود به دست آورید.
          </p>
        </div>
        
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onNext}
            className="w-full sm:w-auto bg-gradient-to-l from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-12 rounded-xl shadow-lg shadow-blue-500/30 transition-all inline-flex items-center justify-center gap-3 text-lg"
          >
            <span>شروع ارزیابی</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </motion.button>
          
          {onHR && (
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onHR}
              className="w-full sm:w-auto bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 font-bold py-4 px-8 rounded-xl shadow-sm transition-all inline-flex items-center justify-center gap-2 text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              <span>ورود منابع انسانی</span>
            </motion.button>
          )}
        </div>

      </motion.div>
    </motion.div>
  );
};
