package com.nemogym.backend.repository;

import com.nemogym.backend.entity.Clase;
import com.nemogym.backend.enums.Genero;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClaseRepository extends JpaRepository<Clase, Long> {
    List<Clase> findByGenero(Genero genero);
}