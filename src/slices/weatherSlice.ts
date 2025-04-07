import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchWeather } from '../lib/api';
import { RootState } from '@/store';
import { WeatherData } from '@/types';

interface WeatherState {
  data: WeatherData[];
  loading: boolean;
  error: string | null;
}

const initialState: WeatherState = {
  data: [],
  loading: false,
  error: null,
};

export const getWeather = createAsyncThunk('weather/getWeather', async (city: string, { getState }) => {
  const state = getState() as RootState;
  const existingData: WeatherData | undefined = state.weather.data.find((item: WeatherData) => item.name.toLowerCase() === city.toLowerCase());
  if (existingData) {
    return { city, data: existingData };
  }
  const response = await fetchWeather(city);
  return { city, data: response };
});

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getWeather.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getWeather.fulfilled, (state, action) => {
        state.loading = false;
        const { city, data } = action.payload;
        const existingIndex = state.data.findIndex((item) => item.name.toLowerCase() === city.toLowerCase());
        if (existingIndex !== -1) {
          state.data[existingIndex] = data;
        } else {
          state.data.push(data);
        }
      })
      .addCase(getWeather.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch weather data';
      });
  },
});

export default weatherSlice.reducer;