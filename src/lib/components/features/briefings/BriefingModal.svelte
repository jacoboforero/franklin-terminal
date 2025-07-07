<script>
  import { createEventDispatcher } from 'svelte';
  
  export let briefing = null;
  export let isOpen = false;
  
  const dispatch = createEventDispatcher();
  
  function closeModal() {
    dispatch('close');
  }
  
  function handleBackdropClick(event) {
    if (event.target === event.currentTarget) {
      closeModal();
    }
  }
</script>

{#if isOpen && briefing}
  <div 
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    on:click={handleBackdropClick}
  >
    <div class="bg-scholar-charcoal border border-scholar-gray rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
      <div class="p-6">
        <div class="flex justify-between items-start mb-6">
          <div>
            <h2 class="text-2xl font-serif font-bold text-scholar-gold mb-2">
              {briefing.title}
            </h2>
            <div class="flex items-center space-x-4 text-sm text-scholar-cream-dark font-mono">
              <span class="px-2 py-1 bg-scholar-gold bg-opacity-20 text-scholar-gold rounded">
                {briefing.category}
              </span>
              <span>{briefing.date}</span>
              <span class="flex items-center">
                <span class="w-2 h-2 bg-scholar-gold rounded-full mr-2"></span>
                High Impact
              </span>
            </div>
          </div>
          <button 
            class="text-scholar-cream-dark hover:text-scholar-gold transition-colors"
            on:click={closeModal}
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <div class="space-y-6">
          <!-- Stake Area Relevance -->
          <div class="bg-scholar-black border border-scholar-gray rounded p-4">
            <h3 class="text-lg font-serif font-semibold text-scholar-gold mb-3">Why This Matters to You</h3>
            <div class="space-y-3">
              {#each briefing.stakeRelevance as relevance}
                <div class="flex items-start">
                  <span class="text-scholar-gold mr-3 mt-1">•</span>
                  <div class="flex-1">
                    <span class="text-sm font-mono text-scholar-gold font-semibold">{relevance.area}:</span>
                    <span class="text-sm text-scholar-cream-dark font-mono ml-2">{relevance.explanation}</span>
                  </div>
                </div>
              {/each}
            </div>
          </div>
          
          <div>
            <h3 class="text-lg font-serif font-semibold text-scholar-gold mb-3">Executive Summary</h3>
            <p class="text-scholar-cream font-mono leading-relaxed">
              {briefing.summary}
            </p>
          </div>
          
          <div>
            <h3 class="text-lg font-serif font-semibold text-scholar-gold mb-3">Key Points</h3>
            <ul class="space-y-2">
              {#each briefing.keyPoints as point}
                <li class="flex items-start text-scholar-cream font-mono">
                  <span class="text-scholar-gold mr-3 mt-1">•</span>
                  {point}
                </li>
              {/each}
            </ul>
          </div>
          
          <div>
            <h3 class="text-lg font-serif font-semibold text-scholar-gold mb-3">Analysis</h3>
            <p class="text-scholar-cream font-mono leading-relaxed">
              {briefing.analysis}
            </p>
          </div>
          
          <div>
            <h3 class="text-lg font-serif font-semibold text-scholar-gold mb-3">Personal Impact</h3>
            <div class="bg-scholar-gold bg-opacity-10 border border-scholar-gold rounded p-4">
              <p class="text-scholar-gold font-mono text-sm">
                {briefing.personalImpact}
              </p>
            </div>
          </div>
          
          <div>
            <h3 class="text-lg font-serif font-semibold text-scholar-gold mb-3">Sources</h3>
            <ul class="space-y-1">
              {#each briefing.sources as source}
                <li class="text-sm text-scholar-cream-dark font-mono">
                  <a href={source.url} class="text-scholar-gold hover:text-scholar-gold-light underline" target="_blank">
                    {source.name}
                  </a>
                </li>
              {/each}
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if} 