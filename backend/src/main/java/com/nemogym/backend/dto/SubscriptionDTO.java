package com.nemogym.backend.dto;

import java.time.LocalDate;

import com.nemogym.backend.entity.Plan;
import com.nemogym.backend.entity.Subscription;

public class SubscriptionDTO {

    private Long id;
    private boolean active;
    private LocalDate startDate;
    private LocalDate endDate;
    private Plan plan;
    private UserDTO user;

    public SubscriptionDTO(Subscription sub) {
        this.id = sub.getId();
        this.active = sub.isActive();
        this.startDate = sub.getStartDate();
        this.endDate = sub.getEndDate();
        this.plan = sub.getPlan();
        this.user = new UserDTO(
                sub.getUser().getId(),
                sub.getUser().getEmail(),
                sub.getUser().getName(),
                sub.getUser().getRoles()
                        .stream()
                        .map(role -> role.getName())
                        .collect(java.util.stream.Collectors.toSet()),
                sub.getUser().getGenero());
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

    public Plan getPlan() {
        return plan;
    }

    public UserDTO getUser() {
        return user;
    }

}