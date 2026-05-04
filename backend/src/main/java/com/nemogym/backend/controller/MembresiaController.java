package com.nemogym.backend.controller;

import com.nemogym.backend.entity.Membresias;
import com.nemogym.backend.entity.User;
import com.nemogym.backend.entity.User;
import com.nemogym.backend.entity.UsuarioMembresia;
import com.nemogym.backend.repository.MembresiaRepository;
import com.nemogym.backend.repository.UserRepository;
import com.nemogym.backend.repository.UsuarioMembresiaRepository;
import com.nemogym.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/membresias")
@CrossOrigin(origins = "${app.cors.origin}")
public class MembresiaController {

    @Autowired
    private MembresiaRepository repository;

    @Autowired
    private UserRepository usuarioRepository;

    @Autowired
    private UsuarioMembresiaRepository usuarioMembresiaRepository;

    @GetMapping
    public List<Membresias> listar() {
        return repository.findAll();
    }

    @PostMapping
    public Membresias guardar(@RequestBody Membresias membresia) {
        return repository.save(membresia);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Membresias> actualizar(@PathVariable Long id, @RequestBody Membresias detalles) {
        return repository.findById(id)
                .map(membresia -> {
                    membresia.setNombre(detalles.getNombre());
                    membresia.setPrecio(detalles.getPrecio());
                    membresia.setIcono(detalles.getIcono());
                    membresia.setTipo(detalles.getTipo());
                    membresia.setPopular(detalles.isPopular());
                    membresia.setFeatures(detalles.getFeatures());
                    return ResponseEntity.ok(repository.save(membresia));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        return repository.findById(id)
                .map(membresia -> {
                    repository.delete(membresia);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/adquirir/{membresiaId}")
    public ResponseEntity<?> adquirirMembresia(@PathVariable Long membresiaId, Principal principal) {

        User usuario = usuarioRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Membresias membresia = repository.findById(membresiaId)
                .orElseThrow(() -> new RuntimeException("Plan de membresía no encontrado"));

        UsuarioMembresia compra = new UsuarioMembresia();
        compra.setUsuario(usuario);
        compra.setMembresia(membresia);
        compra.setFechaInicio(LocalDate.now());
        compra.setFechaFin(LocalDate.now().plusMonths(1));
        compra.setActivo(true);

        usuarioMembresiaRepository.save(compra);

        return ResponseEntity.ok("Membresía adquirida con éxito. ¡Ya puedes acceder a tus clases!");
    }
}