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

    // Call Firebase Function for user intelligence processing
    const response = await fetch(`${FUNCTIONS_BASE_URL}/getUserBriefing`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userProfile: preparedProfile,
      }),
    });

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

    // Return fallback data
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
    const response = await fetch(`${FUNCTIONS_BASE_URL}/getHealth`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting system health:", error);
    return {
      status: "error",
      error: error.message,
      timestamp: new Date().toISOString(),
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
        id: "fallback-1",
        title: "Welcome to Franklin Terminal",
        summary:
          "Your personalized political intelligence platform is being set up. Check back soon for your first briefing.",
        date: new Date().toISOString(),
        source: "system",
        relevance: "general",
        stakeAreas: ["general"],
      },
      {
        id: "fallback-2",
        title: "System Status",
        summary:
          "Our AI is learning your preferences. Your first personalized briefing will be available shortly.",
        date: new Date().toISOString(),
        source: "system",
        relevance: "general",
        stakeAreas: ["general"],
      },
    ],
    timestamp: new Date().toISOString(),
    isFallback: true,
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
