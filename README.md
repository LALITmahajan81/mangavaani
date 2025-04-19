# MangaVaani - Manga Reading App

MangaVaani is a mobile application that lets users read manga from various sources.

## Project Structure

-   `backend/`: Node.js Express server
-   `front-end/`: React Native mobile application

## Installation and Setup

### Backend

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Start the server:

```bash
npm run dev
```

The backend should now be running on port 5000.

### Front-end

1. Navigate to the front-end directory:

```bash
cd front-end
```

2. Install dependencies:

```bash
npm install
```

3. Start the app:

```bash
npm start
```

4. Use Expo to run the app on your device or simulator.

## API Integration

This app uses the Manga Hook API for fetching manga data. The backend serves as a proxy to the Manga Hook API, and the front-end communicates with the backend.

## Features

-   Browse popular manga
-   View manga details and chapters
-   Read manga chapters
-   Search manga by title

## Troubleshooting

If you encounter any issues:

1. Make sure both backend and frontend are running
2. Check that the API URLs are correctly configured
3. Check for any network issues

## License

This project is licensed under the MIT License.
