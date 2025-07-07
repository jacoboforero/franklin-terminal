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
│  • Data source handlers (Reuters, NewsAPI, etc.)            │
│  • Raw data fetching                                         │
│  • Standardized transformation                               │
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

### 1. Ingestion Layer (`/ingestion/`)

**Purpose**: Fetch and standardize data from external sources

- **Input**: External APIs, RSS feeds, data sources
- **Output**: Standardized articles in consistent format
- **Key Files**: `data-schema.js`, source handlers, `base-handler.js`

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
External Sources → Ingestion → Processing → API → Frontend
                                    ↓
                                Storage ←→ All Layers
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

| Layer      | Status          | Next Steps               |
| ---------- | --------------- | ------------------------ |
| Ingestion  | ✅ Architecture | 🔄 Source implementation |
| Processing | ⏳ Architecture | ⏳ Implementation        |
| API        | ⏳ Architecture | ⏳ Implementation        |
| Storage    | ⏳ Architecture | ⏳ Implementation        |

## Getting Started

1. **Start with Ingestion Layer**: Implement source handlers
2. **Add Processing Layer**: Build relevance scoring
3. **Create API Layer**: Build REST endpoints
4. **Setup Storage Layer**: Configure databases

## File Structure

```
src/layers/
├── ingestion/         # Data ingestion (Layer 1)
├── processing/        # Data processing (Layer 2)
├── api/              # API serving (Layer 3)
├── storage/          # Data storage (Layer 4)
└── README.md         # This file
```

Each layer has its own README with detailed implementation guidelines.
