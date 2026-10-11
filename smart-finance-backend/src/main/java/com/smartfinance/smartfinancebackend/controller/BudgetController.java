package com.smartfinance.smartfinancebackend.controller;

import com.smartfinance.smartfinancebackend.dto.BudgetRequest;
import com.smartfinance.smartfinancebackend.dto.BudgetResponse;
import com.smartfinance.smartfinancebackend.entity.Budget;
import com.smartfinance.smartfinancebackend.service.BudgetService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/budgets")
public class BudgetController {

    private final BudgetService budgetService;

    public BudgetController(BudgetService budgetService) {
        this.budgetService = budgetService;
    }

    @PostMapping
    public ResponseEntity<BudgetResponse> createBudget(@Valid @RequestBody BudgetRequest request) {
        Budget budget = budgetService.createBudget(
                request.getCategory(),
                request.getLimitAmount(),
                request.getMonth(),
                request.getYear()
        );
        return ResponseEntity.ok(toResponse(budget));
    }

    @GetMapping
    public ResponseEntity<List<BudgetResponse>> getMyBudgets() {
        List<BudgetResponse> budgets = budgetService.getMyBudgets()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(budgets);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BudgetResponse> updateBudget(@PathVariable Long id, @Valid @RequestBody BudgetRequest request) {
        Budget budget = budgetService.updateBudget(
                id,
                request.getCategory(),
                request.getLimitAmount(),
                request.getMonth(),
                request.getYear()
        );
        return ResponseEntity.ok(toResponse(budget));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBudget(@PathVariable Long id) {
        budgetService.deleteBudget(id);
        return ResponseEntity.noContent().build();
    }

    private BudgetResponse toResponse(Budget b) {
        BigDecimal spent = budgetService.getSpentAmount(b);
        BigDecimal remaining = b.getLimitAmount().subtract(spent);
        return new BudgetResponse(b.getId(), b.getCategory(), b.getLimitAmount(), b.getMonth(), b.getYear(), spent, remaining);
    }
}