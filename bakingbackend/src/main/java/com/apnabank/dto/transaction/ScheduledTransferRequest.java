package com.apnabank.dto.transaction;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ScheduledTransferRequest {
    @NotBlank(message = "From account number is required")
    private String fromAccountNumber;
    
    @NotBlank(message = "To account number is required")
    private String toAccountNumber;
    
    @NotBlank(message = "Beneficiary name is required")
    private String beneficiaryName;
    
    @NotBlank(message = "IFSC code is required")
    private String ifscCode;
    
    @NotNull(message = "Amount is required")
    @DecimalMin(value = "1.00", message = "Amount must be greater than 0")
    private BigDecimal amount;
    
    @NotNull(message = "Scheduled date is required")
    @Future(message = "Scheduled date must be in the future")
    private LocalDate scheduledDate;
    
    private String remarks;
    
    private Boolean isRecurring;
    
    private String recurringFrequency;  // DAILY, WEEKLY, MONTHLY, QUARTERLY, YEARLY
    
    private Integer recurringDay;
    
    private LocalDate endDate;
    
    private Boolean saveAsBeneficiary;
    
    private String beneficiaryNickname;
} 