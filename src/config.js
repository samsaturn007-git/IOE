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
  
  // Weather settings - OpenWeatherMap API (Free tier: 1000 calls/day)
  // Get your free API key from: https://openweathermap.org/api
  // Steps: 1. Sign up at openweathermap.org
  //        2. Go to API keys section
  //        3. Copy your API key below
  OPENWEATHER_API_KEY: 'b000c342a958ee282bc7de82c4122351', // Free tier API key
  WEATHER_LOCATION: 'Mumbai, India',
  WEATHER_REFRESH_INTERVAL: 10 * 60 * 1000, // 10 minutes
  
  // To-Do Integration Settings
  // Multiple options available - no Microsoft account required!
  
  // Option 1: LOCAL STORAGE (Default - No setup required)
  // - Works immediately
  // - Data stored in browser
  // - No account needed
  // - No mobile sync
  
  // Option 2: TODOIST (Free tier available)
  // - Get free account at: https://todoist.com
  // - Get API token: https://todoist.com/app/settings/integrations/developer
  // - Mobile app: iOS & Android
  // - Free tier: 300 tasks, 80 projects
  TODOIST_API_TOKEN: '97edc6b32e388caf085c0512283e2d2ca0c58fba', // Todoist API token configured
  
  // Option 3: MICROSOFT TO-DO (Optional)
  // To set up:
  // 1. Go to https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/ApplicationsListBlade
  // 2. Create a new app registration
  // 3. Add redirect URI: http://localhost:3000 (or your domain)
  // 4. Add API permissions: Tasks.Read, Tasks.ReadWrite
  // 5. Copy the Application (client) ID below
  MS_TODO_CLIENT_ID: 'YOUR_CLIENT_ID_HERE', // Replace with your Microsoft App Client ID
  MS_TODO_SCOPES: 'Tasks.Read Tasks.ReadWrite',
  
  // Gemini AI API Settings
  // Get your free API key from: https://makersuite.google.com/app/apikey
  // Free tier: 60 requests per minute
  GEMINI_API_KEY: 'AIzaSyCG2E12mguC5j34oikJl0IfdLFg5J-TWqw', // Replace with your Gemini API key
};

export default config;
