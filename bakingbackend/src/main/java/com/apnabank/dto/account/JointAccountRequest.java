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
public class JointAccountRequest {

    // Primary Account Holder Details
    @NotBlank(message = "Primary account holder name is required")
    private String primaryHolderName;

    @NotBlank(message = "Primary account holder email is required")
    @Email(message = "Invalid email format for primary account holder")
    private String primaryHolderEmail;

    @NotBlank(message = "Primary account holder mobile number is required")
    @Pattern(regexp = "^[0-9]{10}$", message = "Primary mobile number must be 10 digits")
    private String primaryHolderMobile;

    @NotNull(message = "Primary account holder date of birth is required")
    private LocalDate primaryHolderDob;

    @NotBlank(message = "Primary account holder address is required")
    private String primaryHolderAddress;

    // Secondary Account Holder Details
    @NotBlank(message = "Secondary account holder name is required")
    private String secondaryHolderName;

    @NotBlank(message = "Secondary account holder email is required")
    @Email(message = "Invalid email format for secondary account holder")
    private String secondaryHolderEmail;

    @NotBlank(message = "Secondary account holder mobile number is required")
    @Pattern(regexp = "^[0-9]{10}$", message = "Secondary mobile number must be 10 digits")
    private String secondaryHolderMobile;

    @NotNull(message = "Secondary account holder date of birth is required")
    private LocalDate secondaryHolderDob;

    @NotBlank(message = "Secondary account holder address is required")
    private String secondaryHolderAddress;

    // Relationship Between Holders
    @NotBlank(message = "Relationship between holders is required")
    private String relationship;

    // Account Operation Mode
    @NotBlank(message = "Operation mode is required")
    private String operationMode;

    @NotNull(message = "Initial deposit amount is required")
    private Double initialDeposit;

    @NotNull(message = "Terms acceptance is required")
    private Boolean termsAccepted;
} 