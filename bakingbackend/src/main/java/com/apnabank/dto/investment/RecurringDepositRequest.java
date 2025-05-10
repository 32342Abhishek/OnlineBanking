package com.apnabank.dto.investment;

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
public class RecurringDepositRequest {
    @NotBlank(message = "Account number is required")
    private String accountNumber;
    
    @NotNull(message = "Monthly deposit amount is required")
    @DecimalMin(value = "500.00", message = "Minimum monthly deposit amount is ₹500")
    private BigDecimal monthlyDepositAmount;
    
    @NotNull(message = "Tenure is required")
    @Min(value = 6, message = "Minimum tenure is 6 months")
    @Max(value = 120, message = "Maximum tenure is 120 months (10 years)")
    private Integer tenureMonths;
    
    private String nomineeName;
    
    private String nomineeRelationship;
    
    @NotNull(message = "Maturity instruction is required")
    private String maturityInstruction;  // PRINCIPAL_AND_INTEREST_TO_ACCOUNT, REINVEST
    
    @NotNull(message = "Payment day is required")
    @Min(value = 1, message = "Payment day must be between 1 and 28")
    @Max(value = 28, message = "Payment day must be between 1 and 28")
    private Integer paymentDay;
    
    private Boolean isStandingInstructionEnabled;
} 