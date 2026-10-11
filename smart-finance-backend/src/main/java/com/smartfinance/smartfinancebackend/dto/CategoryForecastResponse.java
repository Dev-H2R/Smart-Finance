package com.smartfinance.smartfinancebackend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class CategoryForecastResponse {
    private String category;

    @JsonProperty("predicted_amount")
    private double predictedAmount;

    @JsonProperty("months_of_data")
    private int monthsOfData;

    private String method;
}