package com.apnabank.service;

import com.apnabank.dto.investment.*;
import java.util.List;

/**
 * Service interface for handling investment operations
 */
public interface InvestmentService {
    
    /**
     * Create a new fixed deposit
     * @param request Fixed deposit creation details
     * @return Response with fixed deposit information
     */
    FixedDepositResponse createFixedDeposit(FixedDepositRequest request);
    
    /**
     * Get all fixed deposits for the authenticated user
     * @return List of fixed deposits
     */
    List<FixedDepositResponse> getAllFixedDeposits();
    
    /**
     * Get details of a specific fixed deposit
     * @param id The ID of the fixed deposit
     * @return Fixed deposit details
     */
    FixedDepositResponse getFixedDepositById(Long id);
    
    /**
     * Create a new recurring deposit
     * @param request Recurring deposit creation details
     * @return Response with recurring deposit information
     */
    RecurringDepositResponse createRecurringDeposit(RecurringDepositRequest request);
    
    /**
     * Get all recurring deposits for the authenticated user
     * @return List of recurring deposits
     */
    List<RecurringDepositResponse> getAllRecurringDeposits();
    
    /**
     * Get details of a specific recurring deposit
     * @param id The ID of the recurring deposit
     * @return Recurring deposit details
     */
    RecurringDepositResponse getRecurringDepositById(Long id);
    
    /**
     * Make an investment in a mutual fund
     * @param request Mutual fund investment details
     * @return Response with mutual fund investment information
     */
    MutualFundResponse investInMutualFund(MutualFundRequest request);
    
    /**
     * Get all mutual fund investments for the authenticated user
     * @return List of mutual fund investments
     */
    List<MutualFundResponse> getAllMutualFundInvestments();
    
    /**
     * Get details of a specific mutual fund investment
     * @param id The ID of the mutual fund investment
     * @return Mutual fund investment details
     */
    MutualFundResponse getMutualFundInvestmentById(Long id);
    
    /**
     * Get current fixed deposit interest rates
     * @return List of fixed deposit rates
     */
    List<FDRateResponse> getFixedDepositRates();
    
    /**
     * Get current recurring deposit interest rates
     * @return List of recurring deposit rates
     */
    List<RDRateResponse> getRecurringDepositRates();
    
    /**
     * Get list of available mutual funds for investment
     * @return List of available mutual funds
     */
    List<AvailableMutualFundResponse> getAvailableMutualFunds();
} 