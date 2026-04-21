package com.nemogym.backend.dto;

import java.util.List;
import com.nemogym.backend.enums.Genero;

public class ClaseItem {

    private String tipo;
    private Genero genero;
    private Integer dia;
    private List<EjercicioItem> ejercicios;

    public Integer getDia() {
        return dia;
    }

    public void setDia(Integer dia) {
        this.dia = dia;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public Genero getGenero() {
        return genero;
    }

    public void setGenero(Genero genero) {
        this.genero = genero;
    }

    public List<EjercicioItem> getEjercicios() {
        return ejercicios;
    }

    public void setEjercicios(List<EjercicioItem> ejercicios) {
        this.ejercicios = ejercicios;
    }

}