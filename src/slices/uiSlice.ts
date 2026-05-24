import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type UiState = {
  newModal: boolean;
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
};
const init: UiState = { newModal: false, saveStatus: 'idle' };
const uiSlice = createSlice({
  name: 'ui',
  initialState: init,
  reducers: {
    openModal(state) {
      state.newModal = true;
    },
    closeModal(state) {
      state.newModal = false;
    },
    setSaveStatus(state, action: PayloadAction<UiState['saveStatus']>) {
      state.saveStatus = action.payload;
    },
  },
});

export const { openModal, closeModal, setSaveStatus } = uiSlice.actions;
export default uiSlice.reducer;
