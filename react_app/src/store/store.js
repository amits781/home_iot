// store.js
import { createStore } from 'redux';
import rootReducer from './reducers'; // You'll create this later

const store = createStore(rootReducer);

export default store;
