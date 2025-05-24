import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Container, Typography, AppBar, Toolbar } from '@mui/material';
import StockDashboard from './components/StockDashboard';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    background: {
      default: '#f5f5f5',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
            <Typography variant="h6">
              Stock Market Dashboard
            </Typography>
        </Toolbar>
      </AppBar>
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <StockDashboard />
        </Container>
              </Box>
    </ThemeProvider>
  );
}

export default App;