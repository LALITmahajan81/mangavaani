// Create global polyfills before anything else loads
global.nanoid = {
    nanoid: function (size = 21) {
        const alphabet = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";
        let id = "";
        let i = size;
        while (i--) {
            id += alphabet[(Math.random() * alphabet.length) | 0];
        }
        return id;
    },
};

// Mock nanoid/non-secure at the module system level
require.cache[require.resolve("nanoid/non-secure")] = {
    id: require.resolve("nanoid/non-secure"),
    filename: require.resolve("nanoid/non-secure"),
    loaded: true,
    exports: {
        nanoid: global.nanoid.nanoid,
        customAlphabet: (alphabet, size = 21) => {
            return (specifiedSize) => {
                let actualSize = specifiedSize || size;
                let id = "";
                let i = actualSize;
                while (i--) {
                    id += alphabet[(Math.random() * alphabet.length) | 0];
                }
                return id;
            };
        },
    },
};

// Now import the actual app
import { registerRootComponent } from "expo";
import App from "./App";

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
