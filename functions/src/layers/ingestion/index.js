// ===============================
// INGESTION LAYER INDEX
// ===============================
// This file orchestrates the ingestion layer (Layer 1).
//
// This layer fetches raw data from NewsAPI using targeted queries
// from the user intelligence layer (Layer 0).

const NewsAPIHandler = require("./sources/newsapi/handler");
const { STANDARDIZED_ARTICLE_SCHEMA } = require("./sources/data-schema");

/**
 * Fetch articles from NewsAPI using targeted queries
 * @param {Object} sourceQueries - Queries from user intelligence layer
 * @returns {Promise<Array>} Array of standardized articles
 */
async function fetchFromSources(sourceQueries) {
  try {
    console.log(
      "Ingestion layer: Fetching from sources with queries:",
      Object.keys(sourceQueries)
    );

    const allArticles = [];

    // Process NewsAPI queries
    if (sourceQueries.newsapi) {
      const newsAPIArticles = await fetchFromNewsAPI(sourceQueries.newsapi);
      allArticles.push(...newsAPIArticles);
    }

    console.log(
      `Ingestion layer: Successfully fetched ${allArticles.length} total articles`
    );

    return allArticles;
  } catch (error) {
    console.error("Error in ingestion layer:", error);

    // Return fallback articles
    return await getFallbackArticles();
  }
}

/**
 * Fetch articles from NewsAPI
 * @param {Object} newsAPIQuery - NewsAPI query parameters
 * @returns {Promise<Array>} Array of standardized articles
 */
async function fetchFromNewsAPI(newsAPIQuery) {
  try {
    const handler = new NewsAPIHandler();

    console.log(
      "Fetching from NewsAPI with query:",
      JSON.stringify(newsAPIQuery, null, 2)
    );

    // Fetch raw articles using the targeted query
    const rawArticles = await handler.fetchRawArticles(newsAPIQuery);

    // Transform to standardized format
    const standardizedArticles = rawArticles
      .map((article) => {
        try {
          return handler.transform(article);
        } catch (transformError) {
          console.error("Error transforming article:", transformError);
          return null;
        }
      })
      .filter((article) => article !== null);

    console.log(`NewsAPI: Transformed ${standardizedArticles.length} articles`);

    return standardizedArticles;
  } catch (error) {
    console.error("Error fetching from NewsAPI:", error);
    return [];
  }
}

/**
 * Fetch articles using multiple query variations for comprehensive coverage
 * @param {Array} queryVariations - Array of NewsAPI queries
 * @returns {Promise<Array>} Array of standardized articles
 */
async function fetchWithMultipleQueries(queryVariations) {
  try {
    console.log(
      `Ingestion layer: Executing ${queryVariations.length} query variations`
    );

    const handler = new NewsAPIHandler();

    // Fetch raw articles using multiple queries
    const rawArticles = await handler.fetchWithMultipleQueries(queryVariations);

    // Transform to standardized format
    const standardizedArticles = rawArticles
      .map((article) => {
        try {
          return handler.transform(article);
        } catch (transformError) {
          console.error("Error transforming article:", transformError);
          return null;
        }
      })
      .filter((article) => article !== null);

    console.log(
      `Multi-query fetch: Transformed ${standardizedArticles.length} unique articles`
    );

    return standardizedArticles;
  } catch (error) {
    console.error("Error in multi-query fetch:", error);
    return await getFallbackArticles();
  }
}

/**
 * Fetch articles for a single user with targeted queries
 * @param {Object} userQueries - User-specific queries from user intelligence
 * @returns {Promise<Array>} Array of standardized articles
 */
async function fetchForSingleUser(userQueries) {
  try {
    console.log("Ingestion layer: Fetching for single user");

    const allArticles = [];

    // Process the user's specific queries
    if (userQueries.queries && userQueries.queries.newsapi) {
      const newsAPIArticles = await fetchFromNewsAPI(
        userQueries.queries.newsapi
      );
      allArticles.push(...newsAPIArticles);
    }

    console.log(`Single user fetch: Retrieved ${allArticles.length} articles`);

    // Add user context to articles
    const articlesWithContext = allArticles.map((article) => ({
      ...article,
      userSegment: userQueries.segment,
      userPreferences: userQueries.preferences,
    }));

    return articlesWithContext;
  } catch (error) {
    console.error("Error fetching for single user:", error);
    return await getFallbackArticles();
  }
}

/**
 * Get fallback articles when primary sources fail
 * @returns {Promise<Array>} Array of fallback articles
 */
async function getFallbackArticles() {
  console.log("Ingestion layer: Using fallback articles");

  const handler = new NewsAPIHandler();

  // Use basic query as fallback
  const fallbackQuery = {
    q: "policy OR regulation OR government",
    pageSize: 20,
    sortBy: "publishedAt",
    language: "en",
  };

  try {
    const rawArticles = await handler.fetchRawArticles(fallbackQuery);
    const standardizedArticles = rawArticles.map((article) =>
      handler.transform(article)
    );

    console.log(`Fallback: Retrieved ${standardizedArticles.length} articles`);
    return standardizedArticles;
  } catch (error) {
    console.error("Error in fallback articles:", error);

    // Return mock articles as last resort
    return handler
      .getMockArticles(fallbackQuery)
      .map((article) => handler.transform(article));
  }
}

/**
 * Validate articles against the standardized schema
 * @param {Array} articles - Articles to validate
 * @returns {Array} Valid articles only
 */
function validateArticles(articles) {
  const validArticles = [];

  for (const article of articles) {
    try {
      // Check required fields from STANDARDIZED_ARTICLE_SCHEMA
      const requiredFields = [
        "id",
        "title",
        "summary",
        "content",
        "category",
        "source",
        "sourceUrl",
        "date",
      ];
      const hasAllFields = requiredFields.every(
        (field) => article[field] !== undefined && article[field] !== ""
      );

      if (hasAllFields) {
        validArticles.push(article);
      } else {
        console.warn(
          "Article missing required fields:",
          article.id || "unknown"
        );
      }
    } catch (error) {
      console.error("Error validating article:", error);
    }
  }

  console.log(
    `Validation: ${validArticles.length}/${articles.length} articles passed validation`
  );
  return validArticles;
}

/**
 * Get ingestion layer statistics
 * @returns {Promise<Object>} Layer statistics
 */
async function getLayerStats() {
  try {
    const handler = new NewsAPIHandler();
    const handlerStats = handler.getStats();

    return {
      layer: "ingestion",
      sources: {
        newsapi: handlerStats,
      },
      schema: STANDARDIZED_ARTICLE_SCHEMA,
      capabilities: [
        "targeted_queries",
        "multi_query_support",
        "user_specific_fetching",
        "article_validation",
        "fallback_handling",
      ],
    };
  } catch (error) {
    console.error("Error getting ingestion stats:", error);
    return {
      layer: "ingestion",
      error: error.message,
    };
  }
}

/**
 * Test ingestion with sample queries
 * @returns {Promise<Object>} Test results
 */
async function testIngestion() {
  try {
    console.log("Testing ingestion layer...");

    // Test basic query
    const basicQuery = {
      q: "technology policy",
      pageSize: 5,
      sortBy: "publishedAt",
    };

    const articles = await fetchFromNewsAPI(basicQuery);
    const validArticles = validateArticles(articles);

    return {
      success: true,
      articlesReturned: articles.length,
      validArticles: validArticles.length,
      sampleArticle: validArticles[0] || null,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Ingestion test failed:", error);
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    };
  }
}

module.exports = {
  fetchFromSources,
  fetchFromNewsAPI,
  fetchWithMultipleQueries,
  fetchForSingleUser,
  getFallbackArticles,
  validateArticles,
  getLayerStats,
  testIngestion,

  // Export handler for testing
  NewsAPIHandler,
};
