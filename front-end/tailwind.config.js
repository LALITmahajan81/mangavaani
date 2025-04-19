/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                primary: "#6C63FF",
                secondary: "#F50057",
                dark: "#1E1E1E",
                light: "#FFFFFF",
                gray: {
                    100: "#F5F5F5",
                    200: "#EEEEEE",
                    300: "#E0E0E0",
                    400: "#BDBDBD",
                    500: "#9E9E9E",
                    600: "#757575",
                    700: "#616161",
                    800: "#424242",
                    900: "#212121",
                },
            },
        },
    },
    plugins: [],
};
