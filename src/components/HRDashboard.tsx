import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, Users, ChevronRight, FileText, Calendar, Trash2, ArrowUp, ArrowDown } from 'lucide-react';

type Props = {
  onBack: () => void;
  onViewUser: (data: any) => void;
};

export const HRDashboard: React.FC<Props> = ({ onBack, onViewUser }) => {
  const [tests, setTests] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [confirmClearAll, setConfirmClearAll] = useState(false);

  useEffect(() => {
    const loaded = JSON.parse(localStorage.getItem('neo_completed_tests') || '[]');
    // sort by newest
    loaded.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setTests(loaded);
  }, []);

  const clearAll = () => {
    if (!confirmClearAll) {
      setConfirmClearAll(true);
      setTimeout(() => setConfirmClearAll(false), 3000);
      return;
    }
    localStorage.removeItem('neo_completed_tests');
    setTests([]);
    setConfirmClearAll(false);
  };

  const deleteRecord = (id: string) => {
    const newTests = tests.filter(t => t.id !== id);
    localStorage.setItem('neo_completed_tests', JSON.stringify(newTests));
    setTests(newTests);
  };

  const moveRecord = (index: number, direction: 'up' | 'down') => {
    const newTests = [...tests];
    if (direction === 'up' && index > 0) {
      const temp = newTests[index - 1];
      newTests[index - 1] = newTests[index];
      newTests[index] = temp;
    } else if (direction === 'down' && index < newTests.length - 1) {
      const temp = newTests[index + 1];
      newTests[index + 1] = newTests[index];
      newTests[index] = temp;
    } else {
      return;
    }
    localStorage.setItem('neo_completed_tests', JSON.stringify(newTests));
    setTests(newTests);
  };

  const filteredTests = tests.filter(test => {
    const term = search.toLowerCase();
    const name = (test.user?.name || '').toLowerCase();
    const nid = (test.user?.nationalId || '').toLowerCase(); // If they added nationalId later, just in case
    return name.includes(term) || nid.includes(term);
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 p-6 md:p-12 transition-colors duration-300" dir="rtl">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="flex items-center px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <ChevronRight className="w-5 h-5" /><span className="text-sm font-semibold pr-1">بازگشت به صفحه اصلی</span>
            </button>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Users className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                پنل منابع انسانی
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                مدیریت و بررسی نتایج کاندیداها
              </p>
            </div>
          </div>
          
          <button 
            onClick={clearAll}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              confirmClearAll 
                ? 'bg-rose-600 text-white hover:bg-rose-700 shadow-md shadow-rose-500/20'
                : 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 hover:bg-rose-100 dark:hover:bg-rose-900/40'
            }`}
          >
            <Trash2 className="w-4 h-4" />
            {confirmClearAll ? 'مطمئن هستید؟ (برای حذف کلیک کنید)' : 'پاک‌سازی همه'}
          </button>
        </div>

        {/* Search & Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2 relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text"
              placeholder="جستجوی نام کاندیدا..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl py-3 pr-12 pl-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 shadow-sm"
            />
          </div>
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 flex items-center justify-between shadow-sm">
            <div>
              <div className="text-sm text-slate-500 dark:text-slate-400">تعداد کل ارزیابی‌ها</div>
              <div className="text-2xl font-bold text-indigo-700 dark:text-indigo-400">{tests.length}</div>
            </div>
            <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
              <FileText className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
        </div>

        {/* List */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden">
          {filteredTests.length === 0 ? (
            <div className="p-12 text-center text-slate-500 dark:text-slate-400">
              موردی یافت نشد.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {filteredTests.map((test, i) => {
                const dateObj = new Date(test.date);
                const dDate = dateObj.toLocaleDateString('fa-IR');
                const dTime = dateObj.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
                
                return (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={test.id} 
                    className="p-4 sm:p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-400 font-bold text-lg rounded-full flex items-center justify-center shrink-0 overflow-hidden">
                        {test.user?.avatar ? (
                          <img src={test.user.avatar} alt={test.user.name} className="w-full h-full object-cover" />
                        ) : (
                          test.user?.name?.charAt(0) || '?'
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white text-lg">
                          {test.user?.name || 'بدون نام'}
                        </h3>
                        <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400 mt-1">
                          <span>{test.user?.age} ساله</span>
                          <span>•</span>
                          <span>{test.user?.gender === 'female' ? 'زن' : 'مرد'}</span>
                          <span>•</span>
                          <span>{test.user?.education}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4 mt-4 sm:mt-0">
                      <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 font-medium sm:hidden md:flex">
                        <Calendar className="w-3.5 h-3.5" />
                        {dDate} - {dTime}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="flex flex-col gap-1 ml-2 border-l border-slate-200 dark:border-slate-700 pl-3">
                          <button 
                            onClick={() => moveRecord(i, 'up')}
                            disabled={i === 0 || search.length > 0}
                            className="p-1 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 disabled:opacity-30 transition-colors"
                            title="انتقال به بالا"
                          >
                            <ArrowUp className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => moveRecord(i, 'down')}
                            disabled={i === filteredTests.length - 1 || search.length > 0}
                            className="p-1 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 disabled:opacity-30 transition-colors"
                            title="انتقال به پایین"
                          >
                            <ArrowDown className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <button 
                           onClick={() => deleteRecord(test.id)}
                           className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors"
                           title="حذف رکورد"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                        
                        <button 
                          onClick={() => onViewUser(test)}
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm shadow-indigo-500/30 transition-colors shrink-0"
                        >
                          مشاهده گزارش
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
