package com.apnabank.dto.account;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CurrentAccountRequest {

    // Personal Details
    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Mobile number is required")
    @Pattern(regexp = "^[0-9]{10}$", message = "Mobile number must be 10 digits")
    private String mobileNumber;

    @NotNull(message = "Date of birth is required")
    private LocalDate dateOfBirth;

    // Business Details
    @NotBlank(message = "Business name is required")
    private String businessName;

    @NotBlank(message = "Business type is required")
    private String businessType;

    @NotBlank(message = "GST number is required")
    private String gstNumber;

    @NotBlank(message = "Business registration number is required")
    private String businessRegistrationNumber;
    
    // Address Details
    @NotBlank(message = "Business address is required")
    private String businessAddress;

    @NotBlank(message = "City is required")
    private String city;

    @NotBlank(message = "State is required")
    private String state;

    @NotBlank(message = "Postal code is required")
    @Pattern(regexp = "^[0-9]{6}$", message = "Postal code must be 6 digits")
    private String postalCode;

    // Financial Details
    @NotNull(message = "Annual turnover is required")
    private Double annualTurnover;
    
    @NotNull(message = "Initial deposit amount is required")
    private Double initialDeposit;
    
    @NotNull(message = "Terms acceptance is required")
    private Boolean termsAccepted;
} 