<script>
  export let stakeAreas = [];

  // Geographic regions with their impact levels and developments
  const regions = [
    {
      name: "United States",
      impact: 85,
      developments: ["Fed policy changes", "Tech regulation"],
      coordinates: "M 50 120 L 120 120 L 120 180 L 50 180 Z",
      color: "rgba(255, 215, 0, 0.85)"
    },
    {
      name: "European Union",
      impact: 75,
      developments: ["AI Act implementation", "Climate policies"],
      coordinates: "M 200 100 L 280 100 L 280 160 L 200 160 Z",
      color: "rgba(255, 215, 0, 0.75)"
    },
    {
      name: "China",
      impact: 60,
      developments: ["Tech export controls", "Economic stimulus"],
      coordinates: "M 350 120 L 420 120 L 420 180 L 350 180 Z",
      color: "rgba(255, 215, 0, 0.60)"
    },
    {
      name: "United Kingdom",
      impact: 45,
      developments: ["Brexit trade deals", "Financial regulations"],
      coordinates: "M 180 90 L 220 90 L 220 110 L 180 110 Z",
      color: "rgba(255, 215, 0, 0.45)"
    },
    {
      name: "Japan",
      impact: 40,
      developments: ["Monetary policy", "Tech partnerships"],
      coordinates: "M 380 110 L 420 110 L 420 130 L 380 130 Z",
      color: "rgba(255, 215, 0, 0.40)"
    }
  ];

  let hoveredRegion = null;

  function getRegionColor(region) {
    if (hoveredRegion === region.name) {
      return "rgba(255, 215, 0, 1)";
    }
    return region.color;
  }
</script>

<div class="card h-full flex flex-col">
  <div class="flex items-center space-x-2 mb-4">
    <span class="text-lg">🗺️</span>
    <span class="text-heading text-sm">Global Impact Heat Map</span>
  </div>
  
  <div class="flex-grow flex flex-col">
    <!-- Map Container -->
    <div class="relative flex-grow mb-4">
      <svg 
        viewBox="0 0 450 200" 
        class="w-full h-full"
        style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);"
      >
        <!-- Background grid -->
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#333" stroke-width="0.5" opacity="0.3"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        
        <!-- Ocean/background -->
        <rect width="100%" height="100%" fill="#1a1a1a" opacity="0.8" />
        
        <!-- Continental outlines (simplified) -->
        <path d="M 30 100 Q 100 80 180 90 L 220 90 Q 300 100 350 120 L 420 120 Q 430 140 420 160 L 350 180 Q 280 190 200 180 L 120 180 Q 80 170 50 160 Z" 
              fill="none" stroke="#444" stroke-width="1" opacity="0.6" />
        
        <!-- Region heat overlays -->
        {#each regions as region}
          <g>
            <path 
              d={region.coordinates}
              fill={getRegionColor(region)}
              stroke="#333"
              stroke-width="1"
              opacity="0.8"
              class="cursor-pointer transition-all duration-200"
              on:mouseenter={() => hoveredRegion = region.name}
              on:mouseleave={() => hoveredRegion = null}
            />
            <!-- Region label -->
            <text 
              x={region.coordinates.includes('M 50') ? 85 : region.coordinates.includes('M 200') ? 240 : region.coordinates.includes('M 350') ? 385 : region.coordinates.includes('M 180') ? 200 : 400}
              y={region.coordinates.includes('M 50') ? 155 : region.coordinates.includes('M 200') ? 135 : region.coordinates.includes('M 350') ? 155 : region.coordinates.includes('M 180') ? 105 : 125}
              class="text-xs font-mono fill-scholar-cream pointer-events-none"
              text-anchor="middle"
            >
              {region.name}
            </text>
          </g>
        {/each}
        
        <!-- Legend -->
        <g transform="translate(10, 10)">
          <rect x="0" y="0" width="120" height="60" fill="#1a1a1a" opacity="0.9" stroke="#444" stroke-width="1" rx="4" />
          <text x="60" y="15" class="text-xs font-mono fill-scholar-gold" text-anchor="middle">Impact Level</text>
          <rect x="10" y="20" width="20" height="8" fill="rgba(255, 215, 0, 0.4)" />
          <text x="35" y="27" class="text-xs font-mono fill-scholar-cream">Low</text>
          <rect x="10" y="32" width="20" height="8" fill="rgba(255, 215, 0, 0.6)" />
          <text x="35" y="39" class="text-xs font-mono fill-scholar-cream">Medium</text>
          <rect x="10" y="44" width="20" height="8" fill="rgba(255, 215, 0, 0.8)" />
          <text x="35" y="51" class="text-xs font-mono fill-scholar-cream">High</text>
        </g>
      </svg>
    </div>
    
    <!-- Region Details -->
    {#if hoveredRegion}
      {@const region = regions.find(r => r.name === hoveredRegion)}
      <div class="bg-scholar-black bg-opacity-50 rounded border border-scholar-gold/30 p-3">
        <div class="flex justify-between items-center mb-2">
          <span class="text-sm font-semibold text-scholar-gold">{region.name}</span>
          <span class="text-xs text-scholar-cream-dark font-mono">{region.impact}% impact</span>
        </div>
      <div class="space-y-1">
          {#each region.developments as dev}
            <div class="text-xs text-scholar-cream">• {dev}</div>
          {/each}
        </div>
      </div>
    {:else}
      <div class="bg-scholar-black bg-opacity-50 rounded border border-scholar-gray p-3">
        <div class="text-xs text-scholar-cream-dark font-mono">
          Hover over regions to see developments
        </div>
      </div>
    {/if}
  </div>
  
  <div class="mt-4 pt-3 border-t border-scholar-gray">
    <span class="text-mono text-xs">
      Based on today's global developments
    </span>
  </div>
</div> 