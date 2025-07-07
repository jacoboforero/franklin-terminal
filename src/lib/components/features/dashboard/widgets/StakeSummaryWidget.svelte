<script>
  export let stakeArea = {};
</script>

<div class="card h-full flex flex-col">
  <div class="flex items-center space-x-2 mb-4">
    <span class="text-lg">🎯</span>
    <span class="text-heading text-sm">{stakeArea.name}</span>
  </div>
  
  <div class="flex-grow">
    <div class="text-2xl font-mono text-scholar-gold mb-2">
      {stakeArea.count}
    </div>
    <div class="text-body text-xs mb-3">
      developments today
    </div>
    
    <div class="space-y-2">
      {#each stakeArea.developments as dev}
        <div class="flex items-center space-x-2">
          <span class="w-2 h-2 bg-scholar-gold rounded-full"></span>
          <span class="text-body text-xs line-clamp-1">{dev.title}</span>
        </div>
      {/each}
    </div>
  </div>
  
  <div class="mt-4 pt-3 border-t border-scholar-gray">
    <a href="/dashboard/briefings" class="text-mono text-xs text-scholar-gold hover:text-scholar-gold-light transition-colors">
      View All →
    </a>
  </div>
</div>

<style>
  .line-clamp-1 {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style> 