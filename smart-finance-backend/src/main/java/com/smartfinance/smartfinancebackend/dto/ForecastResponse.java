package com.smartfinance.smartfinancebackend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class ForecastResponse {
    @JsonProperty("forecast_month")
    private String forecastMonth;

    private List<CategoryForecastResponse> forecasts;
}