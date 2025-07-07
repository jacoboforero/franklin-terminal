# Franklin Terminal - Data Flow Architecture

A comprehensive guide to the multi-layered data processing and relevance filtering system that powers Franklin Terminal's personalized political intelligence platform.

## Table of Contents

1. [System Overview](#system-overview)
2. [Data Flow Architecture](#data-flow-architecture)
3. [Multi-Layered Relevance Filtering](#multi-layered-relevance-filtering)
4. [User Profile Structure](#user-profile-structure)
5. [Data Sources & Integration](#data-sources--integration)
6. [Processing Pipeline](#processing-pipeline)
7. [Storage & Retrieval](#storage--retrieval)
8. [Frontend Integration](#frontend-integration)
9. [Performance & Optimization](#performance--optimization)
10. [Implementation Roadmap](#implementation-roadmap)

---

## System Overview

Franklin Terminal processes thousands of articles daily from multiple sources, filters them through a sophisticated relevance system, and delivers personalized briefings to users based on their unique stake areas and interests.

### Key Principles

- **Relevance First**: Only process and store articles that are truly relevant to users
- **Multi-Layer Filtering**: Combine rule-based and AI-powered filtering for accuracy and efficiency
- **Personalization**: Every briefing is tailored to individual user contexts
- **Real-Time Processing**: Continuous data ingestion and processing
- **Learning System**: Improve relevance based on user feedback and behavior

---

## Data Flow Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Data Sources  │───►│  Processing     │───►│   Storage &     │
│                 │    │  Pipeline       │    │   Retrieval     │
│ • Reuters API   │    │                 │    │                 │
│ • NewsAPI       │    │ • Rule-Based    │    │ • Firestore     │
│ • Politico RSS  │    │   Filtering     │    │ • Real-time     │
│ • FRED Data     │    │ • AI Scoring    │    │   Updates       │
│ • Bloomberg     │    │ • Personalization│   │ • User Context  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   Frontend      │
                       │   Integration   │
                       │                 │
                       │ • Dashboard     │
                       │ • Briefings     │
                       │ • Real-time UI  │
                       └─────────────────┘
```

---

## Multi-Layered Relevance Filtering

The system uses a sophisticated 4-layer filtering approach to ensure only relevant content reaches users.

### Layer 1: Rule-Based Pre-Filtering (Fast, Low-Cost)

**Purpose**: Quickly eliminate obviously irrelevant articles before expensive AI processing.

**Filters Applied**:

- **Geographic Relevance**: Match user's regions of interest with article geographic scope
- **Topic Relevance**: Match user's policy topics with article subject matter
- **Industry Relevance**: Match user's career industry with article industry focus
- **Investment Relevance**: Match user's investment portfolio with financial content
- **Company Relevance**: Direct mentions of user's employer or related companies

**Example**:

```javascript
// User has interest in "Technology Regulation" and works in "Technology" industry
// Article about "EU AI Act" passes both topic and industry filters
const passesFilters =
  geographicFilter(article, user) &&
  topicFilter(article, user) &&
  industryFilter(article, user);
```

### Layer 2: Content Extraction & Entity Recognition (Medium-Cost)

**Purpose**: Extract structured data from articles for more sophisticated matching.

**Extraction Types**:

- **Entities**: Companies, organizations, people, locations
- **Financial Data**: Stocks, bonds, sectors, markets
- **Policy Data**: Regulations, agencies, policy areas
- **Keywords**: Industry-specific terminology and concepts

**Example**:

```javascript
const extractedData = {
  companies: ["Apple", "Google", "Microsoft"],
  organizations: ["Federal Reserve", "EU Parliament"],
  topics: ["AI Regulation", "Climate Policy"],
  financial: ["NASDAQ", "Tech Stocks", "Bonds"],
};
```

### Layer 3: AI-Powered Relevance Scoring (High-Cost, High-Accuracy)

**Purpose**: Use AI to understand nuanced relevance and generate personalized insights.

**AI Analysis**:

- **Relevance Scoring**: 0-1 score based on user profile match
- **Stake Area Mapping**: Identify which user stake areas are affected
- **Personal Impact Assessment**: Generate personalized impact analysis
- **Confidence Scoring**: AI confidence in relevance assessment

**Example**:

```javascript
const aiAnalysis = {
  relevanceScore: 0.85,
  stakeAreas: [
    {
      area: "Investment Portfolio",
      explanation: "Fed rate cuts directly impact bond prices",
      confidence: 0.9,
    },
  ],
  personalImpact: "This affects your tech stock investments...",
  overallConfidence: 0.85,
};
```

### Layer 4: User Behavior & Feedback Learning (Continuous)

**Purpose**: Continuously improve relevance based on user interactions.

**Learning Mechanisms**:

- **Interaction Tracking**: View, dismiss, save, share actions
- **Preference Updates**: Adjust topic weights based on behavior
- **Threshold Optimization**: Fine-tune relevance thresholds
- **Pattern Recognition**: Identify successful content patterns

---

## User Profile Structure

The system uses comprehensive user profiles derived from the stakeholder assessment quiz.

### Profile Schema

```javascript
const userProfile = {
  // Basic Information
  id: "user-uuid",
  name: "string",
  profession: "string", // e.g., "Software Engineer"
  location: "string", // e.g., "San Francisco, CA, USA"

  // Investment Stake
  investments: {
    hasPortfolio: boolean,
    details: "string", // e.g., "tech stocks, bonds, real estate"
  },

  // Career Stake
  career: {
    industry: "string", // e.g., "Technology"
    company: "string", // e.g., "Google"
    role: "string", // e.g., "Senior Manager"
  },

  // Personal Stake
  personal: {
    religion: "string", // e.g., "Christianity"
    ethnicity: "string", // e.g., "Hispanic"
    nationality: "string", // e.g., "US Citizen"
  },

  // Custom Stakes
  customStakes: ["array of strings"],

  // Policy Interests
  regions: ["North America", "Europe", "Asia-Pacific"],
  topics: ["Climate Policy", "Economic Policy", "Technology Regulation"],

  // Preferences
  expertise: "Beginner|Intermediate|Advanced|Expert",
  timeAvailable: "5-10 minutes|10-20 minutes|20-30 minutes|30+ minutes",

  // Metadata
  createdAt: "timestamp",
  updatedAt: "timestamp",
  lastAssessment: "timestamp",
};
```

### Stake Area Mapping

The system maps user profiles to three primary stake areas:

1. **Investment Portfolio**: Financial investments, market exposure
2. **Career & Industry**: Professional context, industry impacts
3. **Personal Values**: Beliefs, identity, community connections

---

## Data Sources & Integration

### Primary Sources

1. **Reuters API**

   - Global news coverage
   - Structured JSON data
   - Real-time updates
   - High reliability

2. **NewsAPI**

   - Easy integration
   - Good categorization
   - Multiple languages
   - Free tier available

3. **Politico RSS Feed**

   - Political news focus
   - Structured XML
   - Policy analysis
   - Free access

4. **Federal Reserve Economic Data (FRED)**

   - Economic indicators
   - Policy announcements
   - Market data
   - Free API

5. **Bloomberg News RSS**
   - Financial news
   - Market analysis
   - Policy impacts
   - High quality

### Source Integration Strategy

```javascript
// functions/sources/sourceManager.js
const sourceManager = {
  // Scheduled fetching
  schedules: {
    reuters: "every 1 hour",
    newsAPI: "every 1 hour",
    politico: "every 2 hours",
    fred: "every 6 hours",
    bloomberg: "every 1 hour",
  },

  // Error handling and retries
  retryConfig: {
    maxRetries: 3,
    backoffMultiplier: 2,
    maxBackoff: 300000, // 5 minutes
  },

  // Rate limiting
  rateLimits: {
    reuters: "1000 requests/hour",
    newsAPI: "1000 requests/day",
    politico: "unlimited",
    fred: "120 requests/minute",
    bloomberg: "unlimited",
  },
};
```

---

## Processing Pipeline

### Article Processing Flow

```javascript
// functions/pipeline/articleProcessor.js
const articleProcessor = {
  async processArticle(article, userProfiles) {
    const results = [];

    for (const userProfile of userProfiles) {
      // Step 1: Rule-based filtering
      const passesBasicFilter = this.applyRuleBasedFilters(
        article,
        userProfile
      );
      if (!passesBasicFilter) continue;

      // Step 2: Content extraction
      const extractedData = this.extractContentData(article);

      // Step 3: AI relevance scoring
      const relevanceScore = await this.scoreArticleRelevance(
        article,
        userProfile
      );

      // Step 4: Threshold check
      if (relevanceScore.relevanceScore < 0.6) continue;

      // Step 5: Create personalized briefing
      const briefing = await this.createPersonalizedBriefing(
        article,
        userProfile,
        relevanceScore
      );

      results.push({
        userId: userProfile.id,
        briefing,
        relevanceScore: relevanceScore.relevanceScore,
      });
    }

    return results;
  },
};
```

### Data Standardization

All articles are standardized to a common format:

```javascript
const standardizedArticle = {
  id: "unique-id",
  title: "string",
  summary: "string",
  content: "string",
  category: "Economic Policy|Technology Regulation|Climate Policy|...",
  date: "ISO date",
  source: "Reuters|NewsAPI|Politico|FRED|Bloomberg",
  sourceUrl: "string",
  author: "string",
  tags: ["array of tags"],
  entities: {
    companies: ["array"],
    organizations: ["array"],
    people: ["array"],
    locations: ["array"],
  },
  metadata: {
    wordCount: number,
    readingTime: number,
    language: "string",
    sentiment: "positive|negative|neutral",
  },
};
```

---

## Storage & Retrieval

### Firestore Collections

```javascript
// Collections structure
const collections = {
  // Raw articles from sources
  "raw-articles": {
    // Raw article data before processing
  },

  // Processed briefings
  briefings: {
    // Standardized briefings with relevance scores
  },

  // User profiles
  users: {
    // User assessment data and preferences
  },

  // User interactions
  "user-interactions": {
    // Track user behavior for learning
  },

  // Processing metadata
  "processing-logs": {
    // Track processing performance and errors
  },
};
```

### Real-Time Updates

```javascript
// functions/realtime/updateManager.js
const updateManager = {
  // Listen for new briefings
  onNewBriefing: (briefing) => {
    // Notify relevant users
    // Update dashboard widgets
    // Send push notifications
  },

  // Listen for user interactions
  onUserInteraction: (interaction) => {
    // Update learning algorithms
    // Adjust user preferences
    // Optimize future recommendations
  },
};
```

---

## Frontend Integration

### Data Access Patterns

```javascript
// src/lib/services/briefings.js
export const briefingService = {
  // Get daily briefings for user
  async getDailyBriefings(userId) {
    const { getFunctions, httpsCallable } = await import('firebase/functions');
    const functions = getFunctions();
    const getBriefings = httpsCallable(functions, 'getDailyBriefings');

    const result = await getBriefings({ userId });
    return result.data;
  },

  // Real-time updates
  subscribeToBriefings(userId, callback) {
    const { onSnapshot, collection, query, where } = await import('firebase/firestore');
    const { db } = await getFirebaseServices();

    const q = query(
      collection(db, 'briefings'),
      where('userId', '==', userId),
      where('date', '>=', new Date().toISOString().split('T')[0])
    );

    return onSnapshot(q, callback);
  }
};
```

### Component Integration

```javascript
// src/routes/dashboard/+page.svelte
<script>
  import { onMount } from 'svelte';
  import { briefingService } from '$lib/services/briefings.js';

  let briefings = [];
  let loading = true;

  onMount(async () => {
    // Load initial data
    briefings = await briefingService.getDailyBriefings(userId);
    loading = false;

    // Subscribe to real-time updates
    const unsubscribe = briefingService.subscribeToBriefings(userId, (snapshot) => {
      briefings = snapshot.docs.map(doc => doc.data());
    });

    return unsubscribe;
  });
</script>
```

---

## Performance & Optimization

### Caching Strategy

```javascript
// functions/caching/cacheManager.js
const cacheManager = {
  // Cache AI analysis results
  cacheAIResults: (articleId, analysis) => {
    // Store in Redis or Firestore cache
  },

  // Cache user preferences
  cacheUserPreferences: (userId, preferences) => {
    // Store frequently accessed user data
  },

  // Cache processed articles
  cacheProcessedArticles: (articles) => {
    // Store processed results to avoid reprocessing
  },
};
```

### Batch Processing

```javascript
// functions/batch/batchProcessor.js
const batchProcessor = {
  // Process articles in batches
  async processBatch(articles, userProfiles) {
    const batchSize = 10;
    const batches = chunk(articles, batchSize);

    for (const batch of batches) {
      await Promise.all(
        batch.map((article) =>
          articleProcessor.processArticle(article, userProfiles)
        )
      );
    }
  },
};
```

### Cost Optimization

- **AI Call Batching**: Group multiple articles for single AI analysis
- **Caching**: Cache expensive AI results
- **Selective Processing**: Only process articles that pass basic filters
- **User Segmentation**: Process high-value users first

---

## Implementation Roadmap

### Phase 1: Foundation (Weeks 1-2)

- [ ] Set up Firebase Functions environment
- [ ] Implement basic rule-based filtering
- [ ] Create content extraction utilities
- [ ] Set up Firestore collections

### Phase 2: Core Processing (Weeks 3-4)

- [ ] Integrate 2-3 data sources
- [ ] Implement AI relevance scoring
- [ ] Create data standardization pipeline
- [ ] Build basic API endpoints

### Phase 3: Frontend Integration (Weeks 5-6)

- [ ] Replace mock data with real APIs
- [ ] Implement real-time updates
- [ ] Add loading states and error handling
- [ ] Create user feedback system

### Phase 4: Optimization (Weeks 7-8)

- [ ] Add remaining data sources
- [ ] Implement caching and batching
- [ ] Add analytics and monitoring
- [ ] Performance optimization

### Phase 5: Advanced Features (Weeks 9-12)

- [ ] Machine learning improvements
- [ ] Advanced personalization
- [ ] Multi-language support
- [ ] Mobile optimization

---

## Technical Stack

### Backend

- **Firebase Functions**: Serverless processing
- **Firestore**: NoSQL database
- **OpenAI/Claude**: AI analysis
- **Node.js**: Runtime environment

### Frontend

- **SvelteKit**: Framework
- **Firebase SDK**: Real-time data
- **Tailwind CSS**: Styling
- **Vite**: Build tool

### Infrastructure

- **Firebase Hosting**: Web hosting
- **Firebase Auth**: Authentication
- **Firebase Storage**: File storage
- **Cloud Functions**: Backend processing

---

## Monitoring & Analytics

### Key Metrics

- **Processing Time**: Time to process articles through pipeline
- **Relevance Accuracy**: User feedback on briefing relevance
- **User Engagement**: Time spent reading, sharing, saving
- **System Performance**: Function execution times, error rates

### Monitoring Tools

- **Firebase Analytics**: User behavior tracking
- **Cloud Functions Logs**: Processing performance
- **Custom Dashboards**: Business metrics
- **Error Tracking**: Sentry or similar

---

This architecture ensures Franklin Terminal delivers highly relevant, personalized political intelligence while maintaining performance, scalability, and cost efficiency.
