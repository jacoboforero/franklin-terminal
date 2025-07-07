/**
 * Ingestion Layer - NewsAPI Only
 *
 * This file exports the main functionality of the ingestion layer.
 * It coordinates fetching from NewsAPI and standardizing the output.
 */

const NewsAPIHandler = require("./sources/newsapi/handler");
const { validateArticle } = require("./sources/data-schema");

const newsapi = new NewsAPIHandler();

/**
 * Fetch articles from NewsAPI using user intelligence queries
 * @param {Object} queryParams - Query for NewsAPI
 * @returns {Promise<Array>} Array of standardized articles
 */
async function fetchFromSources(queryParams) {
  try {
    console.log("Fetching from NewsAPI with query:", queryParams);
    const rawArticles = await newsapi.fetchRawArticles(queryParams);
    const standardizedArticles = rawArticles
      .map((rawArticle) => {
        const standardized = newsapi.transform(rawArticle);
        const validation = validateArticle(standardized);
        if (!validation.isValid) {
          console.warn("Invalid article from NewsAPI:", validation.errors);
          return null;
        }
        return standardized;
      })
      .filter(Boolean);
    console.log(
      `Successfully processed ${standardizedArticles.length} articles from NewsAPI`
    );
    return standardizedArticles;
  } catch (error) {
    console.error("Error fetching from NewsAPI:", error);
    throw error;
  }
}

/**
 * Fetch articles from NewsAPI with query parameters
 * @param {Object} queryParams - Query parameters for NewsAPI
 * @returns {Promise<Array>} Array of standardized articles
 */
async function fetchFromSource(queryParams = {}) {
  const rawArticles = await newsapi.fetchRawArticles(queryParams);
  return rawArticles.map((rawArticle) => newsapi.transform(rawArticle));
}

/**
 * Get list of available sources (NewsAPI only)
 * @returns {Array} Array with 'newsapi'
 */
function getAvailableSources() {
  return ["newsapi"];
}

/**
 * Validate a single article
 * @param {Object} article - Article to validate
 * @returns {Object} Validation result
 */
function validateSingleArticle(article) {
  return validateArticle(article);
}

module.exports = {
  fetchFromSources,
  fetchFromSource,
  getAvailableSources,
  validateSingleArticle,
  newsapi,
};
