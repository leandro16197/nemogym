package com.nemogym.backend.dto;

import com.nemogym.backend.entity.ClasePersonalizada;

public class ClaseResumenDTO {
    private Long id;
    private String nombre;
    private int repeticiones;
    private String descripcion;
    private String nombreCoach;
    private Long usuarioId;
    private int dia;

    public ClaseResumenDTO() {
    }

    public ClaseResumenDTO(ClasePersonalizada clase) {
        this.id = clase.getId();
        this.nombre = clase.getNombre();
        this.repeticiones = clase.getRepeticiones();
        this.descripcion = clase.getDescripcion();
        this.nombreCoach = (clase.getCoach() != null) ? clase.getCoach().getName() : "Sin Coach";
        this.usuarioId = (clase.getUsuario() != null) ? clase.getUsuario().getId() : null;
        this.dia = (clase.getDia() != null) ? clase.getDia() : 0;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public int getRepeticiones() {
        return repeticiones;
    }

    public void setRepeticiones(int repeticiones) {
        this.repeticiones = repeticiones;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getNombreCoach() {
        return nombreCoach;
    }

    public void setNombreCoach(String nombreCoach) {
        this.nombreCoach = nombreCoach;
    }

    public Long getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(Long usuarioId) {
        this.usuarioId = usuarioId;
    }

    public int getDia() {
        return dia;
    }

    public void setDia(int dia) {
        this.dia = dia;
    }
}