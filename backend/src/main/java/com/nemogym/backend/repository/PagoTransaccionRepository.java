package com.nemogym.backend.repository;

import com.nemogym.backend.dto.PagoResumenDTO;
import com.nemogym.backend.dto.PagoResumenCompletoDTO;
import com.nemogym.backend.entity.PagoTransaccion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;

import java.time.LocalDateTime;
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
                        "JOIN User u ON p.usuarioId = u.id " +
                        "WHERE p.id IN (SELECT MAX(p2.id) FROM PagoTransaccion p2 GROUP BY p2.usuarioId)")
        Page<Object[]> findUltimosPagos(Pageable pageable);

        @Query(value = "SELECT p.usuario_id, u.name, p.monto, p.estado " +
                        "FROM pagos_transacciones p " +
                        "JOIN users u ON p.usuario_id = u.id " +
                        "WHERE u.name LIKE CONCAT('%', :nombre, '%')", countQuery = "SELECT count(*) FROM pagos_transacciones p JOIN users u ON p.usuario_id = u.id WHERE u.name LIKE CONCAT('%', :nombre, '%')", nativeQuery = true)
        Page<Object[]> findUltimosPagosConFiltro(@Param("nombre") String nombre, Pageable pageable);

        Optional<PagoTransaccion> findByPreferenciaId(String preferenciaId);

        @Query("SELECT p FROM PagoTransaccion p WHERE p.usuarioId = :usuarioId AND p.fechaCreacion BETWEEN :fechaInicio AND :fechaFin")
        List<PagoTransaccion> findByUsuarioIdAndFechaCreacionBetween(@Param("usuarioId") Long usuarioId,
                        @Param("fechaInicio") LocalDateTime fechaInicio, @Param("fechaFin") LocalDateTime fechaFin);

        List<PagoTransaccion> findByUsuarioIdAndFechaCreacionGreaterThanEqual(Long usuarioId,
                        LocalDateTime fechaInicio);

        List<PagoTransaccion> findByUsuarioIdAndFechaCreacionLessThanEqual(Long usuarioId, LocalDateTime fechaFin);

        List<PagoTransaccion> findByUsuarioId(Long usuarioId);
}