import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [
    {
      id: 1,
      itemName: '',
      weight: '',
      quantity: '',
      originalPrice: '',
      offeredPrice: '',
    },
  ],
  nextItemId: 2, // To increment item numbers
};

const itemSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {
    addItem: (state) => {
      state.items.push({
        id: state.nextItemId,
        itemName: '',
        weight: '',
        quantity: '',
        originalPrice: '',
        offeredPrice: '',
      });
      state.nextItemId += 1;
    },
    removeItem: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    updateItem: (state, action) => {
      const { id, field, value } = action.payload;
      const item = state.items.find((item) => item.id === id);
      if (item) {
        item[field] = value;
      }
    },
    resetItems: (state) => {
      state.items = [
        {
          id: 1,
          itemName: '',
          weight: '',
          quantity: '',
          originalPrice: '',
          offeredPrice: '',
        },
      ];
      state.nextItemId = 2;
    },
  },
});

export const { addItem, removeItem, updateItem, resetItems } = itemSlice.actions;
export default itemSlice.reducer;