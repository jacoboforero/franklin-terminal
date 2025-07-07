<script>
  export let answers = {};
  
  const regions = ['North America', 'Europe', 'Asia-Pacific', 'Middle East', 'Africa', 'Latin America'];
  const topics = ['Climate Policy', 'Economic Policy', 'Foreign Relations', 'Technology Regulation', 'Healthcare', 'Education', 'Immigration', 'Defense'];
</script>

<div class="space-y-4">
  <div>
    <h3 class="text-lg font-serif font-semibold text-scholar-gold mb-3">Regions of Interest</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
      {#each regions as region}
        <label class="flex items-center p-3 border border-scholar-gray rounded-lg hover:border-scholar-gold cursor-pointer transition-colors">
          <input 
            type="checkbox" 
            bind:group={answers.regions} 
            value={region}
            class="h-4 w-4 text-scholar-gold focus:ring-scholar-gold border-scholar-gray rounded bg-scholar-charcoal"
          >
          <span class="ml-3 text-sm font-mono text-scholar-cream">{region}</span>
        </label>
      {/each}
    </div>
  </div>
  
  <div>
    <h3 class="text-lg font-serif font-semibold text-scholar-gold mb-3">Policy Topics</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
      {#each topics as topic}
        <label class="flex items-center p-3 border border-scholar-gray rounded-lg hover:border-scholar-gold cursor-pointer transition-colors">
          <input 
            type="checkbox" 
            bind:group={answers.topics} 
            value={topic}
            class="h-4 w-4 text-scholar-gold focus:ring-scholar-gold border-scholar-gray rounded bg-scholar-charcoal"
          >
          <span class="ml-3 text-sm font-mono text-scholar-cream">{topic}</span>
        </label>
      {/each}
    </div>
  </div>
</div> 