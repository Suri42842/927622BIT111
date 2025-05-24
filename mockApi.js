// Mock API service for testing
const generateMockData = (symbol) => {
  const data = {};
  const basePrice = Math.random() * 1000 + 100;
  const now = new Date();
  
  // Generate 30 days of data
  for (let i = 0; i < 30; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const price = basePrice + (Math.random() - 0.5) * 50;
    data[date.toISOString().split('T')[0]] = parseFloat(price.toFixed(2));
  }
  
  return data;
};

const mockApi = {
  get: async (url) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const symbol = url.split('/').pop();
    return {
      data: generateMockData(symbol)
    };
  }
};

export default mockApi; 