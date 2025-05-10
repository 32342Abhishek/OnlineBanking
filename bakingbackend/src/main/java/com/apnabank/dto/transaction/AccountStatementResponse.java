package com.apnabank.dto.transaction;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AccountStatementResponse {
    private String accountNumber;
    private String accountHolderName;
    private String accountType;
    private String ifscCode;
    private String branchName;
    private LocalDateTime statementGeneratedAt;
    private LocalDateTime fromDate;
    private LocalDateTime toDate;
    private BigDecimal openingBalance;
    private BigDecimal closingBalance;
    private Integer totalTransactions;
    private BigDecimal totalDebitAmount;
    private BigDecimal totalCreditAmount;
    private List<TransactionResponse> transactions;
} 