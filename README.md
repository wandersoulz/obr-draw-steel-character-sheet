# Draw Steel Character Sheet

This project is a character sheet application for the Draw Steel tabletop roleplaying game. It provides a digital interface for managing character stats, abilities, and other game-related data.

## ✨ Features

*   Digital character sheet view
*   Game Master (GM) view for managing campaigns
*   Character list and management
*   Data-driven components based on the "Forgesteel" game system data.

## 🚀 Technologies Used

*   **Framework:** [React](https://reactjs.org/)
*   **Build Tool:** [Vite](https://vitejs.dev/)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **State Management:** [Zustand](https://github.com/pmndrs/zustand)
*   **Routing:** [React Router](https://reactrouter.com/)
*   **Testing:** [Vitest](https://vitest.dev/)

## available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in the development mode.<br />
Open [http://localhost:5173](http://localhost:5173) (or another port if 5173 is in use) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `dist` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

### `npm run lint`

Lints the project files using ESLint.

### `npm run preview`

Serves the production build from the `dist` folder for previewing.

### `npm run test`

Launches the test runner in the interactive watch mode.

## 📁 Folder Structure

*   `public/`: Contains static assets like icons and the manifest file.
*   `src/`: Contains the main application source code.
    *   `assets/`: Icons and images used in the application.
    *   `components/`: Reusable React components.
    *   `conversion/`: Logic for converting game data.
    *   `forgesteel/`: Core game data, enums, logic, and models for the "Draw Steel" system.
    *   `hooks/`: Custom React hooks.
    *   `models/`: TypeScript interfaces and types for application data.
    *   `stores/`: Zustand stores for state management.
    *   `views/`: Main page components like `CharacterSheetView.tsx` and `GMView.tsx`.
*   `vite.config.ts`: Vite configuration.
*   `tailwind.config.js`: Tailwind CSS configuration.
*   `tsconfig.json`: TypeScript configuration.