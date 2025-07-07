# Environment Setup Guide

## 🔍 **Understanding Firebase Project Structure**

Your Franklin Terminal project has **two separate environments**:

```
si-app/                    # Root project (SvelteKit frontend)
├── .env                   # Frontend environment variables
├── package.json           # Frontend dependencies
├── src/                   # Frontend code
└── functions/             # Firebase Functions (backend)
    ├── .env               # Backend environment variables (separate!)
    ├── package.json       # Backend dependencies
    └── src/               # Backend code
```

## 🎯 **Environment Variable Strategy**

### **Frontend (.env in root)**

Variables needed by the SvelteKit app:

```bash
# Firebase configuration (auto-generated)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=si-terminal.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=si-terminal
VITE_FIREBASE_STORAGE_BUCKET=si-terminal.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef

# Frontend-specific settings
VITE_APP_NAME=Franklin Terminal
VITE_APP_VERSION=1.0.0
```

### **Backend (.env in functions/)**

Variables needed by Firebase Functions:

```bash
# API Keys for data sources
NEWSAPI_API_KEY=your_newsapi_key_here
FRED_API_KEY=your_fred_api_key_here
REUTERS_API_KEY=your_reuters_api_key_here

# Source configuration
NEWSAPI_BASE_URL=https://newsapi.org/v2
FRED_BASE_URL=https://api.stlouisfed.org/fred
POLITICO_RSS_URL=https://www.politico.com/rss/politicopicks.xml
BLOOMBERG_RSS_URL=https://feeds.bloomberg.com/politics/news.rss

# Rate limits and timeouts
NEWSAPI_RATE_LIMIT=1000
FRED_RATE_LIMIT=120
REUTERS_RATE_LIMIT=1000

# General settings
NODE_ENV=development
LOG_LEVEL=info
CACHE_TTL=3600
```

## 🛠 **Setup Instructions**

### **Step 1: Frontend Environment**

1. In the **root directory** (`si-app/`), create `.env`:

```bash
# Copy from Firebase Console > Project Settings > General > Your apps
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=si-terminal.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=si-terminal
VITE_FIREBASE_STORAGE_BUCKET=si-terminal.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef

# App settings
VITE_APP_NAME=Franklin Terminal
VITE_APP_VERSION=1.0.0
```

### **Step 2: Backend Environment**

1. In the **functions directory** (`si-app/functions/`), create `.env`:

```bash
# Copy from functions/env.example and fill in your values
NEWSAPI_API_KEY=your_newsapi_key_here
FRED_API_KEY=your_fred_api_key_here
REUTERS_API_KEY=your_reuters_api_key_here

# Source configuration
NEWSAPI_BASE_URL=https://newsapi.org/v2
FRED_BASE_URL=https://api.stlouisfed.org/fred
POLITICO_RSS_URL=https://www.politico.com/rss/politicopicks.xml
BLOOMBERG_RSS_URL=https://feeds.bloomberg.com/politics/news.rss

# Rate limits and timeouts
NEWSAPI_RATE_LIMIT=1000
FRED_RATE_LIMIT=120
REUTERS_RATE_LIMIT=1000

# General settings
NODE_ENV=development
LOG_LEVEL=info
CACHE_TTL=3600
MAX_ARTICLES_PER_SOURCE=100
BATCH_SIZE=50
```

### **Step 3: Firebase Functions Environment**

For production deployment, set environment variables in Firebase:

```bash
# Set environment variables for Firebase Functions
firebase functions:config:set newsapi.key="your_newsapi_key"
firebase functions:config:set fred.key="your_fred_api_key"
firebase functions:config:set general.environment="production"
```

## 🔧 **Development vs Production**

### **Development**

- Use `.env` files in both root and functions directories
- Variables are loaded automatically by Vite (frontend) and dotenv (backend)
- Easy to manage and debug

### **Production**

- Frontend: Environment variables are embedded in the build
- Backend: Use `firebase functions:config:set` or Firebase Console
- More secure, no `.env` files in production

## 📋 **Environment Variable Checklist**

### **Frontend (.env in root)**

- [ ] Firebase configuration (from Firebase Console)
- [ ] App name and version
- [ ] Any frontend-specific API keys (if needed)

### **Backend (.env in functions/)**

- [ ] NewsAPI key (required)
- [ ] FRED API key (required)
- [ ] Reuters API key (optional)
- [ ] RSS feed URLs
- [ ] Rate limits and timeouts
- [ ] General configuration

### **Production Deployment**

- [ ] Set Firebase Functions config variables
- [ ] Verify environment validation passes
- [ ] Test all data sources work

## 🚨 **Important Notes**

1. **Never commit `.env` files** - they're in `.gitignore`
2. **Frontend variables must start with `VITE_`** to be accessible in SvelteKit
3. **Backend variables are accessed via `process.env`** in Node.js
4. **Firebase Functions have their own environment scope** - separate from frontend
5. **Use `functions/env.example` as a template** for the backend `.env`

## 🔍 **Troubleshooting**

### **Frontend can't access environment variables**

- Make sure they start with `VITE_`
- Restart the dev server after adding variables

### **Backend can't access environment variables**

- Check that `.env` is in the `functions/` directory
- Verify variable names match what the code expects
- Restart Firebase emulator

### **Production deployment issues**

- Use `firebase functions:config:get` to verify variables are set
- Check Firebase Console > Functions > Configuration
- Verify environment validation passes

## 📚 **Resources**

- [Firebase Environment Configuration](https://firebase.google.com/docs/functions/config-env)
- [SvelteKit Environment Variables](https://kit.svelte.dev/docs/modules#$env)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
