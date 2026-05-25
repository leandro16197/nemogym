package com.nemogym.backend.controller;

import com.nemogym.backend.dto.MetricasReporteDTO;
import com.nemogym.backend.dto.PagoResumenDTO;
import com.nemogym.backend.dto.HistorialResumenDTO;
import com.nemogym.backend.dto.PagoResumenCompletoDTO;
import com.nemogym.backend.entity.PagoTransaccion;
import com.nemogym.backend.repository.PagoTransaccionRepository;
import com.nemogym.backend.repository.UsuarioMembresiaRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reportes")
public class ReportesController {

    @Autowired
    private PagoTransaccionRepository pagoRepository;

    @Autowired
    private UsuarioMembresiaRepository usuarioMembresiaRepository;

    @Autowired
    private PagoTransaccionRepository pagoTransaccionRepository;

    @GetMapping("/metricas")
    public MetricasReporteDTO obtenerMetricas() {
        MetricasReporteDTO dto = new MetricasReporteDTO();

        dto.setTotalPagos(pagoRepository.countTotalPagos());
        dto.setMontoTotalRecaudado(
                pagoRepository.sumarMontoTotalAprobado() != null ? pagoRepository.sumarMontoTotalAprobado() : 0.0);
        dto.setTotalFull(pagoRepository.countByMembresiaTipo("FULL"));
        dto.setTotalBasic(pagoRepository.countByMembresiaTipo("BASIC"));
        dto.setTotalAprobados(pagoRepository.countByEstado("APROBADO"));
        dto.setTotalRechazados(pagoRepository.countByEstado("RECHAZO_GENERAL"));
        dto.setTotalPendientes(pagoRepository.countByEstado("PENDIENTE"));

        return dto;
    }

    @GetMapping("/ultimos-pagos")
    public Page<PagoResumenCompletoDTO> obtenerUltimosPagos(
            @RequestParam(required = false) String nombre,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Page<Object[]> resultados;
        Pageable pageable = PageRequest.of(page, size);
        if (nombre != null && !nombre.isEmpty()) {
            resultados = pagoRepository.findUltimosPagosConFiltro(nombre, pageable);
        } else {
            resultados = pagoRepository.findUltimosPagos(pageable);
        }

        return resultados.map(obj -> {
            java.math.BigDecimal montoDecimal = (java.math.BigDecimal) obj[2];
            return new PagoResumenCompletoDTO(
                    (Long) obj[0],
                    (String) obj[1],
                    (montoDecimal != null) ? montoDecimal.doubleValue() : 0.0,
                    (String) obj[3]);
        });
    }

    @GetMapping("/historial/{usuarioId}")
    public ResponseEntity<List<HistorialResumenDTO>> obtenerHistorial(
            @PathVariable Long usuarioId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaFin) {

        List<PagoTransaccion> pagos;
        if (fechaInicio != null && fechaFin != null) {
            pagos = pagoTransaccionRepository.findByUsuarioIdAndFechaCreacionBetween(usuarioId, fechaInicio, fechaFin);
        } else if (fechaInicio != null) {
            pagos = pagoTransaccionRepository.findByUsuarioIdAndFechaCreacionGreaterThanEqual(usuarioId, fechaInicio);
        } else if (fechaFin != null) {
            pagos = pagoTransaccionRepository.findByUsuarioIdAndFechaCreacionLessThanEqual(usuarioId, fechaFin);
        } else {
            pagos = pagoTransaccionRepository.findByUsuarioId(usuarioId);
        }

        if (pagos.isEmpty())
            return ResponseEntity.notFound().build();

        List<HistorialResumenDTO> historialDTO = pagos.stream()
                .map(p -> new HistorialResumenDTO(
                        p.getEstado(),
                        p.getMonto(),
                        p.getFechaCreacion(),
                        (p.getMembresia() != null) ? p.getMembresia().getNombre() : "Sin plan"))
                .collect(Collectors.toList());

        return ResponseEntity.ok(historialDTO);
    }
}