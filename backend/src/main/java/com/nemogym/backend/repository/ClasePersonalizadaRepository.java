package com.nemogym.backend.repository;

import com.nemogym.backend.entity.ClasePersonalizada;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClasePersonalizadaRepository extends JpaRepository<ClasePersonalizada, Long> {

    List<ClasePersonalizada> findByUsuarioId(Long userId);

    List<ClasePersonalizada> findByCoachId(Long coachId);

    @Query("SELECT cp FROM ClasePersonalizada cp JOIN UsuarioMembresia um ON cp.usuario.id = um.usuario.id WHERE um.membresia.id = 2 AND um.activo = true AND um.fechaFin >= CURRENT_DATE")
    List<ClasePersonalizada> findAllClasesConPlanFullActivo();
}