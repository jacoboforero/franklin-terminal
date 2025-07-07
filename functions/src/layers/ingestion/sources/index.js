/**
 * Data Sources Manager
 *
 * Centralized interface for all external data sources.
 * Each source has its own handler with specific API integration.
 */

const reutersHandler = require("./reuters/handler");
const newsAPIHandler = require("./newsapi/handler");
const politicoHandler = require("./politico/handler");
const fredHandler = require("./fred/handler");
const bloombergHandler = require("./bloomberg/handler");

// Source configuration
const SOURCES = {
  REUTERS: "reuters",
  NEWS_API: "newsapi",
  POLITICO: "politico",
  FRED: "fred",
  BLOOMBERG: "bloomberg",
};

// Source metadata
const SOURCE_CONFIG = {
  [SOURCES.REUTERS]: {
    name: "Reuters",
    handler: reutersHandler,
    schedule: "every 1 hour",
    rateLimit: "1000 requests/hour",
    priority: 1,
  },
  [SOURCES.NEWS_API]: {
    name: "NewsAPI",
    handler: newsAPIHandler,
    schedule: "every 1 hour",
    rateLimit: "1000 requests/day",
    priority: 2,
  },
  [SOURCES.POLITICO]: {
    name: "Politico",
    handler: politicoHandler,
    schedule: "every 2 hours",
    rateLimit: "unlimited",
    priority: 3,
  },
  [SOURCES.FRED]: {
    name: "Federal Reserve Economic Data",
    handler: fredHandler,
    schedule: "every 6 hours",
    rateLimit: "120 requests/minute",
    priority: 4,
  },
  [SOURCES.BLOOMBERG]: {
    name: "Bloomberg",
    handler: bloombergHandler,
    schedule: "every 1 hour",
    rateLimit: "unlimited",
    priority: 5,
  },
};

/**
 * Fetch data from a specific source
 * @param {string} sourceName - Name of the source
 * @param {Object} options - Source-specific options
 * @returns {Promise<Array>} Array of articles
 */
async function fetchFromSource(sourceName, options = {}) {
  const sourceConfig = SOURCE_CONFIG[sourceName];

  if (!sourceConfig) {
    throw new Error(`Unknown source: ${sourceName}`);
  }

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
 * Fetch data from all sources
 * @param {Object} options - Options for each source
 * @returns {Promise<Object>} Object with source name as key and articles as value
 */
async function fetchFromAllSources(options = {}) {
  const results = {};

  for (const [sourceName, sourceConfig] of Object.entries(SOURCE_CONFIG)) {
    try {
      const sourceOptions = options[sourceName] || {};
      results[sourceName] = await fetchFromSource(sourceName, sourceOptions);
    } catch (error) {
      console.error(`Failed to fetch from ${sourceName}:`, error);
      results[sourceName] = []; // Empty array on failure
    }
  }

  return results;
}

/**
 * Get source configuration
 * @param {string} sourceName - Name of the source
 * @returns {Object} Source configuration
 */
function getSourceConfig(sourceName) {
  return SOURCE_CONFIG[sourceName];
}

/**
 * Get all source configurations
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
