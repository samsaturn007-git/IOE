# News API Setup Guide

This guide will help you set up the News API integration for the Smart Mirror Interface.

## Getting Started

1. **Get an API Key**
   - Visit [NewsAPI.org](https://newsapi.org/)
   - Sign up for a free account
   - Get your API key from the dashboard

2. **Configure the Application**
   Create a `.env` file in the root directory with your API key:
   ```
   REACT_APP_NEWS_API_KEY=your_api_key_here
   ```

## Available Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_NEWS_API_KEY` | Your NewsAPI key | (required) |
| `REACT_APP_NEWS_CATEGORY` | News category | `technology` |
| `REACT_APP_NEWS_COUNTRY` | Country code | `us` |

## Testing the Integration

1. Start the development server:
   ```bash
   npm start
   ```

2. The news feed should now display real headlines from NewsAPI.

## Troubleshooting

- **No News Displayed**: Check your API key and internet connection
- **Rate Limit Exceeded**: The free tier has a limit of 100 requests per day
- **CORS Issues**: Ensure you're running the app on localhost during development

For more information, visit the [NewsAPI Documentation](https://newsapi.org/docs/).
