package com.smartfinance.smartfinancebackend.dto;

import com.smartfinance.smartfinancebackend.entity.RecurringFrequency;
import com.smartfinance.smartfinancebackend.entity.TransactionType;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@AllArgsConstructor
public class RecurringTransactionResponse {
    private Long id;
    private BigDecimal amount;
    private TransactionType type;
    private String category;
    private String description;
    private RecurringFrequency frequency;
    private LocalDate nextDueDate;
    private boolean active;
}