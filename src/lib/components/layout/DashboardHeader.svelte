<script>
  export let title = '';
  export let subtitle = '';
  export let showBackButton = false;
  export let backHref = '/dashboard';
  export let quickActions = [];
</script>

<header class="bg-scholar-black border-b border-scholar-gray">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between items-center py-6">
      <div class="flex items-center space-x-4">
        {#if showBackButton}
          <a href={backHref} class="text-scholar-gold hover:text-scholar-gold-light">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </a>
        {/if}
        <div>
          <h1 class="text-3xl font-serif font-bold text-scholar-gold">{title}</h1>
          <p class="text-sm text-scholar-cream-dark font-mono">{subtitle}</p>
        </div>
      </div>
      
      <!-- Quick Actions -->
      <div class="flex items-center space-x-3">
        {#each quickActions as action}
          <a 
            href={action.href}
            class="flex items-center space-x-2 px-3 py-2 bg-scholar-black bg-opacity-50 rounded border border-scholar-gray hover:border-scholar-gold transition-colors group"
            title={action.description}
          >
            <span class="text-lg">{action.icon}</span>
            <span class="text-sm text-scholar-cream font-medium group-hover:text-scholar-gold transition-colors">
              {action.title}
            </span>
          </a>
        {/each}
      </div>
    </div>
  </div>
</header> 