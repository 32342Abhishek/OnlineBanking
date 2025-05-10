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
public class FixedDepositResponse {
    private Long id;
    private String fdNumber;
    private String accountNumber;
    private BigDecimal amount;
    private BigDecimal interestRate;
    private Integer tenureMonths;
    private LocalDate startDate;
    private LocalDate maturityDate;
    private BigDecimal maturityAmount;
    private BigDecimal interestAmount;
    private String status;  // ACTIVE, MATURED, CLOSED
    private String nomineeName;
    private String nomineeRelationship;
    private Boolean autoRenew;
    private String maturityInstruction;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 