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
public class HomeLoanRequest {
    @NotBlank(message = "Account number is required")
    private String accountNumber;
    
    @NotNull(message = "Loan amount is required")
    @DecimalMin(value = "500000.00", message = "Minimum loan amount is ₹5,00,000")
    @DecimalMax(value = "10000000.00", message = "Maximum loan amount is ₹1,00,00,000")
    private BigDecimal amount;
    
    @NotNull(message = "Tenure is required")
    @Min(value = 12, message = "Minimum tenure is 12 months")
    @Max(value = 360, message = "Maximum tenure is 30 years (360 months)")
    private Integer tenureMonths;
    
    @NotBlank(message = "Property address is required")
    private String propertyAddress;
    
    @NotNull(message = "Property value is required")
    private BigDecimal propertyValue;
    
    @NotNull(message = "Income is required")
    @DecimalMin(value = "40000.00", message = "Minimum income should be ₹40,000")
    private BigDecimal monthlyIncome;
    
    @NotNull(message = "Employment type is required")
    private String employmentType;  // SALARIED, SELF_EMPLOYED, BUSINESS
    
    @Min(value = 0, message = "Existing EMIs must be a positive number")
    private BigDecimal existingEmi;
    
    private String coApplicantName;
    
    private BigDecimal coApplicantIncome;
} 