package com.apnabank.service.impl;

import com.apnabank.dto.loan.*;
import com.apnabank.model.LoanStatus;
import com.apnabank.model.LoanType;
import com.apnabank.service.LoanService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class LoanServiceImpl implements LoanService {

    @Override
    public LoanResponse applyForPersonalLoan(PersonalLoanRequest request) {
        // Implementation will be added later
        // For now, return a mock response
        return createMockLoanResponse(request.getAmount(), request.getTenureMonths(), LoanType.PERSONAL, LoanStatus.APPLIED);
    }

    @Override
    public LoanResponse applyForHomeLoan(HomeLoanRequest request) {
        // Implementation will be added later
        // For now, return a mock response
        return createMockLoanResponse(request.getAmount(), request.getTenureMonths(), LoanType.HOME, LoanStatus.APPLIED);
    }

    @Override
    public LoanResponse applyForCarLoan(CarLoanRequest request) {
        // Implementation will be added later
        // For now, return a mock response
        return createMockLoanResponse(request.getAmount(), request.getTenureMonths(), LoanType.VEHICLE, LoanStatus.APPLIED);
    }

    @Override
    public List<LoanResponse> getAllUserLoans() {
        // Implementation will be added later
        // For now, return a list with sample loans
        List<LoanResponse> loans = new ArrayList<>();
        loans.add(createMockLoanResponse(BigDecimal.valueOf(100000), 24, LoanType.PERSONAL, LoanStatus.APPROVED));
        loans.add(createMockLoanResponse(BigDecimal.valueOf(5000000), 240, LoanType.HOME, LoanStatus.DISBURSED));
        loans.add(createMockLoanResponse(BigDecimal.valueOf(800000), 60, LoanType.VEHICLE, LoanStatus.DISBURSED));
        return loans;
    }

    @Override
    public LoanResponse getLoanById(Long loanId) {
        // Implementation will be added later
        // For now, return a mock response for the specific ID
        LoanResponse response = createMockLoanResponse(BigDecimal.valueOf(100000), 24, LoanType.PERSONAL, LoanStatus.DISBURSED);
        // Set the ID directly
        response.setId(loanId);
        return response;
    }

    @Override
    public List<LoanResponse> getLoansByStatus(String statusStr) {
        // Implementation will be added later
        // For now, return filtered list based on status
        try {
            LoanStatus status = LoanStatus.valueOf(statusStr.toUpperCase());
            List<LoanResponse> allLoans = getAllUserLoans();
            List<LoanResponse> filteredLoans = new ArrayList<>();
            
            for (LoanResponse loan : allLoans) {
                if (loan.getStatus() == status) {
                    filteredLoans.add(loan);
                }
            }
            
            return filteredLoans;
        } catch (IllegalArgumentException e) {
            // Invalid status string
            return new ArrayList<>();
        }
    }

    @Override
    public LoanRepaymentResponse makeLoanRepayment(Long loanId, LoanRepaymentRequest request) {
        // Implementation will be added later
        // For now, return a mock response
        return LoanRepaymentResponse.builder()
                .id(1L)
                .loanId(loanId)
                .loanNumber("LOAN" + UUID.randomUUID().toString().substring(0, 8))
                .accountNumber("12345678")
                .amount(request.getAmount())
                .remainingLoanAmount(BigDecimal.valueOf(50000))
                .remarks("Regular EMI payment")
                .paymentDate(LocalDateTime.now())
                .transactionReference(UUID.randomUUID().toString())
                .build();
    }

    @Override
    public List<LoanRepaymentResponse> getLoanRepayments(Long loanId) {
        // Implementation will be added later
        // For now, return a list with sample repayments
        List<LoanRepaymentResponse> repayments = new ArrayList<>();
        repayments.add(createMockRepayment(loanId, 1L, LocalDateTime.now().minusMonths(2)));
        repayments.add(createMockRepayment(loanId, 2L, LocalDateTime.now().minusMonths(1)));
        repayments.add(createMockRepayment(loanId, 3L, LocalDateTime.now()));
        return repayments;
    }

    @Override
    public List<RepaymentScheduleResponse> getLoanRepaymentSchedule(Long loanId) {
        // Implementation will be added later
        // For now, return a list with sample schedule
        List<RepaymentScheduleResponse> schedule = new ArrayList<>();
        LocalDate today = LocalDate.now();
        
        for (int i = 1; i <= 6; i++) {
            schedule.add(RepaymentScheduleResponse.builder()
                    .id((long) i)
                    .loanId(loanId)
                    .installmentNumber(i)
                    .dueDate(today.plusMonths(i))
                    .emiAmount(BigDecimal.valueOf(10000))
                    .principalComponent(BigDecimal.valueOf(8000))
                    .interestComponent(BigDecimal.valueOf(2000))
                    .outstandingPrincipal(BigDecimal.valueOf(100000 - (i * 8000)))
                    .isPaid(i <= 3) // First 3 are paid
                    .paidDate(i <= 3 ? today.minusDays(i * 5) : null)
                    .build());
        }
        
        return schedule;
    }
    
    // Helper method to create a mock loan response
    private LoanResponse createMockLoanResponse(BigDecimal amount, Integer tenureMonths, LoanType loanType, LoanStatus status) {
        BigDecimal interestRate = getInterestRate(loanType);
        BigDecimal emi = calculateEMI(amount, tenureMonths, loanType);
        BigDecimal totalInterest = emi.multiply(BigDecimal.valueOf(tenureMonths)).subtract(amount);
        BigDecimal totalAmount = amount.add(totalInterest);
        
        return LoanResponse.builder()
                .id(1L)
                .accountNumber("12345678")
                .loanNumber("LOAN" + UUID.randomUUID().toString().substring(0, 8))
                .loanType(loanType)
                .amount(amount)
                .interestRate(interestRate)
                .tenureMonths(tenureMonths)
                .emi(emi)
                .totalInterest(totalInterest)
                .totalAmount(totalAmount)
                .amountPaid(BigDecimal.ZERO)
                .outstandingAmount(totalAmount)
                .startDate(LocalDateTime.now())
                .endDate(LocalDateTime.now().plusMonths(tenureMonths))
                .status(status)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }
    
    // Helper method to get interest rate based on loan type
    private BigDecimal getInterestRate(LoanType loanType) {
        switch (loanType) {
            case HOME:
                return BigDecimal.valueOf(7.5);
            case VEHICLE:
                return BigDecimal.valueOf(9.5);
            case PERSONAL:
                return BigDecimal.valueOf(11.5);
            case EDUCATION:
                return BigDecimal.valueOf(8.5);
            case BUSINESS:
                return BigDecimal.valueOf(12.0);
            default:
                return BigDecimal.valueOf(10.0);
        }
    }
    
    // Helper method to calculate EMI
    private BigDecimal calculateEMI(BigDecimal principal, Integer tenureMonths, LoanType loanType) {
        double rate = getInterestRate(loanType).doubleValue();
        double monthlyRate = rate / (12 * 100);
        double emi = principal.doubleValue() * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths) 
                / (Math.pow(1 + monthlyRate, tenureMonths) - 1);
        return BigDecimal.valueOf(emi).setScale(2, java.math.RoundingMode.HALF_UP);
    }
    
    // Helper method to create a mock repayment
    private LoanRepaymentResponse createMockRepayment(Long loanId, Long id, LocalDateTime paymentDate) {
        BigDecimal amount = BigDecimal.valueOf(10000);
        return LoanRepaymentResponse.builder()
                .id(id)
                .loanId(loanId)
                .loanNumber("LOAN" + UUID.randomUUID().toString().substring(0, 8))
                .accountNumber("12345678")
                .amount(amount)
                .remainingLoanAmount(BigDecimal.valueOf(100000 - (id * 10000)))
                .remarks("Regular EMI payment")
                .paymentDate(paymentDate)
                .transactionReference(UUID.randomUUID().toString())
                .build();
    }
} 