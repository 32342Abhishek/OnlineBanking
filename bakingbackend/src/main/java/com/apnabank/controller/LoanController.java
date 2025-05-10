package com.apnabank.controller;

import com.apnabank.dto.common.ApiResponse;
import com.apnabank.dto.loan.*;
import com.apnabank.service.LoanService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/loans")
@RequiredArgsConstructor
public class LoanController {

    private final LoanService loanService;

    @PostMapping("/personal")
    public ResponseEntity<ApiResponse<LoanResponse>> applyForPersonalLoan(
            @Valid @RequestBody PersonalLoanRequest request
    ) {
        LoanResponse response = loanService.applyForPersonalLoan(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Personal loan application submitted successfully"));
    }

    @PostMapping("/home")
    public ResponseEntity<ApiResponse<LoanResponse>> applyForHomeLoan(
            @Valid @RequestBody HomeLoanRequest request
    ) {
        LoanResponse response = loanService.applyForHomeLoan(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Home loan application submitted successfully"));
    }

    @PostMapping("/car")
    public ResponseEntity<ApiResponse<LoanResponse>> applyForCarLoan(
            @Valid @RequestBody CarLoanRequest request
    ) {
        LoanResponse response = loanService.applyForCarLoan(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Car loan application submitted successfully"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<LoanResponse>>> getAllUserLoans() {
        List<LoanResponse> response = loanService.getAllUserLoans();
        return ResponseEntity.ok(ApiResponse.success(response, "Loans retrieved successfully"));
    }

    @GetMapping("/{loanId}")
    public ResponseEntity<ApiResponse<LoanResponse>> getLoanById(
            @PathVariable Long loanId
    ) {
        LoanResponse response = loanService.getLoanById(loanId);
        return ResponseEntity.ok(ApiResponse.success(response, "Loan details retrieved successfully"));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse<List<LoanResponse>>> getLoansByStatus(
            @PathVariable String status
    ) {
        List<LoanResponse> response = loanService.getLoansByStatus(status);
        return ResponseEntity.ok(ApiResponse.success(response, "Loans retrieved successfully"));
    }

    @PostMapping("/{loanId}/repayment")
    public ResponseEntity<ApiResponse<LoanRepaymentResponse>> makeLoanRepayment(
            @PathVariable Long loanId,
            @Valid @RequestBody LoanRepaymentRequest request
    ) {
        LoanRepaymentResponse response = loanService.makeLoanRepayment(loanId, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Loan repayment successful"));
    }

    @GetMapping("/{loanId}/repayments")
    public ResponseEntity<ApiResponse<List<LoanRepaymentResponse>>> getLoanRepayments(
            @PathVariable Long loanId
    ) {
        List<LoanRepaymentResponse> response = loanService.getLoanRepayments(loanId);
        return ResponseEntity.ok(ApiResponse.success(response, "Loan repayments retrieved successfully"));
    }

    @GetMapping("/{loanId}/schedule")
    public ResponseEntity<ApiResponse<List<RepaymentScheduleResponse>>> getLoanRepaymentSchedule(
            @PathVariable Long loanId
    ) {
        List<RepaymentScheduleResponse> response = loanService.getLoanRepaymentSchedule(loanId);
        return ResponseEntity.ok(ApiResponse.success(response, "Loan repayment schedule retrieved successfully"));
    }
} 