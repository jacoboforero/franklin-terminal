<script>
  export let posts = [];

  function getPlatformConfig(platform) {
    const configs = {
      twitter: {
        name: "Twitter",
        icon: "🐦",
        color: "text-blue-400",
        bgColor: "bg-blue-400/10",
        borderColor: "border-blue-400/20",
        accentColor: "text-blue-400"
      },
      linkedin: {
        name: "LinkedIn",
        icon: "💼",
        color: "text-blue-600",
        bgColor: "bg-blue-600/10",
        borderColor: "border-blue-600/20",
        accentColor: "text-blue-600"
      },
      reddit: {
        name: "Reddit",
        icon: "🤖",
        color: "text-orange-500",
        bgColor: "bg-orange-500/10",
        borderColor: "border-orange-500/20",
        accentColor: "text-orange-500"
      }
    };
    return configs[platform] || configs.twitter;
  }

  function formatEngagement(engagement, platform) {
    if (platform === 'twitter') {
      return `${engagement.likes} • ${engagement.retweets} • ${engagement.replies}`;
    } else if (platform === 'linkedin') {
      return `${engagement.likes} • ${engagement.comments} • ${engagement.shares}`;
    } else if (platform === 'reddit') {
      return `${engagement.upvotes} ↑ • ${engagement.comments}`;
    }
    return '';
  }
</script>

<div class="card h-full flex flex-col">
  <div class="flex items-center space-x-2 mb-4">
    <span class="text-lg">📱</span>
    <span class="text-heading text-sm">Social Intelligence</span>
  </div>
  
  <div class="space-y-4 flex-grow overflow-y-auto">
    {#each posts as post}
      {@const platform = getPlatformConfig(post.platform)}
      <div class="p-4 bg-scholar-black bg-opacity-50 rounded-lg border border-scholar-gray hover:border-scholar-gold/30 transition-colors">
        <!-- Platform Header -->
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center space-x-2">
            <div class="w-8 h-8 rounded-full bg-scholar-gray flex items-center justify-center text-sm">
              {post.avatar}
            </div>
            <div class="flex items-center space-x-1">
              <span class="text-xs font-semibold text-scholar-cream">{post.author}</span>
              {#if post.verified}
                <span class="text-blue-400 text-xs">✓</span>
              {/if}
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <span class="text-xs {platform.color} font-mono">{platform.icon}</span>
            <span class="text-xs text-scholar-cream-dark font-mono">{post.time}</span>
          </div>
        </div>

        <!-- Handle and Platform -->
        <div class="flex items-center justify-between mb-3">
          <span class="text-xs text-scholar-gold font-mono">{post.handle}</span>
          <div class="px-2 py-1 rounded-full {platform.bgColor} {platform.borderColor} border">
            <span class="text-xs {platform.color} font-mono">{platform.name}</span>
          </div>
        </div>

        <!-- Content -->
        <p class="text-body text-sm leading-relaxed mb-3 line-clamp-3">
          {post.content}
        </p>

        <!-- Engagement -->
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <span class="text-xs text-scholar-cream-dark font-mono">
              {formatEngagement(post.engagement, post.platform)}
            </span>
          </div>
          <div class="text-xs text-scholar-gold font-mono">
            → {post.relevance}
          </div>
        </div>
      </div>
    {/each}
  </div>
  
  <div class="mt-4 pt-3 border-t border-scholar-gray">
    <div class="flex items-center justify-between">
      <span class="text-mono text-xs text-scholar-cream-dark">
      Curated for your stake areas
    </span>
      <div class="flex items-center space-x-1">
        <span class="w-2 h-2 rounded-full bg-blue-400"></span>
        <span class="w-2 h-2 rounded-full bg-blue-600"></span>
        <span class="w-2 h-2 rounded-full bg-orange-500"></span>
      </div>
    </div>
  </div>
</div>

<style>
  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style> 