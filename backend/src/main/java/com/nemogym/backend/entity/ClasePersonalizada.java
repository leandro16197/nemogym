package com.nemogym.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "clases_personalizadas")
public class ClasePersonalizada {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User usuario;

    @ManyToOne
    private User coach;

    private String nombre;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    private Integer repeticiones;

    private LocalDate fecha;

    private Integer dia;

    public ClasePersonalizada() {
    }

    public Long getId() {
        return id;
    }

    public User getUsuario() {
        return usuario;
    }

    public User getCoach() {
        return coach;
    }

    public String getNombre() {
        return nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public Integer getRepeticiones() {
        return repeticiones;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public void setUsuario(User usuario) {
        this.usuario = usuario;
    }

    public void setCoach(User coach) {
        this.coach = coach;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public void setRepeticiones(Integer repeticiones) {
        this.repeticiones = repeticiones;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public Integer getDia() {
        return dia;
    }

    public void setDia(Integer dia) {
        this.dia = dia;
    }
}