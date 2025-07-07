<script>
  export let currentStep = 1;
  export let totalSteps = 1;
  export let onPrevious = () => {};
  export let onNext = () => {};
  export let onComplete = () => {};
  export let isComplete = false;
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
      class="px-4 py-2 text-sm font-mono text-scholar-black bg-scholar-gold border border-scholar-gold rounded-md hover:bg-scholar-gold-light transition-colors"
      on:click={onComplete}
    >
      Complete Assessment
    </button>
  {/if}
</div> 