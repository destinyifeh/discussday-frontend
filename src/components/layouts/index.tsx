'use client';

import {useTheme} from 'next-themes';
import {useEffect} from 'react';
import {Toaster} from '../ui/sonner';
interface AppContainerProps {
  children: React.ReactNode;
}
const AppContainer = ({children}: AppContainerProps) => {
  const {setTheme} = useTheme();

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      const newTheme = e.matches ? 'dark' : 'light';
      setTheme(newTheme);
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <div className="app-theme min-h-dvh dark:text-muted-foreground">
      {children}
      <Toaster position="top-center" />
    </div>
  );
};

export default AppContainer;
