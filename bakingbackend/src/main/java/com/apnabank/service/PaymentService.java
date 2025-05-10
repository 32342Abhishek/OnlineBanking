package com.apnabank.service;

import com.apnabank.dto.payment.*;
import java.util.List;

/**
 * Service interface for handling payment operations
 */
public interface PaymentService {
    
    /**
     * Process a bill payment
     * @param request Bill payment details
     * @return Response with bill payment information
     */
    BillPaymentResponse payBill(BillPaymentRequest request);
    
    /**
     * Get payment history for the authenticated user
     * @return List of bill payments
     */
    List<BillPaymentResponse> getBillPaymentHistory();
    
    /**
     * Get details of a specific bill payment
     * @param paymentId The ID of the payment
     * @return Bill payment details
     */
    BillPaymentResponse getBillPaymentById(Long paymentId);
    
    /**
     * Process a mobile recharge
     * @param request Mobile recharge details
     * @return Response with recharge information
     */
    MobileRechargeResponse mobileRecharge(MobileRechargeRequest request);
    
    /**
     * Get mobile recharge history for the authenticated user
     * @return List of mobile recharges
     */
    List<MobileRechargeResponse> getMobileRechargeHistory();
    
    /**
     * Get details of a specific mobile recharge
     * @param rechargeId The ID of the recharge
     * @return Mobile recharge details
     */
    MobileRechargeResponse getMobileRechargeById(Long rechargeId);
    
    /**
     * Process a utility bill payment
     * @param request Utility payment details
     * @return Response with utility payment information
     */
    UtilityPaymentResponse payUtilityBill(UtilityPaymentRequest request);
    
    /**
     * Get utility payment history for the authenticated user
     * @return List of utility payments
     */
    List<UtilityPaymentResponse> getUtilityPaymentHistory();
    
    /**
     * Get details of a specific utility payment
     * @param paymentId The ID of the payment
     * @return Utility payment details
     */
    UtilityPaymentResponse getUtilityPaymentById(Long paymentId);
    
    /**
     * Get all available billers
     * @return List of billers
     */
    List<BillerResponse> getAllBillers();
    
    /**
     * Get billers filtered by type
     * @param type Type of the biller
     * @return List of billers of the specified type
     */
    List<BillerResponse> getBillersByType(String type);
} 