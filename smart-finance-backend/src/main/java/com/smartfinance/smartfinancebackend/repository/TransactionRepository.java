package com.smartfinance.smartfinancebackend.repository;

import com.smartfinance.smartfinancebackend.entity.Transaction;
import com.smartfinance.smartfinancebackend.entity.TransactionType;
import com.smartfinance.smartfinancebackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByUserOrderByDateDesc(User user);

    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.user = :user AND t.type = :type")
    BigDecimal sumByUserAndType(@Param("user") User user, @Param("type") TransactionType type);

    @Query("SELECT t.category, COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.user = :user AND t.type = :type GROUP BY t.category")
    List<Object[]> sumByCategory(@Param("user") User user, @Param("type") TransactionType type);

    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.user = :user AND t.category = :category AND t.type = com.smartfinance.smartfinancebackend.entity.TransactionType.EXPENSE AND YEAR(t.date) = :year AND MONTH(t.date) = :month")
    BigDecimal sumExpenseByUserAndCategoryAndMonth(@Param("user") User user, @Param("category") String category, @Param("year") int year, @Param("month") int month);
}