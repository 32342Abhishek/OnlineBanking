package com.apnabank.controller;

import com.apnabank.dto.common.ApiResponse;
import com.apnabank.dto.transaction.*;
import com.apnabank.service.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    @PostMapping("/transfer")
    public ResponseEntity<ApiResponse<TransactionResponse>> transferFunds(
            @Valid @RequestBody TransferRequest request
    ) {
        TransactionResponse response = transactionService.transferFunds(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Funds transferred successfully"));
    }
    
    @PostMapping("/transfer/instant")
    public ResponseEntity<ApiResponse<TransactionResponse>> instantTransfer(
            @Valid @RequestBody InstantTransferRequest request
    ) {
        TransactionResponse response = transactionService.instantTransfer(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Instant transfer completed successfully"));
    }
    
    @PostMapping("/transfer/international")
    public ResponseEntity<ApiResponse<TransactionResponse>> internationalTransfer(
            @Valid @RequestBody InternationalTransferRequest request
    ) {
        TransactionResponse response = transactionService.internationalTransfer(request);
        return ResponseEntity.ok(ApiResponse.success(response, "International transfer initiated successfully"));
    }
    
    @PostMapping("/transfer/scheduled")
    public ResponseEntity<ApiResponse<ScheduledTransferResponse>> scheduleTransfer(
            @Valid @RequestBody ScheduledTransferRequest request
    ) {
        ScheduledTransferResponse response = transactionService.scheduleTransfer(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Transfer scheduled successfully"));
    }
    
    @GetMapping("/scheduled")
    public ResponseEntity<ApiResponse<List<ScheduledTransferResponse>>> getScheduledTransfers() {
        List<ScheduledTransferResponse> response = transactionService.getScheduledTransfers();
        return ResponseEntity.ok(ApiResponse.success(response, "Scheduled transfers retrieved successfully"));
    }
    
    @DeleteMapping("/scheduled/{scheduledTransferId}")
    public ResponseEntity<ApiResponse<Void>> cancelScheduledTransfer(
            @PathVariable Long scheduledTransferId
    ) {
        transactionService.cancelScheduledTransfer(scheduledTransferId);
        return ResponseEntity.ok(ApiResponse.success(null, "Scheduled transfer cancelled successfully"));
    }

    @GetMapping("/account/{accountNumber}")
    public ResponseEntity<ApiResponse<Page<TransactionResponse>>> getAccountTransactions(
            @PathVariable String accountNumber,
            Pageable pageable
    ) {
        Page<TransactionResponse> response = transactionService.getAccountTransactions(accountNumber, pageable);
        return ResponseEntity.ok(ApiResponse.success(response, "Transactions retrieved successfully"));
    }

    @GetMapping("/account/{accountNumber}/date-range")
    public ResponseEntity<ApiResponse<List<TransactionResponse>>> getAccountTransactionsByDateRange(
            @PathVariable String accountNumber,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate
    ) {
        List<TransactionResponse> response = transactionService.getAccountTransactionsByDateRange(
                accountNumber, startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success(response, "Transactions retrieved successfully"));
    }
    
    @GetMapping("/account/{accountNumber}/statement")
    public ResponseEntity<ApiResponse<AccountStatementResponse>> getAccountStatement(
            @PathVariable String accountNumber,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate
    ) {
        AccountStatementResponse response = transactionService.getAccountStatement(
                accountNumber, startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success(response, "Account statement generated successfully"));
    }
} 