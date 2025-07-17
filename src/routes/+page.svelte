<script>
  import { goto } from '$app/navigation';
</script>

<svelte:head>
  <title>Franklin Terminal - Political Intelligence Platform</title>
</svelte:head>

<div class="min-h-screen bg-scholar-dark text-scholar-cream">
  <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <div class="text-center">
      <h1 class="text-4xl font-serif font-bold text-scholar-gold mb-6">
        Franklin Terminal
      </h1>
      <p class="text-xl text-scholar-cream-dark mb-8">
        Personalized political intelligence for informed decision-making
      </p>
      
      <div class="space-y-4">
        <button 
          on:click={() => goto('/quiz')}
          class="w-full max-w-md px-8 py-4 bg-scholar-gold text-scholar-dark font-mono rounded-lg hover:bg-scholar-gold-dark transition-colors"
        >
          Take the Assessment
        </button>
        
        <button 
          on:click={() => goto('/dashboard')}
          class="w-full max-w-md px-8 py-4 bg-scholar-charcoal text-scholar-cream font-mono rounded-lg hover:bg-scholar-gray transition-colors border border-scholar-gray"
        >
          View Dashboard
        </button>
        
        <button 
          on:click={() => goto('/test-layer0')}
          class="w-full max-w-md px-8 py-4 bg-scholar-charcoal text-scholar-gold font-mono rounded-lg hover:bg-scholar-gray transition-colors border border-scholar-gold"
        >
          🧪 Test Layer 0
        </button>
      </div>
    </div>
  </main>
</div>
