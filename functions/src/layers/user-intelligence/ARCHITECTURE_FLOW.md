# User Intelligence → Ingestion Layer Flow

## Complete Data Flow

```
User Profile → User Intelligence → Ingestion → Processing → API → Storage
     ↓              ↓                ↓           ↓         ↓       ↓
Quiz Results → Query Generation → API Calls → Analysis → Response → Database
```

## Detailed Flow Breakdown

### 1. User Intelligence Layer (Layer 0)

**Input**: User profile from quiz

```javascript
{
  name: "John Doe",
  profession: "Software Engineer",
  regions: ["North America", "Europe"],
  topics: ["Technology Regulation", "Economic Policy"],
  expertise: "Advanced",
  timeAvailable: "20-30 minutes"
}
```

**Output**: Source-specific query parameters

```javascript
{
  reuters: { category: "technology", keywords: ["AI", "regulation"], limit: 50 },
  newsapi: { q: "artificial intelligence regulation", category: "technology", pageSize: 50 },
  politico: { feeds: ["technology-policy"], keywords: ["AI"], limit: 50 },
  fred: { series: ["NASDAQ", "AI_INDEX"], limit: 10 },
  bloomberg: { sector: "technology", keywords: ["AI", "regulation"], limit: 50 }
}
```

### 2. Ingestion Layer (Layer 1)

**Input**: Query parameters from User Intelligence
**Process**: Each handler receives its specific query parameters

#### Reuters Handler Example:

```javascript
// User Intelligence sends:
{ category: "technology", keywords: ["AI", "regulation"], limit: 50 }

// Reuters handler receives and uses:
async fetchRawArticles(queryParams) {
  const { category, keywords, limit } = queryParams;

  // Build Reuters-specific API call
  const url = `https://api.reuters.com/news?category=${category}&keywords=${keywords.join(',')}&limit=${limit}`;

  // Make actual API call
  const response = await this.makeRequest(url);

  // Return raw Reuters data
  return response.articles;
}
```

#### NewsAPI Handler Example:

```javascript
// User Intelligence sends:
{ q: "artificial intelligence regulation", category: "technology", pageSize: 50 }

// NewsAPI handler receives and uses:
async fetchRawArticles(queryParams) {
  const { q, category, pageSize } = queryParams;

  // Build NewsAPI-specific API call
  const url = `https://newsapi.org/v2/top-headlines?q=${q}&category=${category}&pageSize=${pageSize}`;

  // Make actual API call
  const response = await this.makeRequest(url);

  // Return raw NewsAPI data
  return response.articles;
}
```

### 3. Key Points

1. **Query Builder Functions** (`buildReutersQuery()`, etc.) are **NOT** API calls

   - They only generate query parameters
   - They don't make any network requests
   - They're pure functions that transform user preferences into source-specific queries

2. **Source Handlers** (`reuters/handler.js`, etc.) are **WHERE** the actual API calls happen

   - They receive query parameters from User Intelligence
   - They use those parameters to make targeted API calls
   - They transform raw API responses into standardized format

3. **Efficiency Gain**:
   - Without User Intelligence: Fetch ALL articles from ALL sources (inefficient)
   - With User Intelligence: Fetch only relevant articles using targeted queries (90% more efficient)

## Example Implementation Flow

```javascript
// 1. User Intelligence Layer
const userPreferences =
  profileAnalyzer.extractSearchablePreferences(userProfile);
const sourceQueries = queryBuilder.buildSourceQueries(userPreferences);
// Returns: { reuters: { category: "tech", keywords: ["AI"] }, ... }

// 2. Ingestion Layer
const ingestionResult = await ingestion.fetchFromSources(sourceQueries);
// This calls each handler with their specific query parameters

// 3. Each Handler
// Reuters handler receives: { category: "tech", keywords: ["AI"] }
// Makes API call: GET https://api.reuters.com/news?category=tech&keywords=AI
// Returns: Raw Reuters articles

// 4. Processing Layer
// Receives standardized articles from all sources
// Applies relevance scoring, content analysis, etc.
```

## Benefits of This Architecture

1. **Separation of Concerns**: Query generation vs. API execution
2. **Efficiency**: Only fetch relevant content
3. **Scalability**: Easy to add new sources
4. **Maintainability**: Each layer has a single responsibility
5. **Testing**: Can test query generation separately from API calls
