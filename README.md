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
cd functions && npm install
```

### Firebase Setup

```bash
firebase login
firebase init
firebase emulators:start
```

### Development

```bash
npm run dev
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
│       ├── ingestion/           # Data ingestion
│       ├── processing/          # Data processing
│       ├── api/                 # API endpoints
│       └── storage/             # Data storage
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

- Reuters API
- NewsAPI
- Politico RSS
- FRED economic data
- Bloomberg RSS

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

## Next Steps

1. Implement source handlers (Reuters, NewsAPI, etc.)
2. Build processing layer with relevance scoring
3. Create API endpoints for frontend integration
4. Add user authentication and profiles
5. Deploy to Firebase hosting
