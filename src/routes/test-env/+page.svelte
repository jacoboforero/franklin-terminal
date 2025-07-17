<script>
  import { onMount } from 'svelte';
  import { getOrCreateUserProfile } from '$lib/services/user-profile.js';
  import { getStoredBriefing, formatBriefingForDisplay, isBriefingFresh } from '$lib/services/briefing-service.js';
  
  let testResults = [];
  let isLoading = true;
  
  onMount(async () => {
    try {
      isLoading = true;
      testResults = [];
      
      // Test 1: User Profile Service
      testResults.push({ test: 'User Profile Service', status: 'running', message: 'Testing user profile creation...' });
      
      const userId = 'test-user-' + Date.now();
      const userProfile = await getOrCreateUserProfile(userId);
      
      if (userProfile && userProfile.id) {
        testResults.push({ 
          test: 'User Profile Service', 
          status: 'success', 
          message: `Profile created successfully: ${userProfile.name} (${userProfile.id})` 
        });
      } else {
        testResults.push({ 
          test: 'User Profile Service', 
          status: 'error', 
          message: 'Failed to create user profile' 
        });
      }
      
      // Test 2: Briefing Service
      testResults.push({ test: 'Briefing Service', status: 'running', message: 'Testing briefing retrieval...' });
      
      const storedBriefing = await getStoredBriefing(userId);
      const formattedBriefing = formatBriefingForDisplay(storedBriefing);
      
      if (formattedBriefing && formattedBriefing.briefings) {
        testResults.push({ 
          test: 'Briefing Service', 
          status: 'success', 
          message: `Briefing formatted successfully: ${formattedBriefing.briefings.length} items` 
        });
      } else {
        testResults.push({ 
          test: 'Briefing Service', 
          status: 'error', 
          message: 'Failed to format briefing data' 
        });
      }
      
      // Test 3: Mock User Profile
      testResults.push({ test: 'Mock User Profile', status: 'running', message: 'Testing mock user profile...' });
      
      const mockProfile = await getOrCreateUserProfile('mock-user-id');
      
      if (mockProfile && mockProfile.id === 'mock-user-id') {
        testResults.push({ 
          test: 'Mock User Profile', 
          status: 'success', 
          message: `Mock profile working: ${mockProfile.name}` 
        });
      } else {
        testResults.push({ 
          test: 'Mock User Profile', 
          status: 'error', 
          message: 'Failed to create mock user profile' 
        });
      }
      
    } catch (error) {
      testResults.push({ 
        test: 'Test Suite', 
        status: 'error', 
        message: `Test failed: ${error.message}` 
      });
    } finally {
      isLoading = false;
    }
  });
</script>

<svelte:head>
  <title>Environment Test - Franklin Terminal</title>
</svelte:head>

<div class="min-h-screen bg-scholar-dark text-scholar-cream p-8">
  <div class="max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold mb-8 text-scholar-gold">Environment Test</h1>
    
    {#if isLoading}
      <div class="flex items-center justify-center h-64">
        <div class="text-center">
          <svg class="animate-spin h-8 w-8 text-scholar-gold mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p class="text-scholar-cream font-mono">Running tests...</p>
        </div>
      </div>
    {:else}
      <div class="space-y-4">
        {#each testResults as result}
          <div class="bg-scholar-black p-4 rounded-lg border border-scholar-gold">
            <div class="flex items-center justify-between">
              <h3 class="font-semibold text-scholar-gold">{result.test}</h3>
              <span class="px-2 py-1 rounded text-xs font-mono
                {result.status === 'success' ? 'bg-green-600 text-white' : 
                 result.status === 'error' ? 'bg-red-600 text-white' : 
                 'bg-yellow-600 text-black'}">
                {result.status}
              </span>
            </div>
            <p class="text-scholar-cream mt-2 font-mono text-sm">{result.message}</p>
          </div>
        {/each}
      </div>
      
      <div class="mt-8 p-4 bg-scholar-black rounded-lg border border-scholar-gold">
        <h3 class="text-scholar-gold font-semibold mb-2">Next Steps</h3>
        <ul class="text-scholar-cream space-y-1 text-sm">
          <li>• If all tests pass, the dashboard should work correctly</li>
          <li>• If user profile test fails, check Firebase permissions</li>
          <li>• If briefing test fails, check briefing service configuration</li>
          <li>• Visit <a href="/dashboard" class="text-scholar-gold hover:underline">/dashboard</a> to test the main interface</li>
        </ul>
      </div>
    {/if}
  </div>
</div> 