// src/services/api.js
const API_BASE_URL = 'http://localhost:8000';

export class AuthAPI {
  static async login(username, password) {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    const response = await fetch(`${API_BASE_URL}/auth/user_login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Login failed');
    }

    return response.json();
  }

  static getToken() {
    return localStorage.getItem('access_token');
  }

  static getAuthHeaders() {
    const token = this.getToken();
    return token ? {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    } : {
      'Content-Type': 'application/json',
    };
  }

  static logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('token_type');
  }

  static isAuthenticated() {
    return !!this.getToken();
  }
}

export class VahanAPI {
  static async searchResults(searchData) {
    const response = await fetch(`${API_BASE_URL}/results/get_results`, {
      method: 'POST',
      headers: AuthAPI.getAuthHeaders(),
      body: JSON.stringify(searchData),
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        AuthAPI.logout();
        throw new Error('AUTHENTICATION_ERROR');
      }
      
      let errorMessage = 'Search failed';
      try {
        const errorData = await response.json();
        errorMessage = errorData.detail || errorMessage;
      } catch {
        errorMessage = `Server error: ${response.status}`;
      }
      throw new Error(errorMessage);
    }

    return response.json();
  }

  // Add method to fetch results by reg_no or phone_no
  static async getResultDetails(regNo, phoneNo = null) {
    const payload = regNo ? { reg_no: regNo } : { phone_no: phoneNo };
    
    const response = await fetch(`${API_BASE_URL}/results/get_results`, {
      method: 'POST',
      headers: AuthAPI.getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        AuthAPI.logout();
        throw new Error('AUTHENTICATION_ERROR');
      }
      
      let errorMessage = 'Failed to fetch results';
      try {
        const errorData = await response.json();
        errorMessage = errorData.detail || errorMessage;
      } catch {
        errorMessage = `Server error: ${response.status}`;
      }
      throw new Error(errorMessage);
    }

    return response.json();
  }
}