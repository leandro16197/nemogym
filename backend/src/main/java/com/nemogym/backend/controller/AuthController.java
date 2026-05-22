package com.nemogym.backend.controller;

import com.nemogym.backend.dto.AuthResponse;
import com.nemogym.backend.dto.LoginRequest;
import com.nemogym.backend.dto.UserDTO;
import com.nemogym.backend.dto.ApiResponse;
import com.nemogym.backend.entity.Role;
import com.nemogym.backend.entity.User;
import com.nemogym.backend.entity.UsuarioMembresia;
import com.nemogym.backend.repository.RoleRepository;
import com.nemogym.backend.repository.UserRepository;
import com.nemogym.backend.repository.UsuarioMembresiaRepository;
import com.nemogym.backend.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/auth")
public class AuthController {

        private final UserRepository userRepository;
        private final JwtService jwtService;
        private final PasswordEncoder passwordEncoder;
        private final RoleRepository roleRepository;
        private final UsuarioMembresiaRepository usuarioMembresiaRepository;

        public AuthController(UserRepository userRepository,
                        JwtService jwtService,
                        PasswordEncoder passwordEncoder,
                        RoleRepository roleRepository,
                        UsuarioMembresiaRepository usuarioMembresiaRepository) {
                this.userRepository = userRepository;
                this.jwtService = jwtService;
                this.passwordEncoder = passwordEncoder;
                this.roleRepository = roleRepository;
                this.usuarioMembresiaRepository = usuarioMembresiaRepository;
        }

        @PostMapping("/login")
        public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {

                Optional<User> optionalUser = userRepository.findByEmail(request.getEmail());

                if (optionalUser.isEmpty()) {
                        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                        .body(new AuthResponse(false, "Usuario no encontrado", null, null));
                }

                User user = optionalUser.get();

                if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                        .body(new AuthResponse(false, "Password incorrecta", null, null));
                }

                var membresiaActiva = usuarioMembresiaRepository.findMembresiaActiva(user.getEmail());

                boolean tienePlanActivo = membresiaActiva.isPresent();
                String nombrePlan = membresiaActiva
                                .map(um -> um.getMembresia().getNombre())
                                .orElse(null);

                String token = jwtService.generateToken(user);
                Set<String> roles = user.getRoles().stream().map(Role::getName).collect(Collectors.toSet());

                UserDTO userDTO = new UserDTO(
                                user.getId(),
                                user.getEmail(),
                                user.getName(),
                                roles,
                                user.getGenero(),
                                tienePlanActivo,
                                nombrePlan);

                return ResponseEntity.ok(new AuthResponse(true, "Login exitoso", token, userDTO));
        }

        @PostMapping("/register")
        public ResponseEntity<ApiResponse> register(@RequestBody User user) {
                if (userRepository.findByEmail(user.getEmail()).isPresent()) {
                        return ResponseEntity.status(HttpStatus.CONFLICT)
                                        .body(new ApiResponse(false, "Ya existe un usuario con ese email"));
                }
                Role userRole = roleRepository.findByName("USER").orElse(null);
                if (userRole == null) {
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                        .body(new ApiResponse(false, "Error crítico: El rol USER no existe"));
                }
                user.setPassword(passwordEncoder.encode(user.getPassword()));
                user.getRoles().add(userRole);
                userRepository.save(user);
                return ResponseEntity.ok(new ApiResponse(true, "Usuario creado correctamente"));
        }

        @GetMapping("/me")
        public ResponseEntity<?> me() {
                var authentication = SecurityContextHolder.getContext().getAuthentication();

                if (authentication == null || !authentication.isAuthenticated()
                                || authentication.getPrincipal().equals("anonymousUser")) {
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No autenticado");
                }

                String email = authentication.getName();
                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

                var membresiaActiva = usuarioMembresiaRepository.findMembresiaActiva(user.getEmail());

                boolean tienePlanActivo = membresiaActiva.isPresent();
                String nombrePlan = membresiaActiva
                                .map(um -> um.getMembresia().getNombre())
                                .orElse(null);

                Set<String> roles = user.getRoles().stream().map(Role::getName).collect(Collectors.toSet());

                return ResponseEntity.ok(new UserDTO(
                                user.getId(),
                                user.getEmail(),
                                user.getName(),
                                roles,
                                user.getGenero(),
                                tienePlanActivo,
                                nombrePlan));
        }
}