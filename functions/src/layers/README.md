# Franklin Terminal - Backend Layers Architecture

## Overview

Franklin Terminal uses a layered architecture to separate concerns and enable independent development of different components. Each layer has a specific responsibility and communicates with adjacent layers through well-defined interfaces.

## Layer Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (SvelteKit)                     │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                        API LAYER                            │
│  • REST API endpoints                                        │
│  • Authentication & rate limiting                           │
│  • Caching & optimization                                    │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                    PROCESSING LAYER                         │
│  • Relevance scoring & filtering                            │
│  • Content analysis (entities, sentiment, topics)           │
│  • User preference matching                                  │
│  • Data enrichment                                           │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                    INGESTION LAYER                          │
│  • NewsAPI handler (MVP)                                    │
│  • Raw data fetching                                         │
│  • Standardized transformation                               │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                 USER INTELLIGENCE LAYER                     │
│  • User profile analysis                                     │
│  • Query generation for NewsAPI                              │
│  • Preference aggregation                                    │
│  • Query caching & optimization                              │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                     STORAGE LAYER                           │
│  • Firestore database operations                             │
│  • Redis caching                                             │
│  • Firebase Storage for files                                │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

```
User Profiles → User Intelligence → Ingestion (NewsAPI) → Processing → API → Frontend
                    ↓                    ↓           ↓         ↓
                Query Cache ←→ NewsAPI ←→ Storage ←→ All Layers
```

## Layer Details

### Layer 0: User Intelligence (`/user-intelligence/`)

**Purpose**: Analyze user profiles and generate targeted queries for data sources.

**Key Components:**

- `profile-analyzer.js` - Extract searchable preferences from user profiles
- `query-builder.js` - Generate source-specific queries (NewsAPI, Reuters, etc.)
- `preference-aggregator.js` - Combine similar user preferences for efficiency
- `query-cache.js` - Cache query results and optimize API calls
- `user-segments.js` - User segmentation logic

**Input**: User profiles with stake areas, preferences, and geographic scope
**Output**: Source-specific query parameters (e.g., NewsAPI search terms, categories)

**Benefits**: 90% efficiency gain by fetching only relevant content, user-focused personalization

### Layer 1: Ingestion (`/ingestion/`)

**Purpose**: Fetch raw data from NewsAPI and transform into standardized format.

**Key Components:**

- `sources/newsapi/handler.js` - NewsAPI integration
- `sources/base-handler.js` - Base handler class for future sources
- `sources/data-schema.js` - Standardized article schema
- `sources/index.js` - Source registry

**Input**: Query parameters from user intelligence layer
**Output**: Standardized articles with required fields (id, title, summary, content, category, source, etc.)

**Standards**: All sources must output articles validated against `data-schema.js`

### Layer 2: Processing (`/processing/`)

**Purpose**: Analyze and enrich articles for relevance and content insights.

**Planned Structure:**

- `relevance/` - Relevance scoring, rule-based filters, AI-powered scoring
- `analysis/` - Named entity extraction, sentiment analysis, topic classification
- `enrichment/` - Metadata enhancement, tag generation, summary generation
- `user-matching/` - User preference analysis, personalized scoring, feedback learning

**Input**: Standardized articles from ingestion + user profiles
**Output**: Enriched articles with relevance scores and analysis metadata

### Layer 3: API (`/api/`)

**Purpose**: Serve processed articles to frontend and external clients.

**Planned Structure:**

- `endpoints/` - REST API endpoints (articles, users, briefings, health)
- `middleware/` - Authentication, rate limiting, caching, validation
- `services/` - Business logic services

**Key Endpoints:**

- `GET /api/articles` - Get articles with filtering
- `GET /api/briefings/daily` - Get daily briefing
- `GET /api/users/profile` - Get/update user profile

**Features**: JWT authentication, Redis caching, rate limiting, request validation

### Layer 4: Storage (`/storage/`)

**Purpose**: Data persistence, caching, and file storage.

**Key Components:**

- `database/` - Firestore operations (articles, users, briefings collections)
- `cache/` - Redis caching with TTL and intelligent invalidation
- `files/` - Firebase Storage for images and documents

**Collections:**

- `articles`, `articles_raw`, `articles_processed` - Article storage
- `users`, `user_stake_areas`, `user_feedback` - User data
- `briefings`, `briefing_templates`, `briefing_history` - Briefing data

## Development Guidelines

### Layer Independence

- Each layer can be developed independently
- Clear interfaces between layers
- Minimal coupling between layers

### Data Contracts

- Each layer defines its input/output format
- Schema validation at layer boundaries
- Consistent error handling

### Testing Strategy

- Unit tests for each layer
- Integration tests for layer interactions
- End-to-end tests for complete flows

## Current Implementation Status

| Layer             | Status          | Key Files                                 |
| ----------------- | --------------- | ----------------------------------------- |
| User Intelligence | 🔄 Implementing | `profile-analyzer.js`, `query-builder.js` |
| Ingestion         | 🔄 Implementing | `newsapi/handler.js`, `data-schema.js`    |
| Processing        | ⏳ Planning     | Architecture defined                      |
| API               | ⏳ Planning     | Architecture defined                      |
| Storage           | ⏳ Planning     | Architecture defined                      |

## Getting Started

**Development Order:**

1. **User Intelligence**: Complete profile analysis and query generation
2. **Ingestion**: Implement NewsAPI handler with generated queries
3. **Processing**: Build relevance scoring and content analysis
4. **API**: Create REST endpoints for frontend integration
5. **Storage**: Configure databases and implement persistence

**File Structure:**

```
src/layers/
├── user-intelligence/    # Layer 0: User profile analysis
├── ingestion/            # Layer 1: Data fetching
├── processing/           # Layer 2: Content analysis
├── api/                  # Layer 3: REST API
└── storage/              # Layer 4: Data persistence
```

## Architecture Benefits

- **Scalability**: Each layer can scale independently
- **Maintainability**: Clear separation of concerns
- **Testability**: Isolated components with defined interfaces
- **Efficiency**: User-targeted content fetching reduces processing overhead
- **Flexibility**: Easy to add new data sources or modify processing logic
