package com.nemogym.backend.dto;

public class PagoResumenDTO {
    private String usuario;
    private Double monto;
    private String estado;

    public PagoResumenDTO() {
    }

    public PagoResumenDTO(String usuario, java.math.BigDecimal monto, String estado) {
        this.usuario = usuario;
        this.monto = (monto != null) ? monto.doubleValue() : 0.0;
        this.estado = estado;
    }

    public String getUsuario() {
        return usuario;
    }

    public void setUsuario(String usuario) {
        this.usuario = usuario;
    }

    public Double getMonto() {
        return monto;
    }

    public void setMonto(Double monto) {
        this.monto = monto;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }
}