package com.nemogym.backend.controller;

import com.nemogym.backend.entity.ClasePersonalizada;
import com.nemogym.backend.entity.User;
import com.nemogym.backend.repository.ClasePersonalizadaRepository;
import com.nemogym.backend.repository.UserRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/coach")
@PreAuthorize("hasRole('COACH') or hasRole('ADMIN')")
public class ClasePersonalizadaController {

    private final ClasePersonalizadaRepository claseRepo;
    private final UserRepository userRepository;

    public ClasePersonalizadaController(ClasePersonalizadaRepository claseRepo, UserRepository userRepository) {
        this.claseRepo = claseRepo;
        this.userRepository = userRepository;
    }

    @PostMapping("/clases-personalizadas")
    public ResponseEntity<?> crearClase(
            @RequestBody ClasePersonalizada clase,
            Principal principal) {

        User coach = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("Coach no encontrado"));

        clase.setCoach(coach);

        claseRepo.save(clase);

        return ResponseEntity.ok("Clase personalizada creada");
    }

    @GetMapping("/clases-personalizadas/{userId}")
    public ResponseEntity<List<ClasePersonalizada>> getClasesUsuario(@PathVariable Long userId) {
        return ResponseEntity.ok(claseRepo.findByUsuarioId(userId));
    }

    @GetMapping("/mis-clases")
    public ResponseEntity<List<ClasePersonalizada>> getMisClases(Principal principal) {

        User coach = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("Coach no encontrado"));

        return ResponseEntity.ok(claseRepo.findByCoachId(coach.getId()));
    }

    @DeleteMapping("/clases-personalizadas/{id}")
    public ResponseEntity<?> deleteClase(@PathVariable Long id) {
        claseRepo.deleteById(id);
        return ResponseEntity.ok("Clase eliminada");
    }

    @GetMapping("/clases-personalizadas/all")
    public ResponseEntity<List<ClasePersonalizada>> getAllClases() {
        return ResponseEntity.ok(claseRepo.findAll());
    }
}