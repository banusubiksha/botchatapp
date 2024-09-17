import { createStore } from 'redux';
import rootReducer from './reducers'; // Ensure the correct path

// Create the Redux store
const store = createStore(rootReducer);

// Export RootState type
export type RootState = ReturnType<typeof store.getState>;

// Export the store
export default store;
