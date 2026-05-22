package com.nemogym.backend.config;

import com.nemogym.backend.entity.*;
import com.nemogym.backend.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Configuration
public class PagoSeeder {

    @Bean
    @Order(2)
    CommandLineRunner seedPagos(
            UserRepository userRepository,
            MembresiaRepository membresiaRepository,
            PagoTransaccionRepository pagoRepository,
            UsuarioMembresiaRepository usuarioMembresiaRepository) {

        return args -> {
            if (pagoRepository.count() > 0)
                return;

            Membresias basic = membresiaRepository.findById(1L).orElse(null);
            Membresias full = membresiaRepository.findById(2L).orElse(null);

            userRepository.findAll().forEach(user -> {
                if ("USER".equals(user.getRole())) {
                    boolean isFull = user.getName().contains("Full");
                    Membresias memb = isFull ? full : basic;

                    String estado = (user.getId() % 5 == 0) ? "RECHAZO_GENERAL"
                            : (user.getId() % 7 == 0) ? "PENDIENTE" : "APROBADO";
                    PagoTransaccion pago = new PagoTransaccion();
                    pago.setUsuarioId(user.getId());
                    pago.setMembresia(memb);
                    pago.setMonto(java.math.BigDecimal.valueOf(memb.getPrecio()));
                    pago.setEstado(estado);
                    pago.setFechaCreacion(LocalDateTime.now().minusDays(user.getId()));
                    pago.setPreferenciaId("PREF-TEST-" + user.getId());
                    pagoRepository.save(pago);

                    if ("APROBADO".equals(estado)) {
                        UsuarioMembresia um = new UsuarioMembresia();
                        um.setUsuario(user);
                        um.setMembresia(memb);
                        um.setActivo(true);
                        um.setFechaInicio(LocalDate.now());
                        um.setFechaFin(LocalDate.now().plusDays(30));

                        usuarioMembresiaRepository.save(um);
                    }
                }
            });

            System.out.println(">>> SEEDER: Pagos y relaciones de membresía generadas con éxito.");
        };
    }
}