import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '../store';

interface AppState {
  mapLoaded: boolean;
}

const initialState: AppState = {
  mapLoaded: false,
};

export const mapSlice = createSlice({
  name: 'mapSlice',
  initialState,
  reducers: {
    setMapLoaded: (state, action: PayloadAction<boolean>) => {
      state.mapLoaded = action.payload;
    },
  },
});

export const { setMapLoaded } = mapSlice.actions;

export const mapLoaded = (state: RootState) => state.mapSlice.mapLoaded;

export default mapSlice.reducer;
