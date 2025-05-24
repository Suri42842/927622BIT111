import React from 'react';
import { Paper, Typography, Grid, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const COLORS = [
  'rgb(75, 192, 192)',
  'rgb(255, 99, 132)',
  'rgb(54, 162, 235)',
  'rgb(255, 206, 86)',
  'rgb(153, 102, 255)',
  'rgb(255, 159, 64)'
];

function StockStatistics({ stockData, calculations, selectedStocks }) {
  const chartData = {
    labels: Object.keys(Object.values(stockData)[0] || {}),
    datasets: selectedStocks.map((symbol, index) => ({
      label: symbol,
      data: Object.values(stockData[symbol] || {}),
      borderColor: COLORS[index % COLORS.length],
      tension: 0.1
    }))
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Stock Price History'
      }
    },
    scales: {
      y: {
        beginAtZero: false
      }
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper elevation={3} sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>Price History</Typography>
          <Line data={chartData} options={chartOptions} />
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper elevation={3} sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>Individual Stock Statistics</Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Stock</TableCell>
                  <TableCell align="right">Mean</TableCell>
                  <TableCell align="right">Std Dev</TableCell>
                  <TableCell align="right">Variance</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedStocks.map((symbol) => (
                  <TableRow key={symbol}>
                    <TableCell>{symbol}</TableCell>
                    <TableCell align="right">{calculations[symbol]?.mean.toFixed(2)}</TableCell>
                    <TableCell align="right">{calculations[symbol]?.stdDev.toFixed(2)}</TableCell>
                    <TableCell align="right">{calculations[symbol]?.variance.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper elevation={3} sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>Stock Correlations</Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Stocks</TableCell>
                  <TableCell align="right">Correlation</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedStocks.map((stock1, i) => 
                  selectedStocks.slice(i + 1).map((stock2) => (
                    <TableRow key={`${stock1}-${stock2}`}>
                      <TableCell>{`${stock1} vs ${stock2}`}</TableCell>
                      <TableCell align="right">
                        {calculations[`${stock1}-${stock2}`]?.correlation.toFixed(4)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default StockStatistics; 