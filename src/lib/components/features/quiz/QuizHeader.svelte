<script>
  export let currentStep = 1;
  export let totalSteps = 1;
</script>

<header class="bg-scholar-black border-b border-scholar-gray">
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between items-center py-6">
      <div class="flex items-center space-x-4">
        <a href="/dashboard" class="text-scholar-gold hover:text-scholar-gold-light">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </a>
        <div>
          <h1 class="text-3xl font-serif font-bold text-scholar-gold">Stakeholder Assessment</h1>
          <p class="text-sm text-scholar-cream-dark font-mono">Identify your areas of stake and risk</p>
        </div>
      </div>
      <div class="text-sm text-scholar-cream-dark font-mono">
        Step {currentStep} of {totalSteps}
      </div>
    </div>
  </div>
</header>

<div class="bg-scholar-black border-b border-scholar-gray">
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="py-4">
      <div class="w-full bg-scholar-gray rounded-full h-2">
        <div class="bg-scholar-gold h-2 rounded-full transition-all duration-300" style="width: {(currentStep / totalSteps) * 100}%"></div>
      </div>
    </div>
  </div>
</div> 