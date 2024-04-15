// store.js
import { configureStore } from '@reduxjs/toolkit';
import postReducer from './newQuestion/newQuestionReducer';

const store =  configureStore({
  reducer: {
    postReducer,
  },
});

export default store;
