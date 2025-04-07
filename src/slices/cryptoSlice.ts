import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchCrypto } from '@/lib/api';
import { CryptoData } from '@/types';

// Export the PriceHistoryEntry interface
export interface PriceHistoryEntry {
  timestamp: string;
  price: number;
}

interface CryptoState {
  data: CryptoData[];
  priceHistory: { [coinId: string]: PriceHistoryEntry[] };
  loading: boolean;
  error: string | null;
}

const initialState: CryptoState = {
  data: [],
  priceHistory: {},
  loading: false,
  error: null,
};

export const getCrypto = createAsyncThunk('crypto/getCrypto', async () => {
  const response = await fetchCrypto();
  return response;
});

const cryptoSlice = createSlice({
  name: 'crypto',
  initialState,
  reducers: {
    updateCryptoPrice: (state, action) => {
      const { coinId, price } = action.payload;
      const coin = state.data.find((c) => c.id === coinId);
      if (coin) {
        coin.current_price = price;
        coin.last_updated = new Date().toISOString();

        // Add to price history
        if (!state.priceHistory[coinId]) {
          state.priceHistory[coinId] = [];
        }
        state.priceHistory[coinId].push({
          timestamp: new Date().toISOString(),
          price,
        });

        // Limit history to last 5 entries
        if (state.priceHistory[coinId].length > 5) {
          state.priceHistory[coinId] = state.priceHistory[coinId].slice(-5);
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCrypto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCrypto.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getCrypto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch crypto data';
      });
  },
});

export const { updateCryptoPrice } = cryptoSlice.actions;
export default cryptoSlice.reducer;