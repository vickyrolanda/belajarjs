// JWT Utility Functions untuk Frontend

class JWTAuth {
  constructor() {
    this.tokenKey = 'authToken';
    this.userKey = 'user';
  }

  // Get token from localStorage
  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  // Get user info from localStorage
  getUser() {
    const user = localStorage.getItem(this.userKey);
    return user ? JSON.parse(user) : null;
  }

  // Save token and user info
  setAuth(token, user) {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  // Remove token and user info
  clearAuth() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  // Check if user is logged in
  isAuthenticated() {
    return !!this.getToken();
  }

  // Make authenticated API request
  async fetchWithAuth(url, options = {}) {
    const token = this.getToken();
    
    if (!token) {
      throw new Error('No token found');
    }

    const defaultOptions = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };

    const mergedOptions = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers
      }
    };

    const response = await fetch(url, mergedOptions);

    // Check if token is expired or invalid
    if (response.status === 401) {
      this.clearAuth();
      window.location.href = '/';
      throw new Error('Token expired or invalid');
    }

    return response;
  }

  // Verify token with server
  async verifyToken() {
    try {
      const response = await this.fetchWithAuth('/api/verify-token');
      
      if (response.ok) {
        const data = await response.json();
        return data.user;
      }
      
      return null;
    } catch (error) {
      console.error('Token verification failed:', error);
      this.clearAuth();
      return null;
    }
  }

  // Logout
  async logout() {
    try {
      await this.fetchWithAuth('/api/logout', {
        method: 'POST'
      });
    } catch (error) {
      console.error('Logout request failed:', error);
    }
    
    this.clearAuth();
    window.location.href = '/';
  }

  // Refresh token
  async refreshToken() {
    try {
      const response = await this.fetchWithAuth('/api/refresh-token', {
        method: 'POST'
      });
      
      if (response.ok) {
        const data = await response.json();
        const user = this.getUser();
        this.setAuth(data.token, user);
        return data.token;
      }
      
      return null;
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.clearAuth();
      return null;
    }
  }

  // Check authentication and redirect if needed
  checkAuthAndRedirect() {
    if (!this.isAuthenticated()) {
      window.location.href = '/';
      return false;
    }
    return true;
  }
}

// Create global instance
const auth = new JWTAuth();

// Auto-check token expiration every 5 minutes
setInterval(async () => {
  if (auth.isAuthenticated()) {
    const user = await auth.verifyToken();
    if (!user) {
      alert('Session expired. Please login again.');
      auth.clearAuth();
      window.location.href = '/';
    }
  }
}, 5 * 60 * 1000); // 5 minutes