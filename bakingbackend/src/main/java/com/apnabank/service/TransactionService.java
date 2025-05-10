package com.apnabank.service;

import com.apnabank.dto.transaction.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Service interface for handling transaction operations
 */
public interface TransactionService {
    
    /**
     * Process a regular funds transfer
     * @param request Transfer details
     * @return Response with transaction information
     */
    TransactionResponse transferFunds(TransferRequest request);
    
    /**
     * Process an instant funds transfer
     * @param request Instant transfer details
     * @return Response with transaction information
     */
    TransactionResponse instantTransfer(InstantTransferRequest request);
    
    /**
     * Process an international funds transfer
     * @param request International transfer details
     * @return Response with transaction information
     */
    TransactionResponse internationalTransfer(InternationalTransferRequest request);
    
    /**
     * Schedule a future transfer
     * @param request Scheduled transfer details
     * @return Response with scheduled transfer information
     */
    ScheduledTransferResponse scheduleTransfer(ScheduledTransferRequest request);
    
    /**
     * Get all scheduled transfers for the authenticated user
     * @return List of scheduled transfers
     */
    List<ScheduledTransferResponse> getScheduledTransfers();
    
    /**
     * Cancel a scheduled transfer
     * @param scheduledTransferId The ID of the scheduled transfer to cancel
     */
    void cancelScheduledTransfer(Long scheduledTransferId);
    
    /**
     * Get account transactions with pagination
     * @param accountNumber The account number
     * @param pageable Pagination information
     * @return Paged list of transactions
     */
    Page<TransactionResponse> getAccountTransactions(String accountNumber, Pageable pageable);
    
    /**
     * Get account transactions filtered by date range
     * @param accountNumber The account number
     * @param startDate Start date (inclusive)
     * @param endDate End date (inclusive)
     * @return List of transactions within the date range
     */
    List<TransactionResponse> getAccountTransactionsByDateRange(String accountNumber, LocalDateTime startDate, LocalDateTime endDate);
    
    /**
     * Generate an account statement for a date range
     * @param accountNumber The account number
     * @param startDate Start date (inclusive)
     * @param endDate End date (inclusive)
     * @return Account statement with transaction summary
     */
    AccountStatementResponse getAccountStatement(String accountNumber, LocalDateTime startDate, LocalDateTime endDate);
} 