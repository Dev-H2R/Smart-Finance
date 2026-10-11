package com.smartfinance.smartfinancebackend.service;

import com.smartfinance.smartfinancebackend.entity.Transaction;
import com.smartfinance.smartfinancebackend.entity.TransactionType;
import com.smartfinance.smartfinancebackend.entity.User;
import com.smartfinance.smartfinancebackend.repository.TransactionRepository;
import com.smartfinance.smartfinancebackend.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    public TransactionService(TransactionRepository transactionRepository, UserRepository userRepository) {
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found in database"));
    }

    public Transaction createTransaction(BigDecimal amount, TransactionType type, String category,
                                          String description, LocalDate date) {
        User currentUser = getCurrentUser();

        Transaction transaction = new Transaction();
        transaction.setAmount(amount);
        transaction.setType(type);
        transaction.setCategory(category);
        transaction.setDescription(description);
        transaction.setDate(date);
        transaction.setUser(currentUser);

        return transactionRepository.save(transaction);
    }

    public List<Transaction> getMyTransactions() {
        User currentUser = getCurrentUser();
        return transactionRepository.findByUserOrderByDateDesc(currentUser);
    }

    private Transaction getOwnedTransaction(Long id) {
        User currentUser = getCurrentUser();
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        if (!transaction.getUser().getId().equals(currentUser.getId())) {
            throw new SecurityException("You do not have permission to access this transaction");
        }
        return transaction;
    }

    public Transaction updateTransaction(Long id, BigDecimal amount, TransactionType type, String category,
                                          String description, LocalDate date) {
        Transaction transaction = getOwnedTransaction(id);

        transaction.setAmount(amount);
        transaction.setType(type);
        transaction.setCategory(category);
        transaction.setDescription(description);
        transaction.setDate(date);

        return transactionRepository.save(transaction);
    }

    public void deleteTransaction(Long id) {
        Transaction transaction = getOwnedTransaction(id);
        transactionRepository.delete(transaction);
    }
}
