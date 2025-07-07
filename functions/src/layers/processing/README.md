# Processing Layer

## Overview

The processing layer is responsible for analyzing and enriching articles from the ingestion layer. This is the **second layer** in the Franklin Terminal data pipeline.

## Architecture

```
processing/
├── relevance/        # Relevance scoring and filtering
│   ├── scorer.js     # Main relevance scoring logic
│   ├── filters.js    # Rule-based filters
│   └── ai-scorer.js  # AI-powered relevance scoring
├── analysis/         # Content analysis
│   ├── entities.js   # Named entity extraction
│   ├── sentiment.js  # Sentiment analysis
│   └── topics.js     # Topic classification
├── enrichment/       # Data enrichment
│   ├── metadata.js   # Metadata enhancement
│   ├── tags.js       # Tag generation
│   └── summaries.js  # Summary generation
├── user-matching/    # User preference matching
│   ├── preferences.js # User preference analysis
│   ├── scoring.js    # User-specific scoring
│   └── feedback.js   # User feedback learning
└── README.md         # This file
```

## Purpose

- **Relevance Scoring**: Determine how relevant articles are to user stake areas
- **Content Analysis**: Extract entities, sentiment, topics from articles
- **Data Enrichment**: Add metadata, tags, and summaries
- **User Matching**: Match articles to user preferences and stake areas

## Data Flow

```
Ingestion Layer → Processing Layer → API Layer → Storage Layer
```

## Input

- Standardized articles from ingestion layer
- User profiles and stake areas
- Historical user feedback

## Output

- Enriched articles with relevance scores
- User-specific article rankings
- Content analysis metadata

## Key Components

### Relevance Scoring

- Rule-based filters (keywords, categories, sources)
- AI-powered relevance scoring
- User preference matching
- Stake area alignment

### Content Analysis

- Named entity extraction (people, organizations, locations)
- Sentiment analysis (positive, negative, neutral)
- Topic classification
- Content summarization

### User Matching

- Stake area relevance
- Historical preference learning
- Feedback integration
- Personalized scoring

## Development Status

- ⏳ Architecture defined
- ⏳ Relevance scoring implementation
- ⏳ Content analysis implementation
- ⏳ User matching implementation
- ⏳ Integration with ingestion layer

## Next Layer: API

The processing layer passes enriched articles to the API layer, which handles:

- REST API endpoints
- Real-time data serving
- Caching and optimization
- Rate limiting
