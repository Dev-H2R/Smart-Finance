package com.smartfinance.smartfinancebackend.controller;

import com.smartfinance.smartfinancebackend.dto.TransactionRequest;
import com.smartfinance.smartfinancebackend.dto.TransactionResponse;
import com.smartfinance.smartfinancebackend.entity.Transaction;
import com.smartfinance.smartfinancebackend.service.TransactionService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @PostMapping
    public ResponseEntity<TransactionResponse> createTransaction(@Valid @RequestBody TransactionRequest request) {
        Transaction transaction = transactionService.createTransaction(
                request.getAmount(),
                request.getType(),
                request.getCategory(),
                request.getDescription(),
                request.getDate()
        );
        return ResponseEntity.ok(toResponse(transaction));
    }

    @GetMapping
    public ResponseEntity<List<TransactionResponse>> getMyTransactions() {
        List<TransactionResponse> transactions = transactionService.getMyTransactions()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(transactions);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TransactionResponse> updateTransaction(@PathVariable Long id, @Valid @RequestBody TransactionRequest request) {
        Transaction transaction = transactionService.updateTransaction(
                id,
                request.getAmount(),
                request.getType(),
                request.getCategory(),
                request.getDescription(),
                request.getDate()
        );
        return ResponseEntity.ok(toResponse(transaction));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTransaction(@PathVariable Long id) {
        transactionService.deleteTransaction(id);
        return ResponseEntity.noContent().build();
    }

    private TransactionResponse toResponse(Transaction t) {
        return new TransactionResponse(t.getId(), t.getAmount(), t.getType(), t.getCategory(), t.getDescription(), t.getDate());
    }
}
