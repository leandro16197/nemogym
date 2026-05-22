package com.nemogym.backend.repository;

import com.nemogym.backend.dto.PagoResumenDTO;
import com.nemogym.backend.dto.PagoResumenCompletoDTO;
import com.nemogym.backend.entity.PagoTransaccion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Optional;

@Repository
public interface PagoTransaccionRepository extends JpaRepository<PagoTransaccion, Long> {

    @Query("SELECT COUNT(p) FROM PagoTransaccion p")
    long countTotalPagos();

    @Query("SELECT SUM(p.monto) FROM PagoTransaccion p WHERE p.estado = 'APROBADO'")
    Double sumarMontoTotalAprobado();

    long countByEstado(String estado);

    @Query("SELECT COUNT(p) FROM PagoTransaccion p WHERE p.membresia.tipo = :tipo")
    long countByMembresiaTipo(String tipo);

    @Query("SELECT u.id, u.name, p.monto, p.estado " +
            "FROM PagoTransaccion p " +
            "LEFT JOIN User u ON p.usuarioId = u.id")
    Page<Object[]> findUltimosPagos(Pageable pageable);

    Optional<PagoTransaccion> findByPreferenciaId(String preferenciaId);

    List<PagoTransaccion> findByUsuarioId(Long usuarioId);
}