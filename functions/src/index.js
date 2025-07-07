/**
 * Franklin Terminal - Firebase Functions Entry Point
 *
 * This file serves as the main entry point for all Firebase Functions.
 * It orchestrates the layered architecture:
 *
 * User Intelligence → Ingestion Layer → Processing Layer → API Layer → Storage Layer
 */

// Import layer components
const userIntelligence = require("./layers/user-intelligence");
const ingestionLayer = require("./layers/ingestion");
const processingLayer = require("./layers/processing");
const apiLayer = require("./layers/api");
const storageLayer = require("./layers/storage");

// Firebase Functions exports
const functions = require("firebase-functions");

/**
 * Main function to process articles through the pipeline
 * This demonstrates the flow: Ingestion → Processing → Storage
 */
exports.processArticles = functions.pubsub
  .schedule("every 1 hours")
  .onRun(async (context) => {
    try {
      console.log("Starting article processing pipeline...");

      // Step 1: Ingestion Layer - Fetch articles from all sources
      const rawArticles = await ingestionLayer.fetchAllSources();
      console.log(`Fetched ${rawArticles.length} raw articles`);

      // Step 2: Processing Layer - Process and score articles
      const processedArticles = await processingLayer.processArticles(
        rawArticles
      );
      console.log(`Processed ${processedArticles.length} articles`);

      // Step 3: Storage Layer - Store processed articles
      await storageLayer.storeArticles(processedArticles);
      console.log("Articles stored successfully");

      return { success: true, articlesProcessed: processedArticles.length };
    } catch (error) {
      console.error("Error in article processing pipeline:", error);
      throw error;
    }
  });

/**
 * API endpoint to get user-specific briefings
 * This demonstrates the flow: API → Storage → Processing
 */
exports.getUserBriefing = functions.https.onCall(async (data, context) => {
  try {
    // Validate user authentication
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "User must be authenticated"
      );
    }

    const userId = context.auth.uid;

    // Step 1: API Layer - Handle request and validation
    const request = await apiLayer.validateBriefingRequest(data);

    // Step 2: Storage Layer - Get user profile and preferences
    const userProfile = await storageLayer.getUserProfile(userId);

    // Step 3: Processing Layer - Generate personalized briefing
    const briefing = await processingLayer.generateBriefing(
      userProfile,
      request
    );

    // Step 4: Storage Layer - Store briefing for history
    await storageLayer.storeBriefing(userId, briefing);

    return briefing;
  } catch (error) {
    console.error("Error generating user briefing:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Failed to generate briefing"
    );
  }
});

/**
 * Health check endpoint
 */
exports.health = functions.https.onRequest((req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    layers: {
      ingestion: "operational",
      processing: "operational",
      api: "operational",
      storage: "operational",
    },
  });
});

/**
 * Development endpoint to test individual layers
 * Only available in development environment
 */
if (process.env.NODE_ENV === "development") {
  exports.testIngestion = functions.https.onRequest(async (req, res) => {
    try {
      const articles = await ingestionLayer.fetchAllSources();
      res.json({ success: true, articles: articles.length });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  exports.testProcessing = functions.https.onRequest(async (req, res) => {
    try {
      // Mock articles for testing
      const mockArticles = [
        {
          id: "test-1",
          title: "Test Article",
          content: "Test content",
          source: "Test",
        },
      ];

      const processed = await processingLayer.processArticles(mockArticles);
      res.json({ success: true, processed: processed.length });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
}

/**
 * Main orchestration function for the entire pipeline
 * @param {Array} userProfiles - Array of user profiles from quiz
 * @returns {Object} Processed briefing data
 */
async function processBriefingPipeline(userProfiles) {
  try {
    console.log("Starting Franklin Terminal pipeline...");

    // Layer 0: User Intelligence - Generate targeted queries
    console.log("Layer 0: Processing user intelligence...");
    const userIntelligenceResult =
      await userIntelligence.processUserIntelligence(userProfiles);
    console.log(
      `Generated ${
        Object.keys(userIntelligenceResult.sourceQueries).length
      } source queries`
    );

    // Layer 1: Ingestion - Fetch data from sources
    console.log("Layer 1: Fetching data from sources...");
    const ingestionResult = await ingestionLayer.fetchFromSources(
      userIntelligenceResult.sourceQueries
    );
    console.log(
      `Fetched data from ${Object.keys(ingestionResult).length} sources`
    );

    // Layer 2: Processing - Standardize and filter content
    console.log("Layer 2: Processing and standardizing content...");
    const processingResult = await processingLayer.processContent(
      ingestionResult
    );
    console.log(`Processed ${processingResult.articles.length} articles`);

    // Layer 3: API - Serve processed data
    console.log("Layer 3: Preparing API response...");
    const apiResult = await apiLayer.prepareResponse(processingResult);
    console.log("API response prepared");

    // Layer 4: Storage - Store results
    console.log("Layer 4: Storing results...");
    const storageResult = await storageLayer.storeResults(apiResult);
    console.log("Results stored");

    return {
      success: true,
      data: apiResult,
      metrics: {
        userProfiles: userProfiles.length,
        sourceQueries: Object.keys(userIntelligenceResult.sourceQueries).length,
        articlesProcessed: processingResult.articles.length,
        efficiencyGain: userIntelligenceResult.efficiencyMetrics,
      },
    };
  } catch (error) {
    console.error("Error in briefing pipeline:", error);
    return {
      success: false,
      error: error.message,
      fallbackData: await getFallbackData(),
    };
  }
}

/**
 * Process single user briefing request
 * @param {Object} userProfile - Single user profile
 * @returns {Object} User-specific briefing data
 */
async function processSingleUserBriefing(userProfile) {
  try {
    console.log("Processing single user briefing...");

    // Layer 0: User Intelligence for single user
    const userQueries = await userIntelligence.processSingleUser(userProfile);

    // Layer 1: Fetch data for user
    const userData = await ingestionLayer.fetchFromSources(userQueries.queries);

    // Layer 2: Process user-specific content
    const processedData = await processingLayer.processContent(userData);

    // Layer 3: Prepare user response
    const userResponse = await apiLayer.prepareUserResponse(
      processedData,
      userProfile
    );

    // Layer 4: Store user-specific results
    await storageLayer.storeUserResults(userResponse, userProfile.id);

    return {
      success: true,
      data: userResponse,
      userSegment: userQueries.segment,
    };
  } catch (error) {
    console.error("Error in single user briefing:", error);
    return {
      success: false,
      error: error.message,
      fallbackData: await getFallbackData(),
    };
  }
}

/**
 * Get fallback data when pipeline fails
 * @returns {Object} Fallback briefing data
 */
async function getFallbackData() {
  return {
    briefings: [
      {
        id: "fallback-1",
        title: "System Update",
        summary: "Briefing system is being updated. Please check back later.",
        date: new Date().toISOString(),
        source: "system",
        relevance: "general",
      },
    ],
    timestamp: new Date().toISOString(),
  };
}

/**
 * Get system health and statistics
 * @returns {Object} System health information
 */
async function getSystemHealth() {
  try {
    const layerStats = {
      userIntelligence: await userIntelligence.getLayerStats(),
      ingestion: await ingestionLayer.getLayerStats(),
      processing: await processingLayer.getLayerStats(),
      api: await apiLayer.getLayerStats(),
      storage: await storageLayer.getLayerStats(),
    };

    return {
      status: "healthy",
      timestamp: new Date().toISOString(),
      layers: layerStats,
    };
  } catch (error) {
    return {
      status: "error",
      error: error.message,
      timestamp: new Date().toISOString(),
    };
  }
}

// HTTP function for processing briefings
exports.processBriefings = functions.https.onRequest(async (req, res) => {
  try {
    const { userProfiles } = req.body;

    if (!userProfiles || !Array.isArray(userProfiles)) {
      return res.status(400).json({ error: "userProfiles array required" });
    }

    const result = await processBriefingPipeline(userProfiles);
    res.json(result);
  } catch (error) {
    console.error("Function error:", error);
    res.status(500).json({ error: error.message });
  }
});

// HTTP function for single user briefing
exports.getUserBriefing = functions.https.onRequest(async (req, res) => {
  try {
    const { userProfile } = req.body;

    if (!userProfile) {
      return res.status(400).json({ error: "userProfile required" });
    }

    const result = await processSingleUserBriefing(userProfile);
    res.json(result);
  } catch (error) {
    console.error("Function error:", error);
    res.status(500).json({ error: error.message });
  }
});

// HTTP function for system health
exports.getHealth = functions.https.onRequest(async (req, res) => {
  try {
    const health = await getSystemHealth();
    res.json(health);
  } catch (error) {
    console.error("Health check error:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = {
  ingestionLayer,
  processingLayer,
  apiLayer,
  storageLayer,
  processBriefingPipeline,
  processSingleUserBriefing,
  getSystemHealth,
  getFallbackData,
};
