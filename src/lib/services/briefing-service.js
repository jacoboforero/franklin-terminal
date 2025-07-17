// ===============================
// BRIEFING SERVICE
// ===============================
// This service handles briefing operations for the Franklin Terminal app.
//
// It manages:
// - Calling the user intelligence layer
// - Fetching personalized briefings
// - Managing briefing data
// - Integration with Firebase Functions

import { getFirebaseServices } from "$lib/firebase.js";
import {
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
} from "firebase/firestore";
import {
  saveUserProfile,
  prepareProfileForIntelligence,
} from "./user-profile.js";

// Firebase Functions URLs (will be updated when deployed)
const FUNCTIONS_BASE_URL = "https://us-central1-si-terminal.cloudfunctions.net";

// Local development URL for emulator
const LOCAL_FUNCTIONS_URL = "http://localhost:5001/si-terminal/us-central1";

/**
 * Get personalized briefing for a user
 * @param {Object} userProfile - User profile
 * @returns {Promise<Object>} Personalized briefing data
 */
export async function getPersonalizedBriefing(userProfile) {
  try {
    console.log("Getting personalized briefing for user:", userProfile.id);

    // First, ensure user profile is saved
    const savedProfile = await saveUserProfile(userProfile);

    // Prepare profile for user intelligence layer
    const preparedProfile = prepareProfileForIntelligence(savedProfile);

    // Try to call Firebase Function for user intelligence processing
    // First try local emulator, then production
    let response;
    let functionsUrl = LOCAL_FUNCTIONS_URL;

    try {
      response = await fetch(`${functionsUrl}/getUserBriefing`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userProfile: preparedProfile,
        }),
      });
    } catch (localError) {
      console.log("Local emulator not available, trying production...");
      functionsUrl = FUNCTIONS_BASE_URL;
      response = await fetch(`${functionsUrl}/getUserBriefing`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userProfile: preparedProfile,
        }),
      });
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.success) {
      // Save briefing data to Firestore
      await saveBriefingData(savedProfile.id, result.data);

      return {
        success: true,
        briefing: result.data,
        userSegment: result.userSegment,
        timestamp: new Date().toISOString(),
      };
    } else {
      console.error("Briefing generation failed:", result.error);
      return {
        success: false,
        error: result.error,
        fallbackData: result.fallbackData,
      };
    }
  } catch (error) {
    console.error("Error getting personalized briefing:", error);

    // Check if it's a network error (functions not available)
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      console.log("Firebase Functions not available, using fallback data");
      return {
        success: false,
        error: "Firebase Functions not available - using demo data",
        fallbackData: getFallbackBriefing(),
      };
    }

    // Return fallback data for other errors
    return {
      success: false,
      error: error.message,
      fallbackData: getFallbackBriefing(),
    };
  }
}

/**
 * Get briefing for multiple users (batch processing)
 * @param {Array} userProfiles - Array of user profiles
 * @returns {Promise<Object>} Batch briefing results
 */
export async function getBatchBriefings(userProfiles) {
  try {
    console.log("Getting batch briefings for", userProfiles.length, "users");

    // Prepare profiles for user intelligence layer
    const preparedProfiles = userProfiles.map(prepareProfileForIntelligence);

    // Call Firebase Function for batch processing
    const response = await fetch(`${FUNCTIONS_BASE_URL}/processBriefings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userProfiles: preparedProfiles,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.success) {
      // Save batch briefing data
      await saveBatchBriefingData(result.data, userProfiles);

      return {
        success: true,
        briefings: result.data,
        metrics: result.metrics,
        timestamp: new Date().toISOString(),
      };
    } else {
      console.error("Batch briefing generation failed:", result.error);
      return {
        success: false,
        error: result.error,
        fallbackData: result.fallbackData,
      };
    }
  } catch (error) {
    console.error("Error getting batch briefings:", error);

    return {
      success: false,
      error: error.message,
      fallbackData: getFallbackBriefing(),
    };
  }
}

/**
 * Save briefing data to Firestore
 * @param {string} userId - User ID
 * @param {Object} briefingData - Briefing data
 * @returns {Promise<void>}
 */
async function saveBriefingData(userId, briefingData) {
  try {
    const { db } = await getFirebaseServices();

    const briefingRef = doc(db, "briefings", userId);
    await setDoc(briefingRef, {
      ...briefingData,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    console.log("Briefing data saved for user:", userId);
  } catch (error) {
    console.error("Error saving briefing data:", error);
    // Don't throw - briefing generation can continue without saving
  }
}

/**
 * Save batch briefing data to Firestore
 * @param {Object} briefingData - Batch briefing data
 * @param {Array} userProfiles - User profiles
 * @returns {Promise<void>}
 */
async function saveBatchBriefingData(briefingData, userProfiles) {
  try {
    const { db } = await getFirebaseServices();

    // Save batch metadata
    const batchRef = doc(db, "batchBriefings", `batch_${Date.now()}`);
    await setDoc(batchRef, {
      briefingData,
      userCount: userProfiles.length,
      createdAt: new Date().toISOString(),
    });

    console.log("Batch briefing data saved");
  } catch (error) {
    console.error("Error saving batch briefing data:", error);
    // Don't throw - batch processing can continue without saving
  }
}

/**
 * Get stored briefing for a user
 * @param {string} userId - User ID
 * @returns {Promise<Object|null>} Stored briefing or null
 */
export async function getStoredBriefing(userId) {
  try {
    const { db } = await getFirebaseServices();

    const briefingRef = doc(db, "briefings", userId);
    const briefingSnap = await getDoc(briefingRef);

    if (briefingSnap.exists()) {
      return briefingSnap.data();
    } else {
      console.log("No stored briefing found for user:", userId);
      return null;
    }
  } catch (error) {
    console.error("Error getting stored briefing:", error);
    return null;
  }
}

/**
 * Get recent briefings for a user
 * @param {string} userId - User ID
 * @param {number} limit - Number of briefings to retrieve
 * @returns {Promise<Array>} Array of recent briefings
 */
export async function getRecentBriefings(userId, limit = 10) {
  try {
    const { db } = await getFirebaseServices();

    const q = query(
      collection(db, "briefings"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc"),
      limit(limit)
    );

    const querySnapshot = await getDocs(q);
    const briefings = [];

    querySnapshot.forEach((doc) => {
      briefings.push(doc.data());
    });

    return briefings;
  } catch (error) {
    console.error("Error getting recent briefings:", error);
    return [];
  }
}

/**
 * Get system health status
 * @returns {Promise<Object>} System health information
 */
export async function getSystemHealth() {
  try {
    // Try local emulator first
    let response;
    try {
      response = await fetch(`${LOCAL_FUNCTIONS_URL}/health`);
    } catch (localError) {
      console.log("Local emulator not available, trying production...");
      response = await fetch(`${FUNCTIONS_BASE_URL}/health`);
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting system health:", error);
    return {
      status: "offline",
      error: "Firebase Functions not available",
      timestamp: new Date().toISOString(),
      message: "Running in demo mode with fallback data",
    };
  }
}

/**
 * Get fallback briefing data
 * @returns {Object} Fallback briefing data
 */
function getFallbackBriefing() {
  return {
    briefings: [
      {
        id: "demo-1",
        title: "Federal Reserve Signals Potential Rate Cuts in Q2 2024",
        summary:
          "The Federal Reserve's latest meeting minutes reveal growing consensus among policymakers for potential interest rate cuts beginning in the second quarter of 2024. This could significantly impact investment portfolios and tech sector valuations.",
        date: new Date().toISOString(),
        source: "Federal Reserve",
        relevance: "high",
        stakeAreas: ["Investment Portfolio", "Career & Industry"],
        category: "Economic Policy",
        impact: "High",
      },
      {
        id: "demo-2",
        title: "EU AI Act Implementation Timeline Announced",
        summary:
          "European Union officials have released the implementation timeline for the AI Act, with compliance requirements beginning in 2024. This will affect tech companies operating in Europe and may set global standards for AI regulation.",
        date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        source: "European Commission",
        relevance: "high",
        stakeAreas: ["Career & Industry", "Personal Values"],
        category: "Technology Regulation",
        impact: "Medium",
      },
      {
        id: "demo-3",
        title: "Climate Summit Agreement Reached on Carbon Markets",
        summary:
          "Global leaders have agreed on new carbon market mechanisms at the latest climate summit. This agreement could reshape investment strategies and corporate sustainability initiatives worldwide.",
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        source: "UN Climate Summit",
        relevance: "medium",
        stakeAreas: ["Investment Portfolio", "Personal Values"],
        category: "Environmental Policy",
        impact: "Medium",
      },
      {
        id: "demo-4",
        title: "Tech Sector Earnings Exceed Expectations",
        summary:
          "Major technology companies have reported stronger-than-expected earnings, driven by AI adoption and cloud services growth. This positive performance is boosting market sentiment and tech stock valuations.",
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
        source: "Market Reports",
        relevance: "high",
        stakeAreas: ["Investment Portfolio"],
        category: "Economic Policy",
        impact: "High",
      },
      {
        id: "demo-5",
        title: "Remote Work Policy Changes at Major Corporations",
        summary:
          "Several Fortune 500 companies have announced updated remote work policies, with many requiring partial office returns. This shift could impact real estate markets and commuting patterns.",
        date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
        source: "Corporate Announcements",
        relevance: "medium",
        stakeAreas: ["Career & Industry"],
        category: "Labor Policy",
        impact: "Medium",
      },
      {
        id: "demo-6",
        title: "Digital Currency Regulations Proposed",
        summary:
          "New regulatory framework for digital currencies has been proposed by financial authorities. This could affect cryptocurrency markets and blockchain technology adoption in traditional finance.",
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
        source: "Financial Authorities",
        relevance: "medium",
        stakeAreas: ["Investment Portfolio", "Career & Industry"],
        category: "Financial Regulation",
        impact: "Medium",
      },
    ],
    timestamp: new Date().toISOString(),
    isFallback: true,
    message: "Demo data - Firebase Functions not available",
  };
}

/**
 * Check if briefing is fresh (less than 24 hours old)
 * @param {Object} briefing - Briefing data
 * @returns {boolean} True if briefing is fresh
 */
export function isBriefingFresh(briefing) {
  if (!briefing || !briefing.timestamp) {
    return false;
  }

  const briefingTime = new Date(briefing.timestamp);
  const now = new Date();
  const hoursDiff = (now - briefingTime) / (1000 * 60 * 60);

  return hoursDiff < 24;
}

/**
 * Format briefing data for display
 * @param {Object} briefingData - Raw briefing data
 * @returns {Object} Formatted briefing data
 */
export function formatBriefingForDisplay(briefingData) {
  if (!briefingData || !briefingData.briefings) {
    return getFallbackBriefing();
  }

  return {
    ...briefingData,
    briefings: briefingData.briefings.map((briefing) => ({
      ...briefing,
      formattedDate: new Date(briefing.date).toLocaleDateString(),
      timeAgo: getTimeAgo(new Date(briefing.date)),
    })),
  };
}

/**
 * Get time ago string
 * @param {Date} date - Date to compare
 * @returns {string} Time ago string
 */
function getTimeAgo(date) {
  const now = new Date();
  const diffMs = now - date;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) {
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  } else if (diffHours > 0) {
    return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  } else {
    return "Just now";
  }
}
