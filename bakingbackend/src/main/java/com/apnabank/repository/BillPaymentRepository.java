package com.apnabank.repository;

import com.apnabank.model.Account;
import com.apnabank.model.BillPayment;
import com.apnabank.model.Biller;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BillPaymentRepository extends JpaRepository<BillPayment, Long> {
    List<BillPayment> findByAccount(Account account);
    List<BillPayment> findByBiller(Biller biller);
    List<BillPayment> findByAccountAndPaymentDateBetween(Account account, LocalDateTime startDate, LocalDateTime endDate);
    List<BillPayment> findByBillerAndPaymentDateBetween(Biller biller, LocalDateTime startDate, LocalDateTime endDate);
} 