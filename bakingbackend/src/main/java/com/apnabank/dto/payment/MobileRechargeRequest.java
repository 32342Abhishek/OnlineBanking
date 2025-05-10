package com.apnabank.dto.payment;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MobileRechargeRequest {
    @NotBlank(message = "Account number is required")
    private String accountNumber;
    
    @NotBlank(message = "Mobile number is required")
    @Pattern(regexp = "^[6-9]\\d{9}$", message = "Please enter a valid 10 digit mobile number")
    private String mobileNumber;
    
    @NotBlank(message = "Operator is required")
    private String operator;  // AIRTEL, JIO, VI, BSNL, etc.
    
    @NotBlank(message = "Circle is required")
    private String circle; // DELHI, MAHARASHTRA, KARNATAKA, etc.
    
    @NotNull(message = "Amount is required")
    @DecimalMin(value = "10.00", message = "Amount must be at least ₹10")
    private BigDecimal amount;
    
    @NotBlank(message = "Plan ID is required")
    private String planId;
    
    @NotBlank(message = "Recharge type is required")
    private String rechargeType;  // PREPAID, POSTPAID, DTH
    
    private Boolean saveAsFavorite;
    
    private String nickname;
} 