import themeReducer, { toggleTheme, ThemeState } from '../themeSlice';

describe('themeSlice', () => {
  const initialState: ThemeState = { theme: 'dark' };

  it('should toggle theme from dark to light', () => {
    const newState = themeReducer(initialState, toggleTheme());
    expect(newState.theme).toBe('light');
  });

  it('should toggle theme from light to dark', () => {
    const initialState: ThemeState = { theme: 'light' };
    const newState = themeReducer(initialState, toggleTheme());
    expect(newState.theme).toBe('dark');
  });
});