const config = {
  apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  environment: process.env.REACT_APP_ENV || 'development',
  cacheDuration: parseInt(process.env.REACT_APP_CACHE_DURATION || '300000', 10),
  defaultTimeRange: '1M',
  maxStocks: 5,
  refreshInterval: 60000, // 1 minute
  alertThresholds: {
    min: 0,
    max: 1000000
  }
};

export default config; 