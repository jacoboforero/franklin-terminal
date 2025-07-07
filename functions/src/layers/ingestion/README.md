# Ingestion Layer

## Overview

The ingestion layer is responsible for fetching raw data from external sources and transforming it into our standardized format. This is the **first layer** in the Franklin Terminal data pipeline.

## Architecture

```
ingestion/
├── sources/           # Data source handlers
│   ├── reuters/      # Reuters API/RSS handler
│   ├── newsapi/      # NewsAPI handler
│   ├── politico/     # Politico RSS handler
│   ├── fred/         # FRED API handler
│   ├── bloomberg/    # Bloomberg RSS handler
│   ├── base-handler.js    # Base handler class
│   ├── data-schema.js     # Standardized article schema
│   └── index.js           # Source registry
└── README.md         # This file
```

## Purpose

- **Fetch**: Retrieve raw data from external APIs, RSS feeds, and other sources
- **Transform**: Convert raw data into our standardized article format
- **Validate**: Ensure data conforms to our schema before passing to next layer

## Data Flow

```
External Sources → Ingestion Layer → Processing Layer → API Layer → Storage Layer
```

## Standardized Output

All sources must output articles in the format defined in `data-schema.js`:

- Required fields: id, title, summary, content, category, source, sourceUrl, date, tags, entities, metadata, processedAt, raw
- Validation: Use `validateArticle()` function to ensure compliance
- Transformation: Use `transformToStandardFormat()` as a starting point

## Adding New Sources

1. Create a new directory in `sources/`
2. Create a `handler.js` file with skeleton structure
3. Implement `fetchRawArticles()` and `transform()` methods
4. Register the handler in `sources/index.js`
5. Add source to the standardized schema enum

## Next Layer: Processing

The ingestion layer passes standardized articles to the processing layer, which handles:

- Relevance scoring
- Content analysis
- Entity extraction
- Sentiment analysis
- User preference matching

## Development Status

- ✅ Data schema defined
- ✅ Source handlers created (skeletons)
- ✅ Base handler class
- 🔄 Source implementation (in progress)
- ⏳ Processing layer integration
