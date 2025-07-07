<script>
  export let title = '';
  export let description = '';
  export let icon = '';
  export let href = '';
  export let isHighlighted = false;
</script>

<a 
  href={href}
  class="block bg-scholar-charcoal border border-scholar-gray rounded-lg p-6 hover:border-scholar-gold transition-all duration-200 {isHighlighted ? 'ring-2 ring-scholar-gold' : ''}"
>
  <div class="flex items-center space-x-4">
    <div class="flex-shrink-0">
      <div class="w-12 h-12 bg-scholar-gold bg-opacity-20 rounded-lg flex items-center justify-center">
        <span class="text-2xl text-scholar-gold">{icon}</span>
      </div>
    </div>
    <div class="flex-1 min-w-0">
      <h3 class="text-lg font-serif font-semibold text-scholar-gold mb-1">
        {title}
      </h3>
      <p class="text-sm text-scholar-cream-dark font-mono">
        {description}
      </p>
    </div>
    <div class="flex-shrink-0">
      <svg class="w-5 h-5 text-scholar-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
      </svg>
    </div>
  </div>
</a> 