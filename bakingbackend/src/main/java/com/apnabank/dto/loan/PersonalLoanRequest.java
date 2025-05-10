package com.apnabank.dto.loan;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PersonalLoanRequest {
    @NotBlank(message = "Account number is required")
    private String accountNumber;
    
    @NotNull(message = "Loan amount is required")
    @DecimalMin(value = "10000.00", message = "Minimum loan amount is ₹10,000")
    @DecimalMax(value = "1000000.00", message = "Maximum loan amount is ₹10,00,000")
    private BigDecimal amount;
    
    @NotNull(message = "Tenure is required")
    @Min(value = 6, message = "Minimum tenure is 6 months")
    @Max(value = 60, message = "Maximum tenure is 60 months")
    private Integer tenureMonths;
    
    @NotBlank(message = "Purpose is required")
    private String purpose;
    
    @NotNull(message = "Income is required")
    @DecimalMin(value = "25000.00", message = "Minimum income should be ₹25,000")
    private BigDecimal monthlyIncome;
    
    @NotNull(message = "Employment type is required")
    private String employmentType;  // SALARIED, SELF_EMPLOYED, BUSINESS
    
    @Min(value = 0, message = "Existing EMIs must be a positive number")
    private BigDecimal existingEmi;
    
    private Boolean hasHealthInsurance;
} 