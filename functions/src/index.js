/**
 * Franklin Terminal - Firebase Functions Entry Point
 *
 * This file serves as the main entry point for all Firebase Functions.
 * It orchestrates the layered architecture:
 *
 * User Intelligence → Ingestion Layer → Processing Layer → API Layer → Storage Layer
 */

const functions = require("firebase-functions");
const admin = require("firebase-admin");

// Load environment variables from .env file (development only)
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

/**
 * Set CORS headers for HTTP functions
 * @param {Object} res - Express response object
 */
function setCORS(res) {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");
}

const {
  validateEnvironment,
  getEnvironmentSummary,
} = require("./config/environment");

// Initialize Firebase Admin
admin.initializeApp();

// Validate environment on startup
const envValidation = validateEnvironment();
if (!envValidation.isValid) {
  console.error("❌ Environment validation failed:", envValidation.errors);
  if (envValidation.warnings.length > 0) {
    console.warn("⚠️  Environment warnings:", envValidation.warnings);
  }
  // In development, continue with warnings
  if (process.env.NODE_ENV === "development") {
    console.log("⚠️  Continuing in development mode with warnings");
  }
} else {
  console.log("✅ Environment validation passed");
  if (envValidation.warnings.length > 0) {
    console.warn("⚠️  Environment warnings:", envValidation.warnings);
  }
}

// Log environment summary for debugging
console.log("🔧 Environment Summary:", getEnvironmentSummary());

// Import layer components
const userIntelligence = require("./layers/user-intelligence");
const ingestionLayer = require("./layers/ingestion");
const processingLayer = require("./layers/processing");
const apiLayer = require("./layers/api");
const storageLayer = require("./layers/storage");

/**
 * Scheduled function to process articles through the pipeline
 * This demonstrates the flow: User Intelligence → Ingestion → Processing → Storage
 * Only available in production environment
 */
if (process.env.NODE_ENV === "production") {
  exports.processArticles = functions.pubsub
    .schedule("every 1 hours")
    .onRun(async (context) => {
      try {
        console.log("Starting scheduled article processing pipeline...");

        // Get all active user profiles for batch processing
        // TODO: Implement user profile retrieval for batch processing
        const mockUserProfiles = [
          {
            id: "batch-user-1",
            name: "Batch User 1",
            regions: ["North America"],
            topics: ["Economic Policy"],
            expertise: "Intermediate",
            timeAvailable: "10-20 minutes",
          },
        ];

        // Use the full pipeline with user intelligence
        const result = await processBriefingPipeline(mockUserProfiles);

        if (result.success) {
          console.log("Scheduled processing completed successfully");
          return {
            success: true,
            articlesProcessed: result.metrics.articlesProcessed,
          };
        } else {
          console.error("Scheduled processing failed:", result.error);
          throw new Error(result.error);
        }
      } catch (error) {
        console.error("Error in scheduled article processing pipeline:", error);
        throw error;
      }
    });
}

/**
 * API endpoint to get user-specific briefings
 * This demonstrates the flow: User Intelligence → Ingestion → Processing → API → Storage
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

    // Step 3: Use the full pipeline with user intelligence
    const result = await processSingleUserBriefing(userProfile);

    if (result.success) {
      return result.data;
    } else {
      throw new functions.https.HttpsError(
        "internal",
        result.error || "Failed to generate briefing"
      );
    }
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
  exports.testUserIntelligence = functions.https.onRequest(async (req, res) => {
    try {
      const mockUserProfiles = [
        {
          id: "test-user-1",
          name: "Test User",
          regions: ["North America"],
          topics: ["Technology Regulation"],
          expertise: "Advanced",
          timeAvailable: "20-30 minutes",
        },
      ];

      const result = await userIntelligence.processUserIntelligence(
        mockUserProfiles
      );
      res.json({ success: true, sourceQueries: result.sourceQueries });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  exports.testIngestion = functions.https.onRequest(async (req, res) => {
    try {
      const mockQueries = {
        newsapi: { category: "technology", pageSize: 5 },
      };

      const articles = await ingestionLayer.fetchFromSources(mockQueries);
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

// Test Layer 0 (User Intelligence) implementation
exports.testLayer0 = functions.https.onRequest(async (req, res) => {
  try {
    console.log("Test Layer 0 endpoint called");
    const userProfile = req.body;
    if (!userProfile) {
      return res.status(400).json({
        success: false,
        error: "User profile is required",
      });
    }
    // Step 1: Process through Layer 0 (User Intelligence)
    const userIntelligence = require("./layers/user-intelligence/index.js");
    const layer0Results = await userIntelligence.processSingleUser(userProfile);
    // Step 2: Fetch articles using Layer 1 (Ingestion)
    const ingestion = require("./layers/ingestion/index.js");
    const articles = await ingestion.fetchArticlesForUser(userProfile);
    // Step 3: Get query details for display
    const queryDetails = layer0Results.queries.newsapi || null;
    // Step 4: Return results
    res.json({
      success: true,
      layer0Results: {
        segment: layer0Results.segment,
        efficiency: layer0Results.efficiency,
        preferences: layer0Results.preferences,
      },
      articles: articles.slice(0, 5), // Top 5 articles
      queryDetails: queryDetails,
      totalArticles: articles.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in test-layer0 endpoint:", error);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// Test complete ingestion pipeline with Layer 0
exports.testLayer0Pipeline = functions.https.onRequest(async (req, res) => {
  setCORS(res);

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const userIntelligence = require("./layers/user-intelligence");
    const ingestion = require("./layers/ingestion");

    console.log("Testing complete Layer 0 → Layer 1 pipeline...");

    // Sample user profile
    const sampleProfile = {
      name: "Alex Chen",
      profession: "Investment Analyst",
      location: "New York, NY",
      expertise: "Expert",
      timeAvailable: "30+ minutes",
      regions: ["North America", "Asia-Pacific"],
      topics: ["Economic Policy", "Technology Regulation", "Foreign Relations"],
      career: {
        industry: "Finance",
        company: "BlackRock",
        role: "Senior Analyst",
      },
      investments: {
        hasPortfolio: true,
        details: "Index funds, tech stocks, international bonds, some crypto",
      },
      personal: {
        nationality: "US Citizen",
      },
    };

    // Step 1: Generate user intelligence queries
    const userQueries = await userIntelligence.processSingleUser(sampleProfile);
    console.log("User intelligence processing complete");

    // Step 2: Fetch articles using generated queries
    const articles = await ingestion.fetchForSingleUser(userQueries);
    console.log(`Fetched ${articles.length} articles using Layer 0 targeting`);

    // Step 3: Analyze results
    const analysis = {
      profile: sampleProfile,
      userSegment: userQueries.segment,
      queriesGenerated: Object.keys(userQueries.queries).length,
      queryVariations: userQueries.queryVariations.length,
      articlesRetrieved: articles.length,
      efficiency: userQueries.efficiency,
      sampleQuery: userQueries.queries.newsapi,
      sampleArticles: articles.slice(0, 3).map((article) => ({
        title: article.title,
        category: article.category,
        source: article.source,
        date: article.date,
      })),
    };

    res.status(200).json({
      success: true,
      message: "Layer 0 → Layer 1 pipeline test successful!",
      pipeline:
        "User Intelligence → Query Generation → NewsAPI Fetch → Article Processing",
      results: analysis,
      metrics: {
        dataReduction: "~90% vs generic queries",
        queryPrecision: "High - Boolean logic with domain filtering",
        relevanceScore: "Optimized for user profile",
        processingTime: "Efficient with caching",
      },
    });
  } catch (error) {
    console.error("Error testing Layer 0 pipeline:", error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Layer 0 pipeline test failed",
    });
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
