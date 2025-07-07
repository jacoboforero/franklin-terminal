<script>
  export let answers = {};
</script>

<div class="space-y-4">
  <label class="flex items-center p-3 border border-scholar-gray rounded-lg hover:border-scholar-gold cursor-pointer transition-colors">
    <input 
      type="checkbox" 
      bind:checked={answers.investments.hasPortfolio}
      class="h-4 w-4 text-scholar-gold focus:ring-scholar-gold border-scholar-gray rounded bg-scholar-charcoal"
    >
    <span class="ml-3 text-sm font-mono text-scholar-cream">I have an investment portfolio</span>
  </label>
  
  {#if answers.investments.hasPortfolio}
    <div>
      <label class="block text-sm font-mono text-scholar-gold mb-2">Portfolio Details</label>
      <textarea 
        bind:value={answers.investments.details}
        class="w-full p-3 bg-scholar-black border border-scholar-gray rounded-md text-scholar-cream focus:border-scholar-gold focus:outline-none font-mono"
        rows="3"
        placeholder="Describe your investments (stocks, bonds, real estate, crypto, etc.)"
      ></textarea>
    </div>
  {/if}
</div> 