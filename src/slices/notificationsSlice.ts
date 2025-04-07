import { createSlice } from '@reduxjs/toolkit';

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: { list: [] as { type: string; message: string }[] },
  reducers: {
    add: (state, action) => {
      state.list.push(action.payload);
      if (state.list.length > 5) state.list.shift(); // Keep only 5 latest
    },
  },
});

export const { add } = notificationsSlice.actions;
export default notificationsSlice.reducer;