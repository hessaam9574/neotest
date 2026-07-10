import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { User, Calendar, GraduationCap, Play, FileText, LogOut, Activity, Camera } from 'lucide-react';
import { UserData } from '../types';

type Props = {
  user: UserData;
  onStartTest: () => void;
  onContinueTest: (answers: any, page: number) => void;
  onViewResults: (results: any, warnings: any) => void;
  onLogout: () => void;
  onUpdateAvatar: (avatarBase64: string) => void;
};

export const UserProfile: React.FC<Props> = ({ user, onStartTest, onContinueTest, onViewResults, onLogout, onUpdateAvatar }) => {
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        onUpdateAvatar(base64String);
      };
      reader.readAsDataURL(file);
    }
  };
  const [draft, setDraft] = useState<any>(null);
  const [completed, setCompleted] = useState<any>(null);

  useEffect(() => {
    // Check for draft
    const draftData = localStorage.getItem('neo_draft_session');
    if (draftData) {
      try {
        const parsed = JSON.parse(draftData);
        if (parsed.user?.name === user.name) {
          setDraft(parsed);
        }
      } catch(e) {}
    }

    // Check for completed tests
    const completedData = localStorage.getItem('neo_completed_tests');
    if (completedData) {
      try {
        const parsed = JSON.parse(completedData);
        const myTest = parsed.reverse().find((t: any) => t.user?.name === user.name);
        if (myTest) {
          setCompleted(myTest);
        }
      } catch(e) {}
    }
  }, [user]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-12 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300 flex justify-center items-start"
    >
      <div className="max-w-3xl w-full mt-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">پروفایل کاربری</h1>
          <button 
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-sm"
          >
            <LogOut className="w-4 h-4" />
            خروج و بازگشت به صفحه اصلی
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* User Info Card */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm md:col-span-1">
            <div className="flex flex-col items-center text-center">
              <div className="relative group mb-4">
                <div className="w-24 h-24 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-400 font-bold text-3xl rounded-full flex items-center justify-center overflow-hidden border-4 border-white dark:border-slate-800 shadow-sm relative">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    user.name.charAt(0)
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-white dark:bg-slate-700 p-1.5 rounded-full border border-slate-200 dark:border-slate-600 shadow-sm cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors text-slate-600 dark:text-slate-300" title="آپلود تصویر پروفایل">
                  <Camera className="w-4 h-4" />
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{user.name}</h2>
              <div className="inline-flex items-center gap-1 text-sm text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-full font-medium mb-6">
                آزمون‌دهنده
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700/50 flex items-center justify-center text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 dark:text-slate-500">جنسیت</div>
                  <div className="text-sm font-medium">{user.gender === 'female' ? 'زن' : 'مرد'}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700/50 flex items-center justify-center text-slate-500">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 dark:text-slate-500">سن</div>
                  <div className="text-sm font-medium">{user.age} ساله</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700/50 flex items-center justify-center text-slate-500">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 dark:text-slate-500">تحصیلات</div>
                  <div className="text-sm font-medium">{user.education}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Tests and Actions */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <Activity className="w-5 h-5 text-indigo-500" />
                وضعیت آزمون نئو (NEO-PI-R)
              </h3>
              
              {completed ? (
                <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800/30 rounded-xl p-6 text-center">
                  <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8" />
                  </div>
                  <h4 className="font-bold text-emerald-800 dark:text-emerald-400 mb-2">آزمون شما با موفقیت تکمیل شده است</h4>
                  <p className="text-sm text-emerald-600 dark:text-emerald-500 mb-6">
                    پاسخ‌های شما ثبت و تحلیل کامل شخصیتی شما آماده شده است.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                      onClick={() => onViewResults(completed.results, completed.warnings)}
                      className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
                    >
                      مشاهده نتایج آزمون
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                    </button>
                    <button
                      onClick={() => {
                        onStartTest();
                      }}
                      className="w-full sm:w-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-bold py-3 px-8 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
                    >
                      آزمون مجدد
                      <Play className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : draft ? (
                <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 rounded-xl p-6 text-center">
                  <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Activity className="w-8 h-8" />
                  </div>
                  <h4 className="font-bold text-amber-800 dark:text-amber-400 mb-2">آزمون ناتمام</h4>
                  <p className="text-sm text-amber-600 dark:text-amber-500 mb-6">
                    شما یک آزمون ناتمام دارید. پیشرفت شما ذخیره شده است.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                      onClick={() => onContinueTest(draft.answers, draft.curPage)}
                      className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
                    >
                      ادامه آزمون
                      <Play className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        localStorage.removeItem('neo_draft_session'); setDraft(null);
                      }}
                      className="w-full sm:w-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-bold py-3 px-8 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
                    >
                      شروع مجدد
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl p-6 text-center">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Play className="w-8 h-8 ml-1" />
                  </div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-2">پروفایل شما آماده است</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                    برای شروع ارزیابی شخصیت خود، در آزمون شرکت کنید. این آزمون شامل ۲۴۰ سوال است و حدود ۳۰ تا ۴۵ دقیقه زمان می‌برد.
                  </p>
                  <button
                    onClick={onStartTest}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2 mx-auto"
                  >
                    شروع آزمون
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  </button>
                </div>
              )}
            </div>
            
            <div className="bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800/30 rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-indigo-900 dark:text-indigo-300 mb-2">درباره آزمون نئو</h3>
              <p className="text-sm text-indigo-700 dark:text-indigo-400 leading-relaxed text-justify">
                این پرسشنامه (NEO-PI-R) یکی از معتبرترین ابزارهای سنجش شخصیت است که ۵ عامل اصلی (روان‌نژندی، برون‌گرایی، انعطاف‌پذیری، دلپذیر بودن و با وجدان بودن) را به همراه ۳۰ ویژگی فرعی اندازه‌گیری می‌کند.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
