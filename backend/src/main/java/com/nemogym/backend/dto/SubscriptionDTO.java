package com.nemogym.backend.dto;

import java.time.LocalDate;
import java.util.stream.Collectors;
import com.nemogym.backend.entity.Subscription;
import java.time.temporal.ChronoUnit;

public class SubscriptionDTO {

    private Long id;
    private boolean active;
    private LocalDate startDate;
    private LocalDate endDate;
    private String planNombre;
    private UserDTO user;
    private Long diasRestantes;

    public SubscriptionDTO(Subscription sub) {
        this.id = sub.getId();
        this.active = sub.isActive();
        this.startDate = sub.getStartDate();
        this.endDate = sub.getEndDate();

        this.planNombre = (sub.getPlan() != null)
                ? sub.getPlan().getName()
                : null;

        this.diasRestantes = (sub.getEndDate() != null)
                ? ChronoUnit.DAYS.between(LocalDate.now(), sub.getEndDate())
                : 0L;

        this.user = new UserDTO(
                sub.getUser().getId(),
                sub.getUser().getEmail(),
                sub.getUser().getName(),
                sub.getUser().getRoles()
                        .stream()
                        .map(role -> role.getName())
                        .collect(Collectors.toSet()),
                sub.getUser().getGenero(),
                sub.isActive(),
                this.planNombre,
                this.diasRestantes,
                sub.getPlan().getId());
    }

    public Long getId() {
        return id;
    }

    public boolean isActive() {
        return active;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public String getPlanNombre() {
        return planNombre;
    }

    public UserDTO getUser() {
        return user;
    }
}