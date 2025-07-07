<script>
  export let answers = {};
</script>

<div class="space-y-4">
  <div>
    <label class="block text-sm font-mono text-scholar-gold mb-2">Full Name</label>
    <input 
      type="text" 
      bind:value={answers.name}
      class="w-full p-3 bg-scholar-black border border-scholar-gray rounded-md text-scholar-cream focus:border-scholar-gold focus:outline-none font-mono"
      placeholder="Enter your full name"
    >
  </div>
  
  <div>
    <label class="block text-sm font-mono text-scholar-gold mb-2">Profession</label>
    <input 
      type="text" 
      bind:value={answers.profession}
      class="w-full p-3 bg-scholar-black border border-scholar-gray rounded-md text-scholar-cream focus:border-scholar-gold focus:outline-none font-mono"
      placeholder="e.g., Software Engineer, Lawyer, Investor"
    >
  </div>
  
  <div>
    <label class="block text-sm font-mono text-scholar-gold mb-2">Location</label>
    <input 
      type="text" 
      bind:value={answers.location}
      class="w-full p-3 bg-scholar-black border border-scholar-gray rounded-md text-scholar-cream focus:border-scholar-gold focus:outline-none font-mono"
      placeholder="City, State/Province, Country"
    >
  </div>
</div> 