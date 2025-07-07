/**
 * Data Sources Manager (NewsAPI Only)
 *
 * Centralized interface for NewsAPI integration.
 */

const newsAPIHandler = require("./newsapi/handler");

// Source configuration
const SOURCES = {
  NEWS_API: "newsapi",
};

// Source metadata
const SOURCE_CONFIG = {
  [SOURCES.NEWS_API]: {
    name: "NewsAPI",
    handler: newsAPIHandler,
    schedule: "every 1 hour",
    rateLimit: "1000 requests/day",
    priority: 1,
  },
};

/**
 * Fetch data from NewsAPI
 * @param {Object} options - NewsAPI-specific options
 * @returns {Promise<Array>} Array of articles
 */
async function fetchFromSource(sourceName, options = {}) {
  if (sourceName !== SOURCES.NEWS_API) {
    throw new Error(`Unknown source: ${sourceName}`);
  }
  const sourceConfig = SOURCE_CONFIG[sourceName];
  try {
    console.log(`Fetching data from ${sourceConfig.name}...`);
    const articles = await sourceConfig.handler.fetch(options);
    console.log(
      `Fetched ${articles.length} articles from ${sourceConfig.name}`
    );
    return articles;
  } catch (error) {
    console.error(`Error fetching from ${sourceConfig.name}:`, error);
    throw error;
  }
}

/**
 * Fetch data from NewsAPI only
 * @param {Object} options - Options for NewsAPI
 * @returns {Promise<Object>} Object with 'newsapi' as key and articles as value
 */
async function fetchFromAllSources(options = {}) {
  const results = {};
  try {
    const sourceOptions = options[SOURCES.NEWS_API] || {};
    results[SOURCES.NEWS_API] = await fetchFromSource(
      SOURCES.NEWS_API,
      sourceOptions
    );
  } catch (error) {
    console.error(`Failed to fetch from NewsAPI:`, error);
    results[SOURCES.NEWS_API] = [];
  }
  return results;
}

/**
 * Get NewsAPI source configuration
 * @param {string} sourceName - Name of the source
 * @returns {Object} Source configuration
 */
function getSourceConfig(sourceName) {
  return SOURCE_CONFIG[sourceName];
}

/**
 * Get all source configurations (NewsAPI only)
 * @returns {Object} All source configurations
 */
function getAllSourceConfigs() {
  return SOURCE_CONFIG;
}

module.exports = {
  SOURCES,
  SOURCE_CONFIG,
  fetchFromSource,
  fetchFromAllSources,
  getSourceConfig,
  getAllSourceConfigs,
};
