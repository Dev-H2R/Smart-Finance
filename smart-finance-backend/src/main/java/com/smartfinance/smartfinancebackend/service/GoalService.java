package com.smartfinance.smartfinancebackend.service;

import com.smartfinance.smartfinancebackend.entity.Goal;
import com.smartfinance.smartfinancebackend.entity.User;
import com.smartfinance.smartfinancebackend.repository.GoalRepository;
import com.smartfinance.smartfinancebackend.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
public class GoalService {

    private final GoalRepository goalRepository;
    private final UserRepository userRepository;

    public GoalService(GoalRepository goalRepository, UserRepository userRepository) {
        this.goalRepository = goalRepository;
        this.userRepository = userRepository;
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found in database"));
    }

    public Goal createGoal(String name, BigDecimal targetAmount, LocalDate targetDate) {
        User currentUser = getCurrentUser();

        Goal goal = new Goal();
        goal.setName(name);
        goal.setTargetAmount(targetAmount);
        goal.setCurrentAmount(BigDecimal.ZERO);
        goal.setTargetDate(targetDate);
        goal.setUser(currentUser);

        return goalRepository.save(goal);
    }

    public List<Goal> getMyGoals() {
        User currentUser = getCurrentUser();
        return goalRepository.findByUserOrderByTargetDateAsc(currentUser);
    }

    private Goal getOwnedGoal(Long id) {
        User currentUser = getCurrentUser();
        Goal goal = goalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Goal not found"));

        if (!goal.getUser().getId().equals(currentUser.getId())) {
            throw new SecurityException("You do not have permission to access this goal");
        }
        return goal;
    }

    public Goal updateGoal(Long id, String name, BigDecimal targetAmount, LocalDate targetDate) {
        Goal goal = getOwnedGoal(id);

        goal.setName(name);
        goal.setTargetAmount(targetAmount);
        goal.setTargetDate(targetDate);

        return goalRepository.save(goal);
    }

    public Goal updateProgress(Long id, BigDecimal currentAmount) {
        Goal goal = getOwnedGoal(id);
        goal.setCurrentAmount(currentAmount);
        return goalRepository.save(goal);
    }

    public void deleteGoal(Long id) {
        Goal goal = getOwnedGoal(id);
        goalRepository.delete(goal);
    }
}