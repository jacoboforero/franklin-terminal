# User Intelligence → Ingestion Layer Flow (NewsAPI Only)

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

**Output**: NewsAPI query parameters

```javascript
{
  q: "artificial intelligence regulation",
  category: "technology",
  language: "en",
  country: "us",
  pageSize: 50
}
```

### 2. Ingestion Layer (Layer 1)

**Input**: Query parameters from User Intelligence
**Process**: NewsAPI handler receives query parameters

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

1. **Query Builder Functions** (`buildNewsAPIQuery()`) are **NOT** API calls

   - They only generate query parameters
   - They don't make any network requests
   - They're pure functions that transform user preferences into NewsAPI-specific queries

2. **Source Handlers** (`newsapi/handler.js`) are **WHERE** the actual API calls happen

   - They receive query parameters from User Intelligence
   - They use those parameters to make targeted API calls
   - They transform raw API responses into standardized format

3. **Efficiency Gain**:
   - Without User Intelligence: Fetch ALL articles from NewsAPI (inefficient)
   - With User Intelligence: Fetch only relevant articles using targeted queries (90% more efficient)

## Example Implementation Flow

```javascript
// 1. User Intelligence Layer
const userPreferences =
  profileAnalyzer.extractSearchablePreferences(userProfile);
const sourceQueries = queryBuilder.buildSourceQueries(userPreferences);
// Returns: { q: "AI regulation", category: "technology", pageSize: 50 }

// 2. Ingestion Layer
const ingestionResult = await ingestion.fetchFromSources(sourceQueries);
// This calls NewsAPI handler with specific query parameters

// 3. NewsAPI Handler
// Receives: { q: "AI regulation", category: "technology", pageSize: 50 }
// Makes API call: GET https://newsapi.org/v2/top-headlines?q=AI%20regulation&category=technology&pageSize=50
// Returns: Raw NewsAPI articles

// 4. Processing Layer
// Receives standardized articles from NewsAPI
// Applies relevance scoring, content analysis, etc.
```

## Benefits of This Architecture

1. **Separation of Concerns**: Query generation vs. API execution
2. **Efficiency**: Only fetch relevant content
3. **Scalability**: Easy to add new sources in the future
4. **Maintainability**: Each layer has a single responsibility
5. **Testing**: Can test query generation separately from API calls
