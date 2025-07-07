<script>
  import DashboardHeader from '$lib/components/layout/DashboardHeader.svelte';
  import BriefingWidget from '$lib/components/features/dashboard/widgets/BriefingWidget.svelte';
  import HeatMapWidget from '$lib/components/features/dashboard/widgets/HeatMapWidget.svelte';
  import StakeSummaryWidget from '$lib/components/features/dashboard/widgets/StakeSummaryWidget.svelte';
  import SocialWidget from '$lib/components/features/dashboard/widgets/SocialWidget.svelte';
  import ChartWidget from '$lib/components/features/dashboard/widgets/ChartWidget.svelte';
  import BriefingModal from '$lib/components/features/briefings/BriefingModal.svelte';
  
  let selectedBriefing = null;
  let isModalOpen = false;
  
  // Mock data for widgets
  const topBriefing = {
    title: "Federal Reserve Signals Potential Rate Cuts in Q2 2024",
    summary: "The Federal Reserve's latest meeting minutes reveal growing consensus among policymakers for potential interest rate cuts beginning in the second quarter of 2024.",
    date: "2024-01-15",
    stakeRelevance: [{ area: "Investment Portfolio" }]
  };
  
  const heatMapData = [
    { name: "Investment Portfolio", impact: 85 },
    { name: "Career & Industry", impact: 60 },
    { name: "Personal Values", impact: 40 }
  ];
  
  const stakeAreas = [
    {
      name: "Investment Portfolio",
      count: 3,
      developments: [
        { title: "Fed rate policy changes" },
        { title: "Tech sector earnings" },
        { title: "Market volatility" }
      ]
    },
    {
      name: "Career & Industry", 
      count: 2,
      developments: [
        { title: "AI regulation framework" },
        { title: "Remote work policies" }
      ]
    },
    {
      name: "Personal Values",
      count: 1,
      developments: [
        { title: "Climate summit agreement" }
      ]
    }
  ];
  
  const socialPosts = [
    {
      platform: "twitter",
      author: "Jerome Powell",
      handle: "@FedChair",
      content: "Inflation moving toward 2% target. Labor market strength allows for policy flexibility. We remain data-dependent in our approach.",
      time: "2h ago",
      relevance: "bond portfolio",
      engagement: { likes: 1247, retweets: 892, replies: 156 },
      verified: true,
      avatar: "🏛️"
    },
    {
      platform: "linkedin",
      author: "Sarah Chen",
      handle: "Tech Policy Analyst",
      content: "EU AI Act sets global precedent. Compliance costs may reshape competitive landscape. Companies need to prepare for 2024 implementation.",
      time: "4h ago", 
      relevance: "work environment",
      engagement: { likes: 89, comments: 23, shares: 12 },
      verified: false,
      avatar: "👩‍💼"
    },
    {
      platform: "reddit",
      author: "u/econ_insider",
      handle: "r/economics",
      content: "BREAKING: Fed minutes show growing dovish sentiment. Markets pricing in 3 rate cuts by end of year. This could be the pivot we've been waiting for.",
      time: "6h ago",
      relevance: "investment strategy",
      engagement: { upvotes: 2341, comments: 445 },
      verified: false,
      avatar: "📊"
    }
  ];
  
  const chartData = {
    title: "Tech Portfolio Performance",
    data: [
      { value: 60 }, { value: 75 }, { value: 65 }, { value: 80 }, { value: 85 }, { value: 90 }
    ],
    change: 2.3,
    explanation: "Fed policy optimism driving tech gains"
  };
  
  const quickActions = [
    {
      icon: "📰",
      title: "Briefings",
      description: "6 developments today",
      href: "/dashboard/briefings"
    },
    {
      icon: "🎯", 
      title: "Assessment",
      description: "Last updated 2 days ago",
      href: "/quiz"
    },
    {
      icon: "⚡",
      title: "Power Suite",
      description: "Advanced analysis tools",
      href: "/dashboard/power-suite"
    }
  ];
  
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
  <title>Dashboard - Franklin Terminal</title>
</svelte:head>

<div class="min-h-screen bg-scholar-dark text-scholar-cream">
  <DashboardHeader 
    title="Franklin Terminal"
    subtitle="The info you need"
    {quickActions}
  />
  
  <main class="w-full px-4 sm:px-6 lg:px-8 py-12">
    <!-- Widget Grid - Improved layout with better spacing -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 auto-rows-min">
      <!-- Row 1: Top Briefing (left side) -->
      <div class="lg:col-span-4 h-64">
        <BriefingWidget 
          briefing={topBriefing} 
          onViewDetails={() => handleViewDetails(topBriefing)} 
        />
      </div>

      <!-- Row 1: Heat Map (center, larger) - HIDDEN FOR NOW -->
      <!-- <div class="lg:col-span-5 h-80">
        <HeatMapWidget stakeAreas={heatMapData} />
      </div> -->
      
      <!-- Row 1: Stake Summary (right side) -->
      <div class="lg:col-span-8 h-64">
        <StakeSummaryWidget stakeArea={stakeAreas[0]} />
      </div>
      
      <!-- Row 2: Social Widget (full width, prominent) -->
      <div class="lg:col-span-12 h-96">
        <SocialWidget posts={socialPosts} />
      </div>
      
      <!-- Row 3: Chart (full width since QuickActions moved to header) -->
      <div class="lg:col-span-12 h-64">
        <ChartWidget chartData={chartData} />
      </div>
    </div>
  </main>
  
  <BriefingModal 
    briefing={selectedBriefing} 
    isOpen={isModalOpen} 
    on:close={closeModal} 
  />
</div> 