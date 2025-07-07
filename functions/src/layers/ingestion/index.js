/**
 * Ingestion Layer - Main Entry Point
 *
 * This file exports the main functionality of the ingestion layer.
 * It coordinates fetching from all data sources and standardizing the output.
 */

const sources = require("./sources");
const { validateArticle } = require("./sources/data-schema");

/**
 * Fetch articles from all configured sources using user intelligence queries
 * @param {Object} sourceQueries - Queries from user intelligence layer
 * @returns {Promise<Array>} Array of standardized articles
 */
async function fetchFromSources(sourceQueries) {
  const allArticles = [];

  try {
    // Fetch from each source using targeted queries
    for (const [sourceName, queryParams] of Object.entries(sourceQueries)) {
      const handler = sources[sourceName];
      if (!handler) {
        console.warn(`No handler found for source: ${sourceName}`);
        continue;
      }

      try {
        console.log(`Fetching from ${sourceName} with query:`, queryParams);
        const rawArticles = await handler.fetchRawArticles(queryParams);

        // Transform each raw article to standardized format
        const standardizedArticles = rawArticles
          .map((rawArticle) => {
            const standardized = handler.transform(rawArticle);

            // Validate the standardized article
            const validation = validateArticle(standardized);
            if (!validation.isValid) {
              console.warn(
                `Invalid article from ${sourceName}:`,
                validation.errors
              );
              return null;
            }

            return standardized;
          })
          .filter(Boolean); // Remove null articles

        allArticles.push(...standardizedArticles);
        console.log(
          `Successfully processed ${standardizedArticles.length} articles from ${sourceName}`
        );
      } catch (error) {
        console.error(`Error fetching from ${sourceName}:`, error);
        // Continue with other sources even if one fails
      }
    }

    console.log(`Total articles fetched: ${allArticles.length}`);
    return allArticles;
  } catch (error) {
    console.error("Error in fetchAllSources:", error);
    throw error;
  }
}

/**
 * Fetch articles from a specific source with query parameters
 * @param {string} sourceName - Name of the source
 * @param {Object} queryParams - Query parameters for the source
 * @returns {Promise<Array>} Array of standardized articles
 */
async function fetchFromSource(sourceName, queryParams = {}) {
  const handler = sources[sourceName];
  if (!handler) {
    throw new Error(`Unknown source: ${sourceName}`);
  }

  const rawArticles = await handler.fetchRawArticles(queryParams);
  return rawArticles.map((rawArticle) => handler.transform(rawArticle));
}

/**
 * Get list of available sources
 * @returns {Array} Array of source names
 */
function getAvailableSources() {
  return Object.keys(sources);
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
  sources,
};
