<script>
  import { onMount } from 'svelte';
  import { getFirebaseServices } from '$lib/firebase.js';
  
  let message = 'Hello from Franklin Terminal!';
  let count = 0;
  let firebaseStatus = 'Testing...';
  let firebaseTestResult = '';
  let isTestingFirebase = false;
  
  function increment() {
    count++;
  }
  
  async function testFirebase() {
    isTestingFirebase = true;
    firebaseStatus = 'Testing Firebase connection...';
    
    try {
      // Get Firebase services
      const { app, db } = await getFirebaseServices();
      
      if (!db) {
        firebaseStatus = '❌ Firebase not initialized';
        firebaseTestResult = 'Database instance is null after initialization';
        return;
      }
      
      // Import Firestore functions and test
      const { collection, getDocs } = await import('firebase/firestore');
      const testCollection = collection(db, 'test');
      const querySnapshot = await getDocs(testCollection);
      
      firebaseStatus = '✅ Firebase is working!';
      firebaseTestResult = `Successfully connected to Firestore. Found ${querySnapshot.size} documents in test collection.`;
      
    } catch (error) {
      firebaseStatus = '❌ Firebase test failed';
      firebaseTestResult = `Error: ${error.message}`;
      console.error('Firebase test error:', error);
    } finally {
      isTestingFirebase = false;
    }
  }
  
  onMount(() => {
    // Test Firebase on page load
    setTimeout(testFirebase, 1000);
  });
</script>

<svelte:head>
  <title>Franklin Terminal - Test</title>
</svelte:head>

<div class="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
  <div class="max-w-2xl mx-auto p-8 text-center">
    <h1 class="text-4xl font-bold mb-8 text-amber-400">
      {message}
    </h1>
    
    <div class="bg-gray-800 rounded-lg p-6 mb-6">
      <h2 class="text-2xl font-semibold mb-4 text-amber-300">Basic Test</h2>
      <p class="text-lg mb-4">Count: {count}</p>
      <button 
        on:click={increment}
        class="bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded transition-colors"
      >
        Increment
      </button>
    </div>
    
    <div class="bg-gray-800 rounded-lg p-6 mb-6">
      <h2 class="text-2xl font-semibold mb-4 text-amber-300">Firebase Test</h2>
      <p class="text-lg mb-4">Status: {firebaseStatus}</p>
      {#if firebaseTestResult}
        <p class="text-sm mb-4 text-gray-300">{firebaseTestResult}</p>
      {/if}
      <button 
        on:click={testFirebase}
        disabled={isTestingFirebase}
        class="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-bold py-2 px-4 rounded transition-colors"
      >
        {isTestingFirebase ? 'Testing...' : 'Test Firebase'}
      </button>
    </div>
    
    <div class="text-center">
      <a href="/dashboard" class="inline-block bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
        Go to Dashboard
      </a>
    </div>
  </div>
</div>
