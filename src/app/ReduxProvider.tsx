'use client';

import { Provider } from 'react-redux';
import { store } from '@/store';
import { ReactNode } from 'react';
import { ThemeProvider } from 'next-themes';

export default function ReduxProvider({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider attribute="class">
        {children}
      </ThemeProvider>
    </Provider>
  );
}