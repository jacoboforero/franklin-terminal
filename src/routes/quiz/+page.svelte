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
  
  function handlePrevious() {
    if (currentStep > 1) currentStep--;
  }
  
  function handleNext() {
    if (currentStep < totalSteps) currentStep++;
  }
  
  import { goto } from '$app/navigation';
  import { saveUserProfile, validateUserProfile } from '$lib/services/user-profile.js';
  import { getPersonalizedBriefing } from '$lib/services/briefing-service.js';
  
  let isCompleting = false;
  let completionError = null;
  
  async function handleComplete() {
    try {
      isCompleting = true;
      completionError = null;
      
      console.log('Completing Assessment:', answers);
      
      // Validate user profile
      const validation = validateUserProfile(answers);
      if (!validation.isValid) {
        completionError = `Please fix the following errors: ${validation.errors.join(', ')}`;
        return;
      }
      
      if (validation.warnings.length > 0) {
        console.warn('Profile warnings:', validation.warnings);
      }
      
      // Save user profile to Firebase
      const savedProfile = await saveUserProfile(answers);
      console.log('Profile saved:', savedProfile.id);
      
      // Get personalized briefing
      const briefingResult = await getPersonalizedBriefing(savedProfile);
      
      if (briefingResult.success) {
        console.log('Briefing generated successfully');
        // Redirect to dashboard
        goto('/dashboard');
      } else {
        console.warn('Briefing generation failed, using fallback:', briefingResult.error);
        // Still redirect to dashboard with fallback data
        goto('/dashboard');
      }
      
    } catch (error) {
      console.error('Error completing assessment:', error);
      completionError = `Failed to complete assessment: ${error.message}`;
    } finally {
      isCompleting = false;
    }
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
  <title>Stakeholder Assessment - Political Briefing</title>
</svelte:head>

<div class="min-h-screen bg-scholar-dark text-scholar-cream">
  <QuizHeader {currentStep} {totalSteps} />
  
  <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
      {isCompleting}
    />
    
    {#if completionError}
      <div class="mt-4 p-4 bg-red-900 border border-red-700 rounded-lg">
        <p class="text-red-200 text-sm font-mono">{completionError}</p>
      </div>
    {/if}
  </main>
</div> 