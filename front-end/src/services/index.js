import { createStore, applyMiddleware, combineReducers } from "redux";
import thunk from "redux-thunk";

// Import reducers
import mangaReducer from "./reducers/mangaReducer";
import authReducer from "./reducers/authReducer";
import settingsReducer from "./reducers/settingsReducer";

// Combine reducers
const rootReducer = combineReducers({
    manga: mangaReducer,
    auth: authReducer,
    settings: settingsReducer,
});

// Create store
const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
