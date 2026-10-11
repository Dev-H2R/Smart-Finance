package com.smartfinance.smartfinancebackend.repository;

import com.smartfinance.smartfinancebackend.entity.Goal;
import com.smartfinance.smartfinancebackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GoalRepository extends JpaRepository<Goal, Long> {

    List<Goal> findByUserOrderByTargetDateAsc(User user);
}