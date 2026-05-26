package com.nemogym.backend.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mercadopago.client.payment.PaymentClient;
import com.mercadopago.resources.payment.Payment;
import com.nemogym.backend.entity.*;
import com.nemogym.backend.repository.*;
import com.nemogym.backend.services.MercadoPagoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/mercadopago")
public class MercadoPagoController {

        private final MercadoPagoService mercadoPagoService;
        private final MembresiaRepository membresiaRepository;
        private final PagoTransaccionRepository pagoTransaccionRepository;
        private final UsuarioMembresiaRepository usuarioMembresiaRepository;
        private final UserRepository userRepository;
        private final ObjectMapper objectMapper = new ObjectMapper();

        public MercadoPagoController(MercadoPagoService mercadoPagoService,
                        MembresiaRepository membresiaRepository,
                        PagoTransaccionRepository pagoTransaccionRepository,
                        UsuarioMembresiaRepository usuarioMembresiaRepository,
                        UserRepository userRepository) {
                this.mercadoPagoService = mercadoPagoService;
                this.membresiaRepository = membresiaRepository;
                this.pagoTransaccionRepository = pagoTransaccionRepository;
                this.usuarioMembresiaRepository = usuarioMembresiaRepository;
                this.userRepository = userRepository;
        }

        @PostMapping("/crear-preferencia/{membresiaId}")
        public ResponseEntity<?> crearPreferencia(@PathVariable Long membresiaId, Authentication authentication) {
                try {
                        Membresias membresia = membresiaRepository.findById(membresiaId)
                                        .orElseThrow(() -> new RuntimeException("Plan de membresía no encontrado"));

                        User usuario = userRepository.findByEmail(authentication.getName())
                                        .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

                        PagoTransaccion intentoPago = new PagoTransaccion();
                        intentoPago.setUsuarioId(usuario.getId());
                        intentoPago.setMembresia(membresia);
                        intentoPago.setMonto(BigDecimal.valueOf(membresia.getPrecio()));
                        intentoPago = pagoTransaccionRepository.save(intentoPago);

                        Map<String, String> preferencia = mercadoPagoService.crearPreferencia(
                                        membresia.getNombre(),
                                        membresia.getPrecio(),
                                        intentoPago.getId().toString());

                        intentoPago.setPreferenciaId(preferencia.get("id"));
                        pagoTransaccionRepository.save(intentoPago);

                        return ResponseEntity.ok(preferencia);
                } catch (Exception e) {
                        return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
                }
        }

        @PostMapping(value = "/webhook", consumes = "*/*")
        @Transactional
        public ResponseEntity<Void> recibirWebhook(
                        @RequestBody(required = false) String rawBody,
                        @RequestParam(required = false) Map<String, String> allParams) {

                try {
                        if (rawBody == null || rawBody.isEmpty()) {
                                return ResponseEntity.ok().build();
                        }
                        JsonNode jsonNode = objectMapper.readTree(rawBody);
                        String type = jsonNode.has("type") ? jsonNode.get("type").asText() : "";
                        if (allParams != null && allParams.containsKey("topic")) {
                                type = allParams.get("topic");
                        }
                        if (!"payment".equals(type)) {
                                return ResponseEntity.ok().build();
                        }
                        Long paymentId = null;
                        if (jsonNode.has("data") && jsonNode.get("data").has("id")) {
                                paymentId = jsonNode.get("data").get("id").asLong();
                        } else if (jsonNode.has("id")) {
                                paymentId = jsonNode.get("id").asLong();
                        }

                        if (paymentId == null) {
                                return ResponseEntity.ok().build();
                        }
                        Payment payment = new PaymentClient().get(paymentId);

                        String status = payment.getStatus();
                        String statusDetail = payment.getStatusDetail();
                        String externalRef = payment.getExternalReference();
                        if (externalRef == null) {
                                return ResponseEntity.ok().build();
                        }
                        Long pagoId = Long.parseLong(externalRef);
                        PagoTransaccion pagoLocal = pagoTransaccionRepository.findById(pagoId)
                                        .orElse(null);

                        if (pagoLocal == null) {
                                return ResponseEntity.ok().build();
                        }
                        if ("APROBADO".equals(pagoLocal.getEstado()) ||
                                        "RECHAZADO".equals(pagoLocal.getEstado())) {
                                return ResponseEntity.ok().build();
                        }
                        pagoLocal.setMpPagoId(paymentId);
                        if ("approved".equals(status)) {

                                pagoLocal.setEstado("APROBADO");

                                User usuario = userRepository.findById(pagoLocal.getUsuarioId())
                                                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

                                activarMembresia(usuario, pagoLocal.getMembresia());

                        } else if ("rejected".equals(status)) {
                                switch (statusDetail != null ? statusDetail : "") {

                                        case "FUND":
                                                pagoLocal.setEstado("RECHAZO_FONDOS_INSUFICIENTES");
                                                break;
                                        case "SECU":
                                                pagoLocal.setEstado("RECHAZO_CVV_INVALIDO");
                                                break;
                                        case "EXPI":
                                                pagoLocal.setEstado("RECHAZO_TARJETA_VENCIDA");
                                                break;
                                        case "DUPL":
                                                pagoLocal.setEstado("RECHAZO_PAGO_DUPLICADO");
                                                break;
                                        case "LOCK":
                                                pagoLocal.setEstado("RECHAZO_TARJETA_BLOQUEADA");
                                                break;
                                        case "CALL":
                                                pagoLocal.setEstado("RECHAZO_REQUIERE_AUTORIZACION");
                                                break;
                                        case "OTHE":
                                        default:
                                                pagoLocal.setEstado("RECHAZO_GENERAL");
                                                break;
                                }
                        } else {
                                pagoLocal.setEstado("PENDIENTE");
                        }
                        pagoTransaccionRepository.save(pagoLocal);
                        return ResponseEntity.ok().build();
                } catch (Exception e) {
                        e.printStackTrace();
                        return ResponseEntity.ok().build();
                }
        }

        private void activarMembresia(User usuario, Membresias membresia) {
                UsuarioMembresia um = usuarioMembresiaRepository.findByUsuarioIdAndActivoTrue(usuario.getId())
                                .stream().findFirst().orElse(new UsuarioMembresia());

                um.setUsuario(usuario);
                um.setMembresia(membresia);
                um.setFechaInicio(LocalDate.now());
                um.setFechaFin(LocalDate.now().plusDays(30));
                um.setActivo(true);
                usuarioMembresiaRepository.save(um);
        }
}