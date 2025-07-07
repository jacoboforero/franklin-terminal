/**
 * Base Handler for Data Sources
 *
 * Defines the interface that all source handlers must implement.
 * Each source handler extends this base class and implements
 * the required methods for their specific API.
 */

class BaseHandler {
  constructor(config = {}) {
    this.config = {
      apiKey: process.env[`${this.constructor.name.toUpperCase()}_API_KEY`],
      baseUrl: config.baseUrl,
      rateLimit: config.rateLimit,
      retryAttempts: config.retryAttempts || 3,
      timeout: config.timeout || 30000,
      ...config,
    };

    this.lastFetchTime = null;
    this.requestCount = 0;
  }

  /**
   * Fetch raw articles from the source
   * Must be implemented by each source handler
   * @param {Object} queryParams - Query parameters from user intelligence layer
   * @returns {Promise<Array>} Array of raw articles from source
   */
  async fetchRawArticles(queryParams = {}) {
    throw new Error(
      "fetchRawArticles() method must be implemented by source handler"
    );
  }

  /**
   * Transform raw article to standardized format
   * Must be implemented by each source handler
   * @param {Object} rawArticle - Raw article from source
   * @returns {Object} Standardized article
   */
  transform(rawArticle) {
    throw new Error("transform() method must be implemented by source handler");
  }

  /**
   * Transform raw article data to standardized format
   * Must be implemented by each source handler
   * @param {Object} rawArticle - Raw article from source
   * @returns {Object} Standardized article
   */
  transformArticle(rawArticle) {
    throw new Error(
      "transformArticle() method must be implemented by source handler"
    );
  }

  /**
   * Make HTTP request with error handling and retries
   * @param {string} url - Request URL
   * @param {Object} options - Request options
   * @returns {Promise<Object>} Response data
   */
  async makeRequest(url, options = {}) {
    const { default: fetch } = await import("node-fetch");

    const requestOptions = {
      method: "GET",
      headers: {
        "User-Agent": "Franklin-Terminal/1.0",
        Accept: "application/json",
        ...options.headers,
      },
      timeout: this.config.timeout,
      ...options,
    };

    let lastError;

    for (let attempt = 1; attempt <= this.config.retryAttempts; attempt++) {
      try {
        console.log(
          `Making request to ${url} (attempt ${attempt}/${this.config.retryAttempts})`
        );

        const response = await fetch(url, requestOptions);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        this.requestCount++;
        this.lastFetchTime = new Date();

        return data;
      } catch (error) {
        lastError = error;
        console.warn(`Request attempt ${attempt} failed:`, error.message);

        if (attempt < this.config.retryAttempts) {
          // Exponential backoff
          const delay = Math.pow(2, attempt) * 1000;
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    throw new Error(
      `All ${this.config.retryAttempts} request attempts failed. Last error: ${lastError.message}`
    );
  }

  /**
   * Check if rate limit has been exceeded
   * @returns {boolean} True if rate limited
   */
  isRateLimited() {
    // Basic rate limiting check - can be overridden by specific handlers
    return false;
  }

  /**
   * Get source-specific configuration
   * @returns {Object} Configuration object
   */
  getConfig() {
    return this.config;
  }

  /**
   * Get handler statistics
   * @returns {Object} Statistics object
   */
  getStats() {
    return {
      lastFetchTime: this.lastFetchTime,
      requestCount: this.requestCount,
      sourceName: this.constructor.name,
    };
  }

  /**
   * Validate required configuration
   * @throws {Error} If required config is missing
   */
  validateConfig() {
    if (!this.config.apiKey && this.requiresApiKey()) {
      throw new Error(`${this.constructor.name} requires API key`);
    }
  }

  /**
   * Check if API key is required
   * Can be overridden by specific handlers
   * @returns {boolean} True if API key is required
   */
  requiresApiKey() {
    return true;
  }

  /**
   * Get source name
   * @returns {string} Source name
   */
  getSourceName() {
    return this.constructor.name.replace("Handler", "").toLowerCase();
  }
}

module.exports = BaseHandler;
