package com.apnabank.dto.investment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AvailableMutualFundResponse {
    private String fundId;
    private String fundName;
    private String fundHouse;
    private String fundCategory; // EQUITY, DEBT, HYBRID, LIQUID, INDEX, ELSS, etc.
    private String riskLevel; // LOW, MODERATE, HIGH
    private BigDecimal currentNav;
    private BigDecimal expenseRatio;
    private BigDecimal minInvestmentAmount;
    private BigDecimal minSipAmount;
    private BigDecimal oneYearReturn;
    private BigDecimal threeYearReturn;
    private BigDecimal fiveYearReturn;
    private String exitLoad;
    private Boolean sipAvailable;
    private String fundManager;
    private String investmentObjective;
} 