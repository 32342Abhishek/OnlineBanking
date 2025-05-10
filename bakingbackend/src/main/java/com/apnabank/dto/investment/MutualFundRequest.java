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
public class MutualFundRequest {
    @NotBlank(message = "Account number is required")
    private String accountNumber;
    
    @NotBlank(message = "Fund ID is required")
    private String fundId;
    
    @NotNull(message = "Investment amount is required")
    @DecimalMin(value = "1000.00", message = "Minimum investment amount is ₹1,000")
    private BigDecimal investmentAmount;
    
    @NotNull(message = "Investment type is required")
    private String investmentType;  // LUMP_SUM, SIP
    
    private BigDecimal monthlyContribution;
    
    private Integer sipDuration;
    
    private Integer sipDay;
    
    private String investmentGoal;  // RETIREMENT, EDUCATION, WEALTH_CREATION, TAX_SAVING, OTHERS
} 