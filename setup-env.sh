#!/bin/bash

# Franklin Terminal Environment Setup Script
# This script helps you set up environment variables for both frontend and backend

echo "🔧 Franklin Terminal Environment Setup"
echo "======================================"

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "functions" ]; then
    echo "❌ Error: Please run this script from the root of the Franklin Terminal project"
    exit 1
fi

echo ""
echo "📋 This script will help you set up environment variables for:"
echo "   • Frontend (SvelteKit) - .env in root directory"
echo "   • Backend (Firebase Functions) - .env in functions/ directory"
echo ""

# Frontend environment setup
echo "🎯 Step 1: Frontend Environment (.env in root)"
echo "-----------------------------------------------"

if [ -f ".env" ]; then
    echo "⚠️  .env file already exists in root directory"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Skipping frontend environment setup..."
    else
        create_frontend_env=true
    fi
else
    create_frontend_env=true
fi

if [ "$create_frontend_env" = true ]; then
    cat > .env << 'EOF'
# Franklin Terminal Frontend Environment Variables
# Copy these values from your Firebase Console

# Firebase Configuration (Required)
VITE_FIREBASE_API_KEY=your_firebase_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=si-terminal.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=si-terminal
VITE_FIREBASE_STORAGE_BUCKET=si-terminal.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef

# App Configuration
VITE_APP_NAME=Franklin Terminal
VITE_APP_VERSION=1.0.0
EOF
    echo "✅ Created .env file in root directory"
    echo "   📝 Please update the Firebase configuration values from your Firebase Console"
fi

# Backend environment setup
echo ""
echo "🎯 Step 2: Backend Environment (.env in functions/)"
echo "---------------------------------------------------"

if [ -f "functions/.env" ]; then
    echo "⚠️  .env file already exists in functions directory"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Skipping backend environment setup..."
    else
        create_backend_env=true
    fi
else
    create_backend_env=true
fi

if [ "$create_backend_env" = true ]; then
    cat > functions/.env << 'EOF'
# Franklin Terminal Backend Environment Variables
# Copy from functions/env.example and fill in your actual values

# ===============================
# REQUIRED API KEYS
# ===============================

# NewsAPI (Required - Free tier available)
NEWSAPI_API_KEY=your_newsapi_key_here

# ===============================
# SOURCE CONFIGURATION
# ===============================

# NewsAPI Configuration
NEWSAPI_BASE_URL=https://newsapi.org/v2
NEWSAPI_RATE_LIMIT=1000
NEWSAPI_TIMEOUT=30000
NEWSAPI_RETRY_ATTEMPTS=3

# ===============================
# GENERAL CONFIGURATION
# ===============================

# Environment
NODE_ENV=development
LOG_LEVEL=info

# Cache Configuration
CACHE_TTL=3600
MAX_ARTICLES_PER_SOURCE=100
BATCH_SIZE=50

# ===============================
# FIREBASE CONFIGURATION
# ===============================

# These are typically set automatically by Firebase
FIREBASE_PROJECT_ID=si-terminal
FIREBASE_DATABASE_URL=https://si-terminal-default-rtdb.firebaseio.com
FIREBASE_STORAGE_BUCKET=si-terminal.appspot.com

# ===============================
# DEVELOPMENT SETTINGS
# ===============================

# Enable/disable sources for development
ENABLE_NEWSAPI=true

# Debug settings
DEBUG_MODE=false
LOG_REQUESTS=false
LOG_RESPONSES=false
EOF
    echo "✅ Created .env file in functions directory"
    echo "   📝 Please update the API keys and configuration values"
fi

echo ""
echo "🎉 Environment setup complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Get your Firebase configuration from Firebase Console"
echo "   2. Sign up for NewsAPI (free): https://newsapi.org/"
echo "   3. Update the .env files with your actual values"
echo "   4. Test the setup with: npm run dev (frontend) and firebase emulators:start (backend)"
echo ""
echo "📚 For detailed instructions, see:"
echo "   • ENVIRONMENT_SETUP.md"
echo "   • functions/API_RESEARCH_GUIDE.md"
echo "" 