package com.apnabank.controller;

import com.apnabank.dto.common.ApiResponse;
import com.apnabank.dto.investment.*;
import com.apnabank.service.InvestmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/investments")
@RequiredArgsConstructor
public class InvestmentController {

    private final InvestmentService investmentService;

    @PostMapping("/fixed-deposits")
    public ResponseEntity<ApiResponse<FixedDepositResponse>> createFixedDeposit(
            @Valid @RequestBody FixedDepositRequest request
    ) {
        FixedDepositResponse response = investmentService.createFixedDeposit(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Fixed deposit created successfully"));
    }

    @GetMapping("/fixed-deposits")
    public ResponseEntity<ApiResponse<List<FixedDepositResponse>>> getAllFixedDeposits() {
        List<FixedDepositResponse> response = investmentService.getAllFixedDeposits();
        return ResponseEntity.ok(ApiResponse.success(response, "Fixed deposits retrieved successfully"));
    }

    @GetMapping("/fixed-deposits/{id}")
    public ResponseEntity<ApiResponse<FixedDepositResponse>> getFixedDepositById(
            @PathVariable Long id
    ) {
        FixedDepositResponse response = investmentService.getFixedDepositById(id);
        return ResponseEntity.ok(ApiResponse.success(response, "Fixed deposit retrieved successfully"));
    }

    @PostMapping("/recurring-deposits")
    public ResponseEntity<ApiResponse<RecurringDepositResponse>> createRecurringDeposit(
            @Valid @RequestBody RecurringDepositRequest request
    ) {
        RecurringDepositResponse response = investmentService.createRecurringDeposit(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Recurring deposit created successfully"));
    }

    @GetMapping("/recurring-deposits")
    public ResponseEntity<ApiResponse<List<RecurringDepositResponse>>> getAllRecurringDeposits() {
        List<RecurringDepositResponse> response = investmentService.getAllRecurringDeposits();
        return ResponseEntity.ok(ApiResponse.success(response, "Recurring deposits retrieved successfully"));
    }

    @GetMapping("/recurring-deposits/{id}")
    public ResponseEntity<ApiResponse<RecurringDepositResponse>> getRecurringDepositById(
            @PathVariable Long id
    ) {
        RecurringDepositResponse response = investmentService.getRecurringDepositById(id);
        return ResponseEntity.ok(ApiResponse.success(response, "Recurring deposit retrieved successfully"));
    }

    @PostMapping("/mutual-funds")
    public ResponseEntity<ApiResponse<MutualFundResponse>> investInMutualFund(
            @Valid @RequestBody MutualFundRequest request
    ) {
        MutualFundResponse response = investmentService.investInMutualFund(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Mutual fund investment successful"));
    }

    @GetMapping("/mutual-funds")
    public ResponseEntity<ApiResponse<List<MutualFundResponse>>> getAllMutualFundInvestments() {
        List<MutualFundResponse> response = investmentService.getAllMutualFundInvestments();
        return ResponseEntity.ok(ApiResponse.success(response, "Mutual fund investments retrieved successfully"));
    }

    @GetMapping("/mutual-funds/{id}")
    public ResponseEntity<ApiResponse<MutualFundResponse>> getMutualFundInvestmentById(
            @PathVariable Long id
    ) {
        MutualFundResponse response = investmentService.getMutualFundInvestmentById(id);
        return ResponseEntity.ok(ApiResponse.success(response, "Mutual fund investment retrieved successfully"));
    }

    @GetMapping("/rates/fixed-deposits")
    public ResponseEntity<ApiResponse<List<FDRateResponse>>> getFixedDepositRates() {
        List<FDRateResponse> response = investmentService.getFixedDepositRates();
        return ResponseEntity.ok(ApiResponse.success(response, "Fixed deposit rates retrieved successfully"));
    }

    @GetMapping("/rates/recurring-deposits")
    public ResponseEntity<ApiResponse<List<RDRateResponse>>> getRecurringDepositRates() {
        List<RDRateResponse> response = investmentService.getRecurringDepositRates();
        return ResponseEntity.ok(ApiResponse.success(response, "Recurring deposit rates retrieved successfully"));
    }

    @GetMapping("/mutual-funds/available")
    public ResponseEntity<ApiResponse<List<AvailableMutualFundResponse>>> getAvailableMutualFunds() {
        List<AvailableMutualFundResponse> response = investmentService.getAvailableMutualFunds();
        return ResponseEntity.ok(ApiResponse.success(response, "Available mutual funds retrieved successfully"));
    }
} 