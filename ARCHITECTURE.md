# Franklin Terminal - Technical Architecture

## System Overview

Political intelligence platform with personalized briefings based on user stake areas. Multi-layered data processing pipeline from ingestion to delivery.

## Data Flow Architecture

```
External Sources → Ingestion → Processing → API → Frontend
                                    ↓
                                Storage ←→ All Layers
```

## Backend Layers (Firebase Functions)

### 1. Ingestion Layer (`/layers/ingestion/`)

- **Purpose**: Fetch and standardize data from external sources
- **Input**: APIs (Reuters, NewsAPI), RSS feeds (Politico, Bloomberg), FRED data
- **Output**: Standardized articles matching `data-schema.js`
- **Key Files**: `sources/` (handlers), `data-schema.js`, `base-handler.js`

### 2. Processing Layer (`/layers/processing/`)

- **Purpose**: Analyze articles for relevance to user stake areas
- **Input**: Standardized articles from ingestion
- **Output**: Enriched articles with relevance scores
- **Components**: Relevance scoring, content analysis, user matching

### 3. API Layer (`/layers/api/`)

- **Purpose**: Serve data to frontend via REST endpoints
- **Input**: Processed articles from processing layer
- **Output**: HTTP responses with caching and rate limiting
- **Components**: Endpoints, middleware, services

### 4. Storage Layer (`/layers/storage/`)

- **Purpose**: Data persistence and retrieval
- **Input**: Data from all layers
- **Output**: Stored data for retrieval
- **Components**: Firestore, Redis, Firebase Storage

## Multi-Layered Relevance Filtering

### Layer 1: Rule-Based Pre-Filtering

- Geographic, topic, industry, investment relevance
- Fast elimination of irrelevant content

### Layer 2: Content Extraction

- Entity recognition (companies, organizations, people, locations)
- Financial data extraction (stocks, bonds, sectors)

### Layer 3: AI-Powered Scoring

- Relevance scoring (0-1) based on user profile
- Stake area mapping and personal impact assessment

### Layer 4: User Feedback Learning

- Interaction tracking and preference updates
- Continuous improvement of relevance thresholds

## User Profile Schema

```javascript
{
  id: "user-uuid",
  stakeAreas: [
    { name: "Investment Portfolio", weight: 0.4 },
    { name: "Career & Industry", weight: 0.3 },
    { name: "Personal Values", weight: 0.3 }
  ],
  regions: ["North America", "Europe"],
  topics: ["Economic Policy", "Technology Regulation"],
  expertise: "Beginner|Intermediate|Advanced|Expert",
  timeAvailable: "5-10 minutes|10-20 minutes|20-30 minutes|30+ minutes"
}
```

## Standardized Article Schema

```javascript
{
  id: "source-uniqueid",
  title: "string",
  summary: "string",
  content: "string",
  category: "Economic Policy|Political Policy|Technology Regulation|...",
  source: "Reuters|NewsAPI|Politico|FRED|Bloomberg",
  sourceUrl: "url",
  date: "ISO 8601",
  tags: ["array"],
  entities: { companies: [], organizations: [], people: [], locations: [] },
  metadata: { wordCount: number, readingTime: number, language: "en", sentiment: "positive|negative|neutral" },
  processedAt: "ISO 8601",
  raw: "original data"
}
```

## Frontend Architecture (SvelteKit)

- **Framework**: SvelteKit with Tailwind CSS
- **State**: Firebase SDK for real-time data
- **Components**: Modular widget system for dashboard
- **Routing**: `/dashboard`, `/quiz`, `/briefings`

## Development Status

- ✅ Ingestion layer architecture and skeleton handlers
- ⏳ Processing layer implementation
- ⏳ API layer implementation
- ⏳ Storage layer implementation
- ✅ Frontend structure and components
