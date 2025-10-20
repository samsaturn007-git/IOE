// Configuration file for API keys and settings

const config = {
  // Get your free API key from https://newsapi.org
  // Free tier: 100 requests per day
  NEWS_API_KEY: '4b9c96060c1748a98ab1bfee4e011c3c',
  
  // News API settings
  NEWS_COUNTRY: 'us', // Country code (us, gb, in, etc.)
  NEWS_CATEGORY: 'technology', // Category (technology, business, science, etc.)
  NEWS_PAGE_SIZE: 10, // Number of articles to fetch
  
  // Refresh intervals (in milliseconds)
  NEWS_REFRESH_INTERVAL: 30 * 60 * 1000, // 30 minutes
  NEWS_ROTATION_INTERVAL: 10 * 1000, // 10 seconds
  
  // Weather settings (for future API integration)
  WEATHER_LOCATION: 'San Francisco, CA',
};

export default config;
