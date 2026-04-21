package com.nemogym.backend.controller;

import com.nemogym.backend.entity.Plan;
import com.nemogym.backend.entity.Subscription;
import com.nemogym.backend.entity.User;
import com.nemogym.backend.repository.PlanRepository;
import com.nemogym.backend.repository.SubscriptionRepository;
import com.nemogym.backend.repository.UserRepository;
import com.nemogym.backend.dto.ApiResponse;
import com.nemogym.backend.dto.SubscriptionDTO;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import jakarta.transaction.Transactional;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/subscriptions")
public class SubscriptionController {

    private final SubscriptionRepository subscriptionRepository;
    private final UserRepository userRepository;
    private final PlanRepository planRepository;

    public SubscriptionController(
            SubscriptionRepository subscriptionRepository,
            UserRepository userRepository,
            PlanRepository planRepository) {

        this.subscriptionRepository = subscriptionRepository;
        this.userRepository = userRepository;
        this.planRepository = planRepository;
    }

    @GetMapping
    public ResponseEntity<List<Subscription>> getAll() {
        return ResponseEntity.ok(subscriptionRepository.findAll());
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse> mySubscription() {

        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow();

        return subscriptionRepository
                .findFirstByUserAndActiveTrue(user)
                .map(sub -> ResponseEntity.ok(
                        new ApiResponse(
                                true,
                                "Suscripción encontrada",
                                new SubscriptionDTO(sub) // ✅ CAMBIO CLAVE
                        )))
                .orElse(ResponseEntity.status(404)
                        .body(new ApiResponse(false, "No tenés suscripción activa")));
    }

    @PostMapping("/subscribe")
    @Transactional
    public ResponseEntity<ApiResponse> subscribe(@RequestParam Long planId) {

        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Plan plan = planRepository.findById(planId)
                .orElseThrow(() -> new RuntimeException("Plan no existe"));

        subscriptionRepository.deactivateUserSubscriptions(user.getId());

        Subscription subscription = new Subscription();
        subscription.setUser(user);
        subscription.setPlan(plan);
        subscription.setStartDate(LocalDate.now());
        subscription.setEndDate(LocalDate.now().plusDays(plan.getDurationDays()));
        subscription.setActive(true);

        subscriptionRepository.save(subscription);

        return ResponseEntity.ok(
                new ApiResponse(true, "Suscripción activada correctamente"));
    }
}