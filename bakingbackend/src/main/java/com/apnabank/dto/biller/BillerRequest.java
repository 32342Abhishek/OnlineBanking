package com.apnabank.dto.biller;

import com.apnabank.model.BillerType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BillerRequest {

    @NotBlank(message = "Biller name is required")
    private String name;

    @NotBlank(message = "Biller account number is required")
    private String accountNumber;

    @NotNull(message = "Biller type is required")
    private BillerType type;

    @NotBlank(message = "Description is required")
    private String description;

    private String website;
} 