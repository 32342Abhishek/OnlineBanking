package com.apnabank.service.impl;

import com.apnabank.dto.transaction.*;
import com.apnabank.model.TransactionStatus;
import com.apnabank.model.TransactionType;
import com.apnabank.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService {

    @Override
    public TransactionResponse transferFunds(TransferRequest request) {
        // Implementation will be added later
        // For now, return a mock response
        return createMockTransactionResponse(
                request.getFromAccountNumber(),
                request.getToAccountNumber(),
                request.getAmount(),
                "Regular Transfer",
                TransactionType.TRANSFER
        );
    }

    @Override
    public TransactionResponse instantTransfer(InstantTransferRequest request) {
        // Implementation will be added later
        // For now, return a mock response
        return createMockTransactionResponse(
                request.getFromAccountNumber(),
                request.getToAccountNumber(),
                request.getAmount(),
                "Instant Transfer",
                TransactionType.TRANSFER
        );
    }

    @Override
    public TransactionResponse internationalTransfer(InternationalTransferRequest request) {
        // Implementation will be added later
        // For now, return a mock response
        return createMockTransactionResponse(
                request.getFromAccountNumber(),
                request.getBeneficiaryAccountNumber(), // Using beneficiary account number
                request.getAmount(),
                "International Transfer to " + request.getBeneficiaryName(),
                TransactionType.TRANSFER
        );
    }

    @Override
    public ScheduledTransferResponse scheduleTransfer(ScheduledTransferRequest request) {
        // Implementation will be added later
        // For now, return a mock response
        return ScheduledTransferResponse.builder()
                .id(1L)
                .fromAccountNumber(request.getFromAccountNumber())
                .toAccountNumber(request.getToAccountNumber())
                .amount(request.getAmount())
                .beneficiaryName(request.getBeneficiaryName())
                .remarks(request.getRemarks())
                .scheduledDate(request.getScheduledDate())
                .isRecurring(request.getIsRecurring())
                .recurringFrequency(request.getRecurringFrequency())
                .status("SCHEDULED")
                .createdAt(LocalDateTime.now())
                .build();
    }

    @Override
    public List<ScheduledTransferResponse> getScheduledTransfers() {
        // Implementation will be added later
        // For now, return a list with sample scheduled transfers
        List<ScheduledTransferResponse> scheduledTransfers = new ArrayList<>();
        
        scheduledTransfers.add(createMockScheduledTransfer(
                1L, "12345678", "87654321", 
                BigDecimal.valueOf(1000), "Monthly rent", 
                LocalDate.now().plusDays(5), "MONTHLY"
        ));
        
        scheduledTransfers.add(createMockScheduledTransfer(
                2L, "12345678", "98765432", 
                BigDecimal.valueOf(500), "Utility bill", 
                LocalDate.now().plusDays(10), "ONCE"
        ));
        
        return scheduledTransfers;
    }

    @Override
    public void cancelScheduledTransfer(Long scheduledTransferId) {
        // Implementation will be added later
        // For now, just a placeholder
        // In a real implementation, we would find the scheduled transfer and cancel it
    }

    @Override
    public Page<TransactionResponse> getAccountTransactions(String accountNumber, Pageable pageable) {
        // Implementation will be added later
        // For now, return a mock paged response
        List<TransactionResponse> transactions = new ArrayList<>();
        
        // Create some sample transactions
        for (int i = 0; i < 10; i++) {
            transactions.add(createMockTransactionResponse(
                    i % 2 == 0 ? accountNumber : "88888888",
                    i % 2 == 0 ? "88888888" : accountNumber,
                    BigDecimal.valueOf(100 + i * 50),
                    "Sample transaction " + (i + 1),
                    i % 3 == 0 ? TransactionType.TRANSFER : (i % 3 == 1 ? TransactionType.BILL_PAYMENT : TransactionType.DEPOSIT)
            ));
        }
        
        // Apply pagination
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), transactions.size());
        Page<TransactionResponse> page = new PageImpl<>(
                transactions.subList(start, end),
                pageable,
                transactions.size()
        );
        
        return page;
    }

    @Override
    public List<TransactionResponse> getAccountTransactionsByDateRange(String accountNumber, LocalDateTime startDate, LocalDateTime endDate) {
        // Implementation will be added later
        // For now, return a mock list
        List<TransactionResponse> transactions = new ArrayList<>();
        
        // Create some sample transactions with dates within the range
        LocalDateTime currentDate = startDate;
        while (currentDate.isBefore(endDate) || currentDate.isEqual(endDate)) {
            transactions.add(createMockTransactionResponseWithDate(
                    accountNumber,
                    "88888888",
                    BigDecimal.valueOf(100 + Math.random() * 900),
                    "Transaction on " + currentDate.toLocalDate(),
                    Math.random() > 0.5 ? TransactionType.TRANSFER : TransactionType.BILL_PAYMENT,
                    currentDate
            ));
            
            currentDate = currentDate.plusDays(1);
        }
        
        return transactions;
    }

    @Override
    public AccountStatementResponse getAccountStatement(String accountNumber, LocalDateTime startDate, LocalDateTime endDate) {
        // Implementation will be added later
        // For now, return a mock account statement
        List<TransactionResponse> transactions = getAccountTransactionsByDateRange(accountNumber, startDate, endDate);
        
        BigDecimal totalCredit = BigDecimal.ZERO;
        BigDecimal totalDebit = BigDecimal.ZERO;
        
        for (TransactionResponse transaction : transactions) {
            if (transaction.getToAccountNumber().equals(accountNumber)) {
                totalCredit = totalCredit.add(transaction.getAmount());
            }
            
            if (transaction.getFromAccountNumber().equals(accountNumber)) {
                totalDebit = totalDebit.add(transaction.getAmount());
            }
        }
        
        return AccountStatementResponse.builder()
                .accountNumber(accountNumber)
                .accountType("SAVINGS") // Placeholder
                .accountHolderName("John Doe") // Placeholder
                .fromDate(startDate)
                .toDate(endDate)
                .openingBalance(BigDecimal.valueOf(10000))
                .closingBalance(BigDecimal.valueOf(10000).add(totalCredit).subtract(totalDebit))
                .totalCreditAmount(totalCredit)
                .totalDebitAmount(totalDebit)
                .totalTransactions(transactions.size())
                .transactions(transactions)
                .statementGeneratedAt(LocalDateTime.now())
                .build();
    }
    
    // Helper methods
    
    private TransactionResponse createMockTransactionResponse(
            String fromAccountNumber, String toAccountNumber, 
            BigDecimal amount, String description, TransactionType type) {
        
        return createMockTransactionResponseWithDate(
                fromAccountNumber, toAccountNumber, amount,
                description, type, LocalDateTime.now());
    }
    
    private TransactionResponse createMockTransactionResponseWithDate(
            String fromAccountNumber, String toAccountNumber, 
            BigDecimal amount, String description, TransactionType type,
            LocalDateTime timestamp) {
        
        return TransactionResponse.builder()
                .id(Math.abs(UUID.randomUUID().getLeastSignificantBits()) % 1000)
                .transactionNumber("TXN" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .fromAccountNumber(fromAccountNumber)
                .toAccountNumber(toAccountNumber)
                .amount(amount)
                .description(description)
                .type(type)
                .status(TransactionStatus.COMPLETED)
                .timestamp(timestamp)
                .build();
    }
    
    private ScheduledTransferResponse createMockScheduledTransfer(
            Long id, String fromAccountNumber, String toAccountNumber,
            BigDecimal amount, String remarks, LocalDate scheduledDate,
            String recurringFrequency) {
        
        return ScheduledTransferResponse.builder()
                .id(id)
                .fromAccountNumber(fromAccountNumber)
                .toAccountNumber(toAccountNumber)
                .amount(amount)
                .remarks(remarks)
                .scheduledDate(scheduledDate)
                .recurringFrequency(recurringFrequency)
                .isRecurring(recurringFrequency != null && !recurringFrequency.equals("ONCE"))
                .status("SCHEDULED")
                .createdAt(LocalDateTime.now().minusDays(5))
                .build();
    }
} 