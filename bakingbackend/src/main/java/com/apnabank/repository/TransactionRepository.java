package com.apnabank.repository;

import com.apnabank.model.Account;
import com.apnabank.model.Transaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    
    Optional<Transaction> findByTransactionNumber(String transactionNumber);
    
    @Query("SELECT t FROM Transaction t WHERE t.fromAccount = ?1 OR t.toAccount = ?1")
    Page<Transaction> findByAccount(Account account, Pageable pageable);
    
    @Query("SELECT t FROM Transaction t WHERE t.fromAccount = ?1 OR t.toAccount = ?1 ORDER BY t.timestamp DESC")
    List<Transaction> findByAccount(Account account);
    
    @Query("SELECT t FROM Transaction t WHERE (t.fromAccount = ?1 OR t.toAccount = ?1) AND t.timestamp BETWEEN ?2 AND ?3 ORDER BY t.timestamp DESC")
    List<Transaction> findByAccountAndTimestampBetween(Account account, LocalDateTime startDate, LocalDateTime endDate);
} 