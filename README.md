# Too-A-Tee: T-Shirt Creator App

A cross-platform mobile app built with React Native and Expo that allows users to design custom T-shirts, preview them, and purchase directly from the app.

---

## Features
- Image upload from camera or gallery
- AI-powered image enhancement/generation (planned)
- T-shirt preview with design overlay
- Background removal toggle
- Shopping cart and checkout process
- User authentication (optional for MVP)

---

## Tech Stack
- **Frontend:** React Native, Expo
- **Navigation:** React Navigation
- **State Management:** Redux Toolkit
- **Backend/Storage:** Firebase (planned)
- **Payments:** Stripe React Native SDK (planned)

---

## Project Structure
```
Too-A-Tee/
├── assets/                # Images, fonts, etc.
├── src/
│   ├── components/        # Reusable UI components
│   ├── screens/           # Main app screens
│   ├── navigation/        # Navigation configuration
│   ├── services/          # API calls, Firebase config, etc.
│   ├── utils/             # Helper functions
│   ├── hooks/             # Custom React hooks
│   ├── store/             # Redux store and slices
│   └── App.js             # Root component
├── app.json               # Expo configuration
├── babel.config.js        # Babel configuration
├── package.json           # Project dependencies and scripts
└── README.md              # Project documentation
```

---

## Getting Started

### 1. Install Dependencies
```
npm install
# or
yarn
```

### 2. Start the Expo Development Server
```
npm start
# or
yarn start
```

### 3. Run on Device/Emulator
- Use the Expo Go app on your phone, or
- Run on iOS/Android emulator:
  - `npm run ios`
  - `npm run android`

---

## Development Notes
- **Navigation** is set up in `src/navigation/AppNavigator.js` using React Navigation (bottom tabs + stacks).
- **Redux Store** is configured in `src/store/` with slices for cart, user, and design state.
- **Core Components** like `Header` and `DesignCard` are in `src/components/`.
- **Screens** are scaffolded in `src/screens/` (Home, Design, etc.).
- **Utils** for colors, fonts, and image processing are in `src/utils/`.

---

## Next Steps
- Implement image picker and T-shirt preview logic
- Integrate Firebase for storage and authentication
- Add Stripe for payments
- Build out remaining screens and polish UI

---

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## License
[MIT](LICENSE)
