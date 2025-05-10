package com.apnabank.controller;

import com.apnabank.dto.account.*;
import com.apnabank.dto.common.ApiResponse;
import com.apnabank.service.AccountService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/accounts")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;

    @PostMapping
    public ResponseEntity<ApiResponse<AccountResponse>> createAccount(
            @Valid @RequestBody AccountRequest request
    ) {
        AccountResponse response = accountService.createAccount(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Account created successfully"));
    }
    
    @PostMapping("/savings")
    public ResponseEntity<ApiResponse<AccountResponse>> createSavingsAccount(
            @Valid @RequestBody SavingsAccountRequest request
    ) {
        AccountResponse response = accountService.createSavingsAccount(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Savings account created successfully"));
    }
    
    @PostMapping("/current")
    public ResponseEntity<ApiResponse<AccountResponse>> createCurrentAccount(
            @Valid @RequestBody CurrentAccountRequest request
    ) {
        AccountResponse response = accountService.createCurrentAccount(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Current account created successfully"));
    }
    
    @PostMapping("/zero-balance")
    public ResponseEntity<ApiResponse<AccountResponse>> createZeroBalanceAccount(
            @Valid @RequestBody ZeroBalanceAccountRequest request
    ) {
        AccountResponse response = accountService.createZeroBalanceAccount(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Zero balance account created successfully"));
    }
    
    @PostMapping("/joint")
    public ResponseEntity<ApiResponse<AccountResponse>> createJointAccount(
            @Valid @RequestBody JointAccountRequest request
    ) {
        AccountResponse response = accountService.createJointAccount(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Joint account created successfully"));
    }
    
    @PostMapping("/digital")
    public ResponseEntity<ApiResponse<AccountResponse>> createDigitalAccount(
            @Valid @RequestBody DigitalAccountRequest request
    ) {
        AccountResponse response = accountService.createDigitalAccount(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Digital account created successfully"));
    }
    
    @PostMapping("/senior-citizen")
    public ResponseEntity<ApiResponse<AccountResponse>> createSeniorCitizenAccount(
            @Valid @RequestBody SeniorCitizenAccountRequest request
    ) {
        AccountResponse response = accountService.createSeniorCitizenAccount(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Senior citizen account created successfully"));
    }
    
    @PostMapping("/salary")
    public ResponseEntity<ApiResponse<AccountResponse>> createSalaryAccount(
            @Valid @RequestBody SalaryAccountRequest request
    ) {
        AccountResponse response = accountService.createSalaryAccount(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Salary account created successfully"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AccountResponse>>> getAllAccounts() {
        List<AccountResponse> response = accountService.getAllAccounts();
        return ResponseEntity.ok(ApiResponse.success(response, "Accounts retrieved successfully"));
    }
    
    @GetMapping("/types/{type}")
    public ResponseEntity<ApiResponse<List<AccountResponse>>> getAccountsByType(
            @PathVariable String type
    ) {
        List<AccountResponse> response = accountService.getAccountsByType(type);
        return ResponseEntity.ok(ApiResponse.success(response, "Accounts retrieved successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AccountResponse>> getAccountById(
            @PathVariable Long id
    ) {
        AccountResponse response = accountService.getAccountById(id);
        return ResponseEntity.ok(ApiResponse.success(response, "Account retrieved successfully"));
    }

    @GetMapping("/number/{accountNumber}")
    public ResponseEntity<ApiResponse<AccountResponse>> getAccountByAccountNumber(
            @PathVariable String accountNumber
    ) {
        AccountResponse response = accountService.getAccountByAccountNumber(accountNumber);
        return ResponseEntity.ok(ApiResponse.success(response, "Account retrieved successfully"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<AccountResponse>> updateAccount(
            @PathVariable Long id,
            @Valid @RequestBody AccountRequest request
    ) {
        AccountResponse response = accountService.updateAccount(id, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Account updated successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> closeAccount(
            @PathVariable Long id
    ) {
        accountService.closeAccount(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Account closed successfully"));
    }

    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<AccountResponse>>> getPendingAccounts() {
        List<AccountResponse> response = accountService.getPendingAccounts();
        return ResponseEntity.ok(ApiResponse.success(response, "Pending accounts retrieved successfully"));
    }
    
    @PostMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<AccountResponse>> approveAccount(
            @PathVariable Long id
    ) {
        AccountResponse response = accountService.approveAccount(id);
        return ResponseEntity.ok(ApiResponse.success(response, "Account approved successfully"));
    }
    
    @PostMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<AccountResponse>> rejectAccount(
            @PathVariable Long id,
            @RequestParam String reason
    ) {
        AccountResponse response = accountService.rejectAccount(id, reason);
        return ResponseEntity.ok(ApiResponse.success(response, "Account rejected successfully"));
    }
} 