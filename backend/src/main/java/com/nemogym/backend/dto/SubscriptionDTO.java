package com.nemogym.backend.dto;

import java.time.LocalDate;
import java.util.stream.Collectors;
import com.nemogym.backend.entity.Subscription;

public class SubscriptionDTO {

    private Long id;
    private boolean active;
    private LocalDate startDate;
    private LocalDate endDate;
    private String planNombre;
    private UserDTO user;

    public SubscriptionDTO(Subscription sub) {
        System.out.println("Creando SubscriptionDTO para suscripción ID: " + sub.getId());
        this.id = sub.getId();
        this.active = sub.isActive();
        this.startDate = sub.getStartDate();
        this.endDate = sub.getEndDate();

        this.planNombre = (sub.getPlan() != null)
                ? sub.getPlan().getName()
                : null;

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
                this.planNombre);
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