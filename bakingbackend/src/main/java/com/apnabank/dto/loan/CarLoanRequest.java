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
public class CarLoanRequest {
    @NotBlank(message = "Account number is required")
    private String accountNumber;
    
    @NotNull(message = "Loan amount is required")
    @DecimalMin(value = "100000.00", message = "Minimum loan amount is ₹1,00,000")
    @DecimalMax(value = "5000000.00", message = "Maximum loan amount is ₹50,00,000")
    private BigDecimal amount;
    
    @NotNull(message = "Tenure is required")
    @Min(value = 12, message = "Minimum tenure is 12 months")
    @Max(value = 84, message = "Maximum tenure is 84 months")
    private Integer tenureMonths;
    
    @NotBlank(message = "Car make is required")
    private String carMake;
    
    @NotBlank(message = "Car model is required")
    private String carModel;
    
    @NotNull(message = "Car value is required")
    private BigDecimal carValue;
    
    @NotNull(message = "Income is required")
    @DecimalMin(value = "30000.00", message = "Minimum income should be ₹30,000")
    private BigDecimal monthlyIncome;
    
    @NotNull(message = "Employment type is required")
    private String employmentType;  // SALARIED, SELF_EMPLOYED, BUSINESS
    
    @Min(value = 0, message = "Existing EMIs must be a positive number")
    private BigDecimal existingEmi;
    
    private Boolean isNewCar;
    
    private Integer carAge;
} 