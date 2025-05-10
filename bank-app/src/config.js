/**
 * Application Configuration
 * This file contains all the configuration variables for the banking application
 */

export const APP_CONFIG = {
  // Application metadata
  APP_NAME: 'Apna Digital Bank',
  APP_VERSION: '2.0.0',
  APP_DESCRIPTION: 'Modern digital banking solution',
  
  // API configuration
  API_BASE_URL: 'http://localhost:8080',  // Spring Boot default port
  API_TIMEOUT: 30000, // 30 seconds
  
  // Authentication configuration
  TOKEN_KEY: 'apna_bank_auth_token',
  USER_KEY: 'apna_bank_user',
  TOKEN_EXPIRY: 3600 * 24, // 24 hours
  
  // Feature flags
  FEATURES: {
    ENABLE_DARK_MODE: true,
    ENABLE_BIOMETRIC: true,
    ENABLE_NOTIFICATIONS: true,
    ENABLE_TRANSACTION_SEARCH: true,
    ENABLE_QUICK_ACTIONS: true,
    ENABLE_STATEMENT_DOWNLOAD: true,
    ENABLE_VIRTUAL_CARDS: true,
    ENABLE_INVESTMENT_MODULE: true,
    ENABLE_LOAN_MODULE: true,
    ENABLE_INSURANCE_MODULE: false
  },
  
  // Contact information
  CONTACT: {
    CUSTOMER_CARE: '+91 1800-XXX-XXXX',
    SUPPORT_EMAIL: 'support@apnabank.com',
    BRANCH_LOCATOR_URL: 'https://apnabank.com/branches',
    SOCIAL_MEDIA: {
      FACEBOOK: 'https://facebook.com/apnabank',
      TWITTER: 'https://twitter.com/apnabank',
      INSTAGRAM: 'https://instagram.com/apnabank',
      LINKEDIN: 'https://linkedin.com/company/apnabank'
    }
  },
  
  // Transaction limits
  TRANSACTION_LIMITS: {
    IMPS: {
      MIN: 1,
      MAX: 100000,
      DAILY: 200000
    },
    NEFT: {
      MIN: 1,
      MAX: 1000000,
      DAILY: 2000000
    },
    RTGS: {
      MIN: 200000,
      MAX: 10000000,
      DAILY: 20000000
    },
    UPI: {
      MIN: 1,
      MAX: 100000,
      DAILY: 200000
    }
  },
  
  // Dashboard configuration
  DASHBOARD: {
    REFRESH_INTERVAL: 300000, // 5 minutes
    SHOW_ACCOUNT_BALANCE: true,
    SHOW_RECENT_TRANSACTIONS: true,
    MAX_RECENT_TRANSACTIONS: 5,
    SHOW_OFFERS: true,
    MAX_OFFERS: 3
  },
  
  // Theme configuration
  THEME: {
    PRIMARY_COLOR: '#4f46e5',
    SECONDARY_COLOR: '#6366f1',
    ACCENT_COLOR: '#8b5cf6',
    TERTIARY_COLOR: '#10b981',
    QUATERNARY_COLOR: '#f97316',
    SUCCESS_COLOR: '#10b981',
    ERROR_COLOR: '#ef4444',
    WARNING_COLOR: '#f59e0b',
    INFO_COLOR: '#3b82f6',
    DARK_MODE_BACKGROUND: '#1e293b',
    LIGHT_MODE_BACKGROUND: '#f8fafc'
  },
  
  // Date formats
  DATE_FORMATS: {
    STANDARD: 'DD/MM/YYYY',
    FULL: 'DD MMM YYYY',
    TIME: 'HH:mm:ss',
    TIMESTAMP: 'DD/MM/YYYY HH:mm:ss'
  },
  
  // Currency configuration
  CURRENCY: {
    CODE: 'INR',
    SYMBOL: '₹',
    LOCALE: 'en-IN',
    DISPLAY_FORMAT: '{symbol}{amount}'
  },
  
  // Accessibility options
  ACCESSIBILITY: {
    DEFAULT_FONT_SIZE: 16,
    MIN_FONT_SIZE: 12,
    MAX_FONT_SIZE: 24,
    HIGH_CONTRAST_MODE: false
  }
};

// API Configuration with endpoints
export const API_CONFIG = {
  BASE_URL: APP_CONFIG.API_BASE_URL,
  TIMEOUT: APP_CONFIG.API_TIMEOUT,
  AUTH: {
    LOGIN: '/api/v1/auth/login',
    REGISTER: '/api/v1/auth/register',
    VERIFY_OTP: '/api/v1/auth/verify-otp',
    FORGOT_PASSWORD: '/api/v1/auth/forgot-password',
    RESET_PASSWORD: '/api/v1/auth/reset-password',
    LOGOUT: '/api/v1/auth/logout'
  },
  ACCOUNTS: {
    BASE: '/api/v1/accounts',
    GET_ALL: '/api/v1/accounts',
    GET_DETAILS: '/api/v1/accounts/{id}',
    GET_BALANCE: '/api/v1/accounts/{id}/balance',
    CREATE: '/api/v1/accounts',
    UPDATE: '/api/v1/accounts/{id}',
    DELETE: '/api/v1/accounts/{id}',
    PENDING: '/api/v1/accounts/pending',
    APPROVE: '/api/v1/accounts/{id}/approve',
    REJECT: '/api/v1/accounts/{id}/reject'
  },
  TRANSACTIONS: {
    TRANSFER: '/api/v1/transactions/transfer',
    GET_ALL: '/api/v1/transactions',
    GET_BY_ACCOUNT: '/api/v1/transactions/account/{accountId}',
    GET_BY_ID: '/api/v1/transactions/{id}',
    GET_STATEMENT: '/api/v1/transactions/statement'
  },
  USERS: {
    PROFILE: '/api/v1/users/profile',
    UPDATE_PROFILE: '/api/v1/users/profile',
    CHANGE_PASSWORD: '/api/v1/users/change-password'
  }
};

// Environment-specific configuration overrides
const ENV = process.env.NODE_ENV || 'development';

// Development environment overrides
if (ENV === 'development') {
  Object.assign(APP_CONFIG, {
    API_BASE_URL: 'http://localhost:8080',  // Spring Boot default port
    TOKEN_EXPIRY: 3600 * 24 * 7, // 7 days for development
  });
  
  // Update BASE_URL in API_CONFIG to match APP_CONFIG
  API_CONFIG.BASE_URL = APP_CONFIG.API_BASE_URL;
}

// Production environment overrides
if (ENV === 'production') {
  Object.assign(APP_CONFIG, {
    API_BASE_URL: 'https://api.apnabank.com',
    DASHBOARD: {
      ...APP_CONFIG.DASHBOARD,
      REFRESH_INTERVAL: 600000, // 10 minutes
    }
  });
  
  // Update BASE_URL in API_CONFIG to match APP_CONFIG for production
  API_CONFIG.BASE_URL = APP_CONFIG.API_BASE_URL;
}

// Export the theme object separately for easier access in style components
export const THEME = APP_CONFIG.THEME;

export default APP_CONFIG; 