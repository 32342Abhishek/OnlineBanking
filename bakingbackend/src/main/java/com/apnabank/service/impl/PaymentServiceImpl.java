package com.apnabank.service.impl;

import com.apnabank.dto.payment.*;
import com.apnabank.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    @Override
    public BillPaymentResponse payBill(BillPaymentRequest request) {
        // Implementation will be added later
        // For now, return a mock response
        return BillPaymentResponse.builder()
                .id(1L)
                .billerId(request.getBillerId())
                .accountNumber(request.getAccountNumber())
                .amount(request.getAmount())
                .consumerIdNumber(request.getConsumerIdNumber())
                .transactionId(UUID.randomUUID().toString())
                .paymentDate(LocalDateTime.now())
                .status("SUCCESS")
                .build();
    }

    @Override
    public List<BillPaymentResponse> getBillPaymentHistory() {
        // Implementation will be added later
        // For now, return an empty list
        return new ArrayList<>();
    }

    @Override
    public BillPaymentResponse getBillPaymentById(Long paymentId) {
        // Implementation will be added later
        // For now, return a mock response
        return BillPaymentResponse.builder()
                .id(paymentId)
                .billerId("BIL001")
                .billerName("BESCOM")
                .billerCategory("ELECTRICITY")
                .accountNumber("12345678")
                .amount(BigDecimal.valueOf(1000.0))
                .consumerIdNumber("CONS123456")
                .transactionId(UUID.randomUUID().toString())
                .paymentDate(LocalDateTime.now())
                .status("SUCCESS")
                .build();
    }

    @Override
    public MobileRechargeResponse mobileRecharge(MobileRechargeRequest request) {
        // Implementation will be added later
        // For now, return a mock response
        return MobileRechargeResponse.builder()
                .id(1L)
                .mobileNumber(request.getMobileNumber())
                .operator(request.getOperator())
                .circle(request.getCircle())
                .amount(request.getAmount())
                .planId(request.getPlanId())
                .rechargeType(request.getRechargeType())
                .accountNumber(request.getAccountNumber())
                .transactionId(UUID.randomUUID().toString())
                .rechargeDate(LocalDateTime.now())
                .status("SUCCESS")
                .build();
    }

    @Override
    public List<MobileRechargeResponse> getMobileRechargeHistory() {
        // Implementation will be added later
        // For now, return an empty list
        return new ArrayList<>();
    }

    @Override
    public MobileRechargeResponse getMobileRechargeById(Long rechargeId) {
        // Implementation will be added later
        // For now, return a mock response
        return MobileRechargeResponse.builder()
                .id(rechargeId)
                .mobileNumber("9876543210")
                .operator("Airtel")
                .circle("Mumbai")
                .amount(BigDecimal.valueOf(100.0))
                .planId("AIRTEL99")
                .planDetails("1.5GB/day, Unlimited Calls, 84 days")
                .rechargeType("PREPAID")
                .accountNumber("12345678")
                .transactionId(UUID.randomUUID().toString())
                .rechargeDate(LocalDateTime.now())
                .status("SUCCESS")
                .build();
    }

    @Override
    public UtilityPaymentResponse payUtilityBill(UtilityPaymentRequest request) {
        // Implementation will be added later
        // For now, return a mock response
        return UtilityPaymentResponse.builder()
                .id(1L)
                .utilityProvider(request.getUtilityProvider())
                .utilityType(request.getUtilityType())
                .consumerIdNumber(request.getConsumerIdNumber())
                .accountNumber(request.getAccountNumber())
                .amount(request.getAmount())
                .billNumber(request.getBillNumber())
                .billPeriod(request.getBillPeriod())
                .transactionId(UUID.randomUUID().toString())
                .paymentDate(LocalDateTime.now())
                .status("SUCCESS")
                .build();
    }

    @Override
    public List<UtilityPaymentResponse> getUtilityPaymentHistory() {
        // Implementation will be added later
        // For now, return an empty list
        return new ArrayList<>();
    }

    @Override
    public UtilityPaymentResponse getUtilityPaymentById(Long paymentId) {
        // Implementation will be added later
        // For now, return a mock response
        return UtilityPaymentResponse.builder()
                .id(paymentId)
                .utilityProvider("BESCOM")
                .utilityType("ELECTRICITY")
                .consumerIdNumber("CONS123456")
                .accountNumber("12345678")
                .amount(BigDecimal.valueOf(500.0))
                .billNumber("BN12345")
                .billPeriod("July 2023")
                .transactionId(UUID.randomUUID().toString())
                .paymentDate(LocalDateTime.now())
                .status("SUCCESS")
                .build();
    }

    @Override
    public List<BillerResponse> getAllBillers() {
        // Implementation will be added later
        // For now, return a list with sample billers
        List<BillerResponse> billers = new ArrayList<>();
        billers.add(BillerResponse.builder()
                .billerId("BIL001")
                .billerName("BESCOM")
                .billerCategory("UTILITY")
                .billerType("ELECTRICITY")
                .build());
                
        billers.add(BillerResponse.builder()
                .billerId("BIL002")
                .billerName("BWSSB")
                .billerCategory("UTILITY")
                .billerType("WATER")
                .build());
                
        billers.add(BillerResponse.builder()
                .billerId("BIL003")
                .billerName("Airtel")
                .billerCategory("TELECOM")
                .billerType("MOBILE")
                .build());
                
        return billers;
    }

    @Override
    public List<BillerResponse> getBillersByType(String type) {
        // Implementation will be added later
        // For now, filter from the sample list based on type
        List<BillerResponse> allBillers = getAllBillers();
        List<BillerResponse> filteredBillers = new ArrayList<>();
        
        for (BillerResponse biller : allBillers) {
            if (biller.getBillerType().equalsIgnoreCase(type)) {
                filteredBillers.add(biller);
            }
        }
        
        return filteredBillers;
    }
} 