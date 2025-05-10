package com.apnabank.dto.transaction;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ScheduledTransferResponse {
    private Long id;
    private String fromAccountNumber;
    private String toAccountNumber;
    private String beneficiaryName;
    private String ifscCode;
    private BigDecimal amount;
    private LocalDate scheduledDate;
    private LocalDateTime createdAt;
    private String status;  // PENDING, COMPLETED, FAILED, CANCELLED
    private String remarks;
    private Boolean isRecurring;
    private String recurringFrequency;
    private Integer recurringDay;
    private LocalDate nextExecutionDate;
    private LocalDate endDate;
    private String transactionId;
    private Boolean isBeneficiarySaved;
    private String beneficiaryNickname;
} 