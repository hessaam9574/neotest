import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Q } from '../data/questions';
import { ANS, PER, SCC } from '../data/constants';

type Props = {
  onComplete: (answers: (string | null)[]) => void;
  onBack: () => void;
  initialAnswers?: (string | null)[];
  initialPage?: number;
  user?: any; // To avoid importing UserData just for this, or we can use any
};

export const Quiz: React.FC<Props> = ({ onComplete, onBack, initialAnswers, initialPage, user }) => {
  const [answers, setAnswers] = useState<(string | null)[]>(initialAnswers || new Array(Q.length).fill(null));
  const [curPage, setCurPage] = useState(initialPage || 0);
  const [confirmDialog, setConfirmDialog] = useState<{isOpen: boolean, message: string, onConfirm: () => void}>({isOpen: false, message: '', onConfirm: () => {}});
  
  React.useEffect(() => {
    if (user) {
      localStorage.setItem('neo_draft_session', JSON.stringify({ user, answers, curPage }));
    }
  }, [answers, curPage, user]);

  const totalPages = Math.ceil(Q.length / PER);
  const startIdx = curPage * PER;
  const endIdx = Math.min(startIdx + PER, Q.length);
  const currentQuestions = Q.slice(startIdx, endIdx);
  const answeredCount = answers.filter(a => a !== null).length;
  const isLastPage = curPage >= totalPages - 1;

  const handleSelect = (idx: number, ans: string) => {
    const newAnswers = [...answers];
    newAnswers[idx] = ans;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    const unansweredInPage = currentQuestions.filter((_, i) => answers[startIdx + i] === null).length;
    if (unansweredInPage > 0 && !isLastPage) {
      setConfirmDialog({
        isOpen: true,
        message: `در این صفحه ${unansweredInPage} سوال بی‌پاسخ است. آیا می‌خواهید به صفحه بعد بروید؟`,
        onConfirm: () => {
          setConfirmDialog({ isOpen: false, message: '', onConfirm: () => {} });
          setCurPage(curPage + 1);
          window.scrollTo(0, 0);
        }
      });
      return;
    }
    
    if (!isLastPage) {
      setCurPage(curPage + 1);
      window.scrollTo(0, 0);
    } else {
      const totalUnanswered = answers.filter(a => a === null).length;
      if (totalUnanswered > 0) {
        setConfirmDialog({
          isOpen: true,
          message: `مجموعاً ${totalUnanswered} سوال بی‌پاسخ مانده است. آیا می‌خواهید آزمون را پایان دهید و نتایج را ببینید؟`,
          onConfirm: () => {
            setConfirmDialog({ isOpen: false, message: '', onConfirm: () => {} });
            onComplete(answers);
          }
        });
        return;
      }
      onComplete(answers);
    }
  };

  const handlePrev = () => {
    if (curPage > 0) {
      setCurPage(curPage - 1);
      window.scrollTo(0, 0);
    } else {
      onBack();
    }
  };

  const remainingCount = Q.length - answeredCount;
  const estimatedSeconds = remainingCount * 10;
  const estimatedMins = Math.floor(estimatedSeconds / 60);
  const estimatedSecs = estimatedSeconds % 60;
  const estimatedTimeStr = `${estimatedMins}:${estimatedSecs.toString().padStart(2, '0')}`;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 pb-24 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Sticky Header */}
      <div className="sticky top-[65px] z-40 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 px-8 py-4 shadow-sm flex items-center justify-between shrink-0 transition-colors duration-300">
        <div className="flex items-center gap-6 flex-1">
          <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest shrink-0">
            سوالات {startIdx + 1} تا {endIdx}
          </div>
          <div className="flex-1 max-w-xl">
            <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300 ease-out"
                style={{ width: `${(answeredCount / Q.length) * 100}%` }}
              />
            </div>
          </div>
          <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
            {Math.round((answeredCount / Q.length) * 100)}٪
          </div>
        </div>
        
        <div className="flex items-center gap-6 mr-8">
          <button 
            onClick={() => {
              const totalUnanswered = answers.filter(a => a === null).length;
              if (totalUnanswered > 0) {
                setConfirmDialog({
                  isOpen: true,
                  message: `مجموعاً ${totalUnanswered} سوال بی‌پاسخ مانده است. آیا مطمئنید که می‌خواهید آزمون را پایان دهید و نتایج را ببینید؟`,
                  onConfirm: () => {
                    setConfirmDialog({ isOpen: false, message: '', onConfirm: () => {} });
                    onComplete(answers);
                  }
                });
                return;
              }
              onComplete(answers);
            }}
            className="hidden md:flex px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-lg text-xs font-bold hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors"
          >
            پایان و مشاهده نتایج
          </button>
          <div className="flex flex-col items-end hidden sm:flex">

            <span className="text-[10px] uppercase font-semibold text-slate-400 dark:text-slate-500 tracking-wider flex items-center gap-2">
              وضعیت پاسخ‌دهی
              <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-[9px]">
                ⏳ تخمین زمان: {estimatedTimeStr}
              </span>
            </span>
            <span className="text-sm font-medium mt-1">
              <span className="text-blue-700 dark:text-blue-400">{answeredCount} پاسخ داده</span> 
              <span className="text-slate-300 dark:text-slate-600 mx-1">|</span> 
              <span className="text-slate-500 dark:text-slate-400">{remainingCount} باقیمانده</span>
            </span>
          </div>
        </div>
      </div>

      {/* Questions */}
      <main className="flex-1 flex flex-col p-8 overflow-hidden">
        <div className="max-w-2xl w-full mx-auto flex flex-col flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={curPage}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8 flex-1"
            >
              {currentQuestions.map((q, localIdx) => {
                const globalIdx = startIdx + localIdx;
                const selectedAns = answers[globalIdx];
                const color = SCC[q.scale] || "#533483";

                return (
                  <div key={q.id} className="flex flex-col">
                    <div className="mb-4">
                      <span className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-widest">سوال {q.id}</span>
                      <h1 className="text-xl font-bold text-slate-900 dark:text-white mt-2 leading-relaxed">{q.text}</h1>
                    </div>
                    <div className="space-y-3">
                      {ANS.map((ans, i) => {
                        const isSelected = selectedAns === ans;
                        return (
                          <div
                            key={ans}
                            onClick={() => handleSelect(globalIdx, ans)}
                            className={`
                              p-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-xl shadow-sm flex items-center gap-4 transition-all cursor-pointer
                              ${isSelected 
                                ? 'border-2 border-indigo-600 dark:border-indigo-500 ring-4 ring-blue-50 dark:ring-blue-900/30' 
                                : 'border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-300'
                              }
                            `}
                          >
                            <div className={`w-5 h-5 rounded-full shrink-0 flex items-center justify-center ${isSelected ? 'border-2 border-indigo-600 dark:border-indigo-500' : 'border border-slate-300 dark:border-slate-600'}`}>
                                {isSelected && <div className="w-2.5 h-2.5 bg-indigo-600 dark:bg-indigo-500 rounded-full" />}
                            </div>
                            <div className={`flex-1 text-sm ${isSelected ? 'font-semibold text-slate-900 dark:text-white' : 'font-medium'}`}>{ans}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Fixed Footer Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 p-6 z-10 shrink-0 transition-colors duration-300">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button 
            onClick={handlePrev}
            className="px-6 py-2 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center gap-2 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            قبلی
          </button>
          
          <div className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            صفحه {curPage + 1} از {totalPages}
          </div>

          
          <button 
            onClick={() => {
              if (isLastPage) {
                handleNext();
              } else {
                const totalUnanswered = answers.filter(a => a === null).length;
                if (totalUnanswered > 0) {
                  setConfirmDialog({
                    isOpen: true,
                    message: `مجموعاً ${totalUnanswered} سوال بی‌پاسخ مانده است. آیا می‌خواهید نتایج را ببینید؟`,
                    onConfirm: () => {
                      setConfirmDialog({ isOpen: false, message: '', onConfirm: () => {} });
                      onComplete(answers);
                    }
                  });
                  return;
                }
                onComplete(answers);
              }
            }}
            className="px-4 py-2 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 ml-4 transition-colors"
          >
            {isLastPage ? '' : 'پایان آزمون'}
          </button>
          <button 
            onClick={handleNext}

            className="px-8 py-3 bg-gradient-to-l from-blue-600 to-indigo-600 text-white rounded-lg text-sm font-bold shadow-lg shadow-blue-500/30 dark:shadow-none hover:from-blue-700 hover:to-indigo-700 transition-colors flex items-center gap-2"
          >
            {isLastPage ? 'مشاهده نتایج ✓' : 'بعدی'}
            {!isLastPage && <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>}
          </button>
                </div>
      </div>
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">توجه</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
              {confirmDialog.message}
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmDialog({ isOpen: false, message: '', onConfirm: () => {} })}
                className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                انصراف
              </button>
              <button
                onClick={confirmDialog.onConfirm}
                className="px-4 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-md shadow-indigo-500/30"
              >
                بله، ادامه بده
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
