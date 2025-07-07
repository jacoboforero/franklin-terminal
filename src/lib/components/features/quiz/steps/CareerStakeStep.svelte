<script>
  export let answers = {};
</script>

<div class="space-y-4">
  <div>
    <label class="block text-sm font-mono text-scholar-gold mb-2">Industry</label>
    <input 
      type="text" 
      bind:value={answers.career.industry}
      class="w-full p-3 bg-scholar-black border border-scholar-gray rounded-md text-scholar-cream focus:border-scholar-gold focus:outline-none font-mono"
      placeholder="e.g., Technology, Healthcare, Finance, Education"
    >
  </div>
  
  <div>
    <label class="block text-sm font-mono text-scholar-gold mb-2">Company</label>
    <input 
      type="text" 
      bind:value={answers.career.company}
      class="w-full p-3 bg-scholar-black border border-scholar-gray rounded-md text-scholar-cream focus:border-scholar-gold focus:outline-none font-mono"
      placeholder="Company name or 'Self-employed'"
    >
  </div>
  
  <div>
    <label class="block text-sm font-mono text-scholar-gold mb-2">Role</label>
    <input 
      type="text" 
      bind:value={answers.career.role}
      class="w-full p-3 bg-scholar-black border border-scholar-gray rounded-md text-scholar-cream focus:border-scholar-gold focus:outline-none font-mono"
      placeholder="e.g., Senior Manager, Founder, Consultant"
    >
  </div>
</div> 