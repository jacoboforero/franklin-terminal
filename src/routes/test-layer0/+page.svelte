<script>
  import QuizHeader from '$lib/components/features/quiz/QuizHeader.svelte';
  import QuizStep from '$lib/components/features/quiz/QuizStep.svelte';
  import QuizNavigation from '$lib/components/features/quiz/QuizNavigation.svelte';
  import BasicProfileStep from '$lib/components/features/quiz/steps/BasicProfileStep.svelte';
  import InvestmentStakeStep from '$lib/components/features/quiz/steps/InvestmentStakeStep.svelte';
  import CareerStakeStep from '$lib/components/features/quiz/steps/CareerStakeStep.svelte';
  import PersonalStakeStep from '$lib/components/features/quiz/steps/PersonalStakeStep.svelte';
  import CustomStakeStep from '$lib/components/features/quiz/steps/CustomStakeStep.svelte';
  import AIAssistanceStep from '$lib/components/features/quiz/steps/AIAssistanceStep.svelte';
  import PolicyInterestsStep from '$lib/components/features/quiz/steps/PolicyInterestsStep.svelte';
  import PreferencesStep from '$lib/components/features/quiz/steps/PreferencesStep.svelte';
  
  let currentStep = 1;
  let totalSteps = 8;
  let showResults = false;
  let isProcessing = false;
  let processingError = null;
  
  let answers = {
    name: '',
    profession: '',
    location: '',
    investments: { hasPortfolio: false, details: '' },
    career: { industry: '', company: '', role: '' },
    personal: { religion: '', ethnicity: '', nationality: '' },
    customStakes: [],
    regions: [],
    topics: [],
    expertise: '',
    timeAvailable: ''
  };
  
  // Ensure all nested objects are properly initialized
  $: if (!answers.investments) answers.investments = { hasPortfolio: false, details: '' };
  $: if (!answers.career) answers.career = { industry: '', company: '', role: '' };
  $: if (!answers.personal) answers.personal = { religion: '', ethnicity: '', nationality: '' };
  $: if (!answers.customStakes) answers.customStakes = [];
  $: if (!answers.regions) answers.regions = [];
  $: if (!answers.topics) answers.topics = [];
  
  // Results state
  let layer0Results = null;
  let articles = [];
  let queryDetails = null;
  
  function handlePrevious() {
    if (currentStep > 1) currentStep--;
  }
  
  function handleNext() {
    if (currentStep < totalSteps) currentStep++;
  }
  
  async function handleComplete() {
    try {
      isProcessing = true;
      processingError = null;
      showResults = false;
      
      console.log('Processing quiz answers:', answers);
      
      // Call the backend to process the quiz and fetch articles
      const response = await fetch('https://us-central1-si-terminal.cloudfunctions.net/testLayer0', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(answers)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        layer0Results = result.layer0Results;
        articles = result.articles;
        queryDetails = result.queryDetails;
        showResults = true;
        console.log('Test completed successfully:', result);
      } else {
        throw new Error(result.error || 'Unknown error occurred');
      }
      
    } catch (error) {
      console.error('Error processing quiz:', error);
      processingError = `Failed to process quiz: ${error.message}`;
    } finally {
      isProcessing = false;
    }
  }
  
  function resetTest() {
    currentStep = 1;
    showResults = false;
    isProcessing = false;
    processingError = null;
    layer0Results = null;
    articles = [];
    queryDetails = null;
    
    // Reset answers
    answers = {
      name: '',
      profession: '',
      location: '',
      investments: { hasPortfolio: false, details: '' },
      career: { industry: '', company: '', role: '' },
      personal: { religion: '', ethnicity: '', nationality: '' },
      customStakes: [],
      regions: [],
      topics: [],
      expertise: '',
      timeAvailable: ''
    };
  }
  
  const steps = [
    {
      title: 'Basic Profile',
      description: "Let's start with some basic information.",
      component: BasicProfileStep
    },
    {
      title: 'Investment Stake',
      description: 'Understanding your investments helps identify relevant market impacts.',
      component: InvestmentStakeStep
    },
    {
      title: 'Career Stake',
      description: 'Your professional context helps identify relevant policy impacts.',
      component: CareerStakeStep
    },
    {
      title: 'Personal Stake',
      description: 'Personal factors that may influence your information needs.',
      component: PersonalStakeStep
    },
    {
      title: 'Custom Areas of Stake',
      description: 'Add any other areas where you have personal stake or risk.',
      component: CustomStakeStep
    },
    {
      title: 'AI-Powered Stake Discovery',
      description: 'Our AI can help identify additional areas of stake based on your profile.',
      component: AIAssistanceStep
    },
    {
      title: 'Policy Areas of Interest',
      description: 'Select policy areas you want to stay informed about.',
      component: PolicyInterestsStep
    },
    {
      title: 'Information Preferences',
      description: 'Final preferences for how we deliver your personalized briefings.',
      component: PreferencesStep
    }
  ];
</script>

<svelte:head>
  <title>Layer 0 Test - Franklin Terminal</title>
</svelte:head>

<div class="min-h-screen bg-scholar-dark text-scholar-cream">
  {#if !showResults}
    <!-- Quiz Interface -->
    <QuizHeader {currentStep} {totalSteps} />
    
    <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-6">
        <h1 class="text-2xl font-serif font-bold text-scholar-gold mb-2">
          Layer 0 Test - User Intelligence Pipeline
        </h1>
        <p class="text-scholar-cream-dark">
          Complete the quiz below to test the Layer 0 user intelligence system and see personalized articles.
        </p>
      </div>
      
      <QuizStep 
        title={steps[currentStep - 1].title}
        description={steps[currentStep - 1].description}
      >
        <svelte:component this={steps[currentStep - 1].component} {answers} />
      </QuizStep>
      
      <QuizNavigation 
        {currentStep}
        {totalSteps}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onComplete={handleComplete}
        isCompleting={isProcessing}
      />
      
      {#if processingError}
        <div class="mt-4 p-4 bg-red-900 border border-red-700 rounded-lg">
          <p class="text-red-200 text-sm font-mono">{processingError}</p>
        </div>
      {/if}
    </main>
  {:else}
    <!-- Results Interface -->
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8">
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-3xl font-serif font-bold text-scholar-gold">
            Layer 0 Test Results
          </h1>
          <button 
            on:click={resetTest}
            class="px-6 py-3 bg-scholar-gold text-scholar-dark font-mono rounded-md hover:bg-scholar-gold-dark transition-colors"
          >
            Run Another Test
          </button>
        </div>
        
        <!-- Layer 0 Results Summary -->
        <div class="bg-scholar-charcoal border border-scholar-gray rounded-lg p-6 mb-8">
          <h2 class="text-xl font-serif font-semibold text-scholar-gold mb-4">
            User Intelligence Analysis
          </h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="bg-scholar-black p-4 rounded-md">
              <div class="text-sm text-scholar-cream-dark">User Segment</div>
              <div class="text-lg font-mono text-scholar-gold">{layer0Results?.segment || 'N/A'}</div>
            </div>
            
            <div class="bg-scholar-black p-4 rounded-md">
              <div class="text-sm text-scholar-cream-dark">Keyword Sets</div>
              <div class="text-lg font-mono text-scholar-gold">{layer0Results?.efficiency?.keywordSets || 0}</div>
            </div>
            
            <div class="bg-scholar-black p-4 rounded-md">
              <div class="text-sm text-scholar-cream-dark">Total Keywords</div>
              <div class="text-lg font-mono text-scholar-gold">{layer0Results?.efficiency?.totalKeywords || 0}</div>
            </div>
            
            <div class="bg-scholar-black p-4 rounded-md">
              <div class="text-sm text-scholar-cream-dark">Query Complexity</div>
              <div class="text-lg font-mono text-scholar-gold">{layer0Results?.efficiency?.queryComplexity || 'N/A'}</div>
            </div>
          </div>
        </div>
        
        <!-- Query Details -->
        {#if queryDetails}
          <div class="bg-scholar-charcoal border border-scholar-gray rounded-lg p-6 mb-8">
            <h2 class="text-xl font-serif font-semibold text-scholar-gold mb-4">
              Generated NewsAPI Query
            </h2>
            
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-mono text-scholar-gold mb-2">Query String</label>
                <div class="bg-scholar-black p-4 rounded-md font-mono text-sm text-scholar-cream border border-scholar-gray">
                  {queryDetails.q}
                </div>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm font-mono text-scholar-gold mb-2">Domains</label>
                  <div class="bg-scholar-black p-3 rounded-md text-sm text-scholar-cream border border-scholar-gray">
                    {queryDetails.domains || 'All domains'}
                  </div>
                </div>
                
                <div>
                  <label class="block text-sm font-mono text-scholar-gold mb-2">Page Size</label>
                  <div class="bg-scholar-black p-3 rounded-md text-sm text-scholar-cream border border-scholar-gray">
                    {queryDetails.pageSize}
                  </div>
                </div>
                
                <div>
                  <label class="block text-sm font-mono text-scholar-gold mb-2">Sort By</label>
                  <div class="bg-scholar-black p-3 rounded-md text-sm text-scholar-cream border border-scholar-gray">
                    {queryDetails.sortBy}
                  </div>
                </div>
              </div>
            </div>
          </div>
        {/if}
        
        <!-- Articles Results -->
        <div class="bg-scholar-charcoal border border-scholar-gray rounded-lg p-6">
          <h2 class="text-xl font-serif font-semibold text-scholar-gold mb-4">
            Top 5 Personalized Articles
          </h2>
          
          {#if articles.length > 0}
            <div class="space-y-6">
              {#each articles.slice(0, 5) as article, index}
                <div class="bg-scholar-black border border-scholar-gray rounded-lg p-6">
                  <div class="flex justify-between items-start mb-3">
                    <h3 class="text-lg font-serif font-semibold text-scholar-cream leading-tight">
                      {article.title}
                    </h3>
                    <span class="text-xs text-scholar-cream-dark bg-scholar-charcoal px-2 py-1 rounded">
                      #{index + 1}
                    </span>
                  </div>
                  
                  <div class="text-sm text-scholar-cream-dark mb-3">
                    {article.description || 'No description available'}
                  </div>
                  
                  <div class="flex justify-between items-center text-xs text-scholar-cream-dark">
                    <div class="flex items-center space-x-4">
                      <span class="font-mono">{article.source}</span>
                      <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                    </div>
                    
                    <a 
                      href={article.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      class="text-scholar-gold hover:text-scholar-gold-light transition-colors font-mono"
                    >
                      Read Article →
                    </a>
                  </div>
                </div>
              {/each}
            </div>
          {:else}
            <div class="text-center py-12">
              <div class="text-scholar-cream-dark mb-4">
                <svg class="w-16 h-16 mx-auto text-scholar-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <p class="text-scholar-cream-dark font-mono">
                No articles found. This might be due to API rate limiting or no matching content.
              </p>
            </div>
          {/if}
        </div>
      </div>
    </div>
  {/if}
</div> 