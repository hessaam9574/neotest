import React, { useState } from 'react';
import { motion } from 'motion/react';
import { UserData } from '../types';
import { User, Calendar, GraduationCap } from 'lucide-react';

type Props = {
  onBack: () => void;
  onStart: (data: UserData) => void;
};

export const InfoForm: React.FC<Props> = ({ onBack, onStart }) => {
  const [data, setData] = useState<UserData>({
    name: '',
    age: '',
    education: '',
    gender: 'female'
  });

  const [errorMsg, setErrorMsg] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.name.trim()) {
      setErrorMsg('لطفاً نام خود را وارد کنید');
      return;
    }
    if (!data.age.trim()) {
      alert('لطفاً سن خود را وارد کنید');
      return;
    }
    onStart(data);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 dark:from-slate-900 dark:via-slate-800 dark:to-slate-950 font-sans transition-colors duration-500"
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
        className="max-w-md w-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-8 sm:p-10 shadow-2xl border border-white/50 dark:border-slate-700/50 transition-colors duration-300 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl"></div>

        <h2 className="text-2xl font-bold text-center text-slate-900 dark:text-white mb-8 tracking-tight relative z-10">مشخصات ارزیابی‌شونده</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div className="space-y-2">
            <label className="text-sm text-slate-600 dark:text-slate-300 font-medium">نام و نام خانوادگی</label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                <User className="w-5 h-5" />
              </div>
              <input 
                type="text" 
                value={data.name}
                onChange={e => setData({...data, name: e.target.value})}
                className="w-full bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 rounded-xl pr-10 pl-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
                placeholder="نام کامل خود را وارد کنید"
              />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="space-y-2 flex-1">
              <label className="text-sm text-slate-600 dark:text-slate-300 font-medium">سن (سال)</label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                  <Calendar className="w-5 h-5" />
                </div>
                <input 
                  type="number" 
                  value={data.age}
                  onChange={e => setData({...data, age: e.target.value})}
                  className="w-full bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 rounded-xl pr-10 pl-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
                  placeholder="مثال: ۲۵"
                />
              </div>
            </div>
            
            <div className="space-y-2 flex-1">
              <label className="text-sm text-slate-600 dark:text-slate-300 font-medium">جنسیت</label>
              <div className="flex bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 rounded-xl overflow-hidden p-1">
                <button
                  type="button"
                  onClick={() => setData({...data, gender: 'female'})}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${data.gender === 'female' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                >
                  زن
                </button>
                <button
                  type="button"
                  onClick={() => setData({...data, gender: 'male'})}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${data.gender === 'male' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                >
                  مرد
                </button>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm text-slate-600 dark:text-slate-300 font-medium">تحصیلات</label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                <GraduationCap className="w-5 h-5" />
              </div>
              
              <select 
                value={data.education}
                onChange={e => setData({...data, education: e.target.value})}
                className="w-full bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 rounded-xl pr-10 pl-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all text-slate-900 dark:text-white appearance-none"
              >
                <option value="" disabled className="text-slate-400">سطح تحصیلات خود را انتخاب کنید</option>
                <option value="زیر دیپلم" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">زیر دیپلم</option>
                <option value="دیپلم" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">دیپلم</option>
                <option value="کاردانی" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">کاردانی</option>
                <option value="کارشناسی" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">کارشناسی</option>
                <option value="کارشناسی ارشد" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">کارشناسی ارشد</option>
                <option value="دکتری" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">دکتری و بالاتر</option>
              </select>
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-8 mt-8 border-t border-slate-200 dark:border-slate-700/50">
            <button 
              type="button"
              onClick={onBack}
              className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-semibold text-sm px-4 py-2 transition-colors flex items-center gap-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              بازگشت
            </button>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="bg-gradient-to-l from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2 text-sm"
            >
              ایجاد پروفایل و ادامه
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};
