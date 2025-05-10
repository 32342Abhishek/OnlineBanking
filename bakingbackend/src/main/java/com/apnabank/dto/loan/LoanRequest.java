package com.apnabank.dto.loan;

import com.apnabank.model.LoanType;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoanRequest {

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    private BigDecimal amount;

    @NotNull(message = "Term in months is required")
    @Positive(message = "Term must be positive")
    @Max(value = 360, message = "Term cannot exceed 360 months (30 years)")
    private Integer termMonths;

    @NotNull(message = "Loan type is required")
    private LoanType type;

    private String purpose;

    @NotNull(message = "Account number for disbursement is required")
    private String accountNumber;
} 