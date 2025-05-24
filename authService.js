import api from './api';

class AuthService {
  constructor() {
    this.tokenKey = 'token';
    this.userKey = 'user';
    console.log('AuthService initialized');
  }

  async login(email, password) {
    try {
      console.log('AuthService: Attempting login with:', { email, password });
      
      // For development testing
      if (email === 'test@example.com' && password === 'test123') {
        console.log('AuthService: Using test credentials');
        const mockUser = {
          id: 1,
          email: email,
          name: 'Test User',
          avatar: null
        };
        const mockToken = 'test-token-123';
        
        // Set both token and user data
        this.setToken(mockToken);
        this.setUser(mockUser);
        
        console.log('AuthService: Test login successful');
        return mockUser;
      }

      const response = await api.post('/auth/login', { email, password });
      console.log('AuthService: Login response:', response.data);
      
      const { token, user } = response.data;
      
      this.setToken(token);
      this.setUser(user);
      
      return user;
    } catch (error) {
      console.error('AuthService: Login error details:', error);
      throw new Error(error.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  }

  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData);
      const { token, user } = response.data;
      
      this.setToken(token);
      this.setUser(user);
      
      return user;
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  }

  logout() {
    console.log('AuthService: Logging out');
    this.removeToken();
    this.removeUser();
    window.location.href = '/login';
  }

  setToken(token) {
    console.log('AuthService: Setting token');
    localStorage.setItem(this.tokenKey, token);
  }

  getToken() {
    const token = localStorage.getItem(this.tokenKey);
    console.log('AuthService: Getting token:', token ? 'Token exists' : 'No token');
    return token;
  }

  removeToken() {
    console.log('AuthService: Removing token');
    localStorage.removeItem(this.tokenKey);
  }

  setUser(user) {
    console.log('AuthService: Setting user:', user);
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  getUser() {
    const user = localStorage.getItem(this.userKey);
    console.log('AuthService: Getting user:', user ? 'User exists' : 'No user');
    return user ? JSON.parse(user) : null;
  }

  removeUser() {
    console.log('AuthService: Removing user');
    localStorage.removeItem(this.userKey);
  }

  isAuthenticated() {
    const token = this.getToken();
    const user = this.getUser();
    const isAuth = !!(token && user);
    console.log('AuthService: Checking authentication:', isAuth);
    return isAuth;
  }

  async refreshToken() {
    try {
      console.log('AuthService: Refreshing token');
      const response = await api.post('/auth/refresh-token');
      const { token } = response.data;
      this.setToken(token);
      return token;
    } catch (error) {
      console.error('AuthService: Token refresh error:', error);
      this.logout();
      throw error;
    }
  }
}

export default new AuthService(); 