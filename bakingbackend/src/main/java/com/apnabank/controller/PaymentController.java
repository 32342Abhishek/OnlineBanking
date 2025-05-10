package com.apnabank.controller;

import com.apnabank.dto.common.ApiResponse;
import com.apnabank.dto.payment.*;
import com.apnabank.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/bills")
    public ResponseEntity<ApiResponse<BillPaymentResponse>> payBill(
            @Valid @RequestBody BillPaymentRequest request
    ) {
        BillPaymentResponse response = paymentService.payBill(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Bill payment successful"));
    }

    @GetMapping("/bills")
    public ResponseEntity<ApiResponse<List<BillPaymentResponse>>> getBillPaymentHistory() {
        List<BillPaymentResponse> response = paymentService.getBillPaymentHistory();
        return ResponseEntity.ok(ApiResponse.success(response, "Bill payment history retrieved successfully"));
    }

    @GetMapping("/bills/{paymentId}")
    public ResponseEntity<ApiResponse<BillPaymentResponse>> getBillPaymentById(
            @PathVariable Long paymentId
    ) {
        BillPaymentResponse response = paymentService.getBillPaymentById(paymentId);
        return ResponseEntity.ok(ApiResponse.success(response, "Bill payment retrieved successfully"));
    }

    @PostMapping("/mobile-recharge")
    public ResponseEntity<ApiResponse<MobileRechargeResponse>> mobileRecharge(
            @Valid @RequestBody MobileRechargeRequest request
    ) {
        MobileRechargeResponse response = paymentService.mobileRecharge(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Mobile recharge successful"));
    }

    @GetMapping("/mobile-recharge")
    public ResponseEntity<ApiResponse<List<MobileRechargeResponse>>> getMobileRechargeHistory() {
        List<MobileRechargeResponse> response = paymentService.getMobileRechargeHistory();
        return ResponseEntity.ok(ApiResponse.success(response, "Mobile recharge history retrieved successfully"));
    }

    @GetMapping("/mobile-recharge/{rechargeId}")
    public ResponseEntity<ApiResponse<MobileRechargeResponse>> getMobileRechargeById(
            @PathVariable Long rechargeId
    ) {
        MobileRechargeResponse response = paymentService.getMobileRechargeById(rechargeId);
        return ResponseEntity.ok(ApiResponse.success(response, "Mobile recharge retrieved successfully"));
    }

    @PostMapping("/utility")
    public ResponseEntity<ApiResponse<UtilityPaymentResponse>> payUtilityBill(
            @Valid @RequestBody UtilityPaymentRequest request
    ) {
        UtilityPaymentResponse response = paymentService.payUtilityBill(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Utility bill payment successful"));
    }

    @GetMapping("/utility")
    public ResponseEntity<ApiResponse<List<UtilityPaymentResponse>>> getUtilityPaymentHistory() {
        List<UtilityPaymentResponse> response = paymentService.getUtilityPaymentHistory();
        return ResponseEntity.ok(ApiResponse.success(response, "Utility payment history retrieved successfully"));
    }

    @GetMapping("/utility/{paymentId}")
    public ResponseEntity<ApiResponse<UtilityPaymentResponse>> getUtilityPaymentById(
            @PathVariable Long paymentId
    ) {
        UtilityPaymentResponse response = paymentService.getUtilityPaymentById(paymentId);
        return ResponseEntity.ok(ApiResponse.success(response, "Utility payment retrieved successfully"));
    }

    @GetMapping("/billers")
    public ResponseEntity<ApiResponse<List<BillerResponse>>> getAllBillers() {
        List<BillerResponse> response = paymentService.getAllBillers();
        return ResponseEntity.ok(ApiResponse.success(response, "Billers retrieved successfully"));
    }

    @GetMapping("/billers/type/{type}")
    public ResponseEntity<ApiResponse<List<BillerResponse>>> getBillersByType(
            @PathVariable String type
    ) {
        List<BillerResponse> response = paymentService.getBillersByType(type);
        return ResponseEntity.ok(ApiResponse.success(response, "Billers retrieved successfully"));
    }
} 