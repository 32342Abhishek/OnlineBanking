/**
 * Authentication utility functions for the banking application
 * Handles token management, validation, and refresh
 */

// Check if token is expired
export const isTokenExpired = () => {
  const expiryString = localStorage.getItem('tokenExpiry');
  if (!expiryString) return true;
  
  try {
    const expiry = new Date(expiryString);
    return expiry <= new Date();
  } catch (error) {
    console.error('Error parsing token expiry date:', error);
    return true;
  }
};

// Get the authentication token, checking for expiry
export const getAuthToken = () => {
  const token = localStorage.getItem('token');
  
  if (!token || isTokenExpired()) {
    // Token is missing or expired
    return null;
  }
  
  return token;
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = getAuthToken();
  const user = localStorage.getItem('user');
  
  return !!token && !!user;
};

// Refresh token (simulate token refresh)
// In a real application, this would make an API call to refresh the token
export const refreshToken = async () => {
  try {
    // In a real app, this would be an API call to refresh the token
    // For this demo, we'll just generate a new random token
    const newToken = "Bearer " + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
    localStorage.setItem('token', newToken);
    localStorage.setItem('tokenExpiry', new Date(Date.now() + 3600000).toISOString()); // Token expires in 1 hour
    
    return newToken;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return null;
  }
};

// Authenticate API request with current token
export const authenticateRequest = async (requestFn) => {
  try {
    let token = getAuthToken();
    
    // If token is expired or missing, try to refresh it
    if (!token) {
      token = await refreshToken();
      
      if (!token) {
        // Token refresh failed, user needs to log in again
        return { success: false, authError: true };
      }
    }
    
    // Call the actual API request function with the token
    return await requestFn(token);
  } catch (error) {
    console.error('Error in authenticated request:', error);
    return { success: false, error: error.message };
  }
};

// Logout function - clear all auth data
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('tokenExpiry');
  localStorage.removeItem('user');
  
  // Dispatch auth change event to update components
  window.dispatchEvent(new Event('auth-change'));
}; 