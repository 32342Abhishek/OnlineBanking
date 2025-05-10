package com.apnabank.service;

import com.apnabank.dto.loan.*;
import java.util.List;

/**
 * Service interface for handling loan operations
 */
public interface LoanService {
    
    /**
     * Process a personal loan application
     * @param request Personal loan application details
     * @return Response with loan information
     */
    LoanResponse applyForPersonalLoan(PersonalLoanRequest request);
    
    /**
     * Process a home loan application
     * @param request Home loan application details
     * @return Response with loan information
     */
    LoanResponse applyForHomeLoan(HomeLoanRequest request);
    
    /**
     * Process a car loan application
     * @param request Car loan application details
     * @return Response with loan information
     */
    LoanResponse applyForCarLoan(CarLoanRequest request);
    
    /**
     * Get all loans for the authenticated user
     * @return List of loans
     */
    List<LoanResponse> getAllUserLoans();
    
    /**
     * Get details of a specific loan
     * @param loanId The ID of the loan
     * @return Loan details
     */
    LoanResponse getLoanById(Long loanId);
    
    /**
     * Get loans filtered by status
     * @param status Status of the loan (e.g., ACTIVE, PENDING, CLOSED)
     * @return List of loans with the specified status
     */
    List<LoanResponse> getLoansByStatus(String status);
    
    /**
     * Process a loan repayment
     * @param loanId The ID of the loan
     * @param request Repayment details
     * @return Response with repayment information
     */
    LoanRepaymentResponse makeLoanRepayment(Long loanId, LoanRepaymentRequest request);
    
    /**
     * Get repayment history for a loan
     * @param loanId The ID of the loan
     * @return List of repayments for the loan
     */
    List<LoanRepaymentResponse> getLoanRepayments(Long loanId);
    
    /**
     * Get repayment schedule for a loan
     * @param loanId The ID of the loan
     * @return List of scheduled repayments
     */
    List<RepaymentScheduleResponse> getLoanRepaymentSchedule(Long loanId);
} 