import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchNews } from '../lib/api';
import { RootState } from '@/store';
import { NewsData } from '@/types'; // Use NewsData instead of NewsItem

interface NewsState {
  data: NewsData[];
  loading: boolean;
  error: string | null;
}

const initialState: NewsState = {
  data: [],
  loading: false,
  error: null,
};

export const getNews = createAsyncThunk('news/getNews', async (_, { getState }) => {
  const state = getState() as RootState;
  if (state.news.data.length > 0) {
    return state.news.data;
  }
  const response = await fetchNews();
  return response;
});

const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getNews.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch news';
      });
  },
});

export default newsSlice.reducer;