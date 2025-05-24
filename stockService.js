import { stockApi } from './api';
import config from '../config';

class StockService {
  constructor() {
    this.cache = new Map();
  }

  async fetchStockData(symbol) {
    try {
      // Check cache first
      const cached = this.getCache(symbol);
      if (cached) return cached;

      const response = await stockApi.getStockData(symbol);
      if (!response.data) {
        throw new Error('No data received from API');
      }
      
      this.setCache(symbol, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching data for ${symbol}:`, error);
      // Return fallback data for development
      return this.getFallbackData(symbol);
    }
  }

  getFallbackData(symbol) {
    // Generate some mock data for development
    const data = {};
    const basePrice = Math.random() * 1000 + 100;
    const now = new Date();
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const price = basePrice + (Math.random() - 0.5) * 50;
      data[date.toISOString().split('T')[0]] = parseFloat(price.toFixed(2));
    }
    
    return data;
  }

  async getStockStats(symbol) {
    try {
      const response = await stockApi.getStockStats(symbol);
      return response.data;
    } catch (error) {
      console.error(`Error fetching stats for ${symbol}:`, error);
      // Calculate stats from fallback data
      const data = this.getFallbackData(symbol);
      return {
        mean: this.calculateMean(data),
        stdDev: this.calculateStandardDeviation(data),
        variance: Math.pow(this.calculateStandardDeviation(data), 2)
      };
    }
  }

  async getCorrelation(symbol1, symbol2) {
    try {
      const response = await stockApi.getCorrelation(symbol1, symbol2);
      return response.data;
    } catch (error) {
      console.error(`Error fetching correlation for ${symbol1}-${symbol2}:`, error);
      // Calculate correlation from fallback data
      const data1 = this.getFallbackData(symbol1);
      const data2 = this.getFallbackData(symbol2);
      return {
        correlation: this.calculatePearsonCorrelation(data1, data2)
      };
    }
  }

  calculateMean(data) {
    const values = Object.values(data);
    const sum = values.reduce((acc, val) => acc + val, 0);
    return sum / values.length;
  }

  calculateStandardDeviation(data) {
    const mean = this.calculateMean(data);
    const squaredDifferences = Object.values(data).map(value => Math.pow(value - mean, 2));
    const variance = squaredDifferences.reduce((acc, val) => acc + val, 0) / squaredDifferences.length;
    return Math.sqrt(variance);
  }

  calculateCovariance(data1, data2) {
    const mean1 = this.calculateMean(data1);
    const mean2 = this.calculateMean(data2);
    const keys = Object.keys(data1);
    
    let sum = 0;
    keys.forEach(key => {
      sum += (data1[key] - mean1) * (data2[key] - mean2);
    });
    
    return sum / keys.length;
  }

  calculatePearsonCorrelation(data1, data2) {
    const covariance = this.calculateCovariance(data1, data2);
    const stdDev1 = this.calculateStandardDeviation(data1);
    const stdDev2 = this.calculateStandardDeviation(data2);
    
    return covariance / (stdDev1 * stdDev2);
  }

  setCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  getCache(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < config.cacheDuration) {
      return cached.data;
    }
    return null;
  }

  async setPriceAlert(symbol, threshold) {
    if (threshold < config.alertThresholds.min || threshold > config.alertThresholds.max) {
      throw new Error(`Threshold must be between ${config.alertThresholds.min} and ${config.alertThresholds.max}`);
    }

    try {
      const response = await stockApi.setAlert(symbol, threshold);
      return response.data;
    } catch (error) {
      console.error(`Error setting alert for ${symbol}:`, error);
      throw error;
    }
  }

  async getAlerts() {
    try {
      const response = await stockApi.getAlerts();
      return response.data;
    } catch (error) {
      console.error('Error fetching alerts:', error);
      return [];
    }
  }

  async deleteAlert(alertId) {
    try {
      await stockApi.deleteAlert(alertId);
    } catch (error) {
      console.error(`Error deleting alert ${alertId}:`, error);
      throw error;
    }
  }
}

export default new StockService(); 