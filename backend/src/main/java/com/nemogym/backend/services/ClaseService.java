package com.nemogym.backend.services;

import com.nemogym.backend.entity.Clase;
import com.nemogym.backend.entity.Ejercicio;
import com.nemogym.backend.enums.Genero;
import com.nemogym.backend.repository.ClaseRepository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import com.nemogym.backend.dto.ClaseRequest;
import com.nemogym.backend.dto.EjercicioItem;
import com.nemogym.backend.dto.ClaseItem;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class ClaseService {

    @Autowired
    private ClaseRepository claseRepository;
    @PersistenceContext
    private EntityManager entityManager;

    public void crearClasesDesdeJson(ClaseRequest request) {
        System.out.println(request);
        List<Clase> clases = new ArrayList<>();

        for (ClaseItem item : request.getClases()) {
            Clase clase = new Clase();

            clase.setFecha(request.getFecha());
            clase.setTipo(item.getTipo());
            clase.setGenero(item.getGenero());
            clase.setDia(item.getDia());

            if ("HOMBRE".equals(item.getGenero())) {
                clase.setColor("#3498db");
            } else {
                clase.setColor("#e91e63");
            }

            List<Ejercicio> ejercicios = new ArrayList<>();
            if (item.getEjercicios() != null) {
                for (EjercicioItem ej : item.getEjercicios()) {
                    Ejercicio ejercicio = new Ejercicio();
                    ejercicio.setNombre(ej.getNombre());
                    ejercicio.setRepeticiones(ej.getRepeticiones());
                    ejercicio.setClase(clase);
                    ejercicios.add(ejercicio);
                }
            }
            clase.setEjercicios(ejercicios);
            clases.add(clase);
        }
        claseRepository.saveAll(clases);
    }

    public List<Clase> obtenerClasesPorGenero(Genero genero) {
        entityManager.clear();
        return claseRepository.findByGenero(genero);
    }

    public List<Clase> obtenerTodasLasClases() {
        return claseRepository.findAll();
    }

    public void eliminarClase(Long id) {
        Clase clase = claseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Clase no encontrada con id: " + id));
        claseRepository.delete(clase);
    }

    @Transactional
    public void actualizarClase(Long id, Clase request) {
        Clase clase = claseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Clase no encontrada con id: " + id));

        clase.setDia(request.getDia());
        clase.setGenero(request.getGenero());
        clase.setTipo(request.getTipo());
        clase.getEjercicios().clear();
        if (request.getEjercicios() != null) {
            request.getEjercicios().forEach(ejercicio -> {
                ejercicio.setClase(clase);
                clase.getEjercicios().add(ejercicio);
            });
        }

        claseRepository.save(clase);
    }
}