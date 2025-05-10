import axiosInstance from './axiosInstance';
import { authService } from '.';
import { API_CONFIG } from '../config';

const loanService = {
  // Personal Loan Application
  applyForPersonalLoan: async (loanData) => {
    try {
      authService.checkAuth();
      console.log('Applying for personal loan:', loanData);
      const response = await axiosInstance.post(API_CONFIG.LOANS.PERSONAL_LOAN, loanData);
      console.log('Personal loan application submitted successfully:', response.data);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error applying for personal loan:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw new Error(error.response?.data?.message || error.message || 'Failed to apply for personal loan. Please try again.');
    }
  },

  // Home Loan Application
  applyForHomeLoan: async (loanData) => {
    try {
      authService.checkAuth();
      console.log('Applying for home loan:', loanData);
      const response = await axiosInstance.post(API_CONFIG.LOANS.HOME_LOAN, loanData);
      console.log('Home loan application submitted successfully:', response.data);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error applying for home loan:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw new Error(error.response?.data?.message || error.message || 'Failed to apply for home loan. Please try again.');
    }
  },

  // Car Loan Application
  applyForCarLoan: async (loanData) => {
    try {
      authService.checkAuth();
      console.log('Applying for car loan:', loanData);
      const response = await axiosInstance.post(API_CONFIG.LOANS.CAR_LOAN, loanData);
      console.log('Car loan application submitted successfully:', response.data);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error applying for car loan:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw new Error(error.response?.data?.message || error.message || 'Failed to apply for car loan. Please try again.');
    }
  },

  // Apply for generic loan
  applyForLoan: async (loanData) => {
    try {
      authService.checkAuth();
      console.log('Applying for loan:', loanData);
      const response = await axiosInstance.post(API_CONFIG.LOANS.APPLY, loanData);
      console.log('Loan application submitted successfully:', response.data);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error applying for loan:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw new Error(error.response?.data?.message || error.message || 'Failed to apply for loan. Please try again.');
    }
  },

  // Get all loans for the user
  getAllUserLoans: async (page = 0, size = 10) => {
    try {
      authService.checkAuth();
      console.log('Fetching all user loans');
      const response = await axiosInstance.get(`${API_CONFIG.LOANS.GET_ALL}?page=${page}&size=${size}`);
      console.log('Loans fetched successfully:', response.data);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching loans:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch loans. Please try again.');
    }
  },

  // Get loan by ID
  getLoanById: async (loanId) => {
    try {
      authService.checkAuth();
      console.log(`Fetching loan with ID: ${loanId}`);
      const url = API_CONFIG.LOANS.GET_DETAILS.replace('{id}', loanId);
      const response = await axiosInstance.get(url);
      console.log('Loan fetched successfully:', response.data);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching loan by ID:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch loan details. Please try again.');
    }
  },

  // Get loans by status
  getLoansByStatus: async (status, page = 0, size = 10) => {
    try {
      authService.checkAuth();
      console.log(`Fetching loans with status: ${status}`);
      const response = await axiosInstance.get(`${API_CONFIG.LOANS.GET_ALL}/status/${status}?page=${page}&size=${size}`);
      console.log('Loans fetched successfully:', response.data);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching loans by status:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch loans. Please try again.');
    }
  },

  // Make a loan repayment
  makeLoanRepayment: async (repaymentData) => {
    try {
      authService.checkAuth();
      console.log('Making loan repayment:', repaymentData);
      const response = await axiosInstance.post(API_CONFIG.LOANS.REPAYMENT, repaymentData);
      console.log('Loan repayment successful:', response.data);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error making loan repayment:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw new Error(error.response?.data?.message || error.message || 'Failed to make loan repayment. Please try again.');
    }
  },

  // Get loan repayment schedule
  getLoanRepaymentSchedule: async (loanId) => {
    try {
      authService.checkAuth();
      console.log(`Fetching repayment schedule for loan ID: ${loanId}`);
      const url = API_CONFIG.LOANS.GET_REPAYMENT_SCHEDULE.replace('{id}', loanId);
      const response = await axiosInstance.get(url);
      console.log('Loan repayment schedule fetched successfully:', response.data);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching loan repayment schedule:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch loan repayment schedule. Please try again.');
    }
  }
};

export default loanService; 