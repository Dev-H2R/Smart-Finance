package com.smartfinance.smartfinancebackend.service;

import com.smartfinance.smartfinancebackend.dto.ForecastRequest;
import com.smartfinance.smartfinancebackend.dto.ForecastResponse;
import com.smartfinance.smartfinancebackend.dto.ForecastTransactionRequest;
import com.smartfinance.smartfinancebackend.entity.Transaction;
import com.smartfinance.smartfinancebackend.entity.User;
import com.smartfinance.smartfinancebackend.repository.TransactionRepository;
import com.smartfinance.smartfinancebackend.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
public class ForecastService {

    private static final String AI_SERVICE_URL = "http://localhost:8000/forecast";

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final RestTemplate restTemplate;

    public ForecastService(TransactionRepository transactionRepository, UserRepository userRepository, RestTemplate restTemplate) {
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
        this.restTemplate = restTemplate;
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found in database"));
    }

    public ForecastResponse getForecast() {
        User currentUser = getCurrentUser();
        List<Transaction> transactions = transactionRepository.findByUserOrderByDateDesc(currentUser);

        List<ForecastTransactionRequest> payload = transactions.stream()
                .map(t -> new ForecastTransactionRequest(t.getAmount(), t.getType(), t.getCategory(), t.getDate()))
                .toList();

        ForecastRequest request = new ForecastRequest(payload);

        return restTemplate.postForObject(AI_SERVICE_URL, request, ForecastResponse.class);
    }
}