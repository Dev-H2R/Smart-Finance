package com.smartfinance.smartfinancebackend.service;

import com.smartfinance.smartfinancebackend.entity.Budget;
import com.smartfinance.smartfinancebackend.entity.User;
import com.smartfinance.smartfinancebackend.repository.BudgetRepository;
import com.smartfinance.smartfinancebackend.repository.TransactionRepository;
import com.smartfinance.smartfinancebackend.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class BudgetService {

    private final BudgetRepository budgetRepository;
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    public BudgetService(BudgetRepository budgetRepository, TransactionRepository transactionRepository, UserRepository userRepository) {
        this.budgetRepository = budgetRepository;
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found in database"));
    }

    public Budget createBudget(String category, BigDecimal limitAmount, Integer month, Integer year) {
        User currentUser = getCurrentUser();

        Budget budget = new Budget();
        budget.setCategory(category);
        budget.setLimitAmount(limitAmount);
        budget.setMonth(month);
        budget.setYear(year);
        budget.setUser(currentUser);

        return budgetRepository.save(budget);
    }

    public List<Budget> getMyBudgets() {
        User currentUser = getCurrentUser();
        return budgetRepository.findByUserOrderByYearDescMonthDesc(currentUser);
    }

    private Budget getOwnedBudget(Long id) {
        User currentUser = getCurrentUser();
        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Budget not found"));

        if (!budget.getUser().getId().equals(currentUser.getId())) {
            throw new SecurityException("You do not have permission to access this budget");
        }
        return budget;
    }

    public Budget updateBudget(Long id, String category, BigDecimal limitAmount, Integer month, Integer year) {
        Budget budget = getOwnedBudget(id);

        budget.setCategory(category);
        budget.setLimitAmount(limitAmount);
        budget.setMonth(month);
        budget.setYear(year);

        return budgetRepository.save(budget);
    }

    public void deleteBudget(Long id) {
        Budget budget = getOwnedBudget(id);
        budgetRepository.delete(budget);
    }

    public BigDecimal getSpentAmount(Budget budget) {
        return transactionRepository.sumExpenseByUserAndCategoryAndMonth(
                budget.getUser(), budget.getCategory(), budget.getYear(), budget.getMonth()
        );
    }
}