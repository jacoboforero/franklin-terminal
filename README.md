# Franklin Terminal

Political intelligence platform delivering personalized briefings based on user stake areas. Built with SvelteKit, Tailwind CSS, and Firebase.

## Tech Stack

### Frontend

- **Framework**: SvelteKit v2.16.0
- **Styling**: Tailwind CSS v3.4.1
- **Build**: Vite v6.2.6
- **Data**: Firebase Web SDK v11.9.1

### Backend

- **Functions**: Node.js on Firebase Cloud Functions
- **Database**: Firestore (NoSQL)
- **Auth**: Firebase Auth
- **Storage**: Firebase Storage

## Quick Start

### Prerequisites

- Node.js v18+
- npm
- Firebase CLI

### Installation

```bash
git clone <repository-url>
cd si-app
npm install
cd functions && npm install && cd ..
```

### Environment Setup

#### Project Structure

```
si-app/                    # Root project (SvelteKit frontend)
├── .env                   # Frontend environment variables
└── functions/             # Firebase Functions (backend)
    └── .env               # Backend environment variables (separate!)
```

#### Frontend Environment (.env in root)

```bash
# Firebase configuration (from Firebase Console)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=si-terminal.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=si-terminal
VITE_FIREBASE_STORAGE_BUCKET=si-terminal.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=19947220100
VITE_FIREBASE_APP_ID=1:19947220100:web:d22d6b25b674896eeee6d1

# App settings
VITE_APP_NAME=Franklin Terminal
VITE_APP_VERSION=1.0.0
```

#### Backend Environment (.env in functions/)

```bash
# NewsAPI (required for MVP)
NEWSAPI_API_KEY=your_newsapi_key_here
NEWSAPI_BASE_URL=https://newsapi.org/v2

# Configuration
NODE_ENV=development
LOG_LEVEL=info
CACHE_TTL=3600
```

#### Setup Script

```bash
# Set up environment variables for both frontend and backend
./setup-env.sh

# Update the generated .env files with your actual API keys
```

### Firebase Setup

```bash
firebase login
firebase init
firebase emulators:start
```

### Development

```bash
# Start frontend (in one terminal)
npm run dev

# Start Firebase emulators (in another terminal)
firebase emulators:start
```

## Project Structure

```
si-app/
├── src/
│   ├── lib/
│   │   ├── firebase.js          # Firebase config
│   │   └── components/          # Svelte components
│   ├── routes/                  # SvelteKit routes
│   └── app.css                  # Global styles
├── functions/
│   └── src/layers/              # Backend layers
│       ├── user-intelligence/   # Layer 0: User profile analysis
│       ├── ingestion/           # Layer 1: Data ingestion
│       ├── processing/          # Layer 2: Data processing
│       ├── api/                 # Layer 3: API endpoints
│       └── storage/             # Layer 4: Data storage
├── firebase.json                # Firebase config
└── package.json
```

## Backend Architecture

### Layered Design

```
External Sources → Ingestion → Processing → API → Frontend
                                    ↓
                                Storage ←→ All Layers
```

### Current Status

- ✅ Ingestion layer (skeleton handlers)
- ⏳ Processing layer (placeholder)
- ⏳ API layer (placeholder)
- ⏳ Storage layer (placeholder)

## Key Features

### User Assessment

- Stakeholder quiz to determine interests
- Investment, career, and personal stake areas
- Policy topic preferences

### Data Sources

- NewsAPI (aggregates multiple sources)

### Relevance Filtering

- Rule-based pre-filtering
- Content extraction and entity recognition
- AI-powered relevance scoring
- User feedback learning

## Development Workflow

1. **Backend**: Implement source handlers in `/functions/src/layers/ingestion/sources/`
2. **Processing**: Build relevance scoring in `/functions/src/layers/processing/`
3. **API**: Create endpoints in `/functions/src/layers/api/`
4. **Frontend**: Update components to use real data

## Firebase Configuration

```javascript
// src/lib/firebase.js
const firebaseConfig = {
  apiKey: "AIzaSyBt5NMl4zW8_NylvwWSJSoy3tmOBweO5s0",
  authDomain: "si-terminal.firebaseapp.com",
  projectId: "si-terminal",
  storageBucket: "si-terminal.firebasestorage.app",
  messagingSenderId: "19947220100",
  appId: "1:19947220100:web:d22d6b25b674896eeee6d1",
};
```

## Routes

- `/` - Homepage with Firebase test
- `/dashboard` - Main dashboard
- `/quiz` - Stakeholder assessment
- `/briefings` - Daily briefings
- `/test` - Development testing

## Environment Variables

### Important Notes

1. **Never commit `.env` files** - they're in `.gitignore`
2. **Frontend variables must start with `VITE_`** to be accessible in SvelteKit
3. **Backend variables are accessed via `process.env`** in Node.js
4. **Firebase Functions have their own environment scope** - separate from frontend

### Production Deployment

For production, set environment variables in Firebase:

```bash
firebase functions:config:set newsapi.key="your_newsapi_key"
firebase functions:config:set general.environment="production"
```

## Next Steps

1. Implement NewsAPI handler
2. Build processing layer with relevance scoring
3. Create API endpoints for frontend integration
4. Add user authentication and profiles
5. Deploy to Firebase hosting
