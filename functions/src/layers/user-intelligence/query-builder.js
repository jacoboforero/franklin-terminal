/**
 * Query Builder
 * Converts user preferences into optimized NewsAPI queries
 */

/**
 * Build optimized NewsAPI queries from user preferences
 * @param {Object} preferences - User preferences from profile analyzer
 * @returns {Object} NewsAPI query object
 */
function buildSourceQueries(preferences) {
  // Generate multiple query variations for maximum coverage
  const queries = generateQueryVariations(preferences);

  // For NewsAPI, we'll use the highest priority query
  const primaryQuery = queries[0];

  return {
    newsapi: primaryQuery,
  };
}

/**
 * Generate multiple query variations from user preferences
 * @param {Object} preferences - User preferences
 * @returns {Array} Array of NewsAPI query objects
 */
function generateQueryVariations(preferences) {
  const variations = [];

  // 1. Primary query - combines top keywords with Boolean logic
  const primaryQuery = buildPrimaryQuery(preferences);
  variations.push(primaryQuery);

  // 2. Topic-specific queries - one for each major topic
  const topicQueries = buildTopicQueries(preferences);
  variations.push(...topicQueries);

  // 3. Company/industry-specific query
  if (preferences.industry || preferences.company) {
    const industryQuery = buildIndustryQuery(preferences);
    variations.push(industryQuery);
  }

  // 4. Investment-focused query
  if (preferences.hasInvestments) {
    const investmentQuery = buildInvestmentQuery(preferences);
    variations.push(investmentQuery);
  }

  // 5. Geographic-focused query
  if (preferences.regions && preferences.regions.length > 0) {
    const geoQuery = buildGeographicQuery(preferences);
    variations.push(geoQuery);
  }

  return variations;
}

/**
 * Build primary query combining all user interests
 * @param {Object} preferences - User preferences
 * @returns {Object} NewsAPI query object
 */
function buildPrimaryQuery(preferences) {
  const query = {
    pageSize: preferences.pageSize,
    sortBy: preferences.sortBy,
    language: preferences.language,
  };

  // Build complex query string using Boolean logic
  const queryParts = [];

  // Add high-priority keyword sets (industry, policy topics)
  const highPriorityKeywords = getHighPriorityKeywords(preferences);
  if (highPriorityKeywords.length > 0) {
    queryParts.push(`(${highPriorityKeywords.join(" OR ")})`);
  }

  // Add medium-priority keywords with AND logic
  const mediumPriorityKeywords = getMediumPriorityKeywords(preferences);
  if (mediumPriorityKeywords.length > 0) {
    queryParts.push(`+(${mediumPriorityKeywords.join(" OR ")})`);
  }

  // Exclude irrelevant content
  const excludeTerms = getExcludeTerms(preferences);
  if (excludeTerms.length > 0) {
    queryParts.push(`-(${excludeTerms.join(" OR ")})`);
  }

  query.q = queryParts.join(" ");

  // Add domain restrictions
  if (preferences.domains && preferences.domains.length > 0) {
    query.domains = preferences.domains.join(",");
  }

  if (preferences.excludeDomains && preferences.excludeDomains.length > 0) {
    query.excludeDomains = preferences.excludeDomains.join(",");
  }

  // Add date range (last 7 days for most relevant content)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  query.from = sevenDaysAgo.toISOString().split("T")[0];

  return query;
}

/**
 * Build topic-specific queries
 * @param {Object} preferences - User preferences
 * @returns {Array} Array of topic-specific queries
 */
function buildTopicQueries(preferences) {
  const queries = [];

  // Find policy topic keyword sets
  const policyKeywordSets = preferences.keywordSets.filter(
    (set) => set.type === "policy"
  );

  for (const keywordSet of policyKeywordSets) {
    const query = {
      pageSize: Math.floor(
        preferences.pageSize / Math.max(policyKeywordSets.length, 2)
      ),
      sortBy: preferences.sortBy,
      language: preferences.language,
    };

    // Build topic-specific query
    const topicKeywords = keywordSet.keywords.slice(0, 5); // Top 5 keywords for the topic
    query.q = `(${topicKeywords.join(" OR ")})`;

    // Add geographic context if relevant
    if (preferences.regions && preferences.regions.length > 0) {
      const geoTerms = preferences.regions.slice(0, 3).join(" OR ");
      query.q += ` +(${geoTerms})`;
    }

    // Add domain restrictions
    if (preferences.domains && preferences.domains.length > 0) {
      query.domains = preferences.domains.join(",");
    }

    // Recent articles for topics
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    query.from = threeDaysAgo.toISOString().split("T")[0];

    queries.push(query);
  }

  return queries;
}

/**
 * Build industry-specific query
 * @param {Object} preferences - User preferences
 * @returns {Object} Industry-specific NewsAPI query
 */
function buildIndustryQuery(preferences) {
  const query = {
    pageSize: Math.floor(preferences.pageSize * 0.3), // 30% of total articles
    sortBy: preferences.sortBy,
    language: preferences.language,
  };

  const queryParts = [];

  // Industry keywords
  if (preferences.industry) {
    const industryKeywordSet = preferences.keywordSets.find(
      (set) => set.type === "industry"
    );
    if (industryKeywordSet) {
      const industryTerms = industryKeywordSet.keywords
        .slice(0, 8)
        .join(" OR ");
      queryParts.push(`(${industryTerms})`);
    }
  }

  // Company-specific terms
  if (preferences.company) {
    const companyKeywordSet = preferences.keywordSets.find(
      (set) => set.type === "company"
    );
    if (companyKeywordSet) {
      const companyTerms = companyKeywordSet.keywords.join(" OR ");
      queryParts.push(`+(${companyTerms})`);
    }
  }

  // Add regulatory/policy context
  queryParts.push(
    "+(regulation OR policy OR law OR government OR SEC OR FDA OR FTC OR antitrust)"
  );

  query.q = queryParts.join(" ");

  // Industry-specific domains
  if (preferences.industry === "Technology") {
    query.domains =
      "techcrunch.com,arstechnica.com,theverge.com,wired.com,reuters.com,bloomberg.com";
  } else if (preferences.industry === "Finance") {
    query.domains =
      "bloomberg.com,reuters.com,wsj.com,ft.com,marketwatch.com,cnbc.com";
  } else if (preferences.domains) {
    query.domains = preferences.domains.join(",");
  }

  // Recent news for industry impact
  const fiveDaysAgo = new Date();
  fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
  query.from = fiveDaysAgo.toISOString().split("T")[0];

  return query;
}

/**
 * Build investment-focused query
 * @param {Object} preferences - User preferences
 * @returns {Object} Investment-focused NewsAPI query
 */
function buildInvestmentQuery(preferences) {
  const query = {
    pageSize: Math.floor(preferences.pageSize * 0.25), // 25% of total articles
    sortBy: "relevancy", // Most relevant for investment decisions
    language: preferences.language,
  };

  const investmentKeywordSet = preferences.keywordSets.find(
    (set) => set.type === "investment"
  );
  let queryParts = [];

  if (investmentKeywordSet) {
    const investmentTerms = investmentKeywordSet.keywords.join(" OR ");
    queryParts.push(`(${investmentTerms})`);
  }

  // Add market impact terms
  queryParts.push(
    "+(earnings OR SEC OR regulation OR market OR stock OR shares OR investor)"
  );

  // Exclude purely technical analysis
  queryParts.push("-(technical analysis OR chart pattern OR trading strategy)");

  query.q = queryParts.join(" ");

  // Financial news sources
  query.domains =
    "bloomberg.com,reuters.com,wsj.com,marketwatch.com,cnbc.com,ft.com,axios.com";

  // Recent financial news
  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
  query.from = threeDaysAgo.toISOString().split("T")[0];

  return query;
}

/**
 * Build geographic-focused query
 * @param {Object} preferences - User preferences
 * @returns {Object} Geographic-focused NewsAPI query
 */
function buildGeographicQuery(preferences) {
  const query = {
    pageSize: Math.floor(preferences.pageSize * 0.2), // 20% of total articles
    sortBy: preferences.sortBy,
    language: preferences.language,
  };

  const geoKeywordSets = preferences.keywordSets.filter(
    (set) => set.type === "geographic"
  );
  const geoTerms = [];

  for (const keywordSet of geoKeywordSets) {
    geoTerms.push(...keywordSet.keywords.slice(0, 3)); // Top 3 keywords per region
  }

  if (geoTerms.length > 0) {
    query.q = `(${geoTerms.join(
      " OR "
    )}) +(policy OR regulation OR government OR politics OR international)`;
  }

  // Add domain restrictions
  if (preferences.domains) {
    query.domains = preferences.domains.join(",");
  }

  // Recent international news
  const fiveDaysAgo = new Date();
  fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
  query.from = fiveDaysAgo.toISOString().split("T")[0];

  return query;
}

/**
 * Get high-priority keywords from user preferences
 * @param {Object} preferences - User preferences
 * @returns {Array} High-priority keywords
 */
function getHighPriorityKeywords(preferences) {
  const keywords = [];

  // Industry keywords (highest weight)
  const industrySet = preferences.keywordSets.find(
    (set) => set.type === "industry"
  );
  if (industrySet) {
    keywords.push(...industrySet.keywords.slice(0, 6));
  }

  // Policy topic keywords
  const policySet = preferences.keywordSets.find(
    (set) => set.type === "policy" && set.priority === "high"
  );
  if (policySet) {
    keywords.push(...policySet.keywords.slice(0, 5));
  }

  return keywords;
}

/**
 * Get medium-priority keywords from user preferences
 * @param {Object} preferences - User preferences
 * @returns {Array} Medium-priority keywords
 */
function getMediumPriorityKeywords(preferences) {
  const keywords = [];

  // Geographic keywords
  const geoSets = preferences.keywordSets.filter(
    (set) => set.type === "geographic"
  );
  for (const geoSet of geoSets) {
    keywords.push(...geoSet.keywords.slice(0, 2));
  }

  // Company keywords
  const companySet = preferences.keywordSets.find(
    (set) => set.type === "company"
  );
  if (companySet) {
    keywords.push(...companySet.keywords.slice(0, 3));
  }

  return keywords;
}

/**
 * Get terms to exclude from queries
 * @param {Object} preferences - User preferences
 * @returns {Array} Terms to exclude
 */
function getExcludeTerms(preferences) {
  const excludeTerms = [
    "sports",
    "entertainment",
    "celebrity",
    "fashion",
    "lifestyle",
    "recipe",
    "travel",
    "horoscope",
    "weather forecast",
  ];

  // Exclude topics user didn't select
  const allPolicyTopics = [
    "Climate Policy",
    "Economic Policy",
    "Foreign Relations",
    "Technology Regulation",
    "Healthcare",
    "Education",
    "Immigration",
    "Defense",
  ];

  const userTopics = preferences.policyTopics || [];
  const unselectedTopics = allPolicyTopics.filter(
    (topic) => !userTopics.includes(topic)
  );

  // Add some exclusions for unselected topics (but not too aggressive)
  if (!userTopics.includes("Sports")) {
    excludeTerms.push("NFL", "NBA", "MLB", "Olympics");
  }

  return excludeTerms;
}

/**
 * Optimize query length for NewsAPI (max 500 characters)
 * @param {string} query - Query string
 * @returns {string} Optimized query string
 */
function optimizeQueryLength(query) {
  if (query.length <= 500) {
    return query;
  }

  // Truncate query while preserving Boolean logic
  const truncated = query.substring(0, 480);
  const lastComplete = truncated.lastIndexOf(")");

  if (lastComplete > 400) {
    return truncated.substring(0, lastComplete + 1);
  }

  return truncated;
}

/**
 * Build query for specific user segment
 * @param {string} segment - User segment
 * @param {Object} preferences - User preferences
 * @returns {Object} Segment-optimized query
 */
function buildSegmentQuery(segment, preferences) {
  const baseQuery = buildPrimaryQuery(preferences);

  switch (segment) {
    case "power_user":
      // Power users want comprehensive coverage
      baseQuery.pageSize = Math.min(baseQuery.pageSize * 1.5, 100);
      baseQuery.sortBy = "relevancy";
      break;

    case "engaged_user":
      // Engaged users want balanced coverage
      baseQuery.sortBy = "relevancy";
      break;

    case "topic_focused":
      // Topic-focused users want specific content
      baseQuery.pageSize = Math.floor(baseQuery.pageSize * 0.8);
      baseQuery.sortBy = "publishedAt";
      break;

    case "general_user":
      // General users want digestible content
      baseQuery.pageSize = Math.floor(baseQuery.pageSize * 0.6);
      baseQuery.sortBy = "publishedAt";
      break;
  }

  return baseQuery;
}

module.exports = {
  buildSourceQueries,
  generateQueryVariations,
  buildPrimaryQuery,
  buildTopicQueries,
  buildIndustryQuery,
  buildInvestmentQuery,
  buildGeographicQuery,
  buildSegmentQuery,
  optimizeQueryLength,
};
