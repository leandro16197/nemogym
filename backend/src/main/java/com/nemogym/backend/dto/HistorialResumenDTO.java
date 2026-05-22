package com.nemogym.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class HistorialResumenDTO {
    private String estado;
    private BigDecimal monto;
    private LocalDateTime fechaCreacion;

    public HistorialResumenDTO(String estado, BigDecimal monto, LocalDateTime fechaCreacion) {
        this.estado = estado;
        this.monto = monto;
        this.fechaCreacion = fechaCreacion;
    }

    public String getEstado() {
        return estado;
    }

    public BigDecimal getMonto() {
        return monto;
    }

    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }
}