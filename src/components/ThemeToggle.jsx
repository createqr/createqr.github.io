import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle({ label = 'Toggle theme' }) {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      try {
        localStorage.setItem('theme', 'dark');
      } catch (e) {}
    } else {
      document.documentElement.classList.remove('dark');
      try {
        localStorage.setItem('theme', 'light');
      } catch (e) {}
    }
  };

  if (!mounted) {
    return (
      <button
        type="button"
        aria-label={label}
        className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        <span className="w-5 h-5 block" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className="p-2 rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800/80 transition-all border border-slate-200/60 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-amber-400 animate-fade-in" />
      ) : (
        <Moon className="w-5 h-5 text-slate-700 animate-fade-in" />
      )}
    </button>
  );
}
