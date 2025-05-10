package com.apnabank.dto.biller;

import com.apnabank.model.RecurrenceType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
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
public class RecurringPaymentRequest {

    @NotBlank(message = "Name is required")
    private String name;

    @NotNull(message = "Biller ID is required")
    private Long billerId;

    @NotBlank(message = "Account number is required")
    private String accountNumber;

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    private BigDecimal amount;

    @NotNull(message = "Recurrence type is required")
    private RecurrenceType recurrenceType;

    @NotNull(message = "Start date is required")
    private LocalDateTime startDate;

    private LocalDateTime endDate;

    private Integer dayOfMonth;

    private Integer dayOfWeek;

    private String description;
} 