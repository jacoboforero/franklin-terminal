<script>
  export let answers = {};
  
  const expertiseLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
  const timeOptions = ['5-10 minutes', '10-20 minutes', '20-30 minutes', '30+ minutes'];
</script>

<div class="space-y-6">
  <div>
    <h3 class="text-lg font-serif font-semibold text-scholar-gold mb-3">Expertise Level</h3>
    <div class="space-y-2">
      {#each expertiseLevels as level}
        <label class="flex items-center p-3 border border-scholar-gray rounded-lg hover:border-scholar-gold cursor-pointer transition-colors">
          <input 
            type="radio" 
            bind:group={answers.expertise} 
            value={level}
            class="h-4 w-4 text-scholar-gold focus:ring-scholar-gold border-scholar-gray bg-scholar-charcoal"
          >
          <span class="ml-3 text-sm font-mono text-scholar-cream">{level}</span>
        </label>
      {/each}
    </div>
  </div>
  
  <div>
    <h3 class="text-lg font-serif font-semibold text-scholar-gold mb-3">Time Available Daily</h3>
    <div class="space-y-2">
      {#each timeOptions as time}
        <label class="flex items-center p-3 border border-scholar-gray rounded-lg hover:border-scholar-gold cursor-pointer transition-colors">
          <input 
            type="radio" 
            bind:group={answers.timeAvailable} 
            value={time}
            class="h-4 w-4 text-scholar-gold focus:ring-scholar-gold border-scholar-gray bg-scholar-charcoal"
          >
          <span class="ml-3 text-sm font-mono text-scholar-cream">{time}</span>
        </label>
      {/each}
    </div>
  </div>
</div> 