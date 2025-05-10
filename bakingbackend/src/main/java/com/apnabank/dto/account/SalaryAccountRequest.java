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
public class SalaryAccountRequest {

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

    @NotBlank(message = "Address is required")
    private String address;

    @NotBlank(message = "City is required")
    private String city;

    @NotBlank(message = "State is required")
    private String state;

    @NotBlank(message = "Postal code is required")
    @Pattern(regexp = "^[0-9]{6}$", message = "Postal code must be 6 digits")
    private String postalCode;

    // Employment Details
    @NotBlank(message = "Employer name is required")
    private String employerName;

    @NotBlank(message = "Employee ID is required")
    private String employeeId;

    @NotBlank(message = "Designation is required")
    private String designation;

    @NotNull(message = "Employment start date is required")
    private LocalDate employmentStartDate;
    
    @NotNull(message = "Monthly salary is required")
    private Double monthlySalary;
    
    @NotBlank(message = "ID proof type is required")
    private String idProofType;

    @NotBlank(message = "ID proof number is required")
    private String idProofNumber;
    
    // Employment verification document (base64 encoded)
    private String employmentVerificationDocument;
    
    @NotNull(message = "Terms acceptance is required")
    private Boolean termsAccepted;
} 