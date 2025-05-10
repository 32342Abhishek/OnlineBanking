package com.apnabank.repository;

import com.apnabank.model.Account;
import com.apnabank.model.Biller;
import com.apnabank.model.RecurringPayment;
import com.apnabank.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface RecurringPaymentRepository extends JpaRepository<RecurringPayment, Long> {
    List<RecurringPayment> findByUser(User user);
    List<RecurringPayment> findByUserAndActive(User user, boolean active);
    List<RecurringPayment> findByAccount(Account account);
    List<RecurringPayment> findByBiller(Biller biller);
    Optional<RecurringPayment> findByIdAndUser(Long id, User user);
    
    @Query("SELECT rp FROM RecurringPayment rp WHERE rp.active = true AND rp.nextExecutionDate <= ?1")
    List<RecurringPayment> findDueRecurringPayments(LocalDateTime currentDate);
} 