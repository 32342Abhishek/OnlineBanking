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
public class FixedDepositRequest {
    @NotBlank(message = "Account number is required")
    private String accountNumber;
    
    @NotNull(message = "Amount is required")
    @DecimalMin(value = "1000.00", message = "Minimum deposit amount is ₹1,000")
    private BigDecimal amount;
    
    @NotNull(message = "Tenure is required")
    @Min(value = 1, message = "Minimum tenure is 1 month")
    @Max(value = 120, message = "Maximum tenure is 120 months (10 years)")
    private Integer tenureMonths;
    
    private String nomineeName;
    
    private String nomineeRelationship;
    
    private Boolean autoRenew;
    
    @NotNull(message = "Maturity instruction is required")
    private String maturityInstruction;  // PRINCIPAL_AND_INTEREST_TO_ACCOUNT, PRINCIPAL_TO_ACCOUNT_INTEREST_REINVESTED, REINVEST_PRINCIPAL_AND_INTEREST
} 