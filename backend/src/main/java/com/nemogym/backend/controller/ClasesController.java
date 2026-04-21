package com.nemogym.backend.controller;

import com.nemogym.backend.dto.ApiResponse;
import com.nemogym.backend.dto.ClaseRequest;
import com.nemogym.backend.entity.Clase;
import com.nemogym.backend.entity.User; // Import para User
import com.nemogym.backend.repository.ClaseRepository;
import com.nemogym.backend.repository.UserRepository; // Import para UserRepository
import com.nemogym.backend.services.ClaseService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication; // Import para Authentication
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/clases")
public class ClasesController {

    @Autowired
    private ClaseService claseService;
    @Autowired
    private ClaseRepository claseRepository;
    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<ApiResponse<Void>> crearClases(@RequestBody ClaseRequest request) {
        try {
            claseService.crearClasesDesdeJson(request);
            return ResponseEntity.ok(
                    new ApiResponse<>(true, "Clases creadas correctamente"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(
                    new ApiResponse<>(false, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(
                    new ApiResponse<>(false, "Error interno del servidor"));
        }
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Clase>>> obtenerClases(Authentication authentication) {
        try {

            String email = authentication.getName();
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            List<Clase> clases = claseService.obtenerClasesPorGenero(user.getGenero());

            return ResponseEntity.ok(
                    new ApiResponse<>(true, "Clases obtenidas correctamente", clases));

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(
                    new ApiResponse<>(false, "Error al obtener clases: " + e.getMessage(), null));
        }
    }

    @GetMapping("/admin")
    public ResponseEntity<ApiResponse<List<Clase>>> obtenerTodasLasClasesAdmin() {
        try {

            List<Clase> clases = claseService.obtenerTodasLasClases();

            return ResponseEntity.ok(
                    new ApiResponse<>(true, "Todas las clases obtenidas (Modo Admin)", clases));

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(
                    new ApiResponse<>(false, "Error al obtener clases: " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> eliminarClase(@PathVariable Long id) {
        try {
            claseService.eliminarClase(id);
            return ResponseEntity.ok(
                    new ApiResponse<>(true, "Clase eliminada correctamente"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(
                    new ApiResponse<>(false, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(
                    new ApiResponse<>(false, "Error interno del servidor"));
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> actualizarClase(
            @PathVariable Long id,
            @RequestBody Clase request) {
        try {
            claseService.actualizarClase(id, request);
            return ResponseEntity.ok(
                    new ApiResponse<>(true, "Clase actualizada correctamente"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(
                    new ApiResponse<>(false, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(
                    new ApiResponse<>(false, "Error interno del servidor"));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Clase>> obtenerClasePorId(@PathVariable Long id) {
        try {
            Clase clase = claseRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Clase no encontrada con ID: " + id));
            return ResponseEntity.ok(new ApiResponse<>(true, "Clase encontrada", clase));
        } catch (Exception e) {
            return ResponseEntity.status(404).body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
}