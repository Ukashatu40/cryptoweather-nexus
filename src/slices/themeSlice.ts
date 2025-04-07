import { createSlice } from '@reduxjs/toolkit';

export interface ThemeState {
  theme: 'dark' | 'light';
}

const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    theme: 'dark',
  } as ThemeState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
    },
  },
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;