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

## Layer Responsibilities

### 0. User Intelligence Layer (`/user-intelligence/`)

**Purpose**: Analyze user profiles and generate targeted queries

- **Input**: User profiles from quiz
- **Output**: NewsAPI query parameters
- **Key Files**: `profile-analyzer.js`, `query-builder.js`, `preference-aggregator.js`

### 1. Ingestion Layer (`/ingestion/`)

**Purpose**: Fetch and standardize data from NewsAPI

- **Input**: Query parameters from user intelligence layer
- **Output**: Standardized articles in consistent format
- **Key Files**: `data-schema.js`, `newsapi/handler.js`, `base-handler.js`

### 2. Processing Layer (`/processing/`)

**Purpose**: Analyze and enrich articles for relevance

- **Input**: Standardized articles from ingestion
- **Output**: Enriched articles with relevance scores
- **Key Components**: Relevance scoring, content analysis, user matching

### 3. API Layer (`/api/`)

**Purpose**: Serve data to frontend and external clients

- **Input**: Processed articles from processing layer
- **Output**: REST API responses
- **Key Components**: Endpoints, middleware, services

### 4. Storage Layer (`/storage/`)

**Purpose**: Data persistence and retrieval

- **Input**: Data from all layers
- **Output**: Stored data for retrieval
- **Key Components**: Firestore, Redis, Firebase Storage

## Data Flow

```
User Profiles → User Intelligence → Ingestion (NewsAPI) → Processing → API → Frontend
                    ↓                    ↓           ↓         ↓
                Query Cache ←→ NewsAPI ←→ Storage ←→ All Layers
```

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

## Current Status

| Layer             | Status          | Next Steps                |
| ----------------- | --------------- | ------------------------- |
| User Intelligence | ✅ Architecture | 🔄 Implementation         |
| Ingestion         | ✅ Architecture | 🔄 NewsAPI implementation |
| Processing        | ✅ Architecture | 🔄 Implementation         |
| API               | ✅ Architecture | 🔄 Implementation         |
| Storage           | ✅ Architecture | 🔄 Implementation         |

## Getting Started

1. **Start with User Intelligence Layer**: Implement profile analysis and query generation
2. **Implement Ingestion Layer**: Build NewsAPI handler with query parameters
3. **Add Processing Layer**: Build relevance scoring and content analysis
4. **Create API Layer**: Build REST endpoints and response formatting
5. **Setup Storage Layer**: Configure databases and caching

## File Structure

```
src/layers/
├── user-intelligence/ # User intelligence (Layer 0)
├── ingestion/         # Data ingestion (Layer 1)
├── processing/        # Data processing (Layer 2)
├── api/              # API serving (Layer 3)
├── storage/          # Data storage (Layer 4)
└── README.md         # This file
```

Each layer has its own README with detailed implementation guidelines.
