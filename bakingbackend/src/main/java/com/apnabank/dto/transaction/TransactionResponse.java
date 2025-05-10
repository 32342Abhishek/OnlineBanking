package com.apnabank.dto.transaction;

import com.apnabank.model.TransactionStatus;
import com.apnabank.model.TransactionType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionResponse {
    private Long id;
    private String transactionNumber;
    private BigDecimal amount;
    private TransactionType type;
    private String description;
    private LocalDateTime timestamp;
    private TransactionStatus status;
    private String fromAccountNumber;
    private String toAccountNumber;
} 