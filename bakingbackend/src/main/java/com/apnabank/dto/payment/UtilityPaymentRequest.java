package com.apnabank.dto.payment;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UtilityPaymentRequest {
    @NotBlank(message = "Account number is required")
    private String accountNumber;
    
    @NotBlank(message = "Utility provider is required")
    private String utilityProvider;
    
    @NotBlank(message = "Utility type is required")
    private String utilityType;  // ELECTRICITY, WATER, GAS, INTERNET, CABLE_TV, etc.
    
    @NotBlank(message = "Consumer ID/Number is required")
    private String consumerIdNumber;
    
    @NotNull(message = "Amount is required")
    @DecimalMin(value = "1.00", message = "Amount must be greater than 0")
    private BigDecimal amount;
    
    private String billNumber;
    
    private String billPeriod;
    
    private String remarks;
    
    private Boolean saveAsFavorite;
    
    private String nickname;
} 