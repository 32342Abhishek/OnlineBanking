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
public class FDRateResponse {
    private Integer tenureMonths;
    private BigDecimal regularRate;
    private BigDecimal seniorCitizenRate;
} 