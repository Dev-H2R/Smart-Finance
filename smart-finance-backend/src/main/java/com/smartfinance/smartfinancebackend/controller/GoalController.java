package com.smartfinance.smartfinancebackend.controller;

import com.smartfinance.smartfinancebackend.dto.GoalProgressRequest;
import com.smartfinance.smartfinancebackend.dto.GoalRequest;
import com.smartfinance.smartfinancebackend.dto.GoalResponse;
import com.smartfinance.smartfinancebackend.entity.Goal;
import com.smartfinance.smartfinancebackend.service.GoalService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/goals")
public class GoalController {

    private final GoalService goalService;

    public GoalController(GoalService goalService) {
        this.goalService = goalService;
    }

    @PostMapping
    public ResponseEntity<GoalResponse> createGoal(@Valid @RequestBody GoalRequest request) {
        Goal goal = goalService.createGoal(request.getName(), request.getTargetAmount(), request.getTargetDate());
        return ResponseEntity.ok(toResponse(goal));
    }

    @GetMapping
    public ResponseEntity<List<GoalResponse>> getMyGoals() {
        List<GoalResponse> goals = goalService.getMyGoals()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(goals);
    }

    @PutMapping("/{id}")
    public ResponseEntity<GoalResponse> updateGoal(@PathVariable Long id, @Valid @RequestBody GoalRequest request) {
        Goal goal = goalService.updateGoal(id, request.getName(), request.getTargetAmount(), request.getTargetDate());
        return ResponseEntity.ok(toResponse(goal));
    }

    @PatchMapping("/{id}/progress")
    public ResponseEntity<GoalResponse> updateProgress(@PathVariable Long id, @Valid @RequestBody GoalProgressRequest request) {
        Goal goal = goalService.updateProgress(id, request.getCurrentAmount());
        return ResponseEntity.ok(toResponse(goal));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGoal(@PathVariable Long id) {
        goalService.deleteGoal(id);
        return ResponseEntity.noContent().build();
    }

    private GoalResponse toResponse(Goal g) {
        BigDecimal progressPercent = BigDecimal.ZERO;
        if (g.getTargetAmount().compareTo(BigDecimal.ZERO) > 0) {
            progressPercent = g.getCurrentAmount()
                    .divide(g.getTargetAmount(), 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100));
        }
        return new GoalResponse(g.getId(), g.getName(), g.getTargetAmount(), g.getCurrentAmount(), g.getTargetDate(), progressPercent);
    }
}