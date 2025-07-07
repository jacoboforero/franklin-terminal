<script>
  export let chartData = {};
</script>

<div class="card h-full flex flex-col">
  <div class="flex items-center space-x-2 mb-4">
    <span class="text-lg">📊</span>
    <span class="text-heading text-sm">{chartData.title}</span>
  </div>
  
  <div class="flex-grow">
    <!-- Simple chart visualization -->
    <div class="h-20 bg-scholar-black rounded border border-scholar-gray p-2 mb-3">
      <div class="flex items-end justify-between h-full space-x-1">
        {#each chartData.data as point}
          <div 
            class="bg-scholar-gold rounded-t"
            style="height: {point.value}%; width: 12px;"
          ></div>
        {/each}
      </div>
    </div>
    
    <div class="flex justify-between items-center mb-2">
      <span class="text-body text-xs">Today's Change</span>
      <span class="text-mono text-xs {chartData.change >= 0 ? 'text-green-400' : 'text-red-400'}">
        {chartData.change >= 0 ? '+' : ''}{chartData.change}%
      </span>
    </div>
    
    <div class="text-xs text-mono">
      {chartData.explanation}
    </div>
  </div>
  
  <div class="mt-4 pt-3 border-t border-scholar-gray">
    <span class="text-mono text-xs">
      Based on your holdings
    </span>
  </div>
</div> 