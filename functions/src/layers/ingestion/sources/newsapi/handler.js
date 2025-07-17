/**
 * NewsAPI Handler
 * Handles data retrieval from NewsAPI using optimized queries
 */

const { transformToStandardFormat } = require("../data-schema");

class NewsAPIHandler {
  constructor() {
    this.apiKey = process.env.NEWSAPI_KEY;
    this.baseUrl = "https://newsapi.org/v2";
    this.rateLimitDelay = 1000; // 1 second between requests for free tier
  }

  /**
   * Fetch articles from NewsAPI using query parameters
   * @param {Object} queryParams - NewsAPI query parameters
   * @returns {Promise<Array<Object>>} Array of raw articles
   */
  async fetchRawArticles(queryParams = {}) {
    try {
      if (!this.apiKey) {
        console.warn("NewsAPI key not found, using mock data");
        return this.getMockArticles(queryParams);
      }

      // Use 'everything' endpoint for comprehensive search
      const url = `${this.baseUrl}/everything`;

      // Prepare query parameters
      const params = this.prepareQueryParams(queryParams);

      console.log(
        "Fetching from NewsAPI with params:",
        JSON.stringify(params, null, 2)
      );

      const response = await this.makeAPIRequest(url, params);

      if (response.status === "ok" && response.articles) {
        console.log(
          `Successfully fetched ${response.articles.length} articles from NewsAPI`
        );
        return response.articles;
      } else {
        console.error("NewsAPI error:", response);
        return this.getMockArticles(queryParams);
      }
    } catch (error) {
      console.error("Error fetching from NewsAPI:", error);
      return this.getMockArticles(queryParams);
    }
  }

  /**
   * Make HTTP request to NewsAPI
   * @param {string} url - API endpoint URL
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} API response
   */
  async makeAPIRequest(url, params) {
    const queryString = new URLSearchParams(params).toString();
    const fullUrl = `${url}?${queryString}`;

    const response = await fetch(fullUrl, {
      method: "GET",
      headers: {
        "X-Api-Key": this.apiKey,
        "User-Agent": "Franklin-Terminal/1.0",
      },
    });

    if (!response.ok) {
      throw new Error(
        `NewsAPI request failed: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  }

  /**
   * Prepare query parameters for NewsAPI
   * @param {Object} queryParams - Input query parameters
   * @returns {Object} Formatted NewsAPI parameters
   */
  prepareQueryParams(queryParams) {
    const params = {
      apiKey: this.apiKey,
      language: queryParams.language || "en",
      sortBy: queryParams.sortBy || "publishedAt",
      pageSize: Math.min(queryParams.pageSize || 50, 100), // NewsAPI max is 100
    };

    // Add query string (most important parameter)
    if (queryParams.q) {
      params.q = this.optimizeQueryString(queryParams.q);
    }

    // Add domain restrictions
    if (queryParams.domains) {
      params.domains = queryParams.domains;
    }

    // Add domain exclusions
    if (queryParams.excludeDomains) {
      params.excludeDomains = queryParams.excludeDomains;
    }

    // Add date range
    if (queryParams.from) {
      params.from = queryParams.from;
    }

    if (queryParams.to) {
      params.to = queryParams.to;
    }

    // Add sources (if not using domains)
    if (queryParams.sources && !queryParams.domains) {
      params.sources = queryParams.sources;
    }

    // Add search fields restriction
    if (queryParams.searchIn) {
      params.searchIn = queryParams.searchIn;
    }

    return params;
  }

  /**
   * Optimize query string for NewsAPI
   * @param {string} query - Raw query string
   * @returns {string} Optimized query string
   */
  optimizeQueryString(query) {
    // Ensure query is within NewsAPI's 500 character limit
    if (query.length <= 500) {
      return query;
    }

    // Truncate while preserving Boolean logic
    const truncated = query.substring(0, 480);
    const lastComplete = truncated.lastIndexOf(")");

    if (lastComplete > 400) {
      return truncated.substring(0, lastComplete + 1);
    }

    return truncated;
  }

  /**
   * Fetch articles with multiple query variations
   * @param {Array} queryVariations - Array of query objects
   * @returns {Promise<Array<Object>>} Combined articles from all queries
   */
  async fetchWithMultipleQueries(queryVariations) {
    const allArticles = [];
    const seenUrls = new Set();

    for (const [index, query] of queryVariations.entries()) {
      try {
        console.log(
          `Executing query ${index + 1}/${queryVariations.length}:`,
          query.q?.substring(0, 100) + "..."
        );

        const articles = await this.fetchRawArticles(query);

        // Deduplicate articles by URL
        const uniqueArticles = articles.filter((article) => {
          if (!article.url || seenUrls.has(article.url)) {
            return false;
          }
          seenUrls.add(article.url);
          return true;
        });

        allArticles.push(...uniqueArticles);

        console.log(
          `Query ${index + 1} returned ${uniqueArticles.length} unique articles`
        );

        // Rate limiting delay
        if (index < queryVariations.length - 1) {
          await this.delay(this.rateLimitDelay);
        }
      } catch (error) {
        console.error(`Error with query ${index + 1}:`, error);
        continue;
      }
    }

    console.log(`Total unique articles fetched: ${allArticles.length}`);
    return allArticles;
  }

  /**
   * Transform raw NewsAPI data to standardized format
   * @param {Object} rawArticle - Raw NewsAPI article
   * @returns {Object} Standardized article
   */
  transform(rawArticle) {
    const standardizedData = {
      // Required fields for transformToStandardFormat
      headline: rawArticle.title || "",
      summary: rawArticle.description || "",
      content: rawArticle.content || rawArticle.description || "",
      source_name: rawArticle.source?.name || "Unknown",
      source_url: rawArticle.url || "",
      published_date: rawArticle.publishedAt || new Date().toISOString(),

      // Additional NewsAPI-specific fields
      author: rawArticle.author || "",
      url_to_image: rawArticle.urlToImage || "",

      // Category mapping
      category: this.mapToCategory(rawArticle),

      // Raw data for debugging
      raw_data: rawArticle,
    };

    return transformToStandardFormat(standardizedData, "NewsAPI");
  }

  /**
   * Map NewsAPI article to category
   * @param {Object} rawArticle - Raw NewsAPI article
   * @returns {string} Category
   */
  mapToCategory(rawArticle) {
    const title = (rawArticle.title || "").toLowerCase();
    const description = (rawArticle.description || "").toLowerCase();
    const text = `${title} ${description}`;

    // Political/policy categories
    if (
      this.containsKeywords(text, [
        "policy",
        "government",
        "congress",
        "senate",
        "politics",
        "regulation",
        "law",
      ])
    ) {
      return "Politics";
    }

    // Economic/business categories
    if (
      this.containsKeywords(text, [
        "economy",
        "business",
        "market",
        "financial",
        "economic",
        "finance",
        "earnings",
      ])
    ) {
      return "Business";
    }

    // Technology categories
    if (
      this.containsKeywords(text, [
        "technology",
        "tech",
        "ai",
        "artificial intelligence",
        "software",
        "digital",
      ])
    ) {
      return "Technology";
    }

    // Health categories
    if (
      this.containsKeywords(text, [
        "health",
        "medical",
        "healthcare",
        "drug",
        "pharmaceutical",
        "fda",
      ])
    ) {
      return "Health";
    }

    // International/world categories
    if (
      this.containsKeywords(text, [
        "international",
        "foreign",
        "global",
        "world",
        "diplomatic",
      ])
    ) {
      return "World";
    }

    return "General";
  }

  /**
   * Check if text contains any of the keywords
   * @param {string} text - Text to search
   * @param {Array} keywords - Keywords to find
   * @returns {boolean} True if any keyword found
   */
  containsKeywords(text, keywords) {
    return keywords.some((keyword) => text.includes(keyword));
  }

  /**
   * Get mock articles for testing/fallback
   * @param {Object} queryParams - Query parameters (for context)
   * @returns {Array} Mock articles
   */
  getMockArticles(queryParams) {
    console.log("Using mock NewsAPI data");

    const mockArticles = [
      {
        title: "Federal Reserve Announces New Interest Rate Policy",
        description:
          "The Federal Reserve announced a new approach to interest rate management affecting financial markets and economic policy.",
        content:
          "In a significant policy shift, the Federal Reserve today announced new guidelines for interest rate management...",
        source: { name: "Reuters" },
        url: "https://reuters.com/mock-fed-policy",
        urlToImage: null,
        publishedAt: new Date().toISOString(),
        author: "Mock Author",
      },
      {
        title: "Technology Regulation Debate Intensifies in Congress",
        description:
          "Congressional hearings on technology regulation continue as lawmakers debate new policies for major tech companies.",
        content:
          "The ongoing debate over technology regulation reached new heights today as Congress held hearings...",
        source: { name: "Politico" },
        url: "https://politico.com/mock-tech-regulation",
        urlToImage: null,
        publishedAt: new Date().toISOString(),
        author: "Mock Reporter",
      },
      {
        title: "Climate Policy Updates Affect Energy Sector",
        description:
          "New climate policy announcements are expected to have significant impacts on the energy sector and related industries.",
        content:
          "Government officials today outlined new climate policy initiatives that will affect energy companies...",
        source: { name: "Bloomberg" },
        url: "https://bloomberg.com/mock-climate-policy",
        urlToImage: null,
        publishedAt: new Date().toISOString(),
        author: "Mock Energy Reporter",
      },
    ];

    // Filter mock articles based on query if provided
    if (queryParams.q) {
      const queryLower = queryParams.q.toLowerCase();
      return mockArticles.filter(
        (article) =>
          article.title.toLowerCase().includes("policy") ||
          article.description.toLowerCase().includes("regulation") ||
          queryLower.includes("federal") ||
          queryLower.includes("technology") ||
          queryLower.includes("climate")
      );
    }

    return mockArticles;
  }

  /**
   * Delay execution for rate limiting
   * @param {number} ms - Milliseconds to delay
   * @returns {Promise} Promise that resolves after delay
   */
  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Get handler statistics
   * @returns {Object} Handler statistics
   */
  getStats() {
    return {
      handler: "NewsAPI",
      hasApiKey: !!this.apiKey,
      rateLimitDelay: this.rateLimitDelay,
      baseUrl: this.baseUrl,
    };
  }
}

module.exports = NewsAPIHandler;
