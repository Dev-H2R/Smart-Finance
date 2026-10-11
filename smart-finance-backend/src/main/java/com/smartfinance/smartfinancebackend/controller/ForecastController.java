package com.smartfinance.smartfinancebackend.controller;

import com.smartfinance.smartfinancebackend.dto.ForecastResponse;
import com.smartfinance.smartfinancebackend.service.ForecastService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/forecast")
public class ForecastController {

    private final ForecastService forecastService;

    public ForecastController(ForecastService forecastService) {
        this.forecastService = forecastService;
    }

    @GetMapping
    public ResponseEntity<ForecastResponse> getForecast() {
        return ResponseEntity.ok(forecastService.getForecast());
    }
}