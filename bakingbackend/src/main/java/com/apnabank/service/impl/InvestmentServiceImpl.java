package com.apnabank.service.impl;

import com.apnabank.dto.investment.*;
import com.apnabank.service.InvestmentService;
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
public class InvestmentServiceImpl implements InvestmentService {

    @Override
    public FixedDepositResponse createFixedDeposit(FixedDepositRequest request) {
        // Implementation will be added later
        // For now, return a mock response
        BigDecimal interestRate = getInterestRateForTenure(request.getTenureMonths());
        BigDecimal maturityAmount = calculateMaturityAmount(request.getAmount(), request.getTenureMonths());
        BigDecimal interestAmount = maturityAmount.subtract(request.getAmount());
        
        return FixedDepositResponse.builder()
                .id(1L)
                .accountNumber(request.getAccountNumber())
                .fdNumber("FD" + UUID.randomUUID().toString().substring(0, 8))
                .amount(request.getAmount())
                .tenureMonths(request.getTenureMonths())
                .interestRate(interestRate)
                .maturityAmount(maturityAmount)
                .interestAmount(interestAmount)
                .startDate(LocalDate.now())
                .maturityDate(LocalDate.now().plusMonths(request.getTenureMonths()))
                .status("ACTIVE")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    @Override
    public List<FixedDepositResponse> getAllFixedDeposits() {
        // Implementation will be added later
        // For now, return a list with sample fixed deposits
        List<FixedDepositResponse> fixedDeposits = new ArrayList<>();
        fixedDeposits.add(createMockFixedDeposit(1L, "12345678", BigDecimal.valueOf(100000), 12));
        fixedDeposits.add(createMockFixedDeposit(2L, "12345678", BigDecimal.valueOf(50000), 24));
        fixedDeposits.add(createMockFixedDeposit(3L, "12345678", BigDecimal.valueOf(200000), 36));
        return fixedDeposits;
    }

    @Override
    public FixedDepositResponse getFixedDepositById(Long id) {
        // Implementation will be added later
        // For now, return a mock response for the specific ID
        return createMockFixedDeposit(id, "12345678", BigDecimal.valueOf(100000), 12);
    }

    @Override
    public RecurringDepositResponse createRecurringDeposit(RecurringDepositRequest request) {
        // Implementation will be added later
        // For now, return a mock response
        BigDecimal interestRate = getInterestRateForTenure(request.getTenureMonths());
        BigDecimal maturityAmount = calculateRDMaturityAmount(request.getMonthlyDepositAmount(), request.getTenureMonths());
        BigDecimal totalDepositAmount = request.getMonthlyDepositAmount().multiply(BigDecimal.valueOf(request.getTenureMonths()));
        BigDecimal interestAmount = maturityAmount.subtract(totalDepositAmount);
        
        return RecurringDepositResponse.builder()
                .id(1L)
                .accountNumber(request.getAccountNumber())
                .rdNumber("RD" + UUID.randomUUID().toString().substring(0, 8))
                .monthlyDepositAmount(request.getMonthlyDepositAmount())
                .tenureMonths(request.getTenureMonths())
                .interestRate(interestRate)
                .maturityAmount(maturityAmount)
                .totalDepositAmount(totalDepositAmount)
                .interestAmount(interestAmount)
                .installmentsPaid(0)
                .totalInstallments(request.getTenureMonths())
                .startDate(LocalDate.now())
                .maturityDate(LocalDate.now().plusMonths(request.getTenureMonths()))
                .status("ACTIVE")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    @Override
    public List<RecurringDepositResponse> getAllRecurringDeposits() {
        // Implementation will be added later
        // For now, return a list with sample recurring deposits
        List<RecurringDepositResponse> recurringDeposits = new ArrayList<>();
        recurringDeposits.add(createMockRecurringDeposit(1L, "12345678", BigDecimal.valueOf(5000), 36));
        recurringDeposits.add(createMockRecurringDeposit(2L, "12345678", BigDecimal.valueOf(10000), 24));
        recurringDeposits.add(createMockRecurringDeposit(3L, "12345678", BigDecimal.valueOf(3000), 60));
        return recurringDeposits;
    }

    @Override
    public RecurringDepositResponse getRecurringDepositById(Long id) {
        // Implementation will be added later
        // For now, return a mock response for the specific ID
        return createMockRecurringDeposit(id, "12345678", BigDecimal.valueOf(5000), 36);
    }

    @Override
    public MutualFundResponse investInMutualFund(MutualFundRequest request) {
        // Implementation will be added later
        // For now, return a mock response
        BigDecimal navAtPurchase = BigDecimal.valueOf(10); // Assuming NAV is 10
        BigDecimal units = request.getInvestmentAmount().divide(navAtPurchase, 2, BigDecimal.ROUND_HALF_UP);
        
        return MutualFundResponse.builder()
                .id(1L)
                .investmentId("MF" + UUID.randomUUID().toString().substring(0, 8))
                .accountNumber(request.getAccountNumber())
                .fundId(request.getFundId())
                .fundName(getMockFundName(request.getFundId()))
                .fundCategory("EQUITY")
                .investmentAmount(request.getInvestmentAmount())
                .investmentType("LUMP_SUM")
                .navAtPurchase(navAtPurchase)
                .currentNav(navAtPurchase)
                .units(units)
                .currentValue(request.getInvestmentAmount()) // Initially same as investment amount
                .returns(BigDecimal.ZERO)
                .returnsPercentage(BigDecimal.ZERO)
                .investmentDate(LocalDate.now())
                .lastValuationDate(LocalDate.now())
                .status("ACTIVE")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    @Override
    public List<MutualFundResponse> getAllMutualFundInvestments() {
        // Implementation will be added later
        // For now, return a list with sample mutual fund investments
        List<MutualFundResponse> mutualFunds = new ArrayList<>();
        mutualFunds.add(createMockMutualFund(1L, "12345678", "MF001", BigDecimal.valueOf(10000)));
        mutualFunds.add(createMockMutualFund(2L, "12345678", "MF002", BigDecimal.valueOf(25000)));
        mutualFunds.add(createMockMutualFund(3L, "12345678", "MF003", BigDecimal.valueOf(50000)));
        return mutualFunds;
    }

    @Override
    public MutualFundResponse getMutualFundInvestmentById(Long id) {
        // Implementation will be added later
        // For now, return a mock response for the specific ID
        return createMockMutualFund(id, "12345678", "MF001", BigDecimal.valueOf(10000));
    }

    @Override
    public List<FDRateResponse> getFixedDepositRates() {
        // Implementation will be added later
        // For now, return a list with sample FD rates
        List<FDRateResponse> rates = new ArrayList<>();
        rates.add(FDRateResponse.builder().tenureMonths(3).regularRate(BigDecimal.valueOf(4.5)).seniorCitizenRate(BigDecimal.valueOf(5.0)).build());
        rates.add(FDRateResponse.builder().tenureMonths(6).regularRate(BigDecimal.valueOf(5.0)).seniorCitizenRate(BigDecimal.valueOf(5.5)).build());
        rates.add(FDRateResponse.builder().tenureMonths(12).regularRate(BigDecimal.valueOf(5.5)).seniorCitizenRate(BigDecimal.valueOf(6.0)).build());
        rates.add(FDRateResponse.builder().tenureMonths(24).regularRate(BigDecimal.valueOf(6.0)).seniorCitizenRate(BigDecimal.valueOf(6.5)).build());
        rates.add(FDRateResponse.builder().tenureMonths(36).regularRate(BigDecimal.valueOf(6.5)).seniorCitizenRate(BigDecimal.valueOf(7.0)).build());
        rates.add(FDRateResponse.builder().tenureMonths(60).regularRate(BigDecimal.valueOf(7.0)).seniorCitizenRate(BigDecimal.valueOf(7.5)).build());
        return rates;
    }

    @Override
    public List<RDRateResponse> getRecurringDepositRates() {
        // Implementation will be added later
        // For now, return a list with sample RD rates
        List<RDRateResponse> rates = new ArrayList<>();
        rates.add(RDRateResponse.builder().tenureMonths(6).regularRate(BigDecimal.valueOf(5.0)).seniorCitizenRate(BigDecimal.valueOf(5.5)).build());
        rates.add(RDRateResponse.builder().tenureMonths(12).regularRate(BigDecimal.valueOf(5.5)).seniorCitizenRate(BigDecimal.valueOf(6.0)).build());
        rates.add(RDRateResponse.builder().tenureMonths(24).regularRate(BigDecimal.valueOf(6.0)).seniorCitizenRate(BigDecimal.valueOf(6.5)).build());
        rates.add(RDRateResponse.builder().tenureMonths(36).regularRate(BigDecimal.valueOf(6.5)).seniorCitizenRate(BigDecimal.valueOf(7.0)).build());
        rates.add(RDRateResponse.builder().tenureMonths(60).regularRate(BigDecimal.valueOf(7.0)).seniorCitizenRate(BigDecimal.valueOf(7.5)).build());
        return rates;
    }

    @Override
    public List<AvailableMutualFundResponse> getAvailableMutualFunds() {
        // Implementation will be added later
        // For now, return a list with sample available mutual funds
        List<AvailableMutualFundResponse> funds = new ArrayList<>();
        funds.add(createMockAvailableFund("MF001", "HDFC Top 100 Fund", "EQUITY", 12.5, 15.8, 14.2));
        funds.add(createMockAvailableFund("MF002", "SBI Blue Chip Fund", "EQUITY", 11.2, 14.3, 13.1));
        funds.add(createMockAvailableFund("MF003", "Axis Liquid Fund", "DEBT", 6.5, 7.2, 7.5));
        funds.add(createMockAvailableFund("MF004", "ICICI Prudential Value Discovery Fund", "EQUITY", 13.8, 16.2, 15.5));
        funds.add(createMockAvailableFund("MF005", "Kotak Corporate Bond Fund", "DEBT", 7.8, 8.5, 8.2));
        return funds;
    }
    
    // Helper methods
    
    private FixedDepositResponse createMockFixedDeposit(Long id, String accountNumber, BigDecimal amount, Integer tenureMonths) {
        BigDecimal interestRate = getInterestRateForTenure(tenureMonths);
        BigDecimal maturityAmount = calculateMaturityAmount(amount, tenureMonths);
        BigDecimal interestAmount = maturityAmount.subtract(amount);
        
        return FixedDepositResponse.builder()
                .id(id)
                .accountNumber(accountNumber)
                .fdNumber("FD" + UUID.randomUUID().toString().substring(0, 8))
                .amount(amount)
                .tenureMonths(tenureMonths)
                .interestRate(interestRate)
                .maturityAmount(maturityAmount)
                .interestAmount(interestAmount)
                .startDate(LocalDate.now().minusDays(30))
                .maturityDate(LocalDate.now().minusDays(30).plusMonths(tenureMonths))
                .status("ACTIVE")
                .createdAt(LocalDateTime.now().minusDays(30))
                .updatedAt(LocalDateTime.now().minusDays(30))
                .build();
    }
    
    private RecurringDepositResponse createMockRecurringDeposit(Long id, String accountNumber, BigDecimal monthlyAmount, Integer tenureMonths) {
        BigDecimal interestRate = getInterestRateForTenure(tenureMonths);
        BigDecimal maturityAmount = calculateRDMaturityAmount(monthlyAmount, tenureMonths);
        BigDecimal totalDepositAmount = monthlyAmount.multiply(BigDecimal.valueOf(tenureMonths));
        BigDecimal interestAmount = maturityAmount.subtract(totalDepositAmount);
        
        int monthsSinceStart = 3; // Assuming it was started 3 months ago
        
        return RecurringDepositResponse.builder()
                .id(id)
                .accountNumber(accountNumber)
                .rdNumber("RD" + UUID.randomUUID().toString().substring(0, 8))
                .monthlyDepositAmount(monthlyAmount)
                .tenureMonths(tenureMonths)
                .interestRate(interestRate)
                .maturityAmount(maturityAmount)
                .totalDepositAmount(totalDepositAmount)
                .interestAmount(interestAmount)
                .installmentsPaid(monthsSinceStart)
                .totalInstallments(tenureMonths)
                .startDate(LocalDate.now().minusMonths(monthsSinceStart))
                .maturityDate(LocalDate.now().minusMonths(monthsSinceStart).plusMonths(tenureMonths))
                .status("ACTIVE")
                .createdAt(LocalDateTime.now().minusMonths(monthsSinceStart))
                .updatedAt(LocalDateTime.now())
                .build();
    }
    
    private MutualFundResponse createMockMutualFund(Long id, String accountNumber, String fundId, BigDecimal amount) {
        BigDecimal navAtPurchase = BigDecimal.valueOf(10); // Assuming NAV is 10
        BigDecimal currentNav = BigDecimal.valueOf(12); // Assuming 20% growth
        BigDecimal units = amount.divide(navAtPurchase, 2, BigDecimal.ROUND_HALF_UP);
        BigDecimal currentValue = units.multiply(currentNav);
        BigDecimal returns = currentValue.subtract(amount);
        BigDecimal returnsPercentage = returns.multiply(BigDecimal.valueOf(100)).divide(amount, 2, BigDecimal.ROUND_HALF_UP);
        
        return MutualFundResponse.builder()
                .id(id)
                .investmentId("MF" + UUID.randomUUID().toString().substring(0, 8))
                .accountNumber(accountNumber)
                .fundId(fundId)
                .fundName(getMockFundName(fundId))
                .fundCategory("EQUITY")
                .investmentAmount(amount)
                .investmentType("LUMP_SUM")
                .navAtPurchase(navAtPurchase)
                .currentNav(currentNav)
                .units(units)
                .currentValue(currentValue)
                .returns(returns)
                .returnsPercentage(returnsPercentage)
                .investmentDate(LocalDate.now().minusMonths(6))
                .lastValuationDate(LocalDate.now())
                .status("ACTIVE")
                .createdAt(LocalDateTime.now().minusMonths(6))
                .updatedAt(LocalDateTime.now())
                .build();
    }
    
    private AvailableMutualFundResponse createMockAvailableFund(String fundId, String name, String category, double oneYearReturn, double threeYearReturn, double fiveYearReturn) {
        return AvailableMutualFundResponse.builder()
                .fundId(fundId)
                .fundName(name)
                .fundHouse(name.split(" ")[0]) // Extract fund house from name (e.g., "HDFC" from "HDFC Top 100 Fund")
                .fundCategory(category)
                .riskLevel(category.equals("DEBT") ? "LOW" : "HIGH")
                .currentNav(BigDecimal.valueOf(10 + Math.random() * 290)) // Random NAV between 10 and 300
                .minInvestmentAmount(BigDecimal.valueOf(category.equals("DEBT") ? 5000 : 1000))
                .minSipAmount(BigDecimal.valueOf(category.equals("DEBT") ? 1000 : 500))
                .expenseRatio(BigDecimal.valueOf(category.equals("DEBT") ? 0.5 : 1.5))
                .oneYearReturn(BigDecimal.valueOf(oneYearReturn))
                .threeYearReturn(BigDecimal.valueOf(threeYearReturn))
                .fiveYearReturn(BigDecimal.valueOf(fiveYearReturn))
                .exitLoad("1% if redeemed within 1 year")
                .sipAvailable(true)
                .fundManager("John Doe")
                .investmentObjective("Long term capital appreciation")
                .build();
    }
    
    private BigDecimal getInterestRateForTenure(Integer tenureMonths) {
        if (tenureMonths <= 3) return BigDecimal.valueOf(4.5);
        if (tenureMonths <= 6) return BigDecimal.valueOf(5.0);
        if (tenureMonths <= 12) return BigDecimal.valueOf(5.5);
        if (tenureMonths <= 24) return BigDecimal.valueOf(6.0);
        if (tenureMonths <= 36) return BigDecimal.valueOf(6.5);
        return BigDecimal.valueOf(7.0);
    }
    
    private BigDecimal calculateMaturityAmount(BigDecimal principal, Integer tenureMonths) {
        BigDecimal rate = getInterestRateForTenure(tenureMonths);
        double simpleInterest = principal.doubleValue() * rate.doubleValue() * tenureMonths / (100 * 12);
        return principal.add(BigDecimal.valueOf(simpleInterest));
    }
    
    private BigDecimal calculateRDMaturityAmount(BigDecimal monthlyAmount, Integer tenureMonths) {
        BigDecimal rate = getInterestRateForTenure(tenureMonths);
        double totalContribution = monthlyAmount.doubleValue() * tenureMonths;
        double approximateInterest = totalContribution * rate.doubleValue() * (tenureMonths + 1) / (2 * 100 * 12);
        return BigDecimal.valueOf(totalContribution + approximateInterest);
    }
    
    private String getMockFundName(String fundId) {
        switch (fundId) {
            case "MF001": return "HDFC Top 100 Fund";
            case "MF002": return "SBI Blue Chip Fund";
            case "MF003": return "Axis Liquid Fund";
            case "MF004": return "ICICI Prudential Value Discovery Fund";
            case "MF005": return "Kotak Corporate Bond Fund";
            default: return "Unknown Fund";
        }
    }
} 