"use client";

import { Provider } from 'react-redux';
import { store } from '@/store'; // Import from src/store.ts
import { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}