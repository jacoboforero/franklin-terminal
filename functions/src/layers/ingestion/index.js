/**
 * Ingestion Layer - Main Entry Point
 *
 * This file exports the main functionality of the ingestion layer.
 * It coordinates fetching from all data sources and standardizing the output.
 */

const sources = require("./sources");
const { validateArticle } = require("./sources/data-schema");

/**
 * Fetch articles from all configured sources
 * @returns {Promise<Array>} Array of standardized articles
 */
async function fetchAllSources() {
  const allArticles = [];

  try {
    // Fetch from each source
    for (const [sourceName, handler] of Object.entries(sources)) {
      try {
        console.log(`Fetching from ${sourceName}...`);
        const rawArticles = await handler.fetchRawArticles();

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
 * Fetch articles from a specific source
 * @param {string} sourceName - Name of the source
 * @returns {Promise<Array>} Array of standardized articles
 */
async function fetchFromSource(sourceName) {
  const handler = sources[sourceName];
  if (!handler) {
    throw new Error(`Unknown source: ${sourceName}`);
  }

  const rawArticles = await handler.fetchRawArticles();
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
  fetchAllSources,
  fetchFromSource,
  getAvailableSources,
  validateSingleArticle,
  sources,
};
