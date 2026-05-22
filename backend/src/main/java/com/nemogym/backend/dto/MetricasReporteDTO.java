package com.nemogym.backend.dto;

import java.util.List;

import lombok.Data;

@Data
public class MetricasReporteDTO {
    private long totalPagos;
    private double montoTotalRecaudado;
    private long totalFull;
    private long totalBasic;
    private long totalAprobados;
    private long totalRechazados;
    private long totalPendientes;
    private List<PagoResumenDTO> ultimosPagos;

    public List<PagoResumenDTO> getUltimosPagos() {
        return ultimosPagos;
    }

    public void setUltimosPagos(List<PagoResumenDTO> ultimosPagos) {
        this.ultimosPagos = ultimosPagos;
    }
}