package com.nemogym.backend.dto;

import java.util.Set;

import com.nemogym.backend.enums.Genero;

public class UserDTO {

    private Long id;
    private String email;
    private String name;
    private Set<String> roles;
    private Genero genero;

    public UserDTO(Long id, String email, String name, Set<String> roles, Genero genero) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.roles = roles;
        this.genero = genero;
    }

    public Long getId() {
        return id;
    }

    public Genero getGenero() {
        return genero;
    }

    public void setGenero(Genero genero) {
        this.genero = genero;
    }

    public String getEmail() {
        return email;
    }

    public String getName() {
        return name;
    }

    public Set<String> getRoles() {
        return roles;
    }
}