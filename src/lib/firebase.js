import { browser } from "$app/environment";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBt5NMl4zW8_NylvwWSJSoy3tmOBweO5s0",
  authDomain: "si-terminal.firebaseapp.com",
  projectId: "si-terminal",
  storageBucket: "si-terminal.firebasestorage.app",
  messagingSenderId: "19947220100",
  appId: "1:19947220100:web:d22d6b25b674896eeee6d1",
};

let app = null;
let db = null;
let isInitialized = false;
let initPromise = null;

// Initialize Firebase
async function initializeFirebase() {
  if (initPromise) return initPromise;

  initPromise = (async () => {
    if (!browser) {
      throw new Error("Firebase can only be used in browser");
    }

    try {
      const { initializeApp } = await import("firebase/app");
      const { getFirestore } = await import("firebase/firestore");

      app = initializeApp(firebaseConfig);
      db = getFirestore(app);
      isInitialized = true;

      console.log("Firebase initialized successfully");
      return { app, db };
    } catch (error) {
      console.error("Firebase initialization failed:", error);
      throw error;
    }
  })();

  return initPromise;
}

// Auto-initialize if in browser
if (browser) {
  initializeFirebase().catch((error) => {
    console.error("Auto-initialization failed:", error);
  });
}

// Export Firebase services
export { app, db, isInitialized };

// Simple helper function to get initialized Firebase
export async function getFirebaseServices() {
  if (!browser) {
    throw new Error("Firebase can only be used in browser");
  }

  if (isInitialized && app && db) {
    return { app, db };
  }

  // Initialize if not already initialized
  await initializeFirebase();
  return { app, db };
}

// TODO: Add Auth back once we resolve the compatibility issue
// import { getAuth } from "firebase/auth";
// export const auth = browser ? getAuth(app) : undefined;
