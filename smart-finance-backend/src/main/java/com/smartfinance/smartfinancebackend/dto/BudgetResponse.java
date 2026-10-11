package com.smartfinance.smartfinancebackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class BudgetResponse {
    private Long id;
    private String category;
    private BigDecimal limitAmount;
    private Integer month;
    private Integer year;
    private BigDecimal spentAmount;
    private BigDecimal remainingAmount;
}