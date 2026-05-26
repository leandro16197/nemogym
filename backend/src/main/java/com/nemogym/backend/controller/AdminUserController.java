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

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/admin/users")

public class AdminUserController {

    private final UserRepository userRepository;
    private final SubscriptionRepository subscriptionRepository;

    @Autowired
    private UsuarioService usuarioService;

    public AdminUserController(UserRepository userRepository, SubscriptionRepository subscriptionRepository) {
        this.userRepository = userRepository;
        this.subscriptionRepository = subscriptionRepository;
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
        String generoParam = (genero != null && !genero.trim().isEmpty()) ? genero : null;

        Page<User> usuarios = userRepository.findByFilters(searchParam, generoParam, roleId, pageable);

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
        var subscription = subscriptionRepository.findActiveByEmail(user.getEmail());

        boolean tienePlanActivo = subscription.isPresent();
        String nombrePlan = null;
        Long diasRestantes = 0L;

        if (tienePlanActivo) {
            var s = subscription.get();
            nombrePlan = s.getPlan().getName();
            diasRestantes = ChronoUnit.DAYS.between(LocalDate.now(), s.getEndDate());
            if (diasRestantes < 0) {
                tienePlanActivo = false;
            }
        }

        return new UserDTO(
                user.getId(),
                user.getEmail(),
                user.getName(),
                user.getRoles().stream()
                        .map(role -> role.getName())
                        .collect(Collectors.toSet()),
                user.getGenero(),
                tienePlanActivo,
                nombrePlan,
                diasRestantes);
    }
}