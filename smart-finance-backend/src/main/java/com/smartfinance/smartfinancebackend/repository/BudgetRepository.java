package com.smartfinance.smartfinancebackend.repository;

import com.smartfinance.smartfinancebackend.entity.Budget;
import com.smartfinance.smartfinancebackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BudgetRepository extends JpaRepository<Budget, Long> {

    List<Budget> findByUserOrderByYearDescMonthDesc(User user);
}