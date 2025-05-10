package com.apnabank.dto.loan;

import com.apnabank.model.LoanStatus;
import com.apnabank.model.LoanType;
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
public class LoanResponse {
    private Long id;
    private String loanNumber;
    private String accountNumber;
    private LoanType loanType;
    private BigDecimal amount;
    private BigDecimal interestRate;
    private Integer tenureMonths;
    private BigDecimal emi;
    private BigDecimal totalInterest;
    private BigDecimal totalAmount;
    private BigDecimal amountPaid;
    private BigDecimal outstandingAmount;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private LoanStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 