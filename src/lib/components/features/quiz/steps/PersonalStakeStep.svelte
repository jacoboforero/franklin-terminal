<script>
  export let answers = {};
  
  const religions = ['Christianity', 'Islam', 'Judaism', 'Hinduism', 'Buddhism', 'Atheist/Agnostic', 'Other'];
</script>

<div class="space-y-4">
  <div>
    <label class="block text-sm font-mono text-scholar-gold mb-2">Religion (optional)</label>
    <select 
      bind:value={answers.personal.religion}
      class="w-full p-3 bg-scholar-black border border-scholar-gray rounded-md text-scholar-cream focus:border-scholar-gold focus:outline-none font-mono"
    >
      <option value="">Select religion</option>
      {#each religions as religion}
        <option value={religion}>{religion}</option>
      {/each}
    </select>
  </div>
  
  <div>
    <label class="block text-sm font-mono text-scholar-gold mb-2">Ethnicity (optional)</label>
    <input 
      type="text" 
      bind:value={answers.personal.ethnicity}
      class="w-full p-3 bg-scholar-black border border-scholar-gray rounded-md text-scholar-cream focus:border-scholar-gold focus:outline-none font-mono"
      placeholder="e.g., Hispanic, Asian, African American"
    >
  </div>
  
  <div>
    <label class="block text-sm font-mono text-scholar-gold mb-2">Nationality</label>
    <input 
      type="text" 
      bind:value={answers.personal.nationality}
      class="w-full p-3 bg-scholar-black border border-scholar-gray rounded-md text-scholar-cream focus:border-scholar-gold focus:outline-none font-mono"
      placeholder="e.g., US Citizen, Dual Citizen, Permanent Resident"
    >
  </div>
</div> 