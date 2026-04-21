package com.nemogym.backend.repository;

import com.nemogym.backend.entity.Aviso;
import com.nemogym.backend.entity.Plan;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AvisoRepository extends JpaRepository<Aviso, Long> {
    // Ordenamos para que los más nuevos aparezcan primero
    List<Aviso> findAllByOrderByCreatedAtDesc();
}