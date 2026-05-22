package com.nemogym.backend.repository;

import com.nemogym.backend.entity.User;
import com.nemogym.backend.entity.UsuarioMembresia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UsuarioMembresiaRepository extends JpaRepository<UsuarioMembresia, Long> {

    @Query("SELECT COUNT(um) > 0 FROM UsuarioMembresia um WHERE um.usuario.email = :email AND um.activo = true")
    boolean existsByUsuarioEmailAndActivoTrue(@Param("email") String email);

    @Query("SELECT um FROM UsuarioMembresia um WHERE um.usuario.email=:email AND um.activo=true AND um.fechaFin>=CURRENT_DATE")
    Optional<UsuarioMembresia> findMembresiaActiva(@Param("email") String email);

    @Query("SELECT um.usuario FROM UsuarioMembresia um WHERE um.membresia.id = 2 AND um.activo = true AND um.fechaFin >= CURRENT_DATE")
    List<User> findUsuariosConPlanFullActivo();

    List<UsuarioMembresia> findByUsuarioIdAndActivoTrue(Long usuarioId);

    List<UsuarioMembresia> findByUsuarioId(Long usuarioId);
}