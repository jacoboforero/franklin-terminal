<script>
  export let briefing = {};
  export let onViewDetails = () => {};
</script>

<div class="card h-full flex flex-col group">
  <!-- Header -->
  <div class="flex justify-between items-start mb-4">
    <div class="flex items-center space-x-3">
      <span class="px-3 py-1 text-xs font-mono bg-scholar-gold bg-opacity-15 text-scholar-gold rounded-full border border-scholar-gold border-opacity-30">
        {briefing.category}
      </span>
      <span class="text-mono">
        {briefing.date}
      </span>
    </div>
    <div class="flex items-center space-x-2">
      <span class="w-2 h-2 bg-scholar-gold rounded-full"></span>
      <span class="text-xs font-mono text-scholar-gold">High Impact</span>
    </div>
  </div>
  
  <!-- Title -->
  <h3 class="text-heading text-lg mb-3 line-clamp-2 group-hover:text-scholar-gold-light transition-colors">
    {briefing.title}
  </h3>
  
  <!-- Summary -->
  <p class="text-body text-sm mb-5 line-clamp-3 flex-grow">
    {briefing.summary}
  </p>
  
  <!-- Stake Area Relevance -->
  <div class="mb-5 p-4 bg-scholar-black bg-opacity-50 border border-scholar-gray rounded-lg">
    <h4 class="text-sm font-serif font-semibold text-scholar-gold mb-3">Relevant to Your Stake Areas:</h4>
    <div class="space-y-2">
      {#each briefing.stakeRelevance as relevance}
        <div class="flex items-start">
          <span class="text-scholar-gold mr-3 mt-1 text-sm">•</span>
          <div class="flex-1">
            <span class="text-xs font-mono text-scholar-gold font-semibold">{relevance.area}:</span>
            <span class="text-xs text-body ml-2 leading-relaxed">{relevance.explanation}</span>
          </div>
        </div>
      {/each}
    </div>
  </div>
  
  <!-- Key Points -->
  <div class="mb-5">
    <h4 class="text-sm font-serif font-semibold text-scholar-gold mb-3">Key Points:</h4>
    <ul class="space-y-2">
      {#each briefing.keyPoints.slice(0, 3) as point}
        <li class="flex items-start">
          <span class="text-scholar-gold mr-3 mt-1 text-sm">•</span>
          <span class="text-xs text-body leading-relaxed line-clamp-2">{point}</span>
        </li>
      {/each}
    </ul>
  </div>
  
  <!-- Action Button -->
  <button 
    class="btn-primary w-full mt-auto"
    on:click={onViewDetails}
  >
    View Full Analysis
  </button>
</div>

<style>
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style> 