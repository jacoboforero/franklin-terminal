/**
 * Layer 0 Test Script with Real API Calls
 * Tests the complete pipeline from user profile to actual articles
 */

// Load environment variables
require("dotenv").config();

// Import modules
const userIntelligence = require("./src/layers/user-intelligence/index.js");
const ingestion = require("./src/layers/ingestion/index.js");

// Test user profile
const testUserProfile = {
  id: "test-user-123",
  name: "John Doe",
  profession: "Software Engineer",
  location: "San Francisco, CA",
  investments: {
    hasPortfolio: true,
    details: "Tech stocks, index funds, crypto",
  },
  career: {
    industry: "Technology",
    company: "Google",
    role: "Senior Software Engineer",
  },
  personal: {
    religion: "Not specified",
    ethnicity: "Not specified",
    nationality: "US",
  },
  customStakes: [
    {
      name: "Real estate holdings in coastal areas",
      description: "Property investments vulnerable to climate policy",
      addedAt: new Date().toISOString(),
    },
  ],
  regions: ["North America", "Europe"],
  topics: ["Technology Regulation", "Economic Policy"],
  expertise: "Advanced",
  timeAvailable: "20-30 minutes",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

console.log("🚀 Testing Layer 0 with Real API Calls");
console.log("=====================================\n");

async function testCompletePipeline() {
  try {
    // Step 1: Process user profile through Layer 0
    console.log("📊 Step 1: Processing User Profile (Layer 0)");
    console.log("---------------------------------------------");

    const layer0Result = userIntelligence.processUserProfile(testUserProfile);
    console.log("✅ Layer 0 processing successful");
    console.log("User Segment:", layer0Result.userSegment);
    console.log("Generated Queries:", layer0Result.queries.length);
    console.log("Efficiency Metrics:", layer0Result.efficiencyMetrics);
    console.log("");

    // Step 2: Fetch articles using generated queries
    console.log("📰 Step 2: Fetching Articles (Layer 1)");
    console.log("----------------------------------------");

    const articles = await ingestion.fetchArticlesForUser(testUserProfile);
    console.log("✅ Article fetching successful");
    console.log("Total Articles Fetched:", articles.length);
    console.log("");

    // Step 3: Display sample articles
    console.log("📋 Step 3: Sample Articles");
    console.log("---------------------------");

    if (articles.length > 0) {
      articles.slice(0, 3).forEach((article, index) => {
        console.log(`${index + 1}. ${article.title}`);
        console.log(`   Source: ${article.source}`);
        console.log(`   Published: ${article.publishedAt}`);
        console.log(`   Relevance: ${article.relevanceScore || "N/A"}`);
        console.log(`   URL: ${article.url}`);
        console.log("");
      });
    } else {
      console.log("No articles fetched. This might be due to:");
      console.log("- API rate limiting");
      console.log("- No matching articles found");
      console.log("- API key issues");
      console.log("");
    }

    // Step 4: Test specific queries
    console.log("🔍 Step 4: Testing Specific Queries");
    console.log("------------------------------------");

    const testQueries = [
      "artificial intelligence regulation",
      "tech policy",
      "Google antitrust",
    ];

    for (const query of testQueries) {
      console.log(`Testing query: "${query}"`);
      try {
        const queryArticles = await ingestion.fetchArticlesByQuery(query, {
          pageSize: 5,
          language: "en",
          sortBy: "relevancy",
        });
        console.log(`  ✅ Found ${queryArticles.length} articles`);
        if (queryArticles.length > 0) {
          console.log(`  📰 Sample: ${queryArticles[0].title}`);
        }
      } catch (error) {
        console.log(`  ❌ Error: ${error.message}`);
      }
      console.log("");
    }

    console.log("✅ Complete pipeline testing finished!");
  } catch (error) {
    console.error("❌ Pipeline testing failed:", error.message);
    console.error("Stack trace:", error.stack);
  }
}

// Run the test
testCompletePipeline();
