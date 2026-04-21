package com.nemogym.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.nemogym.backend.entity.Aviso;
import com.nemogym.backend.repository.AvisoRepository;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/avisos")
@CrossOrigin(origins = "*")
public class AvisoController {

    @Autowired
    private AvisoRepository avisoRepository;

    @GetMapping
    public ResponseEntity<?> getAllAvisos() {
        try {
            List<Aviso> avisos = avisoRepository.findAllByOrderByCreatedAtDesc();
            return ResponseEntity.ok(Map.of("data", avisos));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error al obtener avisos");
        }
    }

    @PostMapping
    public ResponseEntity<?> createAviso(@RequestBody Aviso aviso) {
        try {
            System.out.println("Intentando guardar aviso: " + aviso.getMensaje());
            Aviso nuevoAviso = avisoRepository.save(aviso);
            return ResponseEntity.ok(nuevoAviso);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error al crear el aviso: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAviso(@PathVariable Long id) {
        return avisoRepository.findById(id)
                .map(aviso -> {
                    avisoRepository.delete(aviso);
                    return ResponseEntity.ok(Map.of("message", "Aviso eliminado correctamente"));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateAviso(@PathVariable Long id, @RequestBody Aviso aviso) {
        return avisoRepository.findById(id)
                .map(existing -> {
                    existing.setMensaje(aviso.getMensaje());
                    Aviso actualizado = avisoRepository.save(existing);
                    return ResponseEntity.ok(actualizado);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}