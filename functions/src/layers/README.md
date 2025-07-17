# Franklin Terminal - Backend Layers Architecture

## Overview

Franklin Terminal uses a layered architecture to separate concerns and enable independent development of different components. Each layer has a specific responsibility and communicates with adjacent layers through well-defined interfaces.

## Complete System Architecture

### High-Level Data Flow

```
External Sources → Ingestion → Processing → API → Frontend
                                    ↓
                                Storage ←→ All Layers
```

### Detailed Layer Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (SvelteKit)                     │
│  • Quiz interface for user profiles                          │
│  • Dashboard for personalized briefings                      │
│  • Services for API communication                            │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                        API LAYER (Layer 3)                  │
│  • REST API endpoints                                        │
│  • Authentication & rate limiting                           │
│  • Caching & optimization                                    │
│  • Request validation & formatting                           │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                    PROCESSING LAYER (Layer 2)               │
│  • Relevance scoring & filtering                            │
│  • Content analysis (entities, sentiment, topics)           │
│  • User preference matching                                  │
│  • Data enrichment & standardization                        │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                    INGESTION LAYER (Layer 1)                │
│  • NewsAPI handler (MVP)                                    │
│  • Raw data fetching                                         │
│  • Standardized transformation                               │
│  • Query-driven data fetching                                │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                 USER INTELLIGENCE LAYER (Layer 0)           │
│  • User profile analysis                                     │
│  • Query generation for NewsAPI                              │
│  • Preference aggregation                                    │
│  • Query caching & optimization                              │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                     STORAGE LAYER (Layer 4)                 │
│  • Firestore database operations                             │
│  • Redis caching                                             │
│  • Firebase Storage for files                                │
│  • User profile management                                   │
└─────────────────────────────────────────────────────────────┘
```

## Complete Data Flow & Integration

### 1. User Profile Creation

```
Quiz Completion → User Profile Service → Firestore Storage
```

### 2. Briefing Generation Pipeline

```
User Profile → User Intelligence → Ingestion (NewsAPI) → Processing → API → Storage → Frontend
     ↓              ↓                ↓           ↓         ↓       ↓         ↓
Quiz Results → Query Generation → NewsAPI → Analysis → Response → Database → Dashboard
```

### 3. Real-time User Briefing

```
Single User → User Intelligence → Ingestion (NewsAPI) → Processing → API → Storage
     ↓              ↓                ↓           ↓         ↓       ↓
User Profile → Query Generation → NewsAPI → Analysis → Response → Database
```

## Layer Details & Integration

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

**Integration**: `userIntelligence.processUserIntelligence()` → `ingestion.fetchFromSources()`

**Example Flow**:

```javascript
// User Intelligence generates targeted queries
const queries = {
  newsapi: {
    q: "artificial intelligence regulation",
    category: "technology",
    pageSize: 50,
  },
};

// Ingestion uses queries to fetch only relevant content
const articles = await ingestion.fetchFromSources(queries.newsapi);
```

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

**Integration**: `ingestion.fetchFromSources()` → `processing.processContent()`

**Standards**: All sources must output articles validated against `data-schema.js`

**Standardized Article Schema**:

```javascript
{
  id: "source-uniqueid",
  title: "string",
  summary: "string",
  content: "string",
  category: "Economic Policy|Political Policy|Technology Regulation|...",
  source: "NewsAPI",
  sourceUrl: "url",
  date: "ISO 8601",
  tags: ["array"],
  entities: { companies: [], organizations: [], people: [], locations: [] },
  metadata: { wordCount: number, readingTime: number, language: "en", sentiment: "positive|negative|neutral" },
  processedAt: "ISO 8601",
  raw: "original data"
}
```

### Layer 2: Processing (`/processing/`)

**Purpose**: Analyze and enrich articles for relevance and content insights.

**Planned Structure:**

- `relevance/` - Relevance scoring, rule-based filters, AI-powered scoring
- `analysis/` - Named entity extraction, sentiment analysis, topic classification
- `enrichment/` - Metadata enhancement, tag generation, summary generation
- `user-matching/` - User preference analysis, personalized scoring, feedback learning

**Input**: Standardized articles from ingestion + user profiles
**Output**: Enriched articles with relevance scores and analysis metadata

**Integration**: `processing.processContent()` → `api.prepareResponse()`

**Multi-Layered Relevance Filtering**:

1. **Rule-Based Pre-Filtering** - Geographic, topic, industry, investment relevance
2. **Content Extraction** - Entity recognition (companies, organizations, people, locations)
3. **AI-Powered Scoring** - Relevance scoring (0-1) based on user profile
4. **User Feedback Learning** - Interaction tracking and preference updates

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

**Integration**: `api.prepareResponse()` → `storage.storeResults()`

### Layer 4: Storage (`/storage/`)

**Purpose**: Data persistence, caching, and file storage.

**Key Components:**

- `database/` - Firestore operations (articles, users, briefings collections)
- `cache/` - Redis caching with TTL and intelligent invalidation
- `files/` - Firebase Storage for images and documents

**Collections:**

- `articles`, `articles_raw`, `articles_processed` - Article storage
- `users`, `user_stake_areas`, `user_feedback` - User data
- `briefings`, `briefings_templates`, `briefing_history` - Briefing data

**Integration**: Serves all other layers with data persistence and retrieval

## Key Integration Points

### 1. Function Name Consistency

All layers use consistent function names:

- `processUserIntelligence()` → `fetchFromSources()` → `processContent()` → `prepareResponse()` → `storeResults()`

### 2. Data Format Consistency

- User profiles follow consistent schema across all layers
- Articles follow `STANDARDIZED_ARTICLE_SCHEMA`
- API responses follow consistent format

### 3. Error Handling

- Each layer has fallback mechanisms
- Errors are propagated up the chain with context
- Graceful degradation when services are unavailable

### 4. Caching Strategy

- User Intelligence: Query result caching
- Ingestion: NewsAPI data caching
- Storage: Database and Redis caching

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

## Efficiency Benefits

### 1. 90% Data Reduction

- **Without User Intelligence**: Fetch ALL articles from NewsAPI
- **With User Intelligence**: Fetch only relevant articles using targeted queries

### 2. Scalable Architecture

- Each layer can scale independently
- User intelligence enables efficient batch processing
- Caching reduces redundant API calls

### 3. Personalization

- Content tailored to individual user preferences
- Relevance scoring based on user stake areas
- Dynamic query generation based on user segments

## Current Implementation Status

| Layer             | Status          | Key Files                                 |
| ----------------- | --------------- | ----------------------------------------- |
| User Intelligence | 🔄 Implementing | `profile-analyzer.js`, `query-builder.js` |
| Ingestion         | 🔄 Implementing | `newsapi/handler.js`, `data-schema.js`    |
| Processing        | ⏳ Planning     | Architecture defined                      |
| API               | ⏳ Planning     | Architecture defined                      |
| Storage           | ⏳ Planning     | Architecture defined                      |

## Testing Integration

### Development Endpoints

- `/testUserIntelligence` - Test user intelligence layer
- `/testIngestion` - Test ingestion with mock queries
- `/testProcessing` - Test processing pipeline
- `/getHealth` - System health check

### Pipeline Testing

- `processBriefingPipeline()` - Full pipeline with user intelligence
- `processSingleUserBriefing()` - Single user pipeline
- Error handling and fallback mechanisms

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
- **Reliability**: Comprehensive error handling and fallback mechanisms
