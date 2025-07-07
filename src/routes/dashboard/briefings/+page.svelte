<script>
  import BriefingCard from '$lib/components/features/briefings/BriefingCard.svelte';
  import BriefingModal from '$lib/components/features/briefings/BriefingModal.svelte';
  import StakeAreaGroup from '$lib/components/features/briefings/StakeAreaGroup.svelte';
  
  let selectedBriefing = null;
  let isModalOpen = false;
  
  // Mock user stake areas - in real app this would come from the quiz results
  const userStakeAreas = {
    investments: {
      name: "Investment Portfolio",
      description: "You have investments in tech stocks, bonds, and real estate",
      briefings: [
        {
          id: 1,
          title: "Federal Reserve Signals Potential Rate Cuts in Q2 2024",
          category: "Economic Policy",
          date: "2024-01-15",
          summary: "The Federal Reserve's latest meeting minutes reveal growing consensus among policymakers for potential interest rate cuts beginning in the second quarter of 2024, citing improved inflation metrics and economic stability indicators.",
          keyPoints: [
            "Fed officials see inflation moving toward 2% target",
            "Labor market strength allows for policy flexibility",
            "Market expectations align with Fed guidance",
            "International economic conditions support easing"
          ],
          analysis: "The Federal Reserve's dovish pivot represents a significant shift in monetary policy stance, driven by sustained improvements in inflation metrics and a resilient labor market. This development has far-reaching implications for financial markets, consumer borrowing costs, and economic growth trajectories.",
          personalImpact: "This development directly impacts your investment portfolio through potential bond price appreciation and equity market support. Consider reviewing fixed-income allocations and monitoring sectors sensitive to interest rate changes.",
          stakeRelevance: [
            {
              area: "Investment Portfolio",
              explanation: "Rate cuts typically boost bond prices and may support equity markets, directly affecting your tech stocks and bond holdings"
            }
          ],
          sources: [
            { name: "Federal Reserve Meeting Minutes", url: "#" },
            { name: "NewsAPI Economics Analysis", url: "#" },
            { name: "Financial Times Market Coverage", url: "#" }
          ],
          component: BriefingCard
        },
        {
          id: 4,
          title: "Tech Sector Earnings Surge Amid AI Investment Boom",
          category: "Market Analysis",
          date: "2024-01-14",
          summary: "Major technology companies report stronger-than-expected earnings as AI investments drive growth across the sector.",
          keyPoints: [
            "AI-related revenue up 40% year-over-year",
            "Cloud computing services see record adoption",
            "Semiconductor demand continues to surge",
            "Venture capital flowing into AI startups"
          ],
          analysis: "The technology sector is experiencing unprecedented growth driven by AI adoption across industries. This trend is likely to continue as businesses invest heavily in AI infrastructure and capabilities.",
          personalImpact: "Your tech stock investments are likely benefiting from this sector-wide growth. Consider reviewing your tech allocation and potential opportunities in AI-focused companies.",
          stakeRelevance: [
            {
              area: "Investment Portfolio",
              explanation: "Your tech stock holdings are directly benefiting from the AI investment boom and sector growth"
            }
          ],
          sources: [
            { name: "Financial Times Tech Coverage", url: "#" },
            { name: "NewsAPI Markets", url: "#" },
            { name: "TechCrunch Analysis", url: "#" }
          ],
          component: BriefingCard
        }
      ]
    },
    career: {
      name: "Career & Industry",
      description: "You work in the technology sector as a software engineer",
      briefings: [
        {
          id: 2,
          title: "EU Parliament Approves Comprehensive AI Regulation Framework",
          category: "Technology Regulation",
          date: "2024-01-14",
          summary: "The European Parliament has approved the landmark AI Act, establishing the world's first comprehensive regulatory framework for artificial intelligence, with significant implications for global tech companies and AI development.",
          keyPoints: [
            "Risk-based approach to AI regulation",
            "Strict requirements for high-risk AI systems",
            "Transparency obligations for AI developers",
            "Penalties up to 7% of global revenue for violations"
          ],
          analysis: "The EU's AI Act represents a watershed moment in technology regulation, setting a global precedent for AI governance. The framework's risk-based approach balances innovation with safety, but compliance costs may reshape the competitive landscape for AI companies.",
          personalImpact: "As a technology professional, this regulation may impact your company's AI development roadmap and compliance requirements. Monitor how your organization adapts to these new regulatory standards.",
          stakeRelevance: [
            {
              area: "Career & Industry",
              explanation: "As a software engineer in tech, AI regulation directly impacts your work environment, potential projects, and industry standards"
            }
          ],
          sources: [
            { name: "European Parliament Official Release", url: "#" },
            { name: "TechCrunch Analysis", url: "#" },
            { name: "MIT Technology Review", url: "#" }
          ],
          component: BriefingCard
        },
        {
          id: 5,
          title: "Remote Work Policies Face New Challenges in Tech Sector",
          category: "Workplace Policy",
          date: "2024-01-13",
          summary: "Major tech companies are reassessing remote work policies as productivity data and employee preferences evolve.",
          keyPoints: [
            "Hybrid models showing mixed productivity results",
            "Employee retention linked to flexibility",
            "Office space costs vs. productivity gains",
            "New collaboration tools changing dynamics"
          ],
          analysis: "The remote work experiment in tech is entering a new phase as companies balance productivity metrics with employee preferences and operational costs.",
          personalImpact: "This could affect your work arrangements and career opportunities. Stay informed about your company's evolving policies and industry trends.",
          stakeRelevance: [
            {
              area: "Career & Industry",
              explanation: "As a software engineer, remote work policies directly affect your daily work environment and career flexibility"
            }
          ],
          sources: [
            { name: "Harvard Business Review", url: "#" },
            { name: "Tech Industry Reports", url: "#" },
            { name: "Workplace Analytics", url: "#" }
          ],
          component: BriefingCard
        }
      ]
    },
    personal: {
      name: "Personal Values & Beliefs",
      description: "You have expressed interest in climate action and environmental policy",
      briefings: [
        {
          id: 3,
          title: "Climate Summit Yields Historic Agreement on Renewable Energy Targets",
          category: "Climate Policy",
          date: "2024-01-13",
          summary: "Global leaders at the COP29 summit have reached a historic agreement to triple renewable energy capacity by 2030, with unprecedented commitments from major economies and developing nations.",
          keyPoints: [
            "Triple renewable energy capacity by 2030",
            "$100 billion annual climate finance commitment",
            "Phase-out timeline for fossil fuel subsidies",
            "Technology transfer framework for developing nations"
          ],
          analysis: "This agreement represents the most ambitious climate action plan in history, with concrete targets and funding mechanisms. The commitment to triple renewable energy capacity will accelerate the global energy transition and create new market opportunities.",
          personalImpact: "This development presents significant opportunities in renewable energy investments and may impact your portfolio's exposure to traditional energy sectors. Consider reviewing energy-related holdings.",
          stakeRelevance: [
            {
              area: "Personal Values",
              explanation: "This aligns with your interest in climate action and represents a major step toward environmental goals you care about"
            },
            {
              area: "Investment Portfolio",
              explanation: "Renewable energy investments may benefit from this agreement, potentially affecting your portfolio strategy"
            }
          ],
          sources: [
            { name: "UN Climate Summit Official Statement", url: "#" },
            { name: "Financial Times Climate Coverage", url: "#" },
            { name: "Nature Climate Change Analysis", url: "#" }
          ],
          component: BriefingCard
        },
        {
          id: 6,
          title: "Electric Vehicle Adoption Accelerates Beyond Expectations",
          category: "Environmental Policy",
          date: "2024-01-12",
          summary: "Global EV sales exceed projections as infrastructure improvements and policy incentives drive adoption across major markets.",
          keyPoints: [
            "EV market share reaches 15% globally",
            "Charging infrastructure expands rapidly",
            "Government incentives proving effective",
            "Battery technology improvements continue"
          ],
          analysis: "The electric vehicle transition is accelerating faster than predicted, driven by technological improvements, policy support, and changing consumer preferences.",
          personalImpact: "This rapid transition affects both your environmental values and potential investment opportunities in the EV sector and related technologies.",
          stakeRelevance: [
            {
              area: "Personal Values",
              explanation: "EV adoption directly supports your environmental values and climate action goals"
            },
            {
              area: "Investment Portfolio",
              explanation: "EV-related investments may present opportunities as the sector grows rapidly"
            }
          ],
          sources: [
            { name: "International Energy Agency", url: "#" },
            { name: "NewsAPI New Energy Finance", url: "#" },
            { name: "Environmental Research", url: "#" }
          ],
          component: BriefingCard
        }
      ]
    }
  };
  
  function handleViewDetails(briefing) {
    selectedBriefing = briefing;
    isModalOpen = true;
  }
  
  function closeModal() {
    isModalOpen = false;
    selectedBriefing = null;
  }
</script>

<svelte:head>
  <title>Daily Briefings - Political Briefing</title>
</svelte:head>

<div class="min-h-screen bg-scholar-dark text-scholar-cream">
  <header class="bg-scholar-black border-b border-scholar-gray">
    <div class="w-full px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center py-8">
        <div class="flex items-center space-x-6">
          <a href="/dashboard" class="text-scholar-gold hover:text-scholar-gold-light transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </a>
          <div>
            <h1 class="text-heading text-3xl mb-2">Daily Briefings</h1>
            <p class="text-body text-base">AI-powered analysis of developments affecting your areas of stake</p>
          </div>
        </div>
        <div class="text-mono text-base">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>
    </div>
  </header>

  <main class="w-full px-4 sm:px-6 lg:px-8 py-12">
    <!-- Transparency Notice -->
    <div class="bg-scholar-gold bg-opacity-10 border border-scholar-gold rounded-lg p-6 mb-12">
      <p class="text-body text-base">
        Briefings selected based on your stake areas. Each card shows why it's relevant to you.
      </p>
    </div>
    
    <!-- Briefings Grouped by Stake Area -->
    <div class="space-y-12">
      {#each Object.entries(userStakeAreas) as [key, stakeArea]}
        <StakeAreaGroup 
          stakeArea={stakeArea.name}
          description={stakeArea.description}
          briefings={stakeArea.briefings}
          onViewDetails={handleViewDetails}
        />
      {/each}
    </div>
  </main>
  
  <BriefingModal 
    briefing={selectedBriefing} 
    isOpen={isModalOpen} 
    on:close={closeModal} 
  />
</div> 