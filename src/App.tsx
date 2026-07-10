import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { Moon, Sun } from 'lucide-react';
import { Welcome } from './components/Welcome';
import { InfoForm } from './components/InfoForm';
import { Quiz } from './components/Quiz';
import { Results } from './components/Results';
import { UserData, ResultsData } from './types';
import { calculateResults, detectCarelessResponses } from './utils';
import { HRDashboard } from './components/HRDashboard';
import { UserProfile } from './components/UserProfile';

type Step = 'welcome' | 'info' | 'profile' | 'quiz' | 'results' | 'hr';

export default function App() {
  const [step, setStep] = useState<Step>('welcome');
  const [user, setUser] = useState<UserData | null>(null);
  const [results, setResults] = useState<ResultsData | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [isDark, setIsDark] = useState(false);
  const [initialAnswers, setInitialAnswers] = useState<(string | null)[] | undefined>();
  const [initialPage, setInitialPage] = useState<number | undefined>();
  const [selectedHRUser, setSelectedHRUser] = useState<any>(null);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);
  useEffect(() => {
    const savedUser = localStorage.getItem('neo_current_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setStep('profile');
    }
  }, []);

  const handleUpdateAvatar = (avatarBase64: string) => {
    if (user) {
      const updatedUser = { ...user, avatar: avatarBase64 };
      setUser(updatedUser);
      localStorage.setItem('neo_current_user', JSON.stringify(updatedUser));
      
      // Update in completed tests if any
      const completedStr = localStorage.getItem('neo_completed_tests');
      if (completedStr) {
        let completed = JSON.parse(completedStr);
        completed = completed.map((test: any) => {
          if (test.user.name === user.name) {
            return { ...test, user: updatedUser };
          }
          return test;
        });
        localStorage.setItem('neo_completed_tests', JSON.stringify(completed));
      }
    }
  };

  const handleStart = (userData: UserData) => {
    setUser(userData);
    localStorage.setItem('neo_current_user', JSON.stringify(userData));
    setStep('profile');
  };

  const handleComplete = (answers: (string | null)[]) => {
    if (user) {
      const res = calculateResults(answers, user);
      const warns = detectCarelessResponses(answers);
      setResults(res);
      setWarnings(warns);
      
      const completed = JSON.parse(localStorage.getItem('neo_completed_tests') || '[]');
      completed.push({
        id: Date.now().toString(),
        date: new Date().toISOString(),
        user,
        answers,
        results: res,
        warnings: warns
      });
      localStorage.setItem('neo_completed_tests', JSON.stringify(completed));
      
      localStorage.removeItem('neo_draft_session');
      
      setStep('results');
    }
  };

  const handleReset = () => {
      setInitialAnswers(undefined);
      setInitialPage(undefined);
      setStep('profile');
  };
  
  const viewHRResults = (data: any) => {
    setUser(data.user);
    setResults(data.results);
    setWarnings(data.warnings);
    setStep('results');
    setSelectedHRUser(data.id);
  };

  return (
    <div className="font-sans" dir="rtl">
      
      {/* Top Header */}
      {(step === 'quiz' || step === 'results') && user && (
        <div className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-3 flex items-center justify-between no-print transition-colors duration-300">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-700 dark:text-indigo-400 font-bold text-lg shadow-sm overflow-hidden">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user.name.charAt(0)
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-900 dark:text-white">{user.name}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {user.age} ساله • {user.education} • {user.gender === 'female' ? 'زن' : 'مرد'}
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            title="تغییر تم"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      )}
      
      {/* Fallback Theme Toggle for Welcome/Info screens */}
      {(step === 'welcome' || step === 'info' || step === 'hr') && (
        <button
          onClick={() => setIsDark(!isDark)}
          className="no-print fixed top-4 left-4 z-50 p-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-full shadow-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          title="تغییر تم"
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      )}


      <AnimatePresence mode="wait">
        {step === 'welcome' && (
          <Welcome key="welcome" onNext={() => setStep('info')} onHR={() => setStep('hr')} />
        )}
        
        {step === 'info' && (
          <InfoForm 
            key="info" 
            onBack={() => setStep('welcome')} 
            onStart={handleStart} 
          />
        )}
        
        {step === 'profile' && user && (
          <UserProfile 
            key="profile"
            user={user}
            onUpdateAvatar={handleUpdateAvatar}
            onStartTest={() => {
              setInitialAnswers(undefined);
              setInitialPage(undefined);
              setStep('quiz');
            }}
            onContinueTest={(answers, page) => {
              setInitialAnswers(answers);
              setInitialPage(page);
              setStep('quiz');
            }}
            onViewResults={(res, warns) => {
              setResults(res);
              setWarnings(warns);
              setStep('results');
            }}
            onLogout={() => {
              localStorage.removeItem('neo_current_user');
              setUser(null);
              setStep('welcome');
            }}
          />
        )}

        {step === 'quiz' && (
          <Quiz 
            key="quiz" 
            onBack={() => setStep('info')}
            onComplete={handleComplete}
            initialAnswers={initialAnswers}
            initialPage={initialPage}
            user={user}
          />
        )}
        
        {step === 'results' && user && results && (
          <Results 
            key="results" 
            user={user} 
            results={results} 
            warnings={warnings}
            onReset={() => {
              if (selectedHRUser) {
                setSelectedHRUser(null);
                setUser(null);
                setResults(null);
                setWarnings([]);
                setStep('hr');
              } else {
                handleReset();
              }
            }}
            isHRView={!!selectedHRUser}
            isDark={isDark}
          />
        )}
        {step === 'hr' && (
          <HRDashboard 
            onBack={() => setStep('welcome')}
            onViewUser={viewHRResults}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
