package com.apnabank.repository;

import com.apnabank.model.Loan;
import com.apnabank.model.LoanStatus;
import com.apnabank.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LoanRepository extends JpaRepository<Loan, Long> {
    List<Loan> findByUser(User user);
    List<Loan> findByUserAndStatus(User user, LoanStatus status);
    Optional<Loan> findByLoanNumber(String loanNumber);
    Optional<Loan> findByIdAndUser(Long id, User user);
} 