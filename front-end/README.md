# MangaVaani

A cleaner & simpler way to read manga and webtoons.

## Features

-   **Content Aggregation & Clean Viewing Interface**: An intelligent scraping system that removes ads and clutter while optimizing content for smooth, bandwidth-efficient reading with auto-sorting capabilities.
-   **Customizable Reading Modes**: Flexible viewing options (Right-to-Left, Left-to-Right, and Vertical Scroll) with orientation controls to accommodate different manga and webtoon formats for an optimal reading experience.
-   **Bookmarks, Downloads, and Library**: Comprehensive organization tools that allow users to save progress, create reading lists, and access content offline with auto-resume functionality.
-   **Minimal UI and Distraction-Free Experience**: A clutter-free design focusing solely on content with intuitive navigation controls that maximize reading immersion.

## Setup & Installation

### Prerequisites

-   Node.js (v14 or higher)
-   npm or Yarn
-   Expo CLI: `npm install -g expo-cli`

### Installation

1. Clone the repository:

    ```
    git clone https://github.com/yourusername/MangaVaani.git
    cd MangaVaani
    ```

2. Install dependencies:

    ```
    npm install
    ```

    or

    ```
    yarn install
    ```

3. Setup environment variables:

    - Create a `.env` file in the root directory with the required variables (see `.env.example`)

4. Start the development server:

    ```
    npm start
    ```

    or

    ```
    yarn start
    ```

5. Run on device or emulator:
    - Scan the QR code with the Expo Go app on your mobile device
    - Press 'a' in the terminal to run on Android emulator
    - Press 'i' in the terminal to run on iOS simulator

## Project Structure

```
frontend/
│   ├── src/
│   │   ├── assets/
│   │   │   ├── images/
│   │   │   ├── fonts/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   ├── specific-feature/
│   │   ├── navigation/
│   │   │   ├── AppNavigator.js
│   │   │   ├── AuthNavigator.js
│   │   │   └── ...
│   │   ├── pages/
│   │   │   ├── Auth/
│   │   │   ├── Home/
│   │   │   └── ...
│   │   ├── services/
│   │   │   ├── api.js       // Handles API calls
│   │   │   ├── index.js     // Root reducer/store configuration
│   │   │   ├── reducers/
│   │   │   ├── actions/
│   │   │   ├── selectors/
│   ├── App.js               // Entry point for the frontend
│   ├── package.json
│   ├── babel.config.js
│   ├── .env                 // Environment variables for frontend
```

## Tech Stack

-   React Native
-   Expo
-   Redux for state management
-   React Navigation for routing
-   Axios for API requests
-   NativeWind for styling
-   Expo FileSystem for file handling

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

-   [React Native](https://reactnative.dev/)
-   [Expo](https://expo.dev/)
-   [Redux](https://redux.js.org/)
-   [React Navigation](https://reactnavigation.org/)
-   [NativeWind](https://nativewind.dev/)
