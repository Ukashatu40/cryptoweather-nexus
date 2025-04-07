import { createSlice } from '@reduxjs/toolkit';

interface FavoritesState {
  cities: string[];
  coins: string[];
}

const initialState: FavoritesState = {
  cities: [],
  coins: [],
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggleFavoriteCity: (state, action) => {
      const city = action.payload.toLowerCase();
      const index = state.cities.indexOf(city);
      if (index === -1) {
        state.cities.push(city);
      } else {
        state.cities.splice(index, 1);
      }
    },
    toggleFavoriteCoin: (state, action) => {
      const coin = action.payload;
      const index = state.coins.indexOf(coin);
      if (index === -1) {
        state.coins.push(coin);
      } else {
        state.coins.splice(index, 1);
      }
    },
  },
});

export const { toggleFavoriteCity, toggleFavoriteCoin } = favoritesSlice.actions;
export default favoritesSlice.reducer;