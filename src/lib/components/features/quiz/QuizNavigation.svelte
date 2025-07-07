<script>
  export let currentStep = 1;
  export let totalSteps = 1;
  export let onPrevious = () => {};
  export let onNext = () => {};
  export let onComplete = () => {};
  export let isComplete = false;
  export let isCompleting = false;
</script>

<div class="flex justify-between mt-8">
  <button 
    class="px-4 py-2 text-sm font-mono text-scholar-cream bg-scholar-charcoal border border-scholar-gray rounded-md hover:border-scholar-gold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    disabled={currentStep === 1}
    on:click={onPrevious}
  >
    Previous
  </button>
  
  {#if currentStep < totalSteps}
    <button 
      class="px-4 py-2 text-sm font-mono text-scholar-black bg-scholar-gold border border-scholar-gold rounded-md hover:bg-scholar-gold-light transition-colors"
      on:click={onNext}
    >
      Next
    </button>
  {:else}
    <button 
      class="px-4 py-2 text-sm font-mono text-scholar-black bg-scholar-gold border border-scholar-gold rounded-md hover:bg-scholar-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      on:click={onComplete}
      disabled={isCompleting}
    >
      {#if isCompleting}
        <span class="flex items-center">
          <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-scholar-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing...
        </span>
      {:else}
        Complete Assessment
      {/if}
    </button>
  {/if}
</div> 