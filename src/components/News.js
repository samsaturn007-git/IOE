import React, { useState, useEffect, useRef } from 'react';
import config from '../config';
import './News.css';

const News = () => {
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const newsRef = useRef(null);

  // Fallback news in case API fails
  const fallbackNews = [
    {
      title: 'IoT Devices Reach 15 Billion Globally',
      source: 'Tech News',
      publishedAt: new Date().toISOString()
    },
    {
      title: 'Smart Home Technology Adoption Increases 40%',
      source: 'Innovation Daily',
      publishedAt: new Date().toISOString()
    },
    {
      title: 'AI Integration in Smart Mirrors Revolutionizes Daily Routines',
      source: 'Future Tech',
      publishedAt: new Date().toISOString()
    },
    {
      title: 'New Energy-Efficient IoT Sensors Released',
      source: 'Green Tech',
      publishedAt: new Date().toISOString()
    },
    {
      title: 'Breakthrough in Quantum Computing Announced',
      source: 'Science Today',
      publishedAt: new Date().toISOString()
    }
  ];

  useEffect(() => {
    // Fetch news from NewsAPI (free tier)
    const fetchNews = async () => {
      try {
        // Check if API key is configured
        if (config.NEWS_API_KEY === 'YOUR_API_KEY_HERE') {
          console.log('News API key not configured. Using fallback news.');
          setNewsItems(fallbackNews);
          setLoading(false);
          return;
        }

        const url = `https://newsapi.org/v2/top-headlines?country=${config.NEWS_COUNTRY}&category=${config.NEWS_CATEGORY}&pageSize=${config.NEWS_PAGE_SIZE}&apiKey=${config.NEWS_API_KEY}`;
        
        const response = await fetch(url);
        
        if (response.ok) {
          const data = await response.json();
          if (data.articles && data.articles.length > 0) {
            const formattedNews = data.articles
              .filter(article => article.title && article.title !== '[Removed]')
              .map(article => ({
                title: article.title,
                source: article.source.name,
                publishedAt: article.publishedAt
              }));
            setNewsItems(formattedNews.length > 0 ? formattedNews : fallbackNews);
          } else {
            setNewsItems(fallbackNews);
          }
        } else {
          console.log('News API request failed. Using fallback news.');
          setNewsItems(fallbackNews);
        }
      } catch (error) {
        console.log('Error fetching news. Using fallback news.');
        setNewsItems(fallbackNews);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
    
    // Refresh news based on config interval
    const refreshInterval = setInterval(fetchNews, config.NEWS_REFRESH_INTERVAL);
    
    return () => clearInterval(refreshInterval);
  }, []);

  useEffect(() => {
    if (newsItems.length === 0) return;
    
    // Rotate news based on config interval
    const interval = setInterval(() => {
      setCurrentNewsIndex((prevIndex) => (prevIndex + 1) % newsItems.length);
    }, config.NEWS_ROTATION_INTERVAL);

    return () => clearInterval(interval);
  }, [newsItems.length]);

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      // Swiped left - next news
      setCurrentNewsIndex((prevIndex) => (prevIndex + 1) % newsItems.length);
    }

    if (touchStart - touchEnd < -75) {
      // Swiped right - previous news
      setCurrentNewsIndex((prevIndex) => 
        prevIndex === 0 ? newsItems.length - 1 : prevIndex - 1
      );
    }
  };

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const publishedDate = new Date(dateString);
    const diffMs = now - publishedDate;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHours > 0) return `${diffHours}h ago`;
    return 'Just now';
  };

  if (loading) {
    return (
      <div className="news-container">
        <div className="news-header">
          <span>📰 Loading News...</span>
        </div>
      </div>
    );
  }

  if (newsItems.length === 0) {
    return null;
  }

  const currentNews = newsItems[currentNewsIndex];

  return (
    <div 
      className="news-container"
      ref={newsRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="news-header">
        <span>📰 News of the Day</span>
        <div className="news-indicators">
          {newsItems.map((_, index) => (
            <span 
              key={index} 
              className={`news-indicator ${index === currentNewsIndex ? 'active' : ''}`}
            />
          ))}
        </div>
      </div>
      <div className="news-items">
        <div key={currentNewsIndex} className="news-item">
          <div className="news-title">{currentNews.title}</div>
          <div className="news-meta">
            <span className="news-source">{currentNews.source}</span>
            <span className="news-time">{getTimeAgo(currentNews.publishedAt)}</span>
          </div>
        </div>
      </div>
      <div className="news-swipe-hint">← Swipe to navigate →</div>
    </div>
  );
};

export default News;
