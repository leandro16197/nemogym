package com.nemogym.backend.controller;

import com.nemogym.backend.dto.UserDTO;
import com.nemogym.backend.entity.User;
import com.nemogym.backend.repository.UserRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.stream.Collectors;
import java.util.Map;

@RestController
@RequestMapping("/admin/users")
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

    private final UserRepository userRepository;

    public AdminUserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<?> getUsuarios(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String genero) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        String searchParam = (search != null && !search.trim().isEmpty()) ? search : null;
        String generoParam = (genero != null && !genero.trim().isEmpty()) ? genero : null;

        Page<User> usuarios = userRepository.findByFilters(searchParam, generoParam, pageable);

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
    public ResponseEntity<?> getUsuarioById(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(user -> ResponseEntity.ok(mapToDTO(user)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
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
    public ResponseEntity<?> deleteUsuario(@PathVariable Long id) {
        return userRepository.findById(id).map(user -> {
            userRepository.delete(user);
            return ResponseEntity.ok(Map.of("message", "Usuario eliminado"));
        }).orElse(ResponseEntity.notFound().build());
    }

    private UserDTO mapToDTO(User user) {
        return new UserDTO(
                user.getId(),
                user.getEmail(),
                user.getName(),
                user.getRoles().stream()
                        .map(role -> role.getName())
                        .collect(Collectors.toSet()),
                user.getGenero());
    }
}