package com.apnabank.dto.loan;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoanRepaymentResponse {
    private Long id;
    private Long loanId;
    private String loanNumber;
    private String accountNumber;
    private BigDecimal amount;
    private BigDecimal remainingLoanAmount;
    private String remarks;
    private LocalDateTime paymentDate;
    private String transactionReference;
} 