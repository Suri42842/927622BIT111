const TOKEN_KEY = 'stock_app_token';

export const authService = {
  setToken: (token) => {
    localStorage.setItem(TOKEN_KEY, token);
  },

  getToken: () => {
    return localStorage.getItem(TOKEN_KEY);
  },

  removeToken: () => {
    localStorage.removeItem(TOKEN_KEY);
  },

  isAuthenticated: () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return false;
    
    // Check if token is expired
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }
};

// Initialize with the provided token
authService.setToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQ4MDY0Mjk5LCJpYXQiOjE3NDgwNjM5OTksImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjJjY2FiZjc0LWZkYzQtNDk4Ni04MTljLTFkNWUxZjFiODRkYyIsInN1YiI6InBzdXJpeWEyMDA0QGdtYWlsLmNvbSJ9LCJlbWFpbCI6InBzdXJpeWEyMDA0QGdtYWlsLmNvbSIsIm5hbWUiOiJzdXJpeWEgcCIsInJvbGxObyI6IjkyNzYyMmJpdDExMSIsImFjY2Vzc0NvZGUiOiJ3aGVRVXkiLCJjbGllbnRJRCI6IjJjY2FiZjc0LWZkYzQtNDk4Ni04MTljLTFkNWUxZjFiODRkYyIsImNsaWVudFNlY3JldCI6IkdUTnNNa0FmUnBwWkdtamIifQ.M0yf5sIx4ywXy-0rTVrdyMBN3LNvXQ3t6JTeiExNSSo'); 