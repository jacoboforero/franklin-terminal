# Storage Layer

## Overview

The storage layer is responsible for data persistence and retrieval. This is the **fourth layer** in the Franklin Terminal data pipeline.

## Architecture

```
storage/
├── database/          # Database operations
│   ├── firestore.js   # Firestore client and operations
│   ├── articles.js    # Article database operations
│   ├── users.js       # User database operations
│   └── briefings.js   # Briefing database operations
├── cache/             # Caching layer
│   ├── redis.js       # Redis client and operations
│   ├── articles.js    # Article caching
│   └── users.js       # User caching
├── files/             # File storage
│   ├── firebase-storage.js  # Firebase Storage operations
│   ├── images.js      # Image storage
│   └── documents.js   # Document storage
└── README.md          # This file
```

## Purpose

- **Data Persistence**: Store articles, users, and briefings in Firestore
- **Caching**: Provide fast access to frequently accessed data
- **File Storage**: Store images, documents, and other files
- **Backup**: Ensure data safety and recovery

## Data Flow

```
API Layer ↔ Storage Layer ↔ External Storage (Firestore/Redis/Firebase Storage)
```

## Database Collections

### Articles

- `articles` - Processed articles with metadata
- `articles_raw` - Raw articles from ingestion
- `articles_processed` - Articles with processing results

### Users

- `users` - User profiles and preferences
- `user_stake_areas` - User stake area definitions
- `user_feedback` - User feedback and ratings

### Briefings

- `briefings` - Generated briefings
- `briefing_templates` - Briefing templates
- `briefing_history` - Briefing history

## Features

### Firestore Operations

- CRUD operations for all collections
- Batch operations for efficiency
- Real-time listeners
- Offline support

### Caching Strategy

- Redis for session data
- Article caching with TTL
- User preference caching
- Intelligent cache invalidation

### File Storage

- Firebase Storage for files
- Image optimization
- Document versioning
- Access control

### Data Integrity

- Transaction support
- Data validation
- Backup strategies
- Recovery procedures

## Development Status

- ⏳ Architecture defined
- ⏳ Firestore setup
- ⏳ Database operations implementation
- ⏳ Caching implementation
- ⏳ File storage implementation

## Integration

The storage layer serves all other layers:

- **Ingestion Layer**: Stores raw articles
- **Processing Layer**: Stores processed articles
- **API Layer**: Retrieves data for serving
