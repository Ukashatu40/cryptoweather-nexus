import { configureStore, createSlice } from '@reduxjs/toolkit';
import weatherReducer from '@/slices/weatherSlice';
import cryptoReducer from '@/slices/cryptoSlice';
import newsReducer from '@/slices/newsSlice';

// Define the Favorites State
interface FavoritesState {
  cities: string[];
  cryptos: string[]; // Add field for favorite cryptocurrencies
}

const initialFavoritesState: FavoritesState = {
  cities: [],
  cryptos: [], // Initialize as empty array
};

// Create the Favorites Slice
const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: initialFavoritesState,
  reducers: {
    toggleFavoriteCity: (state, action: { payload: string }) => {
      const city = action.payload.toLowerCase();
      if (state.cities.includes(city)) {
        state.cities = state.cities.filter((c) => c !== city);
      } else {
        state.cities.push(city);
      }
    },
    toggleFavoriteCrypto: (state, action: { payload: string }) => {
      const crypto = action.payload.toLowerCase();
      if (state.cryptos.includes(crypto)) {
        state.cryptos = state.cryptos.filter((c) => c !== crypto);
      } else {
        state.cryptos.push(crypto);
      }
    },
  },
});

// Export the action creators
export const { toggleFavoriteCity, toggleFavoriteCrypto } = favoritesSlice.actions;

// Configure the Store
export const store = configureStore({
  reducer: {
    weather: weatherReducer,
    crypto: cryptoReducer,
    news: newsReducer,
    favorites: favoritesSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;