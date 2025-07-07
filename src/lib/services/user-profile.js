// ===============================
// USER PROFILE SERVICE
// ===============================
// This service handles user profile operations for the Franklin Terminal app.
//
// It manages:
// - Saving quiz results to Firebase
// - Retrieving user profiles
// - Updating user preferences
// - Integration with the user intelligence layer

import { getFirebaseServices } from "$lib/firebase.js";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

/**
 * Save user profile from quiz completion
 * @param {Object} userProfile - User profile data from quiz
 * @returns {Promise<Object>} Saved profile with ID
 */
export async function saveUserProfile(userProfile) {
  try {
    const { db } = await getFirebaseServices();

    // Generate unique ID if not provided
    if (!userProfile.id) {
      userProfile.id = `user_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;
    }

    // Add metadata
    const profileWithMetadata = {
      ...userProfile,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: "1.0",
      status: "active",
    };

    // Save to Firestore
    const userRef = doc(db, "userProfiles", userProfile.id);
    await setDoc(userRef, profileWithMetadata);

    console.log("User profile saved successfully:", userProfile.id);
    return profileWithMetadata;
  } catch (error) {
    console.error("Error saving user profile:", error);
    throw new Error(`Failed to save user profile: ${error.message}`);
  }
}

/**
 * Get user profile by ID
 * @param {string} userId - User ID
 * @returns {Promise<Object|null>} User profile or null if not found
 */
export async function getUserProfile(userId) {
  try {
    const { db } = await getFirebaseServices();

    const userRef = doc(db, "userProfiles", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userSnap.data();
    } else {
      console.log("User profile not found:", userId);
      return null;
    }
  } catch (error) {
    console.error("Error getting user profile:", error);
    throw new Error(`Failed to get user profile: ${error.message}`);
  }
}

/**
 * Update user profile preferences
 * @param {string} userId - User ID
 * @param {Object} updates - Profile updates
 * @returns {Promise<Object>} Updated profile
 */
export async function updateUserProfile(userId, updates) {
  try {
    const { db } = await getFirebaseServices();

    const userRef = doc(db, "userProfiles", userId);

    const updateData = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await updateDoc(userRef, updateData);

    console.log("User profile updated successfully:", userId);

    // Return updated profile
    return await getUserProfile(userId);
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw new Error(`Failed to update user profile: ${error.message}`);
  }
}

/**
 * Get all user profiles for batch processing
 * @param {Object} filters - Optional filters
 * @returns {Promise<Array>} Array of user profiles
 */
export async function getAllUserProfiles(filters = {}) {
  try {
    const { db } = await getFirebaseServices();

    let q = collection(db, "userProfiles");

    // Apply filters
    if (filters.status) {
      q = query(q, where("status", "==", filters.status));
    }

    if (filters.createdAfter) {
      q = query(q, where("createdAt", ">=", filters.createdAfter));
    }

    const querySnapshot = await getDocs(q);
    const profiles = [];

    querySnapshot.forEach((doc) => {
      profiles.push(doc.data());
    });

    console.log(`Retrieved ${profiles.length} user profiles`);
    return profiles;
  } catch (error) {
    console.error("Error getting all user profiles:", error);
    throw new Error(`Failed to get user profiles: ${error.message}`);
  }
}

/**
 * Get user profiles for specific segment
 * @param {string} segment - User segment (investors, professionals, etc.)
 * @returns {Promise<Array>} Array of user profiles in segment
 */
export async function getUserProfilesBySegment(segment) {
  try {
    const { db } = await getFirebaseServices();

    const q = query(
      collection(db, "userProfiles"),
      where("status", "==", "active")
    );

    const querySnapshot = await getDocs(q);
    const profiles = [];

    querySnapshot.forEach((doc) => {
      const profile = doc.data();
      // TODO: Implement segment detection logic
      // For now, return all active profiles
      profiles.push(profile);
    });

    console.log(
      `Retrieved ${profiles.length} profiles for segment: ${segment}`
    );
    return profiles;
  } catch (error) {
    console.error("Error getting user profiles by segment:", error);
    throw new Error(`Failed to get user profiles by segment: ${error.message}`);
  }
}

/**
 * Delete user profile
 * @param {string} userId - User ID
 * @returns {Promise<void>}
 */
export async function deleteUserProfile(userId) {
  try {
    const { db } = await getFirebaseServices();

    const userRef = doc(db, "userProfiles", userId);
    await setDoc(
      userRef,
      { status: "deleted", deletedAt: new Date().toISOString() },
      { merge: true }
    );

    console.log("User profile deleted successfully:", userId);
  } catch (error) {
    console.error("Error deleting user profile:", error);
    throw new Error(`Failed to delete user profile: ${error.message}`);
  }
}

/**
 * Validate user profile data
 * @param {Object} userProfile - User profile to validate
 * @returns {Object} Validation result
 */
export function validateUserProfile(userProfile) {
  const errors = [];
  const warnings = [];

  // Required fields
  if (!userProfile.name) {
    errors.push("Name is required");
  }

  if (!userProfile.profession) {
    errors.push("Profession is required");
  }

  // Optional but recommended fields
  if (!userProfile.regions || userProfile.regions.length === 0) {
    warnings.push("No regions of interest selected");
  }

  if (!userProfile.topics || userProfile.topics.length === 0) {
    warnings.push("No policy topics selected");
  }

  if (!userProfile.expertise) {
    warnings.push("Expertise level not specified");
  }

  if (!userProfile.timeAvailable) {
    warnings.push("Time availability not specified");
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Prepare user profile for user intelligence layer
 * @param {Object} userProfile - Raw user profile
 * @returns {Object} Profile formatted for user intelligence processing
 */
export function prepareProfileForIntelligence(userProfile) {
  return {
    id: userProfile.id,
    name: userProfile.name,
    profession: userProfile.profession,
    location: userProfile.location,
    investments: userProfile.investments || {
      hasPortfolio: false,
      details: "",
    },
    career: userProfile.career || { industry: "", company: "", role: "" },
    personal: userProfile.personal || {
      religion: "",
      ethnicity: "",
      nationality: "",
    },
    customStakes: userProfile.customStakes || [],
    regions: userProfile.regions || [],
    topics: userProfile.topics || [],
    expertise: userProfile.expertise || "Beginner",
    timeAvailable: userProfile.timeAvailable || "10-20 minutes",
    createdAt: userProfile.createdAt,
    updatedAt: userProfile.updatedAt,
  };
}
