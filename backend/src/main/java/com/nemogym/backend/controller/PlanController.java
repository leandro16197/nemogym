package com.nemogym.backend.controller;

import com.nemogym.backend.entity.Plan;
import com.nemogym.backend.repository.PlanRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/plans")
public class PlanController {

    private final PlanRepository planRepository;

    public PlanController(PlanRepository planRepository) {
        this.planRepository = planRepository;
    }

    @GetMapping
    public List<Plan> getAll() {
        return planRepository.findAll();
    }

    @PostMapping
    public Plan create(@RequestBody Plan plan) {
        return planRepository.save(plan);
    }
}