package com.apnabank.dto.account;

import com.apnabank.model.AccountType;
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
public class AccountResponse {
    private Long id;
    private String accountNumber;
    private String accountHolderName;
    private AccountType accountType;
    private BigDecimal balance;
    private LocalDateTime createdAt;
    private boolean active;
    
    // Contact information
    private String email;
    private String mobileNumber;
    
    // Address information
    private String address;
    private String city;
    private String state;
    private String postalCode;
    
    // Joint account fields
    private String secondaryHolderName;
    private String relationship;
    private String operationMode;
    
    // Digital account fields
    private boolean paperlessStatements;
    private boolean virtualDebitCard;
    
    // Salary account fields
    private String employerName;
    private String employeeId;
    
    // Senior citizen account fields
    private String nomineeName;
    private String nomineeRelationship;
} 