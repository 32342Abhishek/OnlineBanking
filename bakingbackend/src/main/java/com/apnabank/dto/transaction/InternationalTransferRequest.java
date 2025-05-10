package com.apnabank.dto.transaction;

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
public class InternationalTransferRequest {
    @NotBlank(message = "From account number is required")
    private String fromAccountNumber;
    
    @NotBlank(message = "Beneficiary account number is required")
    private String beneficiaryAccountNumber;
    
    @NotBlank(message = "Beneficiary name is required")
    private String beneficiaryName;
    
    @NotBlank(message = "Beneficiary bank name is required")
    private String beneficiaryBankName;
    
    @NotBlank(message = "Beneficiary bank address is required")
    private String beneficiaryBankAddress;
    
    @NotBlank(message = "Beneficiary address is required")
    private String beneficiaryAddress;
    
    @NotBlank(message = "SWIFT code is required")
    private String swiftCode;
    
    @NotBlank(message = "Currency is required")
    private String currency;
    
    @NotNull(message = "Amount is required")
    @DecimalMin(value = "1.00", message = "Amount must be greater than 0")
    private BigDecimal amount;
    
    @NotBlank(message = "Purpose of remittance is required")
    private String purposeOfRemittance;
    
    private String remarks;
    
    private String routingNumber;
    
    private String intermediaryBankDetails;
    
    private Boolean saveAsBeneficiary;
    
    private String beneficiaryNickname;
} 