package com.apnabank.dto.biller;

import com.apnabank.model.BillerType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BillerResponse {
    private Long id;
    private String name;
    private String accountNumber;
    private BillerType type;
    private String description;
    private String website;
} 