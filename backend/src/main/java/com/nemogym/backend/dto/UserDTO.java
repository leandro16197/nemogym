package com.nemogym.backend.dto;

import java.util.Set;
import com.nemogym.backend.enums.Genero;

public class UserDTO {

    private Long id;
    private String email;
    private String name;
    private Set<String> roles;
    private Genero genero;
    private boolean hasActivePlan;
    private String nombrePlan;

    public UserDTO(Long id, String email, String name, Set<String> roles, Genero genero, boolean hasActivePlan,
            String nombrePlan) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.roles = roles;
        this.genero = genero;
        this.hasActivePlan = hasActivePlan;
        this.nombrePlan = nombrePlan;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<String> getRoles() {
        return roles;
    }

    public void setRoles(Set<String> roles) {
        this.roles = roles;
    }

    public Genero getGenero() {
        return genero;
    }

    public void setGenero(Genero genero) {
        this.genero = genero;
    }

    public boolean isHasActivePlan() {
        return hasActivePlan;
    }

    public void setHasActivePlan(boolean hasActivePlan) {
        this.hasActivePlan = hasActivePlan;
    }

    public String getNombrePlan() {
        return nombrePlan;
    }

}