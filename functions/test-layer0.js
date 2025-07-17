/**
 * Layer 0 Test Script
 * Tests the User Intelligence layer functionality
 */

// Load environment variables
require("dotenv").config();

// Import Layer 0 modules
const userIntelligence = require("./src/layers/user-intelligence/index.js");
const profileAnalyzer = require("./src/layers/user-intelligence/profile-analyzer.js");
const queryBuilder = require("./src/layers/user-intelligence/query-builder.js");

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
    {
      name: "Family in healthcare industry",
      description:
        "Relatives working in hospitals affected by healthcare policy",
      addedAt: new Date().toISOString(),
    },
  ],
  regions: ["North America", "Europe", "Asia-Pacific"],
  topics: ["Technology Regulation", "Economic Policy", "Climate Policy"],
  expertise: "Advanced",
  timeAvailable: "20-30 minutes",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

async function runTests() {
  console.log("🧪 Testing Layer 0 - User Intelligence");
  console.log("=====================================\n");

  // Test 1: Profile Analysis
  console.log("📊 Test 1: Profile Analysis");
  console.log("----------------------------");
  try {
    const preferences =
      profileAnalyzer.extractSearchablePreferences(testUserProfile);
    console.log("✅ Profile analysis successful");
    console.log("User Segment:", preferences.userSegment);
    console.log("Expertise Level:", preferences.expertiseLevel);
    console.log("Time Available:", preferences.timeAvailable);
    console.log("Regions:", preferences.regions);
    console.log("Policy Topics:", preferences.policyTopics);
    console.log("Has Investments:", preferences.hasInvestments);
    console.log("Industry:", preferences.industry);
    console.log("Company:", preferences.company);
    console.log("Custom Stakes Count:", preferences.customStakes?.length || 0);
    console.log("");
  } catch (error) {
    console.error("❌ Profile analysis failed:", error.message);
  }

  // Test 2: Keyword Generation
  console.log("🔍 Test 2: Keyword Generation");
  console.log("------------------------------");
  try {
    const keywordSets = profileAnalyzer.generateKeywordSets(testUserProfile);
    console.log("✅ Keyword generation successful");
    console.log(`Generated ${keywordSets.length} keyword sets:`);

    keywordSets.forEach((set, index) => {
      console.log(
        `  ${index + 1}. ${set.type} (${set.priority} priority, weight: ${
          set.weight
        })`
      );
      console.log(
        `     Keywords: ${set.keywords.slice(0, 5).join(", ")}${
          set.keywords.length > 5 ? "..." : ""
        }`
      );
    });
    console.log("");
  } catch (error) {
    console.error("❌ Keyword generation failed:", error.message);
  }

  // Test 3: Query Building
  console.log("🔧 Test 3: Query Building");
  console.log("--------------------------");
  try {
    const preferences =
      profileAnalyzer.extractSearchablePreferences(testUserProfile);
    const queries = queryBuilder.buildSourceQueries(preferences);
    console.log("✅ Query building successful");
    console.log(
      `Generated queries for sources: ${Object.keys(queries).join(", ")}`
    );
    Object.entries(queries).forEach(([source, query], index) => {
      console.log(`  ${index + 1}. Source: ${source}`);
      console.log(`     Query: "${query.q}"`);
      console.log(`     Domains: ${query.domains}`);
      console.log(`     Page Size: ${query.pageSize}`);
      console.log(`     Sort By: ${query.sortBy}`);
      console.log("");
    });
  } catch (error) {
    console.error("❌ Query building failed:", error.message);
  }

  // Test 4: Full Layer 0 Pipeline
  console.log("🚀 Test 4: Full Layer 0 Pipeline");
  console.log("---------------------------------");
  try {
    const result = await userIntelligence.processSingleUser(testUserProfile);
    console.log("✅ Full pipeline successful");
    console.log("User Segment:", result.segment);
    console.log("Generated Queries:", Object.keys(result.queries).length);
    console.log("Efficiency:", result.efficiency);
    console.log("");
  } catch (error) {
    console.error("❌ Full pipeline failed:", error.message);
  }

  // Test 5: Demonstration
  console.log("🎯 Test 5: Layer 0 Demonstration");
  console.log("---------------------------------");
  try {
    const demo = await userIntelligence.demonstrateLayer0();
    if (demo.success) {
      console.log("✅ Demonstration successful");
      console.log("Sample Queries Generated:");
      Object.entries(demo.results.queries).forEach(([source, query], index) => {
        console.log(`  ${index + 1}. [${source}] \"${query.q}\"`);
      });
      console.log("");
      console.log("Efficiency Gains:");
      console.log(demo.results.efficiency);
      console.log("");
    } else {
      console.error("❌ Demonstration failed:", demo.error);
    }
  } catch (error) {
    console.error("❌ Demonstration failed:", error.message);
  }

  console.log("✅ Layer 0 testing completed!");
  console.log("\nTo test with real API calls, run:");
  console.log("node test-layer0-with-api.js");
}

runTests();
