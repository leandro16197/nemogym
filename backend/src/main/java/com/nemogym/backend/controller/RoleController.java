package com.nemogym.backend.controller;

import com.nemogym.backend.dto.ApiResponse;
import com.nemogym.backend.dto.AssignRoleRequest;
import com.nemogym.backend.entity.Role;
import com.nemogym.backend.entity.User;
import com.nemogym.backend.repository.RoleRepository;
import com.nemogym.backend.repository.UserRepository;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/roles")
public class RoleController {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    public RoleController(UserRepository userRepository,
            RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    @PostMapping("/assign")
    public ResponseEntity<String> assignRole(@RequestBody AssignRoleRequest request) {

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User no encontrado"));

        Role role = roleRepository.findById(request.getRoleId())
                .orElseThrow(() -> new RuntimeException("Role no existe"));

        if (user.getRoles().contains(role)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("El usuario ya tiene ese rol");
        }

        user.getRoles().add(role);
        userRepository.save(user);

        return ResponseEntity.ok("Rol asignado correctamente");
    }

    @PostMapping("/create")
    public ResponseEntity<ApiResponse> createRole(@RequestParam String name) {

        if (roleRepository.findByName(name.toUpperCase()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new ApiResponse(false, "El rol ya existe"));
        }

        Role role = new Role();
        role.setName(name.toUpperCase());

        roleRepository.save(role);

        return ResponseEntity.ok(
                new ApiResponse(true, "Role creado correctamente"));
    }

    @GetMapping
    public ResponseEntity<List<Role>> getAllRoles() {
        return ResponseEntity.ok(roleRepository.findAll());
    }

}