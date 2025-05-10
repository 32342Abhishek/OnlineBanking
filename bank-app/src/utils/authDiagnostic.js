import { APP_CONFIG, API_CONFIG } from '../config';
import axiosInstance from '../api/axiosInstance';
import { authService } from '../api';

/**
 * Utility for diagnosing and resolving authentication issues
 */
const authDiagnostic = {
  /**
   * Check if user is currently authenticated
   * @returns {Object} Authentication status
   */
  checkAuthStatus: () => {
    console.log('Checking authentication status...');
    
    // Check localStorage directly
    const token = localStorage.getItem(APP_CONFIG.TOKEN_KEY);
    const userStr = localStorage.getItem(APP_CONFIG.USER_KEY);
    
    console.log('Token exists in localStorage:', !!token);
    console.log('User data exists in localStorage:', !!userStr);
    
    let userData = null;
    if (userStr) {
      try {
        userData = JSON.parse(userStr);
        console.log('User data parsed successfully:', userData);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    
    return {
      isAuthenticated: !!token,
      hasUserData: !!userData,
      token: token ? `${token.substring(0, 10)}...` : null,
      userData
    };
  },
  
  /**
   * Perform test login
   * @param {Object} credentials Login credentials
   * @returns {Promise<Object>} Login results
   */
  testLogin: async (credentials = { email: 'test@example.com', password: 'password123' }) => {
    try {
      console.log('Testing login with credentials:', credentials);
      
      // Clear existing auth data to start fresh
      localStorage.removeItem(APP_CONFIG.TOKEN_KEY);
      localStorage.removeItem(APP_CONFIG.USER_KEY);
      
      // First check server connectivity
      const connectionStatus = await authService.testConnection();
      if (!connectionStatus.success) {
        return {
          success: false,
          error: 'Backend server connection failed',
          details: connectionStatus
        };
      }
      
      // Try login
      const response = await axiosInstance.post(API_CONFIG.AUTH.LOGIN, credentials);
      console.log('Login response:', response.data);
      
      // Check localStorage after login
      setTimeout(() => {
        const token = localStorage.getItem(APP_CONFIG.TOKEN_KEY);
        const user = localStorage.getItem(APP_CONFIG.USER_KEY);
        console.log('After login - Token exists:', !!token);
        console.log('After login - User exists:', !!user);
      }, 100);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Test login failed:', error);
      return {
        success: false,
        error: error.message,
        status: error.response?.status,
        data: error.response?.data
      };
    }
  },
  
  /**
   * Check token storage
   * @returns {Object} Token storage status
   */
  checkTokenStorage: () => {
    console.log('Checking token storage...');
    
    // Check all possible storage locations
    const configTokenKey = APP_CONFIG.TOKEN_KEY;
    const hardcodedToken = localStorage.getItem('token');
    const configToken = localStorage.getItem(configTokenKey);
    
    console.log('Config token key:', configTokenKey);
    console.log('Token with config key exists:', !!configToken);
    console.log('Token with hardcoded key exists:', !!hardcodedToken);
    
    // Check if there's a mismatch
    const hasMismatch = (!configToken && hardcodedToken) || (configToken && hardcodedToken && configToken !== hardcodedToken);
    
    return {
      configTokenKey,
      hasConfigToken: !!configToken,
      hasHardcodedToken: !!hardcodedToken,
      hasMismatch,
      configToken: configToken ? `${configToken.substring(0, 10)}...` : null,
      hardcodedToken: hardcodedToken ? `${hardcodedToken.substring(0, 10)}...` : null
    };
  },
  
  /**
   * Migrate tokens from old storage keys to new ones
   * @returns {Object} Migration results
   */
  migrateTokens: () => {
    console.log('Migrating tokens from old keys to new keys...');
    
    const oldToken = localStorage.getItem('token');
    const oldUser = localStorage.getItem('user');
    
    if (!oldToken && !oldUser) {
      return {
        success: false,
        message: 'No tokens found with old keys'
      };
    }
    
    // Migrate token
    if (oldToken) {
      localStorage.setItem(APP_CONFIG.TOKEN_KEY, oldToken);
      console.log('Migrated token to new key:', APP_CONFIG.TOKEN_KEY);
    }
    
    // Migrate user data
    if (oldUser) {
      localStorage.setItem(APP_CONFIG.USER_KEY, oldUser);
      console.log('Migrated user data to new key:', APP_CONFIG.USER_KEY);
    }
    
    return {
      success: true,
      message: 'Token migration successful',
      tokenMigrated: !!oldToken,
      userDataMigrated: !!oldUser
    };
  },
  
  /**
   * Clear all authentication data
   * @returns {Object} Status
   */
  clearAuth: () => {
    console.log('Clearing all authentication data...');
    
    localStorage.removeItem(APP_CONFIG.TOKEN_KEY);
    localStorage.removeItem(APP_CONFIG.USER_KEY);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    return {
      success: true,
      message: 'All authentication data cleared'
    };
  }
};

export default authDiagnostic; 