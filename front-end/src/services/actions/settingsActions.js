import { SETTINGS_TYPES } from "../reducers/settingsReducer";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Set theme
export const setTheme = (theme) => async (dispatch) => {
    // Save to AsyncStorage
    await AsyncStorage.setItem("theme", theme);

    dispatch({
        type: SETTINGS_TYPES.SET_THEME,
        payload: theme,
    });
};

// Set reading mode
export const setReadingMode = (mode) => async (dispatch) => {
    // Save to AsyncStorage
    await AsyncStorage.setItem("readingMode", mode);

    dispatch({
        type: SETTINGS_TYPES.SET_READING_MODE,
        payload: mode,
    });
};

// Set font size
export const setFontSize = (size) => async (dispatch) => {
    // Save to AsyncStorage
    await AsyncStorage.setItem("fontSize", size);

    dispatch({
        type: SETTINGS_TYPES.SET_FONT_SIZE,
        payload: size,
    });
};

// Toggle notifications
export const toggleNotifications = () => async (dispatch, getState) => {
    const { notifications } = getState().settings;

    // Save to AsyncStorage
    await AsyncStorage.setItem("notifications", String(!notifications));

    dispatch({
        type: SETTINGS_TYPES.TOGGLE_NOTIFICATIONS,
    });
};

// Set data usage
export const setDataUsage = (usage) => async (dispatch) => {
    // Save to AsyncStorage
    await AsyncStorage.setItem("dataUsage", usage);

    dispatch({
        type: SETTINGS_TYPES.SET_DATA_USAGE,
        payload: usage,
    });
};

// Toggle auto update chapters
export const toggleAutoUpdate = () => async (dispatch, getState) => {
    const { autoUpdateChapters } = getState().settings;

    // Save to AsyncStorage
    await AsyncStorage.setItem("autoUpdateChapters", String(!autoUpdateChapters));

    dispatch({
        type: SETTINGS_TYPES.TOGGLE_AUTO_UPDATE,
    });
};

// Load settings from AsyncStorage
export const loadSettings = () => async (dispatch) => {
    try {
        const theme = await AsyncStorage.getItem("theme");
        const readingMode = await AsyncStorage.getItem("readingMode");
        const fontSize = await AsyncStorage.getItem("fontSize");
        const notifications = await AsyncStorage.getItem("notifications");
        const dataUsage = await AsyncStorage.getItem("dataUsage");
        const autoUpdateChapters = await AsyncStorage.getItem("autoUpdateChapters");

        if (theme) dispatch({ type: SETTINGS_TYPES.SET_THEME, payload: theme });
        if (readingMode) dispatch({ type: SETTINGS_TYPES.SET_READING_MODE, payload: readingMode });
        if (fontSize) dispatch({ type: SETTINGS_TYPES.SET_FONT_SIZE, payload: fontSize });
        if (notifications !== null) {
            if (notifications === "true") {
                dispatch({ type: SETTINGS_TYPES.TOGGLE_NOTIFICATIONS });
            }
        }
        if (dataUsage) dispatch({ type: SETTINGS_TYPES.SET_DATA_USAGE, payload: dataUsage });
        if (autoUpdateChapters !== null) {
            if (autoUpdateChapters === "true") {
                dispatch({ type: SETTINGS_TYPES.TOGGLE_AUTO_UPDATE });
            }
        }
    } catch (error) {
        console.error("Error loading settings:", error);
    }
};
