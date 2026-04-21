package com.nemogym.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/debug")
public class DebugController {

    @GetMapping("/endpoints")
    public List<String> getEndpoints() {
        return List.of(

                // AUTH
                "/auth/login",
                "/auth/register",
                "/auth/me",

                // USERS
                "/users",
                "/users/{id}",
                "/users/{id}/check-in",
                "/users/{id}/check-out",
                "/users/{id}/sessions",
                "/users/{id}/last-session-duration",
                "/users/{id}/can-access",

                // ROLES (sin usar /roles/** porque ya lo tengo en SecurityConfig)
                "/roles/create",
                "/roles/assign",
                "/roles",

                // PLANS
                "/plans",

                // SUBSCRIPTIONS
                "/subscriptions");
    }
}