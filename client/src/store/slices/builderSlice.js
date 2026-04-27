import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchInventory = createAsyncThunk('builder/fetchInventory', async (_, thunkAPI) => {
  try {
    const response = await axios.get('http://localhost:5000/api/inventory');
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

const initialState = {
  inventory: [],
  selectedBase: null,
  selectedSauce: null,
  selectedCheese: null,
  selectedVeggies: [],
  selectedMeat: null,
  totalPrice: 0,
  isLoading: false,
};

const builderSlice = createSlice({
  name: 'builder',
  initialState,
  reducers: {
    setBase: (state, action) => {
      state.selectedBase = action.payload;
      state.totalPrice = calculatePrice(state);
    },
    setSauce: (state, action) => {
      state.selectedSauce = action.payload;
      state.totalPrice = calculatePrice(state);
    },
    setCheese: (state, action) => {
      state.selectedCheese = action.payload;
      state.totalPrice = calculatePrice(state);
    },
    toggleVeggie: (state, action) => {
      const exists = state.selectedVeggies.find(v => v.name === action.payload.name);
      if (exists) {
        state.selectedVeggies = state.selectedVeggies.filter(v => v.name !== action.payload.name);
      } else if (state.selectedVeggies.length < 10) {
        state.selectedVeggies.push(action.payload);
      }
      state.totalPrice = calculatePrice(state);
    },
    setMeat: (state, action) => {
      state.selectedMeat = action.payload;
      state.totalPrice = calculatePrice(state);
    },
    resetBuilder: (state) => {
      state.selectedBase = null;
      state.selectedSauce = null;
      state.selectedCheese = null;
      state.selectedVeggies = [];
      state.selectedMeat = null;
      state.totalPrice = 0;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInventory.pending, (state) => { state.isLoading = true })
      .addCase(fetchInventory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.inventory = action.payload;
      });
  }
});

const calculatePrice = (state) => {
  let total = 0;
  if (state.selectedBase) total += state.selectedBase.price;
  if (state.selectedSauce) total += state.selectedSauce.price;
  if (state.selectedCheese) total += state.selectedCheese.price;
  state.selectedVeggies.forEach(v => total += v.price);
  if (state.selectedMeat) total += state.selectedMeat.price;
  return total;
};

export const { setBase, setSauce, setCheese, toggleVeggie, setMeat, resetBuilder } = builderSlice.actions;
export default builderSlice.reducer;
