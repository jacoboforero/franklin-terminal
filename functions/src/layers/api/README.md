# API Layer

## Overview

The API layer is responsible for serving processed articles to the frontend and external clients. This is the **third layer** in the Franklin Terminal data pipeline.

## Architecture

```
api/
├── endpoints/         # REST API endpoints
│   ├── articles.js    # Article endpoints
│   ├── users.js       # User endpoints
│   ├── briefings.js   # Briefing endpoints
│   └── health.js      # Health check endpoints
├── middleware/        # API middleware
│   ├── auth.js        # Authentication middleware
│   ├── rate-limit.js  # Rate limiting
│   ├── cache.js       # Caching middleware
│   └── validation.js  # Request validation
├── services/          # API services
│   ├── article-service.js    # Article business logic
│   ├── user-service.js       # User business logic
│   └── briefing-service.js   # Briefing business logic
└── README.md          # This file
```

## Purpose

- **REST API**: Provide HTTP endpoints for frontend and external clients
- **Data Serving**: Serve processed articles and briefings
- **Caching**: Optimize performance with intelligent caching
- **Rate Limiting**: Protect against abuse and ensure fair usage

## Data Flow

```
Processing Layer → API Layer → Frontend/External Clients
```

## Key Endpoints

### Articles

- `GET /api/articles` - Get articles with filtering
- `GET /api/articles/:id` - Get specific article
- `GET /api/articles/relevant` - Get articles relevant to user

### Users

- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/stake-areas` - Get user stake areas

### Briefings

- `GET /api/briefings/daily` - Get daily briefing
- `GET /api/briefings/custom` - Get custom briefing
- `POST /api/briefings/feedback` - Submit briefing feedback

## Features

### Authentication

- JWT-based authentication
- User session management
- Role-based access control

### Caching

- Redis-based caching
- Intelligent cache invalidation
- Performance optimization

### Rate Limiting

- Per-user rate limits
- API key management
- Abuse prevention

### Validation

- Request validation
- Response validation
- Error handling

## Development Status

- ⏳ Architecture defined
- ⏳ Endpoint implementation
- ⏳ Middleware implementation
- ⏳ Service implementation
- ⏳ Integration with processing layer

## Next Layer: Storage

The API layer reads from and writes to the storage layer, which handles:

- Firestore database operations
- File storage
- Data persistence
- Backup and recovery
