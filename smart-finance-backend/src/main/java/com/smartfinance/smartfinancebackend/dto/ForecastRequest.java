package com.smartfinance.smartfinancebackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ForecastRequest {
    private List<ForecastTransactionRequest> transactions;
}