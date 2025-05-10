package com.apnabank.dto.investment;

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
public class MutualFundResponse {
    private Long id;
    private String investmentId;
    private String accountNumber;
    private String fundId;
    private String fundName;
    private String fundCategory;
    private BigDecimal investmentAmount;
    private BigDecimal currentValue;
    private BigDecimal returns;
    private BigDecimal returnsPercentage;
    private String investmentType;  // LUMP_SUM, SIP
    private BigDecimal navAtPurchase;
    private BigDecimal currentNav;
    private BigDecimal units;
    private LocalDate investmentDate;
    private LocalDate lastValuationDate;
    private BigDecimal monthlyContribution;
    private Integer sipDuration;
    private Integer sipDay;
    private String investmentGoal;
    private String status;  // ACTIVE, REDEEMED, PARTIAL_REDEEMED
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 