package com.smartfinance.smartfinancebackend.controller;

import com.smartfinance.smartfinancebackend.dto.RecurringTransactionRequest;
import com.smartfinance.smartfinancebackend.dto.RecurringTransactionResponse;
import com.smartfinance.smartfinancebackend.entity.RecurringTransaction;
import com.smartfinance.smartfinancebackend.service.RecurringTransactionService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/recurring-transactions")
public class RecurringTransactionController {

    private final RecurringTransactionService recurringTransactionService;

    public RecurringTransactionController(RecurringTransactionService recurringTransactionService) {
        this.recurringTransactionService = recurringTransactionService;
    }

    @PostMapping
    public ResponseEntity<RecurringTransactionResponse> createRecurring(@Valid @RequestBody RecurringTransactionRequest request) {
        RecurringTransaction recurring = recurringTransactionService.createRecurring(
                request.getAmount(),
                request.getType(),
                request.getCategory(),
                request.getDescription(),
                request.getFrequency(),
                request.getNextDueDate()
        );
        return ResponseEntity.ok(toResponse(recurring));
    }

    @GetMapping
    public ResponseEntity<List<RecurringTransactionResponse>> getMyRecurring() {
        List<RecurringTransactionResponse> recurring = recurringTransactionService.getMyRecurring()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(recurring);
    }

    @PatchMapping("/{id}/active")
    public ResponseEntity<RecurringTransactionResponse> setActive(@PathVariable Long id, @RequestParam boolean active) {
        RecurringTransaction recurring = recurringTransactionService.setActive(id, active);
        return ResponseEntity.ok(toResponse(recurring));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRecurring(@PathVariable Long id) {
        recurringTransactionService.deleteRecurring(id);
        return ResponseEntity.noContent().build();
    }

    private RecurringTransactionResponse toResponse(RecurringTransaction r) {
        return new RecurringTransactionResponse(
                r.getId(), r.getAmount(), r.getType(), r.getCategory(), r.getDescription(),
                r.getFrequency(), r.getNextDueDate(), r.isActive()
        );
    }
}