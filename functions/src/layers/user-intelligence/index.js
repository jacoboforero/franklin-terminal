// ===============================
// USER INTELLIGENCE LAYER INDEX (NewsAPI Only)
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
 * @returns {Object} Targeted queries for NewsAPI
 */
async function processUserIntelligence(userProfiles) {
  try {
    // Step 1: Analyze individual user profiles
    const userPreferences = userProfiles.map((profile) =>
      profileAnalyzer.extractSearchablePreferences(profile)
    );

    // Step 2: Segment users for efficiency
    const segments = userSegments.segmentUsers(userProfiles);

    // Step 3: Aggregate similar preferences
    const aggregatedPreferences =
      preferenceAggregator.aggregateUserPreferences(userProfiles);

    // Step 4: Generate NewsAPI queries
    const sourceQueries = {};

    for (const [source, preferences] of Object.entries(
      aggregatedPreferences.sharedQueries
    )) {
      const cacheKey = queryCache.generateCacheKey(source, preferences);

      // Check cache first
      const cachedResult = await queryCache.getCachedResult(cacheKey);
      if (cachedResult) {
        sourceQueries[source] = cachedResult;
        continue;
      }

      // Generate new query
      const query = queryBuilder.buildSourceQueries(preferences);
      sourceQueries[source] = query;

      // Cache the query
      const ttl = queryCache.getSourceTTL(source);
      await queryCache.cacheQueryResult(cacheKey, query, ttl);
    }

    return {
      sourceQueries,
      userSegments: segments,
      efficiencyMetrics: aggregatedPreferences.efficiencyMetrics,
      cacheStats: await queryCache.getCacheStats(),
    };
  } catch (error) {
    console.error("Error in user intelligence processing:", error);

    // Return fallback queries
    return {
      sourceQueries: {
        newsapi: { category: "general", pageSize: 20 },
      },
      userSegments: { segments: { general: userProfiles } },
      efficiencyMetrics: {
        totalUsers: userProfiles.length,
        uniqueQueries: 1,
        sharedQueries: 0,
      },
      cacheStats: { totalEntries: 0, hitRate: 0 },
    };
  }
}

/**
 * Process single user profile for real-time queries
 * @param {Object} userProfile - Single user profile
 * @returns {Object} User-specific queries
 */
async function processSingleUser(userProfile) {
  try {
    // Extract user preferences
    const preferences =
      profileAnalyzer.extractSearchablePreferences(userProfile);

    // Determine user segment
    const segment = userSegments.getUserSegment(userProfile);

    // Generate queries
    const queries = queryBuilder.buildSourceQueries(preferences);

    // Apply segment-specific optimizations
    const segmentQueries = userSegments.generateSegmentQueries(
      segment,
      preferences
    );

    return {
      queries,
      segment,
      preferences,
    };
  } catch (error) {
    console.error("Error processing single user:", error);

    // Return fallback queries
    return {
      queries: {
        newsapi: { category: "general", pageSize: 10 },
      },
      segment: "general",
      preferences: {},
    };
  }
}

/**
 * Get user intelligence statistics
 * @returns {Object} Layer statistics
 */
async function getLayerStats() {
  try {
    const cacheStats = await queryCache.getCacheStats();

    return {
      layer: "user-intelligence",
      cacheStats,
      components: {
        profileAnalyzer: "active",
        queryBuilder: "active",
        preferenceAggregator: "active",
        queryCache: "active",
        userSegments: "active",
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
  getLayerStats,

  // Export individual components for testing
  profileAnalyzer,
  queryBuilder,
  preferenceAggregator,
  queryCache,
  userSegments,
};
