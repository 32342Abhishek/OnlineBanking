package com.apnabank.repository;

import com.apnabank.model.Account;
import com.apnabank.model.AccountStatus;
import com.apnabank.model.AccountType;
import com.apnabank.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {
    List<Account> findByUser(User user);
    List<Account> findByUserAndActive(User user, boolean active);
    List<Account> findByUserAndAccountTypeAndActive(User user, AccountType accountType, boolean active);
    Optional<Account> findByAccountNumber(String accountNumber);
    boolean existsByAccountNumber(String accountNumber);
    Optional<Account> findByUserAndAccountNumber(User user, String accountNumber);
    List<Account> findByStatus(AccountStatus status);
} 