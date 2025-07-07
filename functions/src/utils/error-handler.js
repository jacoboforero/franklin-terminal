// ===============================
// ERROR HANDLER UTILITIES
// ===============================
// This file provides robust error handling for the Franklin Terminal data pipeline.

/**
 * Error types for different failure scenarios
 */
const ERROR_TYPES = {
  API_ERROR: "API_ERROR",
  RATE_LIMIT_ERROR: "RATE_LIMIT_ERROR",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  TRANSFORMATION_ERROR: "TRANSFORMATION_ERROR",
  NETWORK_ERROR: "NETWORK_ERROR",
  TIMEOUT_ERROR: "TIMEOUT_ERROR",
  CONFIGURATION_ERROR: "CONFIGURATION_ERROR",
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
};

/**
 * Error severity levels
 */
const ERROR_SEVERITY = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  CRITICAL: "critical",
};

/**
 * Create a standardized error object
 * @param {string} type - Error type from ERROR_TYPES
 * @param {string} message - Error message
 * @param {string} source - Source that caused the error
 * @param {Object} details - Additional error details
 * @param {string} severity - Error severity level
 * @returns {Object} Standardized error object
 */
function createError(
  type,
  message,
  source = "unknown",
  details = {},
  severity = ERROR_SEVERITY.MEDIUM
) {
  return {
    type,
    message,
    source,
    details,
    severity,
    timestamp: new Date().toISOString(),
    stack: new Error().stack,
  };
}

/**
 * Handle API errors with retry logic
 * @param {Error} error - Original error
 * @param {string} source - Source name
 * @param {Object} config - Source configuration
 * @param {number} attempt - Current attempt number
 * @returns {Object} Standardized error object
 */
function handleApiError(error, source, config = {}, attempt = 1) {
  const { message, status, statusCode } = error;

  // Rate limiting errors
  if (status === 429 || statusCode === 429 || message.includes("rate limit")) {
    return createError(
      ERROR_TYPES.RATE_LIMIT_ERROR,
      `Rate limit exceeded for ${source}`,
      source,
      { status, attempt, retryAfter: error.headers?.["retry-after"] },
      ERROR_SEVERITY.HIGH
    );
  }

  // Timeout errors
  if (message.includes("timeout") || message.includes("ETIMEDOUT")) {
    return createError(
      ERROR_TYPES.TIMEOUT_ERROR,
      `Request timeout for ${source}`,
      source,
      { timeout: config.TIMEOUT, attempt },
      ERROR_SEVERITY.MEDIUM
    );
  }

  // Network errors
  if (message.includes("ENOTFOUND") || message.includes("ECONNREFUSED")) {
    return createError(
      ERROR_TYPES.NETWORK_ERROR,
      `Network error for ${source}`,
      source,
      { attempt },
      ERROR_SEVERITY.HIGH
    );
  }

  // API errors (4xx, 5xx)
  if (status >= 400) {
    return createError(
      ERROR_TYPES.API_ERROR,
      `API error for ${source}: ${status} ${message}`,
      source,
      { status, attempt },
      status >= 500 ? ERROR_SEVERITY.HIGH : ERROR_SEVERITY.MEDIUM
    );
  }

  // Unknown errors
  return createError(
    ERROR_TYPES.UNKNOWN_ERROR,
    `Unknown error for ${source}: ${message}`,
    source,
    { attempt },
    ERROR_SEVERITY.MEDIUM
  );
}

/**
 * Handle validation errors
 * @param {Array} errors - Validation error messages
 * @param {string} source - Source name
 * @param {string} context - Validation context
 * @returns {Object} Standardized error object
 */
function handleValidationError(errors, source, context = "data") {
  return createError(
    ERROR_TYPES.VALIDATION_ERROR,
    `Validation failed for ${source} ${context}`,
    source,
    { errors, context },
    ERROR_SEVERITY.MEDIUM
  );
}

/**
 * Handle transformation errors
 * @param {Error} error - Transformation error
 * @param {string} source - Source name
 * @param {Object} rawData - Raw data that failed transformation
 * @returns {Object} Standardized error object
 */
function handleTransformationError(error, source, rawData = {}) {
  return createError(
    ERROR_TYPES.TRANSFORMATION_ERROR,
    `Data transformation failed for ${source}`,
    source,
    {
      originalError: error.message,
      rawDataKeys: Object.keys(rawData),
      stack: error.stack,
    },
    ERROR_SEVERITY.HIGH
  );
}

/**
 * Check if error is retryable
 * @param {Object} error - Standardized error object
 * @param {number} maxAttempts - Maximum retry attempts
 * @param {number} currentAttempt - Current attempt number
 * @returns {boolean} True if error should be retried
 */
function isRetryableError(error, maxAttempts = 3, currentAttempt = 1) {
  if (currentAttempt >= maxAttempts) {
    return false;
  }

  const retryableTypes = [
    ERROR_TYPES.NETWORK_ERROR,
    ERROR_TYPES.TIMEOUT_ERROR,
    ERROR_TYPES.RATE_LIMIT_ERROR,
  ];

  const retryableStatuses = [408, 429, 500, 502, 503, 504];

  return (
    retryableTypes.includes(error.type) ||
    (error.type === ERROR_TYPES.API_ERROR &&
      retryableStatuses.includes(error.details.status))
  );
}

/**
 * Calculate retry delay with exponential backoff
 * @param {number} attempt - Current attempt number
 * @param {number} baseDelay - Base delay in milliseconds
 * @param {number} maxDelay - Maximum delay in milliseconds
 * @returns {number} Delay in milliseconds
 */
function calculateRetryDelay(attempt, baseDelay = 1000, maxDelay = 30000) {
  const delay = Math.min(baseDelay * Math.pow(2, attempt - 1), maxDelay);
  return delay + Math.random() * 1000; // Add jitter
}

/**
 * Log error with appropriate level
 * @param {Object} error - Standardized error object
 * @param {string} context - Error context
 */
function logError(error, context = "") {
  const logLevel =
    error.severity === ERROR_SEVERITY.CRITICAL
      ? "error"
      : error.severity === ERROR_SEVERITY.HIGH
      ? "warn"
      : "info";

  const logData = {
    type: error.type,
    message: error.message,
    source: error.source,
    severity: error.severity,
    timestamp: error.timestamp,
    context,
    details: error.details,
  };

  switch (logLevel) {
    case "error":
      console.error("🚨 CRITICAL ERROR:", logData);
      break;
    case "warn":
      console.warn("⚠️  HIGH SEVERITY:", logData);
      break;
    case "info":
      console.info("ℹ️  MEDIUM SEVERITY:", logData);
      break;
    default:
      console.log("📝 LOW SEVERITY:", logData);
  }
}

/**
 * Aggregate errors from multiple sources
 * @param {Array} errors - Array of error objects
 * @returns {Object} Aggregated error summary
 */
function aggregateErrors(errors) {
  const summary = {
    total: errors.length,
    byType: {},
    bySource: {},
    bySeverity: {},
    criticalErrors: [],
    retryableErrors: [],
  };

  errors.forEach((error) => {
    // Count by type
    summary.byType[error.type] = (summary.byType[error.type] || 0) + 1;

    // Count by source
    summary.bySource[error.source] = (summary.bySource[error.source] || 0) + 1;

    // Count by severity
    summary.bySeverity[error.severity] =
      (summary.bySeverity[error.severity] || 0) + 1;

    // Track critical errors
    if (error.severity === ERROR_SEVERITY.CRITICAL) {
      summary.criticalErrors.push(error);
    }

    // Track retryable errors
    if (isRetryableError(error)) {
      summary.retryableErrors.push(error);
    }
  });

  return summary;
}

/**
 * Create fallback data when errors occur
 * @param {Array} errors - Array of errors
 * @param {string} source - Source name
 * @returns {Object} Fallback data
 */
function createFallbackData(errors, source) {
  return {
    id: `fallback-${source}-${Date.now()}`,
    title: `System Update - ${source}`,
    summary: `Temporary issue with ${source} data. Please check back later.`,
    content: `We're experiencing technical difficulties with ${source}. Our team is working to resolve this issue.`,
    category: "General Policy",
    source: source,
    sourceUrl: "",
    date: new Date().toISOString(),
    tags: ["system", "fallback"],
    entities: { companies: [], organizations: [], people: [], locations: [] },
    metadata: {
      wordCount: 50,
      readingTime: 1,
      language: "en",
      sentiment: "neutral",
    },
    processedAt: new Date().toISOString(),
    raw: { error: true, source, errors },
    isFallback: true,
  };
}

module.exports = {
  ERROR_TYPES,
  ERROR_SEVERITY,
  createError,
  handleApiError,
  handleValidationError,
  handleTransformationError,
  isRetryableError,
  calculateRetryDelay,
  logError,
  aggregateErrors,
  createFallbackData,
};
