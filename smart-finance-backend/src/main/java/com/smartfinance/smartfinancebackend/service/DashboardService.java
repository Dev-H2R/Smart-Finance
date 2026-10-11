package com.smartfinance.smartfinancebackend.service;

import com.smartfinance.smartfinancebackend.dto.DashboardResponse;
import com.smartfinance.smartfinancebackend.entity.TransactionType;
import com.smartfinance.smartfinancebackend.entity.User;
import com.smartfinance.smartfinancebackend.repository.TransactionRepository;
import com.smartfinance.smartfinancebackend.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class DashboardService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    public DashboardService(TransactionRepository transactionRepository, UserRepository userRepository) {
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found in database"));
    }

    public DashboardResponse getDashboard() {
        User currentUser = getCurrentUser();

        BigDecimal totalIncome = transactionRepository.sumByUserAndType(currentUser, TransactionType.INCOME);
        BigDecimal totalExpense = transactionRepository.sumByUserAndType(currentUser, TransactionType.EXPENSE);
        BigDecimal savings = totalIncome.subtract(totalExpense);

        List<Object[]> categoryRows = transactionRepository.sumByCategory(currentUser, TransactionType.EXPENSE);
        Map<String, BigDecimal> expenseByCategory = new LinkedHashMap<>();
        for (Object[] row : categoryRows) {
            String category = (String) row[0];
            BigDecimal sum = (BigDecimal) row[1];
            expenseByCategory.put(category, sum);
        }

        return new DashboardResponse(totalIncome, totalExpense, savings, expenseByCategory);
    }
}
