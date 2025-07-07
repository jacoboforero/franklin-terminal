/**
 * Standardized Data Schema for Franklin Terminal
 *
 * This file defines the exact structure of articles that will be stored
 * in Firestore and used throughout the application. All source handlers
 * must transform their data to match this schema.
 */

/**
 * Standardized Article Schema
 *
 * This is the format that ALL source handlers must output.
 * Every field is required unless marked as optional.
 */
const STANDARDIZED_ARTICLE_SCHEMA = {
  // Unique identifier for the article
  id: {
    type: "string",
    required: true,
    description: "Unique identifier in format: source-{unique-id}",
    example: ["reuters-abc123", "newsapi-def456"],
  },

  // Basic article information
  title: {
    type: "string",
    required: true,
    description: "Article headline/title",
    maxLength: 500,
  },

  summary: {
    type: "string",
    required: true,
    description: "Brief summary or excerpt of the article",
    maxLength: 1000,
  },

  content: {
    type: "string",
    required: true,
    description: "Full article content (can be HTML or plain text)",
    maxLength: 50000,
  },

  // Categorization
  category: {
    type: "string",
    required: true,
    description: "Primary category from our standardized list",
    enum: [
      "Economic Policy",
      "Political Policy",
      "Technology Regulation",
      "Climate Policy",
      "Healthcare Policy",
      "Education Policy",
      "Immigration Policy",
      "Defense Policy",
      "Foreign Relations",
      "General Policy",
    ],
  },

  // Source information
  source: {
    type: "string",
    required: true,
    description: "Source name",
    enum: ["Reuters", "NewsAPI", "Politico", "FRED", "Bloomberg"],
  },

  sourceUrl: {
    type: "string",
    required: true,
    description: "Original article URL",
    format: "url",
  },

  // Metadata
  date: {
    type: "string",
    required: true,
    description: "Publication date in ISO format",
    format: "ISO 8601",
  },

  author: {
    type: "string",
    required: false,
    description: "Article author name",
    default: null,
  },

  // Content analysis
  tags: {
    type: "array",
    required: true,
    description: "Array of relevant tags/keywords",
    items: { type: "string" },
    minItems: 1,
    maxItems: 20,
  },

  // Extracted entities
  entities: {
    type: "object",
    required: true,
    description: "Named entities extracted from the article",
    properties: {
      companies: {
        type: "array",
        description: "Company names mentioned",
        items: { type: "string" },
        default: [],
      },
      organizations: {
        type: "array",
        description: "Government agencies, institutions, etc.",
        items: { type: "string" },
        default: [],
      },
      people: {
        type: "array",
        description: "Person names mentioned",
        items: { type: "string" },
        default: [],
      },
      locations: {
        type: "array",
        description: "Geographic locations mentioned",
        items: { type: "string" },
        default: [],
      },
    },
  },

  // Article metadata
  metadata: {
    type: "object",
    required: true,
    description: "Additional article metadata",
    properties: {
      wordCount: {
        type: "number",
        required: true,
        description: "Estimated word count",
        minimum: 1,
      },
      readingTime: {
        type: "number",
        required: true,
        description: "Estimated reading time in minutes",
        minimum: 1,
      },
      language: {
        type: "string",
        required: true,
        description: "Article language code",
        default: "en",
        enum: ["en", "es", "fr", "de", "zh", "ja"],
      },
      sentiment: {
        type: "string",
        required: true,
        description: "Article sentiment analysis",
        enum: ["positive", "negative", "neutral"],
        default: "neutral",
      },
    },
  },

  // Processing metadata
  processedAt: {
    type: "string",
    required: true,
    description: "When this article was processed by our system",
    format: "ISO 8601",
  },

  // Original source data (for debugging)
  raw: {
    type: "object",
    required: true,
    description: "Original data from source (for debugging and reference)",
    additionalProperties: true,
  },
};

/**
 * Example of a properly formatted article
 */
const EXAMPLE_ARTICLE = {
  id: "reuters-abc123def456",
  title: "Federal Reserve Signals Potential Rate Cuts in Q2 2024",
  summary:
    "The Federal Reserve's latest meeting minutes reveal growing consensus among policymakers for potential interest rate cuts beginning in the second quarter of 2024.",
  content:
    "The Federal Reserve's latest meeting minutes reveal growing consensus among policymakers for potential interest rate cuts beginning in the second quarter of 2024, citing improved inflation metrics and economic stability indicators...",
  category: "Economic Policy",
  source: "Reuters",
  sourceUrl: "https://www.reuters.com/article/fed-rate-cuts-2024",
  date: "2024-01-15T10:30:00Z",
  author: "John Smith",
  tags: [
    "federal reserve",
    "interest rates",
    "monetary policy",
    "inflation",
    "economic policy",
  ],
  entities: {
    companies: [],
    organizations: ["Federal Reserve", "FOMC"],
    people: ["Jerome Powell"],
    locations: ["United States", "Washington"],
  },
  metadata: {
    wordCount: 850,
    readingTime: 4,
    language: "en",
    sentiment: "neutral",
  },
  processedAt: "2024-01-15T11:00:00Z",
  raw: {
    // Original Reuters data would go here
    originalId: "12345",
    originalCategory: "business",
    // ... other original fields
  },
};

/**
 * Validation function to ensure articles match our schema
 * @param {Object} article - Article to validate
 * @returns {Object} Validation result with isValid and errors
 */
function validateArticle(article) {
  const errors = [];
  const warnings = [];

  // Check if article is an object
  if (!article || typeof article !== "object") {
    errors.push("Article must be an object");
    return { isValid: false, errors, warnings };
  }

  // Check required fields
  const requiredFields = [
    "id",
    "title",
    "summary",
    "content",
    "category",
    "source",
    "sourceUrl",
    "date",
    "tags",
    "entities",
    "metadata",
    "processedAt",
    "raw",
  ];

  for (const field of requiredFields) {
    if (!article[field]) {
      errors.push(`Missing required field: ${field}`);
    }
  }

  // Validate category
  const validCategories = [
    "Economic Policy",
    "Political Policy",
    "Technology Regulation",
    "Climate Policy",
    "Healthcare Policy",
    "Education Policy",
    "Immigration Policy",
    "Defense Policy",
    "Foreign Relations",
    "General Policy",
  ];

  if (article.category && !validCategories.includes(article.category)) {
    errors.push(`Invalid category: ${article.category}`);
  }

  // Validate source
  const validSources = ["Reuters", "NewsAPI", "Politico", "FRED", "Bloomberg"];
  if (article.source && !validSources.includes(article.source)) {
    errors.push(`Invalid source: ${article.source}`);
  }

  // Validate entities structure
  if (article.entities) {
    const requiredEntityFields = [
      "companies",
      "organizations",
      "people",
      "locations",
    ];
    for (const field of requiredEntityFields) {
      if (!Array.isArray(article.entities[field])) {
        errors.push(`entities.${field} must be an array`);
      }
    }
  }

  // Validate metadata structure
  if (article.metadata) {
    const requiredMetadataFields = [
      "wordCount",
      "readingTime",
      "language",
      "sentiment",
    ];
    for (const field of requiredMetadataFields) {
      if (!article.metadata[field]) {
        errors.push(`metadata.${field} is required`);
      }
    }

    // Validate sentiment
    const validSentiments = ["positive", "negative", "neutral"];
    if (
      article.metadata.sentiment &&
      !validSentiments.includes(article.metadata.sentiment)
    ) {
      errors.push(`Invalid sentiment: ${article.metadata.sentiment}`);
    }
  }

  // Additional validations
  if (article.title && article.title.length > 500) {
    warnings.push("Title exceeds recommended length of 500 characters");
  }

  if (article.summary && article.summary.length > 1000) {
    warnings.push("Summary exceeds recommended length of 1000 characters");
  }

  if (article.content && article.content.length > 50000) {
    warnings.push("Content exceeds recommended length of 50000 characters");
  }

  if (article.sourceUrl && !isValidUrl(article.sourceUrl)) {
    warnings.push("Source URL may not be valid");
  }

  if (article.date && !isValidDate(article.date)) {
    warnings.push("Date format may not be valid ISO 8601");
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Check if URL is valid
 * @param {string} url - URL to validate
 * @returns {boolean} True if valid URL
 */
function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if date is valid ISO 8601
 * @param {string} date - Date string to validate
 * @returns {boolean} True if valid date
 */
function isValidDate(date) {
  try {
    const parsed = new Date(date);
    return !isNaN(parsed.getTime());
  } catch {
    return false;
  }
}

/**
 * Transform any raw article data to our standardized format
 * @param {Object} rawArticle - Raw article from any source
 * @param {string} source - Source name
 * @returns {Object} Standardized article
 */
function transformToStandardFormat(rawArticle, source) {
  // This is a template - each handler will implement its own transformation
  return {
    id: `placeholder-${Date.now()}`,
    title: rawArticle.title || "Untitled",
    summary: rawArticle.summary || rawArticle.description || "",
    content: rawArticle.content || rawArticle.body || "",
    category: "General Policy", // Will be mapped by handler
    source: source,
    sourceUrl: rawArticle.url || rawArticle.link || "",
    date: rawArticle.date || rawArticle.publishedAt || new Date().toISOString(),
    author: rawArticle.author || null,
    tags: rawArticle.tags || [],
    entities: {
      companies: rawArticle.entities?.companies || [],
      organizations: rawArticle.entities?.organizations || [],
      people: rawArticle.entities?.people || [],
      locations: rawArticle.entities?.locations || [],
    },
    metadata: {
      wordCount: rawArticle.wordCount || 0,
      readingTime: rawArticle.readingTime || 1,
      language: rawArticle.language || "en",
      sentiment: rawArticle.sentiment || "neutral",
    },
    processedAt: new Date().toISOString(),
    raw: rawArticle,
  };
}

module.exports = {
  STANDARDIZED_ARTICLE_SCHEMA,
  EXAMPLE_ARTICLE,
  validateArticle,
  transformToStandardFormat,
  isValidUrl,
  isValidDate,
};
