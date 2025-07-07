/**
 * Franklin Terminal - Firebase Functions Entry Point
 *
 * This file serves as the main entry point for all Firebase Functions.
 * It orchestrates the layered architecture:
 *
 * Ingestion Layer → Processing Layer → API Layer → Storage Layer
 */

// Import layer components
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

module.exports = {
  ingestionLayer,
  processingLayer,
  apiLayer,
  storageLayer,
};
