package com.nemogym.backend.controller;

import com.nemogym.backend.dto.UserDTO;
import com.nemogym.backend.entity.User;
import com.nemogym.backend.repository.UserRepository;
import com.nemogym.backend.services.UsuarioService;
import com.nemogym.backend.repository.SubscriptionRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.nemogym.backend.repository.UsuarioMembresiaRepository;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/admin/users")

public class AdminUserController {

    private final UserRepository userRepository;
    private final UsuarioMembresiaRepository usuarioMembresiaRepository;

    @Autowired
    private UsuarioService usuarioService;

    public AdminUserController(UserRepository userRepository, UsuarioMembresiaRepository usuarioMembresiaRepository) {
        this.userRepository = userRepository;
        this.usuarioMembresiaRepository = usuarioMembresiaRepository;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getUsuarios(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String genero,
            @RequestParam(required = false) Long roleId) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        String searchParam = (search != null && !search.trim().isEmpty()) ? search : null;
        com.nemogym.backend.enums.Genero generoEnum = null;
        if (genero != null && !genero.trim().isEmpty()) {
            try {
                generoEnum = com.nemogym.backend.enums.Genero.valueOf(genero.toUpperCase());
            } catch (IllegalArgumentException e) {
                System.err.println("Género inválido recibido: " + genero);
            }
        }
        Page<User> usuarios = userRepository.findByFilters(searchParam, generoEnum, roleId, pageable);
        var data = usuarios.getContent().stream()
                .map(this::mapToDTO)
                .toList();

        return ResponseEntity.ok(Map.of(
                "data", data,
                "totalPages", usuarios.getTotalPages(),
                "totalElements", usuarios.getTotalElements(),
                "currentPage", usuarios.getNumber()));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getUsuarioById(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(user -> ResponseEntity.ok(mapToDTO(user)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateUsuario(@PathVariable Long id, @RequestBody UserDTO userDTO) {
        return userRepository.findById(id).map(user -> {
            user.setName(userDTO.getName());
            user.setEmail(userDTO.getEmail());
            user.setGenero(userDTO.getGenero());

            userRepository.save(user);
            return ResponseEntity.ok(Map.of("message", "Usuario actualizado correctamente"));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteUsuario(@PathVariable Long id) {
        return userRepository.findById(id).map(user -> {
            userRepository.delete(user);
            return ResponseEntity.ok(Map.of("message", "Usuario eliminado"));
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/aptos-personalizada")
    @PreAuthorize("hasAnyRole('ADMIN', 'COACH')")
    public ResponseEntity<List<UserDTO>> getSociosParaClase() {
        return ResponseEntity.ok(usuarioService.listarSociosFullActivos());
    }

    private UserDTO mapToDTO(User user) {
        var membresiaActiva = usuarioMembresiaRepository.findMembresiaActiva(user.getEmail());

        boolean tienePlanActivo = membresiaActiva.isPresent();
        String nombrePlan = null;
        Long diasRestantes = 0L;
        Long planId = null;
        if (tienePlanActivo) {
            var m = membresiaActiva.get();
            planId = m.getMembresia().getId();
            nombrePlan = m.getMembresia().getNombre();
            diasRestantes = ChronoUnit.DAYS.between(LocalDate.now(), m.getFechaFin());
            if (diasRestantes < 0) {
                tienePlanActivo = false;
            }
        }
        return new UserDTO(
                user.getId(),
                user.getEmail(),
                user.getName(),
                user.getRoles().stream().map(role -> role.getName()).collect(Collectors.toSet()),
                user.getGenero(),
                tienePlanActivo,
                nombrePlan,
                diasRestantes,
                planId);
    }
}