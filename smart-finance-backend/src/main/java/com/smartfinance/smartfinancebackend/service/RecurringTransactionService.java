package com.smartfinance.smartfinancebackend.service;

import com.smartfinance.smartfinancebackend.entity.RecurringFrequency;
import com.smartfinance.smartfinancebackend.entity.RecurringTransaction;
import com.smartfinance.smartfinancebackend.entity.Transaction;
import com.smartfinance.smartfinancebackend.entity.TransactionType;
import com.smartfinance.smartfinancebackend.entity.User;
import com.smartfinance.smartfinancebackend.repository.RecurringTransactionRepository;
import com.smartfinance.smartfinancebackend.repository.TransactionRepository;
import com.smartfinance.smartfinancebackend.repository.UserRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
public class RecurringTransactionService {

    private final RecurringTransactionRepository recurringTransactionRepository;
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    public RecurringTransactionService(RecurringTransactionRepository recurringTransactionRepository,
                                        TransactionRepository transactionRepository,
                                        UserRepository userRepository) {
        this.recurringTransactionRepository = recurringTransactionRepository;
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found in database"));
    }

    public RecurringTransaction createRecurring(BigDecimal amount, TransactionType type, String category,
                                                  String description, RecurringFrequency frequency, LocalDate nextDueDate) {
        User currentUser = getCurrentUser();

        RecurringTransaction recurring = new RecurringTransaction();
        recurring.setAmount(amount);
        recurring.setType(type);
        recurring.setCategory(category);
        recurring.setDescription(description);
        recurring.setFrequency(frequency);
        recurring.setNextDueDate(nextDueDate);
        recurring.setActive(true);
        recurring.setUser(currentUser);

        return recurringTransactionRepository.save(recurring);
    }

    public List<RecurringTransaction> getMyRecurring() {
        User currentUser = getCurrentUser();
        return recurringTransactionRepository.findByUserOrderByNextDueDateAsc(currentUser);
    }

    private RecurringTransaction getOwnedRecurring(Long id) {
        User currentUser = getCurrentUser();
        RecurringTransaction recurring = recurringTransactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Recurring transaction not found"));

        if (!recurring.getUser().getId().equals(currentUser.getId())) {
            throw new SecurityException("You do not have permission to access this recurring transaction");
        }
        return recurring;
    }

    public RecurringTransaction setActive(Long id, boolean active) {
        RecurringTransaction recurring = getOwnedRecurring(id);
        recurring.setActive(active);
        return recurringTransactionRepository.save(recurring);
    }

    public void deleteRecurring(Long id) {
        RecurringTransaction recurring = getOwnedRecurring(id);
        recurringTransactionRepository.delete(recurring);
    }

    private LocalDate advance(LocalDate date, RecurringFrequency frequency) {
        return switch (frequency) {
            case DAILY -> date.plusDays(1);
            case WEEKLY -> date.plusWeeks(1);
            case MONTHLY -> date.plusMonths(1);
        };
    }

    @Scheduled(cron = "0 0 1 * * *")
    public void generateDueTransactions() {
        LocalDate today = LocalDate.now();
        List<RecurringTransaction> due = recurringTransactionRepository.findByActiveTrueAndNextDueDateLessThanEqual(today);

        for (RecurringTransaction recurring : due) {
            Transaction transaction = new Transaction();
            transaction.setAmount(recurring.getAmount());
            transaction.setType(recurring.getType());
            transaction.setCategory(recurring.getCategory());
            transaction.setDescription(recurring.getDescription());
            transaction.setDate(recurring.getNextDueDate());
            transaction.setUser(recurring.getUser());
            transactionRepository.save(transaction);

            recurring.setNextDueDate(advance(recurring.getNextDueDate(), recurring.getFrequency()));
            recurringTransactionRepository.save(recurring);
        }
    }
}