import { configureStore } from '@reduxjs/toolkit';
// Example reducer (you'll create more based on your app's needs)
const initialState = {
  user: null,
  isAuthenticated: false,
  search_url: null
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false
      };
    case 'SEARCH_URL':
      return {
        ...state,
        search_url: action.payload
      };
    default:
      return state;
  }
};

export const store = configureStore({
  reducer: {
    auth: authReducer
    // Add more reducers here as your app grows
  }
});