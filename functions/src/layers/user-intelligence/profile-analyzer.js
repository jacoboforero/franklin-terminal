/**
 * Profile Analyzer
 * Extracts searchable preferences from user profiles to generate targeted NewsAPI queries
 */

/**
 * Extract searchable preferences from user profile
 * @param {Object} userProfile - User profile from quiz
 * @returns {Object} Searchable preferences for query generation
 */
function extractSearchablePreferences(userProfile) {
  const preferences = {
    // Core search terms
    keywords: [],
    keywordSets: [], // Different keyword combinations

    // NewsAPI parameters
    sources: [],
    domains: [],
    excludeDomains: [],
    language: "en",
    sortBy: "relevancy",
    pageSize: 50,

    // User context
    userSegment: determineUserSegment(userProfile),
    expertiseLevel: userProfile.expertise || "Intermediate",
    timeAvailable: userProfile.timeAvailable || "10-20 minutes",

    // Geographic focus
    regions: userProfile.regions || [],
    location: userProfile.location || "",

    // Industry/career focus
    industry: userProfile.career?.industry || "",
    profession: userProfile.profession || userProfile.career?.role || "",
    company: userProfile.career?.company || "",

    // Policy interests
    policyTopics: userProfile.topics || [],

    // Investment interests
    hasInvestments: userProfile.investments?.hasPortfolio || false,
    investmentDetails: userProfile.investments?.details || "",

    // Personal stakes
    personalStakes: {
      religion: userProfile.personal?.religion || "",
      ethnicity: userProfile.personal?.ethnicity || "",
      nationality: userProfile.personal?.nationality || "",
    },
  };

  // Generate keyword sets based on user profile
  preferences.keywordSets = generateKeywordSets(userProfile);

  // Set query parameters based on expertise and time
  setQueryParameters(preferences, userProfile);

  // Add trusted news sources based on profile
  addTrustedSources(preferences, userProfile);

  return preferences;
}

/**
 * Generate keyword sets for different types of queries
 * @param {Object} userProfile - User profile
 * @returns {Array} Array of keyword sets
 */
function generateKeywordSets(userProfile) {
  const keywordSets = [];

  // 1. Industry-specific keywords
  if (userProfile.career?.industry) {
    const industryKeywords = generateIndustryKeywords(
      userProfile.career.industry
    );
    keywordSets.push({
      type: "industry",
      priority: "high",
      keywords: industryKeywords,
      weight: 0.3,
    });
  }

  // 2. Policy topic keywords
  if (userProfile.topics && userProfile.topics.length > 0) {
    for (const topic of userProfile.topics) {
      const policyKeywords = generatePolicyKeywords(topic);
      keywordSets.push({
        type: "policy",
        topic: topic,
        priority: "high",
        keywords: policyKeywords,
        weight: 0.25,
      });
    }
  }

  // 3. Geographic keywords
  if (userProfile.regions && userProfile.regions.length > 0) {
    for (const region of userProfile.regions) {
      const geoKeywords = generateGeographicKeywords(region);
      keywordSets.push({
        type: "geographic",
        region: region,
        priority: "medium",
        keywords: geoKeywords,
        weight: 0.2,
      });
    }
  }

  // 4. Investment keywords
  if (
    userProfile.investments?.hasPortfolio &&
    userProfile.investments?.details
  ) {
    const investmentKeywords = generateInvestmentKeywords(
      userProfile.investments.details
    );
    keywordSets.push({
      type: "investment",
      priority: "medium",
      keywords: investmentKeywords,
      weight: 0.15,
    });
  }

  // 5. Company-specific keywords
  if (userProfile.career?.company) {
    const companyKeywords = generateCompanyKeywords(userProfile.career.company);
    keywordSets.push({
      type: "company",
      priority: "medium",
      keywords: companyKeywords,
      weight: 0.1,
    });
  }

  // 6. Custom stake keywords
  if (userProfile.customStakes && userProfile.customStakes.length > 0) {
    const customKeywords = generateCustomStakeKeywords(
      userProfile.customStakes
    );
    keywordSets.push({
      type: "custom",
      priority: "medium",
      keywords: customKeywords,
      weight: 0.15,
    });
  }

  return keywordSets;
}

/**
 * Generate industry-specific keywords
 * @param {string} industry - User's industry
 * @returns {Array} Industry-related keywords
 */
function generateIndustryKeywords(industry) {
  const industryMap = {
    Technology: [
      "artificial intelligence",
      "AI regulation",
      "data privacy",
      "cybersecurity",
      "tech policy",
      "digital rights",
      "platform regulation",
      "cloud computing",
      "semiconductor",
      "software regulation",
      "tech earnings",
      "startup funding",
    ],
    Healthcare: [
      "healthcare policy",
      "FDA approval",
      "drug pricing",
      "medical regulation",
      "health insurance",
      "Medicare",
      "Medicaid",
      "pharmaceutical",
      "biotech",
      "telemedicine",
      "health data privacy",
      "medical devices",
    ],
    Finance: [
      "financial regulation",
      "banking policy",
      "interest rates",
      "Federal Reserve",
      "cryptocurrency regulation",
      "fintech",
      "securities law",
      "tax policy",
      "inflation",
      "monetary policy",
      "banking sector",
      "financial services",
    ],
    Education: [
      "education policy",
      "student loans",
      "higher education",
      "school funding",
      "education reform",
      "student debt",
      "university policy",
      "academic freedom",
      "education technology",
      "school choice",
      "teacher policy",
    ],
    Energy: [
      "energy policy",
      "renewable energy",
      "oil prices",
      "climate change",
      "carbon tax",
      "green energy",
      "fossil fuels",
      "nuclear energy",
      "solar power",
      "wind energy",
      "energy regulation",
      "utilities",
    ],
    "Real Estate": [
      "housing policy",
      "mortgage rates",
      "property taxes",
      "zoning laws",
      "real estate market",
      "housing crisis",
      "rental market",
      "construction",
      "urban planning",
      "affordable housing",
      "property law",
    ],
  };

  return industryMap[industry] || [industry.toLowerCase()];
}

/**
 * Generate policy topic keywords
 * @param {string} topic - Policy topic
 * @returns {Array} Policy-related keywords
 */
function generatePolicyKeywords(topic) {
  const policyMap = {
    "Climate Policy": [
      "climate change",
      "carbon emissions",
      "Paris Agreement",
      "green deal",
      "renewable energy",
      "environmental regulation",
      "carbon tax",
      "climate action",
      "sustainability",
      "clean energy",
    ],
    "Economic Policy": [
      "economic policy",
      "fiscal policy",
      "GDP growth",
      "unemployment",
      "inflation",
      "trade policy",
      "tariffs",
      "economic stimulus",
      "federal budget",
      "tax reform",
      "monetary policy",
    ],
    "Foreign Relations": [
      "foreign policy",
      "international relations",
      "diplomacy",
      "trade war",
      "sanctions",
      "NATO",
      "UN Security Council",
      "bilateral relations",
      "embassy",
      "international law",
      "global politics",
    ],
    "Technology Regulation": [
      "tech regulation",
      "data privacy",
      "antitrust",
      "platform liability",
      "AI governance",
      "digital rights",
      "cybersecurity policy",
      "internet regulation",
      "social media regulation",
    ],
    Healthcare: [
      "healthcare reform",
      "public health",
      "drug pricing",
      "health insurance",
      "medical regulation",
      "pandemic response",
      "vaccine policy",
      "mental health policy",
      "Medicare for All",
    ],
    Education: [
      "education policy",
      "student debt",
      "school choice",
      "federal funding",
      "higher education",
      "teacher policy",
      "academic freedom",
      "education reform",
      "school vouchers",
    ],
    Immigration: [
      "immigration policy",
      "border security",
      "asylum policy",
      "visa policy",
      "refugee policy",
      "immigration reform",
      "deportation",
      "green card",
      "citizenship policy",
      "border wall",
    ],
    Defense: [
      "defense policy",
      "military budget",
      "national security",
      "defense spending",
      "arms control",
      "military strategy",
      "veteran affairs",
      "defense contracts",
      "homeland security",
    ],
  };

  return policyMap[topic] || [topic.toLowerCase()];
}

/**
 * Generate geographic keywords
 * @param {string} region - Geographic region
 * @returns {Array} Region-related keywords
 */
function generateGeographicKeywords(region) {
  const regionMap = {
    "North America": [
      "United States",
      "Canada",
      "Mexico",
      "NAFTA",
      "USMCA",
      "US-Canada",
      "US-Mexico",
    ],
    Europe: [
      "European Union",
      "Brexit",
      "EU regulation",
      "European Parliament",
      "Germany",
      "France",
      "UK",
    ],
    "Asia-Pacific": [
      "China",
      "Japan",
      "South Korea",
      "India",
      "Australia",
      "ASEAN",
      "Indo-Pacific",
    ],
    "Middle East": [
      "Israel",
      "Saudi Arabia",
      "Iran",
      "UAE",
      "oil prices",
      "Middle East peace",
    ],
    Africa: [
      "South Africa",
      "Nigeria",
      "African Union",
      "sub-Saharan Africa",
      "North Africa",
    ],
    "Latin America": [
      "Brazil",
      "Argentina",
      "Chile",
      "Latin America",
      "South America",
    ],
  };

  return regionMap[region] || [region];
}

/**
 * Generate investment-related keywords
 * @param {string} investmentDetails - User's investment details
 * @returns {Array} Investment-related keywords
 */
function generateInvestmentKeywords(investmentDetails) {
  const keywords = [
    "stock market",
    "earnings",
    "SEC regulation",
    "financial markets",
  ];

  // Add specific keywords based on investment types mentioned
  if (investmentDetails.toLowerCase().includes("crypto")) {
    keywords.push(
      "cryptocurrency",
      "bitcoin",
      "crypto regulation",
      "digital currency"
    );
  }
  if (investmentDetails.toLowerCase().includes("real estate")) {
    keywords.push(
      "real estate market",
      "property prices",
      "mortgage rates",
      "housing market"
    );
  }
  if (investmentDetails.toLowerCase().includes("tech")) {
    keywords.push(
      "tech stocks",
      "technology sector",
      "tech earnings",
      "Silicon Valley"
    );
  }
  if (investmentDetails.toLowerCase().includes("energy")) {
    keywords.push(
      "energy stocks",
      "oil prices",
      "renewable energy stocks",
      "utilities"
    );
  }

  return keywords;
}

/**
 * Generate company-specific keywords
 * @param {string} company - User's company
 * @returns {Array} Company-related keywords
 */
function generateCompanyKeywords(company) {
  // For major companies, add specific regulatory topics
  const majorCompanies = {
    Microsoft: ["Microsoft", "Azure", "antitrust", "cloud computing"],
    Google: ["Google", "Alphabet", "search regulation", "antitrust"],
    Apple: ["Apple", "iPhone", "App Store", "privacy regulation"],
    Amazon: ["Amazon", "AWS", "e-commerce regulation", "antitrust"],
    Tesla: ["Tesla", "electric vehicles", "Elon Musk", "EV regulation"],
    Meta: ["Meta", "Facebook", "social media regulation", "content moderation"],
  };

  return majorCompanies[company] || [company];
}

/**
 * Generate keywords from custom stake areas
 * @param {Array} customStakes - Array of custom stake objects
 * @returns {Array} Custom stake related keywords
 */
function generateCustomStakeKeywords(customStakes) {
  const keywords = [];

  for (const stake of customStakes) {
    const stakeText = (stake.name || stake.description || "").toLowerCase();

    // Extract relevant keywords based on common patterns
    if (stakeText.includes("real estate") || stakeText.includes("property")) {
      keywords.push(
        "real estate market",
        "property prices",
        "housing policy",
        "mortgage rates"
      );
    }

    if (
      stakeText.includes("education") ||
      stakeText.includes("university") ||
      stakeText.includes("school")
    ) {
      keywords.push(
        "education policy",
        "student loans",
        "higher education",
        "school funding"
      );
    }

    if (
      stakeText.includes("healthcare") ||
      stakeText.includes("medical") ||
      stakeText.includes("health")
    ) {
      keywords.push(
        "healthcare policy",
        "medical regulation",
        "health insurance",
        "FDA"
      );
    }

    if (
      stakeText.includes("international") ||
      stakeText.includes("global") ||
      stakeText.includes("foreign")
    ) {
      keywords.push(
        "foreign policy",
        "international relations",
        "trade policy",
        "diplomacy"
      );
    }

    if (stakeText.includes("family") || stakeText.includes("relative")) {
      keywords.push("family policy", "social policy", "welfare", "tax policy");
    }

    // Add the original stake text as a keyword
    keywords.push(stake.name || stake.description);
  }

  return [...new Set(keywords)]; // Remove duplicates
}

/**
 * Determine user segment for targeting
 * @param {Object} userProfile - User profile
 * @returns {string} User segment
 */
function determineUserSegment(userProfile) {
  const expertise = userProfile.expertise || "Intermediate";
  const hasInvestments = userProfile.investments?.hasPortfolio || false;
  const policyTopics = userProfile.topics || [];

  if (expertise === "Expert" && hasInvestments && policyTopics.length >= 3) {
    return "power_user";
  } else if (expertise === "Advanced" || hasInvestments) {
    return "engaged_user";
  } else if (policyTopics.length >= 2) {
    return "topic_focused";
  } else {
    return "general_user";
  }
}

/**
 * Set query parameters based on user preferences
 * @param {Object} preferences - Preferences object to modify
 * @param {Object} userProfile - User profile
 */
function setQueryParameters(preferences, userProfile) {
  // Set page size based on time available and expertise
  const timeToPageSize = {
    "5-10 minutes": 20,
    "10-20 minutes": 35,
    "20-30 minutes": 50,
    "30+ minutes": 75,
  };

  preferences.pageSize = timeToPageSize[userProfile.timeAvailable] || 35;

  // Set sort order based on expertise
  if (
    userProfile.expertise === "Expert" ||
    userProfile.expertise === "Advanced"
  ) {
    preferences.sortBy = "relevancy"; // Experts want most relevant first
  } else {
    preferences.sortBy = "publishedAt"; // Beginners want newest first
  }

  // Set language
  preferences.language = "en"; // For now, English only
}

/**
 * Add trusted news sources based on user profile
 * @param {Object} preferences - Preferences object to modify
 * @param {Object} userProfile - User profile
 */
function addTrustedSources(preferences, userProfile) {
  // High-quality sources for political/policy news
  const trustedSources = [
    "reuters.com",
    "apnews.com",
    "bbc.com",
    "npr.org",
    "wsj.com",
    "nytimes.com",
    "washingtonpost.com",
    "politico.com",
    "axios.com",
    "bloomberg.com",
  ];

  // Industry-specific sources
  if (userProfile.career?.industry === "Technology") {
    trustedSources.push("techcrunch.com", "arstechnica.com", "theverge.com");
  }

  if (userProfile.career?.industry === "Finance") {
    trustedSources.push("ft.com", "marketwatch.com", "cnbc.com");
  }

  preferences.domains = trustedSources.slice(0, 15); // NewsAPI limit is 20 domains

  // Exclude unreliable sources
  preferences.excludeDomains = [
    "clickhole.com",
    "theonion.com",
    "babylonbee.com", // Satire sites
  ];
}

module.exports = {
  extractSearchablePreferences,
  generateKeywordSets,
  generateIndustryKeywords,
  generatePolicyKeywords,
  generateGeographicKeywords,
  generateInvestmentKeywords,
  generateCompanyKeywords,
  generateCustomStakeKeywords,
  determineUserSegment,
};
