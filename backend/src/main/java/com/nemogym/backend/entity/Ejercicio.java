package com.nemogym.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
public class Ejercicio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private int repeticiones;

    @ManyToOne
    @JoinColumn(name = "clase_id")
    @JsonIgnore
    private Clase clase;

    public Long getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public int getRepeticiones() {
        return repeticiones;
    }

    public Clase getClase() {
        return clase;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public void setRepeticiones(int repeticiones) {
        this.repeticiones = repeticiones;
    }

    public void setClase(Clase clase) {
        this.clase = clase;
    }
}