package com.apnabank.service;

import com.apnabank.dto.account.*;
import com.apnabank.model.Account;
import com.apnabank.model.AccountStatus;
import com.apnabank.model.AccountType;
import com.apnabank.model.Role;
import com.apnabank.model.User;
import com.apnabank.repository.AccountRepository;
import com.apnabank.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AccountService {

    private final AccountRepository accountRepository;
    private final UserRepository userRepository;
    
    @Transactional
    public AccountResponse createAccount(AccountRequest request) {
        User currentUser = getCurrentUser();
        
        // Generate account number (12 digits)
        String accountNumber = generateAccountNumber();
        
        Account account = Account.builder()
                .accountNumber(accountNumber)
                .accountHolderName(request.getAccountHolderName())
                .accountType(request.getAccountType())
                .balance(request.getInitialBalance())
                .createdAt(LocalDateTime.now())
                .active(true)
                .status(AccountStatus.PENDING_APPROVAL)
                .user(currentUser)
                .build();
        
        Account savedAccount = accountRepository.save(account);
        return mapToAccountResponse(savedAccount);
    }
    
    @Transactional
    public AccountResponse createSavingsAccount(SavingsAccountRequest request) {
        User currentUser = getCurrentUser();
        String accountNumber = generateAccountNumber();
        
        Account account = Account.builder()
                .accountNumber(accountNumber)
                .accountHolderName(request.getFullName())
                .accountType(AccountType.SAVINGS)
                .balance(BigDecimal.valueOf(request.getInitialDeposit()))
                .createdAt(LocalDateTime.now())
                .active(true)
                .email(request.getEmail())
                .mobileNumber(request.getMobileNumber())
                .address(request.getAddress())
                .city(request.getCity())
                .state(request.getState())
                .postalCode(request.getPostalCode())
                .user(currentUser)
                .build();
        
        Account savedAccount = accountRepository.save(account);
        return mapToAccountResponse(savedAccount);
    }
    
    @Transactional
    public AccountResponse createCurrentAccount(CurrentAccountRequest request) {
        User currentUser = getCurrentUser();
        String accountNumber = generateAccountNumber();
        
        Account account = Account.builder()
                .accountNumber(accountNumber)
                .accountHolderName(request.getFullName())
                .accountType(AccountType.CURRENT)
                .balance(BigDecimal.valueOf(request.getInitialDeposit()))
                .createdAt(LocalDateTime.now())
                .active(true)
                .email(request.getEmail())
                .mobileNumber(request.getMobileNumber())
                .address(request.getBusinessAddress())
                .city(request.getCity())
                .state(request.getState())
                .postalCode(request.getPostalCode())
                .user(currentUser)
                .build();
        
        Account savedAccount = accountRepository.save(account);
        return mapToAccountResponse(savedAccount);
    }
    
    @Transactional
    public AccountResponse createZeroBalanceAccount(ZeroBalanceAccountRequest request) {
        User currentUser = getCurrentUser();
        String accountNumber = generateAccountNumber();
        
        Account account = Account.builder()
                .accountNumber(accountNumber)
                .accountHolderName(request.getFullName())
                .accountType(AccountType.ZERO_BALANCE)
                .balance(BigDecimal.ZERO)
                .createdAt(LocalDateTime.now())
                .active(true)
                .email(request.getEmail())
                .mobileNumber(request.getMobileNumber())
                .address(request.getAddress())
                .city(request.getCity())
                .state(request.getState())
                .postalCode(request.getPostalCode())
                .user(currentUser)
                .build();
        
        Account savedAccount = accountRepository.save(account);
        return mapToAccountResponse(savedAccount);
    }
    
    @Transactional
    public AccountResponse createJointAccount(JointAccountRequest request) {
        User currentUser = getCurrentUser();
        String accountNumber = generateAccountNumber();
        
        Account account = Account.builder()
                .accountNumber(accountNumber)
                .accountHolderName(request.getPrimaryHolderName())
                .secondaryHolderName(request.getSecondaryHolderName())
                .relationship(request.getRelationship())
                .operationMode(request.getOperationMode())
                .accountType(AccountType.JOINT)
                .balance(BigDecimal.valueOf(request.getInitialDeposit()))
                .createdAt(LocalDateTime.now())
                .active(true)
                .email(request.getPrimaryHolderEmail())
                .mobileNumber(request.getPrimaryHolderMobile())
                .address(request.getPrimaryHolderAddress())
                .user(currentUser)
                .build();
        
        Account savedAccount = accountRepository.save(account);
        return mapToAccountResponse(savedAccount);
    }
    
    @Transactional
    public AccountResponse createDigitalAccount(DigitalAccountRequest request) {
        User currentUser = getCurrentUser();
        String accountNumber = generateAccountNumber();
        
        Account account = Account.builder()
                .accountNumber(accountNumber)
                .accountHolderName(request.getFullName())
                .accountType(AccountType.DIGITAL)
                .balance(BigDecimal.ZERO)
                .createdAt(LocalDateTime.now())
                .active(true)
                .email(request.getEmail())
                .mobileNumber(request.getMobileNumber())
                .address(request.getAddress())
                .city(request.getCity())
                .state(request.getState())
                .postalCode(request.getPostalCode())
                .paperlessStatements(true)
                .virtualDebitCard(true)
                .user(currentUser)
                .build();
        
        Account savedAccount = accountRepository.save(account);
        return mapToAccountResponse(savedAccount);
    }
    
    @Transactional
    public AccountResponse createSeniorCitizenAccount(SeniorCitizenAccountRequest request) {
        User currentUser = getCurrentUser();
        String accountNumber = generateAccountNumber();
        
        Account account = Account.builder()
                .accountNumber(accountNumber)
                .accountHolderName(request.getFullName())
                .accountType(AccountType.SENIOR_CITIZEN)
                .balance(BigDecimal.valueOf(request.getInitialDeposit()))
                .createdAt(LocalDateTime.now())
                .active(true)
                .email(request.getEmail())
                .mobileNumber(request.getMobileNumber())
                .address(request.getAddress())
                .city(request.getCity())
                .state(request.getState())
                .postalCode(request.getPostalCode())
                .nomineeName(request.getNomineeName())
                .nomineeRelationship(request.getNomineeRelationship())
                .user(currentUser)
                .build();
        
        Account savedAccount = accountRepository.save(account);
        return mapToAccountResponse(savedAccount);
    }
    
    @Transactional
    public AccountResponse createSalaryAccount(SalaryAccountRequest request) {
        User currentUser = getCurrentUser();
        String accountNumber = generateAccountNumber();
        
        Account account = Account.builder()
                .accountNumber(accountNumber)
                .accountHolderName(request.getFullName())
                .accountType(AccountType.SALARY)
                .balance(BigDecimal.ZERO)
                .createdAt(LocalDateTime.now())
                .active(true)
                .email(request.getEmail())
                .mobileNumber(request.getMobileNumber())
                .address(request.getAddress())
                .city(request.getCity())
                .state(request.getState())
                .postalCode(request.getPostalCode())
                .employerName(request.getEmployerName())
                .employeeId(request.getEmployeeId())
                .user(currentUser)
                .build();
        
        Account savedAccount = accountRepository.save(account);
        return mapToAccountResponse(savedAccount);
    }
    
    public List<AccountResponse> getAllAccounts() {
        User currentUser = getCurrentUser();
        List<Account> accounts = accountRepository.findByUserAndActive(currentUser, true);
        return accounts.stream()
                .map(this::mapToAccountResponse)
                .collect(Collectors.toList());
    }
    
    public List<AccountResponse> getAccountsByType(String type) {
        User currentUser = getCurrentUser();
        AccountType accountType = AccountType.valueOf(type.toUpperCase());
        List<Account> accounts = accountRepository.findByUserAndAccountTypeAndActive(currentUser, accountType, true);
        return accounts.stream()
                .map(this::mapToAccountResponse)
                .collect(Collectors.toList());
    }
    
    public AccountResponse getAccountById(Long id) {
        User currentUser = getCurrentUser();
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Account not found"));
        
        // Verify account belongs to current user
        if (!account.getUser().getId().equals(currentUser.getId())) {
            throw new IllegalArgumentException("Account does not belong to current user");
        }
        
        return mapToAccountResponse(account);
    }
    
    public AccountResponse getAccountByAccountNumber(String accountNumber) {
        User currentUser = getCurrentUser();
        Account account = accountRepository.findByUserAndAccountNumber(currentUser, accountNumber)
                .orElseThrow(() -> new IllegalArgumentException("Account not found"));
        
        return mapToAccountResponse(account);
    }
    
    @Transactional
    public AccountResponse updateAccount(Long id, AccountRequest request) {
        User currentUser = getCurrentUser();
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Account not found"));
        
        // Verify account belongs to current user
        if (!account.getUser().getId().equals(currentUser.getId())) {
            throw new IllegalArgumentException("Account does not belong to current user");
        }
        
        account.setAccountHolderName(request.getAccountHolderName());
        account.setAccountType(request.getAccountType());
        
        Account updatedAccount = accountRepository.save(account);
        return mapToAccountResponse(updatedAccount);
    }
    
    @Transactional
    public void closeAccount(Long id) {
        User currentUser = getCurrentUser();
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Account not found"));
        
        // Verify account belongs to current user
        if (!account.getUser().getId().equals(currentUser.getId())) {
            throw new IllegalArgumentException("Account does not belong to current user");
        }
        
        // Check if account has zero balance
        if (account.getBalance().compareTo(BigDecimal.ZERO) != 0) {
            throw new IllegalArgumentException("Account must have zero balance before closing");
        }
        
        account.setActive(false);
        accountRepository.save(account);
    }
    
    @Transactional
    public AccountResponse approveAccount(Long accountId) {
        User currentUser = getCurrentUser();
        
        // Check if user is admin
        if (currentUser.getRole() != Role.ADMIN) {
            throw new IllegalArgumentException("Only administrators can approve accounts");
        }
        
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new IllegalArgumentException("Account not found"));
        
        account.setStatus(AccountStatus.APPROVED);
        Account updatedAccount = accountRepository.save(account);
        
        return mapToAccountResponse(updatedAccount);
    }
    
    @Transactional
    public AccountResponse rejectAccount(Long accountId, String reason) {
        User currentUser = getCurrentUser();
        
        // Check if user is admin
        if (currentUser.getRole() != Role.ADMIN) {
            throw new IllegalArgumentException("Only administrators can reject accounts");
        }
        
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new IllegalArgumentException("Account not found"));
        
        account.setStatus(AccountStatus.REJECTED);
        Account updatedAccount = accountRepository.save(account);
        
        return mapToAccountResponse(updatedAccount);
    }
    
    public List<AccountResponse> getPendingAccounts() {
        User currentUser = getCurrentUser();
        
        // Check if user is admin
        if (currentUser.getRole() != Role.ADMIN) {
            throw new IllegalArgumentException("Only administrators can view pending accounts");
        }
        
        List<Account> accounts = accountRepository.findByStatus(AccountStatus.PENDING_APPROVAL);
        return accounts.stream()
                .map(this::mapToAccountResponse)
                .collect(Collectors.toList());
    }
    
    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }
    
    private String generateAccountNumber() {
        Random random = new Random();
        StringBuilder sb = new StringBuilder();
        
        // Generate first digit (non-zero)
        sb.append(1 + random.nextInt(9));
        
        // Generate remaining 11 digits
        for (int i = 0; i < 11; i++) {
            sb.append(random.nextInt(10));
        }
        
        String accountNumber = sb.toString();
        
        // Check if account number already exists
        if (accountRepository.existsByAccountNumber(accountNumber)) {
            return generateAccountNumber(); // Recursively generate a new one
        }
        
        return accountNumber;
    }
    
    private AccountResponse mapToAccountResponse(Account account) {
        return AccountResponse.builder()
                .id(account.getId())
                .accountNumber(account.getAccountNumber())
                .accountHolderName(account.getAccountHolderName())
                .accountType(account.getAccountType())
                .balance(account.getBalance())
                .createdAt(account.getCreatedAt())
                .active(account.isActive())
                .email(account.getEmail())
                .mobileNumber(account.getMobileNumber())
                .address(account.getAddress())
                .city(account.getCity())
                .state(account.getState())
                .postalCode(account.getPostalCode())
                .secondaryHolderName(account.getSecondaryHolderName())
                .relationship(account.getRelationship())
                .operationMode(account.getOperationMode())
                .paperlessStatements(account.isPaperlessStatements())
                .virtualDebitCard(account.isVirtualDebitCard())
                .employerName(account.getEmployerName())
                .employeeId(account.getEmployeeId())
                .nomineeName(account.getNomineeName())
                .nomineeRelationship(account.getNomineeRelationship())
                .build();
    }
} 