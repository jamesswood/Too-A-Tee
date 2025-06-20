import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentDesign: null,
  designHistory: [],
  processing: false,
  error: null,
  settings: {
    backgroundRemoval: false,
    imageQuality: 'high',
    designPosition: { x: 0.5, y: 0.5 },
    designScale: 1.0,
    designRotation: 0,
  },
  templates: [],
  userDesigns: [],
};

const designSlice = createSlice({
  name: 'design',
  initialState,
  reducers: {
    setCurrentDesign: (state, action) => {
      state.currentDesign = action.payload;
      state.error = null;
    },
    
    updateDesignSettings: (state, action) => {
      state.settings = { ...state.settings, ...action.payload };
    },
    
    setProcessing: (state, action) => {
      state.processing = action.payload;
    },
    
    setError: (state, action) => {
      state.error = action.payload;
      state.processing = false;
    },
    
    addToHistory: (state, action) => {
      if (state.currentDesign) {
        state.designHistory.unshift({
          id: Date.now().toString(),
          design: state.currentDesign,
          timestamp: new Date().toISOString(),
        });
        // Keep only last 10 designs in history
        if (state.designHistory.length > 10) {
          state.designHistory = state.designHistory.slice(0, 10);
        }
      }
    },
    
    clearHistory: (state) => {
      state.designHistory = [];
    },
    
    saveUserDesign: (state, action) => {
      const design = action.payload;
      const existingIndex = state.userDesigns.findIndex(d => d.id === design.id);
      
      if (existingIndex >= 0) {
        state.userDesigns[existingIndex] = design;
      } else {
        state.userDesigns.unshift({
          ...design,
          id: design.id || Date.now().toString(),
          savedAt: new Date().toISOString(),
        });
      }
    },
    
    removeUserDesign: (state, action) => {
      const designId = action.payload;
      state.userDesigns = state.userDesigns.filter(d => d.id !== designId);
    },
    
    setTemplates: (state, action) => {
      state.templates = action.payload;
    },
    
    resetDesign: (state) => {
      state.currentDesign = null;
      state.settings = {
        backgroundRemoval: false,
        imageQuality: 'high',
        designPosition: { x: 0.5, y: 0.5 },
        designScale: 1.0,
        designRotation: 0,
      };
      state.error = null;
    },
  },
});

export const {
  setCurrentDesign,
  updateDesignSettings,
  setProcessing,
  setError,
  addToHistory,
  clearHistory,
  saveUserDesign,
  removeUserDesign,
  setTemplates,
  resetDesign,
} = designSlice.actions;

export default designSlice.reducer; 