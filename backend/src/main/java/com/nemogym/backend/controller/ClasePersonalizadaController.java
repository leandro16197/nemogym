package com.nemogym.backend.controller;

import com.nemogym.backend.dto.ClaseResumenDTO;
import com.nemogym.backend.entity.ClasePersonalizada;
import com.nemogym.backend.entity.User;
import com.nemogym.backend.repository.ClasePersonalizadaRepository;
import com.nemogym.backend.repository.UserRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;

import org.slf4j.LoggerFactory;
import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/coach")
@PreAuthorize("hasRole('COACH') or hasRole('ADMIN')")
public class ClasePersonalizadaController {

    private final ClasePersonalizadaRepository claseRepo;
    private final UserRepository userRepository;
    private static final Logger log = LoggerFactory.getLogger(ClasePersonalizadaController.class);

    public ClasePersonalizadaController(ClasePersonalizadaRepository claseRepo, UserRepository userRepository) {
        this.claseRepo = claseRepo;
        this.userRepository = userRepository;
    }

    @PostMapping("/clases-personalizadas")
    public ResponseEntity<?> crearClase(@RequestBody Map<String, Object> body, Principal principal) {
        log.info("BODY recibido desde React: {}", body);

        User coach = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("Coach no encontrado"));

        Long userId = Long.valueOf(body.get("user_id").toString());
        User usuario = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        List<Map<String, Object>> ejercicios = (List<Map<String, Object>>) body.get("ejercicios");
        ClasePersonalizada clase = new ClasePersonalizada();
        clase.setCoach(coach);
        clase.setUsuario(usuario);
        clase.setDescripcion("Generada por " + coach.getName());
        if (body.get("dia") != null) {
            clase.setDia(Integer.valueOf(body.get("dia").toString()));
        }

        if (ejercicios != null && !ejercicios.isEmpty()) {
            String primerNombre = (String) ejercicios.get(0).get("nombre");
            clase.setNombre(primerNombre);
            Object repsObj = ejercicios.get(0).get("repeticiones");
            Integer primeraReps = (repsObj != null) ? Integer.valueOf(repsObj.toString()) : 0;
            clase.setRepeticiones(primeraReps);
            for (Map<String, Object> ej : ejercicios) {
                log.info("Ejercicio detectado: {} - Reps: {}", ej.get("nombre"), ej.get("repeticiones"));
            }
        } else {
            clase.setNombre("Rutina sin nombre");
            clase.setRepeticiones(0);
        }

        claseRepo.save(clase);
        return ResponseEntity.ok("Clase creada con " + (ejercicios != null ? ejercicios.size() : 0) + " ejercicios");
    }

    @GetMapping("/clases-personalizadas/{userId}")
    public ResponseEntity<List<ClaseResumenDTO>> getClasesUsuario(@PathVariable Long userId) {
        List<ClasePersonalizada> clases = claseRepo.findByUsuarioId(userId);

        List<ClaseResumenDTO> dtos = clases.stream()
                .map(ClaseResumenDTO::new)
                .toList();

        return ResponseEntity.ok(dtos);
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