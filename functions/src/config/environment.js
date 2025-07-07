// ===============================
// ENVIRONMENT CONFIGURATION (NewsAPI Only)
// ===============================
// This file manages all environment variables and API configurations
// for the Franklin Terminal data pipeline.

/**
 * Environment configuration for NewsAPI
 */
const ENV_CONFIG = {
  // NewsAPI Configuration
  NEWSAPI: {
    API_KEY: process.env.NEWSAPI_API_KEY,
    BASE_URL: process.env.NEWSAPI_BASE_URL || "https://newsapi.org/v2",
    RATE_LIMIT: parseInt(process.env.NEWSAPI_RATE_LIMIT) || 1000, // requests per day
    TIMEOUT: parseInt(process.env.NEWSAPI_TIMEOUT) || 30000,
    RETRY_ATTEMPTS: parseInt(process.env.NEWSAPI_RETRY_ATTEMPTS) || 3,
  },

  // General Configuration
  GENERAL: {
    NODE_ENV: process.env.NODE_ENV || "development",
    LOG_LEVEL: process.env.LOG_LEVEL || "info",
    CACHE_TTL: parseInt(process.env.CACHE_TTL) || 3600, // 1 hour
    MAX_ARTICLES_PER_SOURCE:
      parseInt(process.env.MAX_ARTICLES_PER_SOURCE) || 100,
    BATCH_SIZE: parseInt(process.env.BATCH_SIZE) || 50,
  },

  // Firebase Configuration
  FIREBASE: {
    PROJECT_ID: process.env.FIREBASE_PROJECT_ID || "si-terminal",
    DATABASE_URL: process.env.FIREBASE_DATABASE_URL,
    STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
  },
};

/**
 * Validate environment configuration
 * @returns {Object} Validation result
 */
function validateEnvironment() {
  const errors = [];
  const warnings = [];

  // Check required API keys
  const requiredKeys = [
    { source: "NEWSAPI", key: "NEWSAPI.API_KEY", required: true },
  ];

  for (const { source, key, required } of requiredKeys) {
    const config = ENV_CONFIG[source];
    if (required && !config.API_KEY) {
      errors.push(`Missing required API key: ${key}`);
    } else if (!required && !config.API_KEY) {
      warnings.push(
        `Missing optional API key: ${key} - ${source} will be disabled`
      );
    }
  }

  // Check Firebase configuration
  if (!ENV_CONFIG.FIREBASE.PROJECT_ID) {
    errors.push("Missing FIREBASE_PROJECT_ID");
  }

  // Validate rate limits
  Object.entries(ENV_CONFIG).forEach(([source, config]) => {
    if (config.RATE_LIMIT && config.RATE_LIMIT <= 0) {
      errors.push(`Invalid rate limit for ${source}: ${config.RATE_LIMIT}`);
    }
    if (config.TIMEOUT && config.TIMEOUT <= 0) {
      errors.push(`Invalid timeout for ${source}: ${config.TIMEOUT}`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    config: ENV_CONFIG,
  };
}

/**
 * Get configuration for NewsAPI
 * @param {string} sourceName - Source name (NEWSAPI)
 * @returns {Object} Source configuration
 */
function getSourceConfig(sourceName) {
  const config = ENV_CONFIG[sourceName.toUpperCase()];
  if (!config) {
    throw new Error(`Unknown source: ${sourceName}`);
  }
  return config;
}

/**
 * Check if NewsAPI is enabled (has required configuration)
 * @param {string} sourceName - Source name
 * @returns {boolean} True if source is enabled
 */
function isSourceEnabled(sourceName) {
  try {
    const config = getSourceConfig(sourceName);
    return !!config.API_KEY;
  } catch (error) {
    return false;
  }
}

/**
 * Get enabled sources
 * @returns {Array} Array of enabled source names
 */
function getEnabledSources() {
  const sources = ["NEWSAPI"];
  return sources.filter((source) => isSourceEnabled(source));
}

/**
 * Get disabled sources
 * @returns {Array} Array of disabled source names
 */
function getDisabledSources() {
  const sources = ["NEWSAPI"];
  return sources.filter((source) => !isSourceEnabled(source));
}

/**
 * Get environment summary for debugging
 * @returns {Object} Environment summary
 */
function getEnvironmentSummary() {
  const validation = validateEnvironment();

  return {
    nodeEnv: ENV_CONFIG.GENERAL.NODE_ENV,
    logLevel: ENV_CONFIG.GENERAL.LOG_LEVEL,
    enabledSources: getEnabledSources(),
    disabledSources: getDisabledSources(),
    validation,
    config: {
      GENERAL: ENV_CONFIG.GENERAL,
      FIREBASE: {
        PROJECT_ID: ENV_CONFIG.FIREBASE.PROJECT_ID,
        DATABASE_URL: ENV_CONFIG.FIREBASE.DATABASE_URL
          ? "configured"
          : "not configured",
        STORAGE_BUCKET: ENV_CONFIG.FIREBASE.STORAGE_BUCKET
          ? "configured"
          : "not configured",
      },
    },
  };
}

module.exports = {
  ENV_CONFIG,
  validateEnvironment,
  getSourceConfig,
  isSourceEnabled,
  getEnabledSources,
  getDisabledSources,
  getEnvironmentSummary,
};
