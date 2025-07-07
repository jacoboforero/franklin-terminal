# User Intelligence Layer (Layer 0)

## Overview

The user intelligence layer analyzes user profiles and generates targeted queries for data sources. This is the **zeroth layer** that sits before ingestion to ensure we only fetch relevant content.

## Purpose

- **User Profile Analysis**: Extract searchable preferences from user profiles
- **Query Generation**: Create source-specific queries based on user interests
- **Preference Aggregation**: Combine similar user preferences for efficiency
- **Query Optimization**: Cache and optimize queries to reduce API calls

## Architecture

```
user-intelligence/
├── profile-analyzer.js    # Extract searchable preferences from user profiles
├── query-builder.js       # Generate source-specific queries
├── preference-aggregator.js # Combine similar user preferences
├── query-cache.js         # Cache query results
├── user-segments.js       # User segmentation logic
└── README.md              # This file
```

## Input: User Profile Schema

```javascript
{
  id: "user-uuid",
  name: "string",
  profession: "string",
  location: "string",
  investments: { hasPortfolio: boolean, details: "string" },
  career: { industry: "string", company: "string", role: "string" },
  personal: { religion: "string", ethnicity: "string", nationality: "string" },
  customStakes: ["array of strings"],
  regions: ["North America", "Europe", "Asia-Pacific", ...],
  topics: ["Climate Policy", "Economic Policy", "Technology Regulation", ...],
  expertise: "Beginner|Intermediate|Advanced|Expert",
  timeAvailable: "5-10 minutes|10-20 minutes|20-30 minutes|30+ minutes"
}
```

## Output: Source Queries

```javascript
{
  reuters: { category: "technology", keywords: ["AI", "regulation"] },
  newsapi: { category: "technology", q: "artificial intelligence regulation" },
  politico: { feeds: ["technology-policy"] },
  fred: { series: ["NASDAQ", "AI_INDEX"] },
  bloomberg: { sector: "technology", keywords: ["AI", "regulation"] }
}
```

## Key Components

### Profile Analyzer

- Extract keywords from user stake areas
- Map user interests to source categories
- Identify geographic scope
- Determine investment interests

### Query Builder

- Generate source-specific query parameters
- Handle different source capabilities
- Create fallback queries for limited sources
- Optimize query complexity

### Preference Aggregator

- Group users with similar preferences
- Create shared queries for efficiency
- Maintain user-specific customization
- Balance personalization vs efficiency

### Query Cache

- Cache query results to avoid duplicate fetches
- Implement TTL based on source update frequency
- Handle cache invalidation
- Provide fallback content

## Data Flow

```
User Profiles → Profile Analysis → Query Generation → Ingestion Layer
                                    ↓
                                Query Cache ←→ All Sources
```

## Benefits

- **90% Efficiency Gain**: Only fetch relevant content
- **User-Focused**: Content tailored to individual preferences
- **Scalable**: System scales with user preferences, not total content
- **Cost-Effective**: Fewer API calls, less storage, less processing

## Next Layer: Ingestion

The user intelligence layer passes targeted queries to the ingestion layer, which fetches only relevant content from each source.
