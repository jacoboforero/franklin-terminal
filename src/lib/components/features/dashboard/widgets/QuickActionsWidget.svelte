<script>
  export let actions = [];
</script>

<div class="card h-full flex flex-col">
  <div class="flex items-center space-x-2 mb-4">
    <span class="text-lg">⚡</span>
    <span class="text-heading text-sm">Quick Actions</span>
  </div>
  
  <div class="space-y-2 flex-grow">
    {#each actions as action}
      <a 
        href={action.href}
        class="flex items-center justify-between p-3 bg-scholar-black bg-opacity-50 rounded border border-scholar-gray hover:border-scholar-gold transition-colors"
      >
        <div class="flex items-center space-x-3">
          <span class="text-lg">{action.icon}</span>
          <div>
            <div class="text-body text-xs font-medium">{action.title}</div>
            <div class="text-mono text-xs">{action.description}</div>
          </div>
        </div>
        <span class="text-scholar-gold">→</span>
      </a>
    {/each}
  </div>
  
  <div class="mt-4 pt-3 border-t border-scholar-gray">
    <span class="text-mono text-xs">
      Based on your activity
    </span>
  </div>
</div> 