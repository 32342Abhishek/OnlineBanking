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
public class MobileRechargeResponse {
    private Long id;
    private String transactionId;
    private String accountNumber;
    private String mobileNumber;
    private String operator;
    private String circle;
    private BigDecimal amount;
    private String planId;
    private String planDetails;
    private String rechargeType;
    private String status;  // SUCCESS, FAILED, PENDING
    private LocalDateTime rechargeDate;
    private String referenceNumber;
    private Boolean isFavorite;
    private String nickname;
} 