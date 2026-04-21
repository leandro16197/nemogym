package com.nemogym.backend.dto;

public class EjercicioItem {

    private String nombre;
    private int repeticiones;

    public String getNombre() {
        return nombre;
    }

    public int getRepeticiones() {
        return repeticiones;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public void setRepeticiones(int repeticiones) {
        this.repeticiones = repeticiones;
    }
}