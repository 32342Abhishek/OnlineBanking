package com.apnabank.dto.investment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecurringDepositResponse {
    private Long id;
    private String rdNumber;
    private String accountNumber;
    private BigDecimal monthlyDepositAmount;
    private BigDecimal interestRate;
    private Integer tenureMonths;
    private Integer installmentsPaid;
    private Integer totalInstallments;
    private LocalDate startDate;
    private LocalDate maturityDate;
    private BigDecimal maturityAmount;
    private BigDecimal totalDepositAmount;
    private BigDecimal interestAmount;
    private String status;  // ACTIVE, MATURED, CLOSED
    private String nomineeName;
    private String nomineeRelationship;
    private String maturityInstruction;
    private Integer paymentDay;
    private Boolean isStandingInstructionEnabled;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 