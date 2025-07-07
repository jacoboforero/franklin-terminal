<script>
  export let title = '';
  export let description = '';
  export let stepNumber = 0;
  export let totalSteps = 0;
</script>

<div class="bg-scholar-charcoal border border-scholar-gray rounded-lg p-8">
  <div class="mb-6">
    <h2 class="text-2xl font-serif font-semibold text-scholar-gold mb-4">{title}</h2>
    <p class="text-scholar-cream-dark font-mono">{description}</p>
  </div>
  
  <slot />
</div> 