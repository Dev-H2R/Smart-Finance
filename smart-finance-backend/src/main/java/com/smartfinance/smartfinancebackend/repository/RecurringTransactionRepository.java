package com.smartfinance.smartfinancebackend.repository;

import com.smartfinance.smartfinancebackend.entity.RecurringTransaction;
import com.smartfinance.smartfinancebackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface RecurringTransactionRepository extends JpaRepository<RecurringTransaction, Long> {

    List<RecurringTransaction> findByUserOrderByNextDueDateAsc(User user);

    List<RecurringTransaction> findByActiveTrueAndNextDueDateLessThanEqual(LocalDate date);
}