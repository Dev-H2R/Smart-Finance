package com.smartfinance.smartfinancebackend.dto;

import com.smartfinance.smartfinancebackend.entity.TransactionType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ForecastTransactionRequest {
    private BigDecimal amount;
    private TransactionType type;
    private String category;
    private LocalDate date;
}