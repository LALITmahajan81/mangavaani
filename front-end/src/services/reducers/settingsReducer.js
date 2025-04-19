// Initial state
const initialState = {
    theme: "dark", // Always dark mode
    readingMode: "rightToLeft", // rightToLeft, leftToRight, vertical
    fontSize: "medium",
    notifications: true,
    dataUsage: "normal", // low, normal, high
    autoUpdateChapters: true,
};

// Action types
export const SETTINGS_TYPES = {
    SET_READING_MODE: "SET_READING_MODE",
    SET_FONT_SIZE: "SET_FONT_SIZE",
    TOGGLE_NOTIFICATIONS: "TOGGLE_NOTIFICATIONS",
    SET_DATA_USAGE: "SET_DATA_USAGE",
    TOGGLE_AUTO_UPDATE: "TOGGLE_AUTO_UPDATE",
};

// Reducer
const settingsReducer = (state = initialState, action) => {
    switch (action.type) {
        case SETTINGS_TYPES.SET_READING_MODE:
            return {
                ...state,
                readingMode: action.payload,
            };
        case SETTINGS_TYPES.SET_FONT_SIZE:
            return {
                ...state,
                fontSize: action.payload,
            };
        case SETTINGS_TYPES.TOGGLE_NOTIFICATIONS:
            return {
                ...state,
                notifications: !state.notifications,
            };
        case SETTINGS_TYPES.SET_DATA_USAGE:
            return {
                ...state,
                dataUsage: action.payload,
            };
        case SETTINGS_TYPES.TOGGLE_AUTO_UPDATE:
            return {
                ...state,
                autoUpdateChapters: !state.autoUpdateChapters,
            };
        default:
            return {
                ...state,
                theme: "dark", // Always enforce dark theme regardless of action
            };
    }
};

export default settingsReducer;
