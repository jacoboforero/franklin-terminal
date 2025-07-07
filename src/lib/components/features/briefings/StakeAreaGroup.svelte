<script>
  export let stakeArea = '';
  export let description = '';
  export let briefings = [];
  export let onViewDetails = () => {};
</script>

<div class="mb-16">
  <div class="mb-8">
    <h2 class="text-heading text-2xl mb-3">{stakeArea}</h2>
    <p class="text-body text-base">{description}</p>
  </div>
  
  <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
    {#each briefings as briefing}
      <svelte:component this={briefing.component} {briefing} onViewDetails={() => onViewDetails(briefing)} />
    {/each}
  </div>
</div> 