<script>
  export let briefing = {};
  export let onViewDetails = () => {};
</script>

<div class="card h-full flex flex-col">
  <div class="flex items-center justify-between mb-3">
    <div class="flex items-center space-x-2">
      <span class="text-lg">📰</span>
      <span class="text-heading text-sm">Top Briefing</span>
    </div>
    <span class="text-xs text-mono">{briefing.date}</span>
  </div>
  
  <h3 class="text-heading text-base mb-2 line-clamp-2">
    {briefing.title}
  </h3>
  
  <p class="text-body text-xs mb-3 line-clamp-2 flex-grow">
    {briefing.summary}
  </p>
  
  <div class="mb-3">
    <span class="text-xs font-mono text-scholar-gold font-semibold">
      Relevant to: {briefing.stakeRelevance[0].area}
    </span>
  </div>
  
  <button class="btn-primary text-xs" on:click={onViewDetails}>
    View Analysis
  </button>
</div>

<style>
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style> 