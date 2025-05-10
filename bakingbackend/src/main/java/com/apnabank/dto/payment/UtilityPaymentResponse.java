package com.apnabank.dto.payment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UtilityPaymentResponse {
    private Long id;
    private String transactionId;
    private String accountNumber;
    private String utilityProvider;
    private String utilityType;
    private String consumerIdNumber;
    private BigDecimal amount;
    private String billNumber;
    private String billPeriod;
    private String status;  // SUCCESS, FAILED, PENDING
    private String remarks;
    private LocalDateTime paymentDate;
    private String referenceNumber;
    private Boolean isFavorite;
    private String nickname;
} 