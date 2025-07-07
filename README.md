# Franklin Terminal

A sophisticated political intelligence platform delivering personalized, AI-powered daily briefings—curated and visualized for professionals, researchers, students, and the politically aware—built with SvelteKit, Tailwind CSS, and Firebase.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Current Status](#current-status)
3. [Tech Stack](#tech-stack)
4. [Firebase Setup](#firebase-setup)
5. [Architecture](#architecture)
6. [Folder Structure](#folder-structure)
7. [Setup & Local Development](#setup--local-development)
8. [Development Workflow](#development-workflow)
9. [Troubleshooting](#troubleshooting)
10. [Next Steps](#next-steps)

---

## Project Overview

Franklin Terminal helps users stay informed with minimal effort by:

- **Personal Stakeholder Assessment**: Onboarding quiz to determine user's interests, expertise, and risk profile; outputs topic weights.
- **Daily Briefings**: A single card linking to 3–5 pre-curated summaries (from newsletters, RSS feeds or APIs).
- **Custom Dashboard**: Drag-and-drop canvas of widgets (Recommended Topics, Briefing Card, Twitter Feed, Legislature Alerts).

All dynamic data is fetched via the Firebase SDK in the client; backend logic lives in Firebase Cloud Functions.

---

## Current Status

### ✅ Completed

- **Project Setup**: SvelteKit + Tailwind CSS + Firebase integration
- **Firebase Configuration**: Properly configured and tested Firebase v11.9.1l
- **Basic Routing**: Homepage, dashboard, quiz, and test routes
- **Component Structure**: Organized component library with features, layout, and UI components
- **Firebase Test**: Homepage includes a working Firebase connection test

### 🚧 In Progress

- **Dashboard Implementation**: Basic dashboard structure exists but needs widgets
- **Quiz System**: Quiz components exist but need implementation
- **Briefing System**: Briefing components exist but need data integration

### 📋 Planned

- **User Authentication**: Firebase Auth integration
- **Cloud Functions**: Backend logic for data processing
- **Widget System**: Interactive dashboard widgets
- **Push Notifications**: Firebase Cloud Messaging integration

---

## Tech Stack

### Frontend

- **Framework**: SvelteKit v2.16.0 (JavaScript)
- **Styling**: Tailwind CSS v3.4.1
- **Build Tool**: Vite v6.2.6
- **State & Data**: Firebase Web SDK v11.9.1 (Firestore, Auth, FCM)

### Backend

- **Functions**: Node.js on Firebase Cloud Functions
- **Database**: Firestore (NoSQL)
- **Authentication**: Firebase Auth (planned)
- **Messaging**: Firebase Cloud Messaging (planned)

### Development

- **Package Manager**: npm
- **Version Control**: Git
- **Code Quality**: SvelteKit built-in linting

---

## Firebase Setup

### Configuration

The Firebase configuration is located in `src/lib/firebase.js`:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyBt5NMl4zW8_NylvwWSJSoy3tmOBweO5s0",
  authDomain: "si-terminal.firebaseapp.com",
  projectId: "si-terminal",
  storageBucket: "si-terminal.firebasestorage.app",
  messagingSenderId: "19947220100",
  appId: "1:19947220100:web:d22d6b25b674896eeee6d1",
};
```

### Initialization

Firebase is initialized using a reliable async pattern:

```javascript
// Get Firebase services anywhere in your app
import { getFirebaseServices } from "$lib/firebase.js";

const { app, db } = await getFirebaseServices();
```

### Testing

The homepage (`/`) includes a Firebase test that:

- Automatically tests the connection on page load
- Shows real-time status (✅ working / ❌ failed)
- Provides detailed error messages
- Allows manual re-testing

### Important Notes

- **Version Compatibility**: Uses Firebase v11.9.1 with compatible `@firebase/*` packages
- **SSR Safe**: Properly handles server-side rendering with browser checks
- **Error Handling**: Comprehensive error handling and logging
- **No Conflicts**: Clean dependency tree without version conflicts

---

## Architecture

```
┌─────────────────┐    Firebase SDK    ┌─────────────────┐
│   SvelteKit     │ ──────────────────► │    Firebase     │
│   Frontend      │                    │   Backend       │
│                 │                    │                 │
│ • Homepage      │                    │ • Firestore     │
│ • Dashboard     │                    │ • Auth          │
│ • Quiz          │                    │ • Functions     │
│ • Components    │                    │ • FCM           │
└─────────────────┘                    └─────────────────┘
```

### Data Flow

1. **Client**: SvelteKit components make Firebase SDK calls
2. **Firebase**: Handles authentication, data storage, and real-time updates
3. **Functions**: Cloud Functions process data and send notifications (planned)

---

## Folder Structure

```
si-app/
├── src/
│   ├── lib/
│   │   ├── firebase.js          # Firebase configuration & initialization
│   │   └── components/
│   │       ├── features/        # Feature-specific components
│   │       │   ├── briefings/   # Briefing-related components
│   │       │   ├── dashboard/   # Dashboard widgets
│   │       │   └── quiz/        # Quiz components
│   │       ├── layout/          # Layout components
│   │       └── ui/              # Reusable UI components
│   ├── routes/
│   │   ├── +layout.svelte       # Global layout
│   │   ├── +page.svelte         # Homepage with Firebase test
│   │   ├── dashboard/           # Dashboard pages
│   │   ├── quiz/                # Quiz pages
│   │   └── test/                # Test pages
│   ├── app.html                 # HTML template
│   └── app.css                  # Global styles
├── functions/                   # Firebase Cloud Functions
│   ├── index.js                 # Function exports
│   └── package.json
├── static/                      # Static assets
├── firebase.json                # Firebase configuration
├── firestore.rules              # Firestore security rules
├── firestore.indexes.json       # Firestore indexes
├── package.json                 # Main dependencies
├── vite.config.js               # Vite configuration
├── tailwind.config.js           # Tailwind configuration
└── svelte.config.js             # SvelteKit configuration
```

---

## Setup & Local Development

### Prerequisites

- Node.js v18+
- npm
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd si-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Install Firebase Functions dependencies** (if working on backend)

   ```bash
   cd functions
   npm install
   cd ..
   ```

4. **Start development server**

   ```bash
   npm run dev
   ```

5. **Access the application**
   - Open http://localhost:5173
   - The homepage includes a Firebase test to verify connectivity

### Firebase Emulator (Optional)

For local Firebase development:

```bash
# Install Firebase CLI globally
npm install -g firebase-tools

# Login to Firebase
firebase login

# Start emulators
firebase emulators:start
```

---

## Development Workflow

### Code Organization

- **Components**: Feature-based organization in `src/lib/components/`
- **Routes**: Page-based routing in `src/routes/`
- **Firebase**: Centralized in `src/lib/firebase.js`

### Best Practices

1. **Firebase Usage**: Always use `getFirebaseServices()` for Firebase access
2. **Error Handling**: Implement proper error handling for Firebase operations
3. **Component Structure**: Follow the established feature/layout/ui pattern
4. **Styling**: Use Tailwind CSS classes for consistent styling

### Testing

- **Firebase Test**: Available on homepage (`/`)
- **Manual Testing**: Use the test button to verify Firebase connectivity
- **Console Logs**: Check browser console for Firebase initialization logs

---

## Troubleshooting

### Firebase Issues

If you encounter Firebase errors:

1. **Check Dependencies**: Ensure clean `node_modules` and `package-lock.json`

   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Version Conflicts**: Verify Firebase package versions are compatible

   ```bash
   npm ls firebase @firebase/app @firebase/firestore
   ```

3. **Configuration**: Verify Firebase config in `src/lib/firebase.js`

4. **Browser Console**: Check for initialization errors

### Common Issues

- **"Service firestore is not available"**: Usually indicates version conflicts
- **Build failures**: Check for missing exports or import issues
- **SSR errors**: Ensure Firebase is only used in browser context

---

## Next Steps

### Immediate Priorities

1. **User Authentication**: Implement Firebase Auth
2. **Dashboard Widgets**: Build interactive dashboard components
3. **Quiz Implementation**: Complete the stakeholder assessment quiz
4. **Data Models**: Define Firestore collections and security rules

### Medium Term

1. **Cloud Functions**: Implement backend logic
2. **Real-time Updates**: Add Firestore listeners
3. **Push Notifications**: Integrate Firebase Cloud Messaging
4. **Performance**: Optimize bundle size and loading

### Long Term

1. **Advanced Features**: AI-powered recommendations
2. **Analytics**: User behavior tracking
3. **Mobile**: Progressive Web App features
4. **Scaling**: Performance optimization and monitoring

---

## Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

---

_Happy coding! 🚀_
