<script>
  export let answers = {};
  
  let customStakeText = '';
  
  function addCustomStake() {
    if (customStakeText.trim()) {
      if (!answers.customStakes) {
        answers.customStakes = [];
      }
      answers.customStakes.push({
        name: customStakeText.trim(),
        description: customStakeText.trim(),
        addedAt: new Date().toISOString()
      });
      customStakeText = '';
    }
  }
  
  function removeCustomStake(index) {
    answers.customStakes.splice(index, 1);
    answers.customStakes = [...answers.customStakes]; // Trigger reactivity
  }
</script>

<div class="space-y-4">
  <div class="bg-scholar-gold bg-opacity-10 border border-scholar-gold rounded p-4 mb-4">
    <p class="text-sm text-scholar-gold font-mono">
      Examples: Real estate holdings, educational institution affiliations, family members in specific industries, international business relationships, etc.
    </p>
  </div>
  
  <div>
    <label class="block text-sm font-mono text-scholar-gold mb-2">Add Custom Stake Area</label>
    <div class="flex gap-2">
      <input 
        type="text" 
        bind:value={customStakeText}
        class="flex-1 p-3 bg-scholar-black border border-scholar-gray rounded-md text-scholar-cream focus:border-scholar-gold focus:outline-none font-mono"
        placeholder="e.g., Real estate holdings in coastal areas"
        on:keydown={(e) => e.key === 'Enter' && addCustomStake()}
      >
      <button 
        type="button"
        on:click={addCustomStake}
        class="px-4 py-3 bg-scholar-gold text-scholar-dark font-mono rounded-md hover:bg-scholar-gold-dark transition-colors"
      >
        Add
      </button>
    </div>
  </div>
  
  {#if answers.customStakes && answers.customStakes.length > 0}
    <div>
      <label class="block text-sm font-mono text-scholar-gold mb-2">Your Custom Stakes</label>
      <div class="space-y-2">
        {#each answers.customStakes as stake, index}
          <div class="flex items-center justify-between p-3 bg-scholar-charcoal border border-scholar-gray rounded-md">
            <span class="text-sm font-mono text-scholar-cream">{stake.name}</span>
            <button 
              type="button"
              on:click={() => removeCustomStake(index)}
              class="text-scholar-red hover:text-scholar-red-light transition-colors"
            >
              ×
            </button>
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div> 