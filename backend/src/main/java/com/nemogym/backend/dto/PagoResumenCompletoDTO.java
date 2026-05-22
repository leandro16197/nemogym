package com.nemogym.backend.dto;

public class PagoResumenCompletoDTO {
    private Long usuarioId;
    private String usuario;
    private Double monto;
    private String estado;

    public PagoResumenCompletoDTO(Long usuarioId, String usuario, Double monto, String estado) {
        this.usuarioId = usuarioId;
        this.usuario = usuario;
        this.monto = monto;
        this.estado = estado;
    }

    public Long getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(Long usuarioId) {
        this.usuarioId = usuarioId;
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