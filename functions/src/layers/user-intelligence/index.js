// ===============================
// USER INTELLIGENCE LAYER INDEX (Layer 0) - COMPLETE IMPLEMENTATION
// ===============================
// This file orchestrates the user intelligence layer (Layer 0).
//
// This layer analyzes user profiles and generates targeted queries
// for NewsAPI to ensure we only fetch relevant content.

const profileAnalyzer = require("./profile-analyzer");
const queryBuilder = require("./query-builder");
const preferenceAggregator = require("./preference-aggregator");
const queryCache = require("./query-cache");
const userSegments = require("./user-segments");

/**
 * Main function to process user profiles and generate targeted queries
 * @param {Array} userProfiles - Array of user profiles from quiz
 * @returns {Object} Targeted queries for NewsAPI with efficiency metrics
 */
async function processUserIntelligence(userProfiles) {
  try {
    console.log(
      `User Intelligence: Processing ${userProfiles.length} user profiles`
    );

    // Step 1: Analyze individual user profiles
    const userPreferences = userProfiles.map((profile) => {
      console.log(`Analyzing profile for user: ${profile.name || "Anonymous"}`);
      return profileAnalyzer.extractSearchablePreferences(profile);
    });

    // Step 2: Segment users for efficiency
    const segments = userSegments.segmentUsers(userProfiles);
    console.log(
      `User segmentation: ${
        Object.keys(segments.segments).length
      } segments created`
    );

    // Step 3: Aggregate similar preferences
    const aggregatedPreferences =
      preferenceAggregator.aggregateUserPreferences(userProfiles);
    console.log(
      `Preference aggregation: ${aggregatedPreferences.efficiencyMetrics.uniqueQueries} unique queries generated`
    );

    // Step 4: Generate NewsAPI queries with advanced targeting
    const sourceQueries = {};

    for (const [source, preferences] of Object.entries(
      aggregatedPreferences.sharedQueries
    )) {
      const cacheKey = queryCache.generateCacheKey(source, preferences);

      // Check cache first
      const cachedResult = await queryCache.getCachedResult(cacheKey);
      if (cachedResult) {
        sourceQueries[source] = cachedResult;
        console.log(`Using cached query for ${source}`);
        continue;
      }

      // Generate new optimized query using query builder
      const queryResult = queryBuilder.buildSourceQueries(preferences);
      sourceQueries[source] = queryResult[source]; // Extract the source-specific query

      // Cache the query with appropriate TTL
      const ttl = queryCache.getSourceTTL(source);
      await queryCache.cacheQueryResult(cacheKey, queryResult[source], ttl);
      console.log(`Generated and cached new query for ${source}`);
    }

    // Generate efficiency metrics
    const efficiencyMetrics = calculateEfficiencyMetrics(
      userProfiles,
      sourceQueries
    );

    return {
      sourceQueries,
      userSegments: segments,
      efficiencyMetrics,
      cacheStats: await queryCache.getCacheStats(),
      queryBreakdown: generateQueryBreakdown(sourceQueries),
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error in user intelligence processing:", error);

    // Return fallback queries
    return {
      sourceQueries: {
        newsapi: {
          q: "politics OR policy OR regulation OR government",
          pageSize: 20,
          sortBy: "publishedAt",
          language: "en",
        },
      },
      userSegments: { segments: { general: userProfiles } },
      efficiencyMetrics: {
        totalUsers: userProfiles.length,
        uniqueQueries: 1,
        sharedQueries: 0,
        efficiencyGain: 0,
        dataReduction: 0,
      },
      cacheStats: { totalEntries: 0, hitRate: 0 },
      error: error.message,
    };
  }
}

/**
 * Process single user profile for real-time queries with complete optimization
 * @param {Object} userProfile - Single user profile
 * @returns {Object} User-specific queries with detailed breakdown
 */
async function processSingleUser(userProfile) {
  try {
    console.log(`Processing single user: ${userProfile.name || "Anonymous"}`);

    // Extract comprehensive user preferences
    const preferences =
      profileAnalyzer.extractSearchablePreferences(userProfile);
    console.log(
      `Extracted preferences: ${preferences.keywordSets.length} keyword sets`
    );

    // Determine user segment for optimization
    const segment = userSegments.getUserSegment(userProfile);
    console.log(`User segment: ${segment}`);

    // Generate optimized queries using query builder
    const queryResult = queryBuilder.buildSourceQueries(preferences);
    console.log(
      `Generated optimized queries for ${
        Object.keys(queryResult).length
      } sources`
    );

    // Generate multiple query variations for comprehensive coverage
    const queryVariations = queryBuilder.generateQueryVariations(preferences);
    console.log(`Generated ${queryVariations.length} query variations`);

    return {
      queries: queryResult,
      queryVariations: queryVariations,
      segment: segment,
      preferences: preferences,
      optimizedQuery: queryBuilder.buildSegmentQuery(segment, preferences),
      efficiency: {
        keywordSets: preferences.keywordSets.length,
        totalKeywords: preferences.keywordSets.reduce(
          (sum, set) => sum + set.keywords.length,
          0
        ),
        queryComplexity: calculateQueryComplexity(queryResult),
        estimatedArticles: estimateArticleCount(preferences),
      },
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error processing single user:", error);

    // Return fallback queries
    return {
      queries: {
        newsapi: {
          q: "news OR politics",
          pageSize: 10,
          sortBy: "publishedAt",
          language: "en",
        },
      },
      segment: "general",
      preferences: {},
      error: error.message,
    };
  }
}

/**
 * Calculate efficiency metrics for the user intelligence system
 * @param {Array} userProfiles - Original user profiles
 * @param {Object} sourceQueries - Generated queries
 * @returns {Object} Efficiency metrics
 */
function calculateEfficiencyMetrics(userProfiles, sourceQueries) {
  const totalUsers = userProfiles.length;
  const uniqueQueries = Object.keys(sourceQueries).length;

  // Without user intelligence: would need to fetch ALL articles
  // With user intelligence: fetch only targeted articles
  const estimatedDataReduction = Math.min(
    90,
    ((totalUsers - uniqueQueries) / totalUsers) * 100
  );

  return {
    totalUsers,
    uniqueQueries,
    sharedQueries: Math.max(0, totalUsers - uniqueQueries),
    efficiencyGain: Math.round(estimatedDataReduction),
    dataReduction: Math.round(estimatedDataReduction),
    queryOptimization: "advanced_boolean_logic",
    targetingAccuracy: "high",
  };
}

/**
 * Generate query breakdown for analysis
 * @param {Object} sourceQueries - Generated queries
 * @returns {Object} Query breakdown
 */
function generateQueryBreakdown(sourceQueries) {
  const breakdown = {};

  for (const [source, query] of Object.entries(sourceQueries)) {
    breakdown[source] = {
      queryLength: query.q ? query.q.length : 0,
      keywordCount: query.q ? (query.q.match(/\w+/g) || []).length : 0,
      hasBoolean: query.q
        ? /(\sAND\s|\sOR\s|\sNOT\s|[+\-])/.test(query.q)
        : false,
      hasDomains: !!query.domains,
      hasDateRange: !!(query.from || query.to),
      pageSize: query.pageSize || 0,
      sortBy: query.sortBy || "default",
    };
  }

  return breakdown;
}

/**
 * Calculate query complexity score
 * @param {Object} queries - Query object
 * @returns {string} Complexity level
 */
function calculateQueryComplexity(queries) {
  let complexity = 0;

  for (const query of Object.values(queries)) {
    if (query.q) {
      complexity += query.q.length > 100 ? 3 : query.q.length > 50 ? 2 : 1;
      complexity += /(\sAND\s|\sOR\s|\sNOT\s)/.test(query.q) ? 2 : 0;
      complexity += query.domains ? 1 : 0;
      complexity += query.from || query.to ? 1 : 0;
    }
  }

  if (complexity > 8) return "high";
  if (complexity > 4) return "medium";
  return "low";
}

/**
 * Estimate article count based on preferences
 * @param {Object} preferences - User preferences
 * @returns {number} Estimated article count
 */
function estimateArticleCount(preferences) {
  let baseCount = preferences.pageSize || 50;

  // Adjust based on keyword specificity
  const keywordCount = preferences.keywordSets.reduce(
    (sum, set) => sum + set.keywords.length,
    0
  );
  if (keywordCount > 20) baseCount *= 0.7; // More specific = fewer results
  if (keywordCount < 5) baseCount *= 1.3; // Less specific = more results

  // Adjust based on domains
  if (preferences.domains && preferences.domains.length > 0) {
    baseCount *= 0.8; // Domain restriction reduces results
  }

  return Math.round(baseCount);
}

/**
 * Demonstrate Layer 0 capabilities with sample user profile
 * @returns {Promise<Object>} Demonstration results
 */
async function demonstrateLayer0() {
  console.log("=== LAYER 0 DEMONSTRATION ===");

  // Sample user profile representing a typical user
  const sampleProfile = {
    name: "Sarah Thompson",
    profession: "Software Engineer",
    location: "San Francisco, CA",
    expertise: "Advanced",
    timeAvailable: "20-30 minutes",
    regions: ["North America", "Europe"],
    topics: ["Technology Regulation", "Economic Policy", "Climate Policy"],
    career: {
      industry: "Technology",
      company: "Google",
      role: "Senior Engineer",
    },
    investments: {
      hasPortfolio: true,
      details: "Tech stocks, index funds, some crypto",
    },
    personal: {
      nationality: "US Citizen",
    },
  };

  try {
    console.log("Processing sample user profile...");
    const result = await processSingleUser(sampleProfile);

    console.log("=== RESULTS ===");
    console.log(`User Segment: ${result.segment}`);
    console.log(`Query Variations: ${result.queryVariations.length}`);
    console.log(`Keyword Sets: ${result.preferences.keywordSets.length}`);
    console.log(`Query Complexity: ${result.efficiency.queryComplexity}`);
    console.log(`Estimated Articles: ${result.efficiency.estimatedArticles}`);

    // Show generated query
    if (result.queries.newsapi) {
      console.log("\n=== GENERATED NEWSAPI QUERY ===");
      console.log("Query:", result.queries.newsapi.q);
      console.log("Domains:", result.queries.newsapi.domains);
      console.log("Page Size:", result.queries.newsapi.pageSize);
      console.log("Sort By:", result.queries.newsapi.sortBy);
    }

    return {
      success: true,
      sampleProfile,
      results: result,
      demonstration: "complete",
    };
  } catch (error) {
    console.error("Demonstration failed:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Get comprehensive user intelligence statistics
 * @returns {Promise<Object>} Layer statistics
 */
async function getLayerStats() {
  try {
    const cacheStats = await queryCache.getCacheStats();

    return {
      layer: "user-intelligence",
      status: "fully_implemented",
      capabilities: [
        "profile_analysis",
        "keyword_generation",
        "query_optimization",
        "user_segmentation",
        "preference_aggregation",
        "query_caching",
        "boolean_search_logic",
        "domain_targeting",
        "efficiency_optimization",
      ],
      cacheStats,
      components: {
        profileAnalyzer: "fully_implemented",
        queryBuilder: "fully_implemented",
        preferenceAggregator: "active",
        queryCache: "active",
        userSegments: "active",
      },
      efficiency: {
        dataReduction: "up_to_90_percent",
        queryOptimization: "advanced",
        targeting: "precise",
      },
    };
  } catch (error) {
    console.error("Error getting layer stats:", error);
    return {
      layer: "user-intelligence",
      error: error.message,
    };
  }
}

module.exports = {
  processUserIntelligence,
  processSingleUser,
  demonstrateLayer0,
  getLayerStats,
  calculateEfficiencyMetrics,
  generateQueryBreakdown,

  // Export individual components for testing
  profileAnalyzer,
  queryBuilder,
  preferenceAggregator,
  queryCache,
  userSegments,
};
