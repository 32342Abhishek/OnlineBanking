package com.apnabank.repository;

import com.apnabank.model.Loan;
import com.apnabank.model.LoanRepayment;
import com.apnabank.model.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface LoanRepaymentRepository extends JpaRepository<LoanRepayment, Long> {
    List<LoanRepayment> findByLoan(Loan loan);
    List<LoanRepayment> findByLoanAndStatus(Loan loan, PaymentStatus status);
    List<LoanRepayment> findByLoanAndDueDateBefore(Loan loan, LocalDateTime currentDate);
    List<LoanRepayment> findByLoanAndDueDateBeforeAndStatus(Loan loan, LocalDateTime currentDate, PaymentStatus status);
} 