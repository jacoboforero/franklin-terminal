<script>
  let message = 'Hello from SvelteKit!';
  let count = 0;
  
  function increment() {
    count++;
  }
</script>

<svelte:head>
  <title>Test Page - Franklin Terminal</title>
</svelte:head>

<div class="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
  <div class="max-w-2xl mx-auto p-8 text-center">
    <h1 class="text-4xl font-bold mb-8 text-amber-400">
      {message}
    </h1>
    
    <div class="bg-gray-800 rounded-lg p-6 mb-6">
      <h2 class="text-2xl font-semibold mb-4 text-amber-300">Counter Test</h2>
      <p class="text-lg mb-4">Count: {count}</p>
      <button 
        on:click={increment}
        class="bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded transition-colors"
      >
        Increment
      </button>
    </div>
    
    <div class="text-center">
      <a href="/" class="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors mr-4">
        Home
      </a>
      <a href="/dashboard" class="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
        Dashboard
      </a>
    </div>
  </div>
</div> 