import React, { useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  IconButton
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';

const StockDashboard = () => {
  const [stocks, setStocks] = useState([]);
  const [newSymbol, setNewSymbol] = useState('');

  const handleAddStock = () => {
    if (!newSymbol) return;
    
    // Mock data for demonstration
    const mockData = {
      currentPrice: (Math.random() * 1000).toFixed(2),
      change: (Math.random() * 10 - 5).toFixed(2)
    };
    
    setStocks(prev => [...prev, { symbol: newSymbol, data: mockData }]);
    setNewSymbol('');
  };

  const handleRemoveStock = (symbol) => {
    setStocks(prev => prev.filter(stock => stock.symbol !== symbol));
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <TextField
                label="Stock Symbol"
                value={newSymbol}
                onChange={(e) => setNewSymbol(e.target.value.toUpperCase())}
                placeholder="Enter stock symbol (e.g., AAPL)"
                fullWidth
              />
              <Button
                variant="contained"
                onClick={handleAddStock}
                startIcon={<AddIcon />}
              >
                Add Stock
              </Button>
            </Box>
          </Paper>
        </Grid>

        {stocks.map((stock) => (
          <Grid item xs={12} sm={6} md={4} key={stock.symbol}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="div">
                  {stock.symbol}
                </Typography>
                <Typography color="text.secondary">
                  Current Price: ${stock.data.currentPrice}
                </Typography>
                <Typography variant="body2" color={stock.data.change >= 0 ? 'green' : 'red'}>
                  Change: {stock.data.change}%
                </Typography>
              </CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
                <IconButton
                  color="error"
                  onClick={() => handleRemoveStock(stock.symbol)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Card>
          </Grid>
        ))}

        {stocks.length === 0 && (
          <Grid item xs={12}>
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                No stocks added yet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Add a stock symbol to start tracking
              </Typography>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default StockDashboard; 