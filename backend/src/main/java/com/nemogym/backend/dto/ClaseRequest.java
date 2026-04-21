package com.nemogym.backend.dto;

import java.time.LocalDate;
import java.util.List;

public class ClaseRequest {
    private LocalDate fecha;
    private List<ClaseItem> clases;

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public List<ClaseItem> getClases() {
        return clases;
    }

    public void setClases(List<ClaseItem> clases) {
        this.clases = clases;
    }

}