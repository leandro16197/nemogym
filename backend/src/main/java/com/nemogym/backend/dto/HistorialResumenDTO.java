package com.nemogym.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class HistorialResumenDTO {
    private String estado;
    private BigDecimal monto;
    private LocalDateTime fechaCreacion;
    private String nombreMembresia;

    public HistorialResumenDTO(String estado, BigDecimal monto, LocalDateTime fechaCreacion, String nombreMembresia) {
        this.estado = estado;
        this.monto = monto;
        this.fechaCreacion = fechaCreacion;
        this.nombreMembresia = nombreMembresia;
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

    public String getNombreMembresia() {
        return nombreMembresia;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public void setMonto(BigDecimal monto) {
        this.monto = monto;
    }

    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    public void setNombreMembresia(String nombreMembresia) {
        this.nombreMembresia = nombreMembresia;
    }

}