# QuickMart

A mobile e-commerce application built with React Native (Expo) and TypeScript.

## Key Features

*   User Authentication (Login, Register, Forgot Password)
*   Product Browsing (Categories, Search, Product Details, Reviews)
*   Shopping Cart & Checkout
*   Order Tracking
*   User Profile Management (Addresses, Orders, Payment Methods, Wishlist)
*   Notifications
*   Customer Support Chat
*   Light/Dark Theme Support

## Tech Stack

*   React Native
*   Expo
*   TypeScript
*   Expo Router (for navigation)
*   React Navigation (underlying navigation library)
*   Context API (for state management: Auth, Cart, Theme, Wishlist)
*   AsyncStorage (for local data persistence)
*   Lucide Icons
*   React Native Gesture Handler & Reanimated (for gestures and animations)
*   React Native WebView

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   Node.js (LTS version recommended)
*   npm (comes with Node.js) or Yarn
*   Expo CLI: `npm install -g expo-cli` (if not already installed)

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    ```
    (Replace `<repository-url>` with the actual URL of this repository)
2.  Navigate to the project directory:
    ```bash
    cd quickmart
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```
    or if you prefer Yarn:
    ```bash
    yarn install
    ```

### Running the Application

To start the development server and run the app on a simulator/emulator or a physical device using the Expo Go app:

```bash
npm run dev
```
or
```bash
yarn dev
```

This will open the Expo Developer Tools in your web browser. You can then:
*   Scan the QR code with the Expo Go app on your iOS or Android device.
*   Run on an Android emulator or iOS simulator.
*   Run in a web browser.

## Available Scripts

In the project directory, you can run the following scripts:

### `npm run dev` or `yarn dev`

Runs the app in development mode using Expo. This will start the Metro bundler and provide options to run the app on a simulator/emulator, a physical device via the Expo Go app, or in a web browser.

### `npm run build:web` or `yarn build:web`

Builds the application for web deployment. This command exports the static files to a `web-build` directory (or similar, as configured by Expo).

### `npm run lint` or `yarn lint`

Lints the codebase using ESLint as configured by `expo lint`. This helps in identifying and fixing potential code quality issues and enforcing coding standards.

## Project Structure

The project follows a standard Expo project structure:

```
quickmart/
├── api/              # Contains API call definitions or related logic (e.g., mock API for products, chat).
├── app/              # Contains all the screens and navigation setup, powered by Expo Router.
│   ├── (auth)/       # Authentication-related screens (Login, Register).
│   ├── (tabs)/       # Main tab-based navigation screens (Home, Cart, Profile, etc.).
│   ├── product/      # Product details and reviews screens.
│   └── ...           # Other screens and navigation files.
├── assets/           # Static assets like images, fonts.
├── components/       # Reusable UI components used across different screens.
│   ├── cart/
│   ├── home/
│   ├── product/
│   ├── profile/
│   ├── search/
│   ├── skeletons/    # Skeleton loader components.
│   ├── support/
│   └── ui/           # Generic UI elements (Button, Input, Card, etc.).
├── context/          # React Context API providers for global state management (Auth, Cart, Theme, Wishlist).
├── hooks/            # Custom React hooks.
├── utils/            # Utility functions and helpers (e.g., theme configuration, helper functions).
├── .bolt/            # Directory for Bolt configuration (internal tooling).
├── node_modules/     # Project dependencies.
├── .gitignore        # Specifies intentionally untracked files that Git should ignore.
├── app.json          # Expo configuration file.
├── package.json      # Project metadata, dependencies, and scripts.
├── tsconfig.json     # TypeScript configuration.
└── README.md         # This file.
```

**Key Directories:**

*   **`api/`**: Houses logic related to fetching data from external or mock APIs. For instance, `products.ts` might handle product data, and `chat.ts` could be for support chat functionalities.
*   **`app/`**: This is where Expo Router manages file-system based routing. Each file/directory here typically corresponds to a route or a group of routes in the app.
    *   **`(auth)/`**: Screens related to user authentication (e.g., login, registration). The parentheses denote a route group.
    *   **`(tabs)/`**: Defines the main tab navigation of the app (e.g., Home, Cart, Profile).
*   **`assets/`**: Contains static files like images (`images/`) and custom fonts (`fonts/`).
*   **`components/`**: Stores reusable UI components. These are broken down by feature (e.g., `home/`, `product/`) or type (`ui/` for generic elements, `skeletons/` for loading placeholders).
*   **`context/`**: Holds React Context files for managing global application state (e.g., `AuthContext.tsx` for user authentication status, `CartContext.tsx` for shopping cart data).
*   **`hooks/`**: For custom React Hooks that encapsulate reusable logic.
*   **`utils/`**: Contains utility functions, helper scripts, and global configurations like theme settings (`theme.ts`).

## Contributing

Contributions are welcome! If you have suggestions for improvements or want to fix a bug, please follow these general steps:

1.  **Fork the repository.**
2.  **Create a new branch** for your feature or bug fix:
    ```bash
    git checkout -b feature/your-feature-name
    ```
    or
    ```bash
    git checkout -b bugfix/issue-description
    ```
3.  **Make your changes.** Ensure your code adheres to the existing style and that you've tested your changes.
4.  **Commit your changes:**
    ```bash
    git commit -m "feat: Describe your feature" -m "Detailed description of the changes."
    ```
    (Consider using [Conventional Commits](https://www.conventionalcommits.org/) for commit messages if the project adopts it, otherwise use a clear and descriptive message.)
5.  **Push to your forked repository:**
    ```bash
    git push origin feature/your-feature-name
    ```
6.  **Open a Pull Request** to the main repository. Provide a clear title and description of your changes.

If you're planning to add a major feature, it's a good idea to open an issue first to discuss your ideas.
