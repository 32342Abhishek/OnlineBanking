package com.apnabank.dto.payment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BillerResponse {
    private String billerId;
    private String billerName;
    private String billerCategory;
    private String billerType;
    private String logo;
    private Boolean fetchBill;
    private String paymentModes;
    private String supportedFields;
    private String regionsCovered;
} 