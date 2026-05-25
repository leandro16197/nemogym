package com.nemogym.backend.config;

import com.nemogym.backend.entity.*;
import com.nemogym.backend.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.concurrent.ThreadLocalRandom;

@Configuration
public class PagoSeeder {

    @Bean
    @Order(2)
    @Transactional
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

            String[] estados = { "APROBADO", "APROBADO", "APROBADO", "PENDIENTE", "RECHAZO_GENERAL" };
            Membresias[] opcionesMembresia = { basic, full };

            userRepository.findAll().forEach(user -> {
                if ("USER".equals(user.getRole())) {
                    int cantidadPagos = ThreadLocalRandom.current().nextInt(5, 9);

                    for (int i = 0; i < cantidadPagos; i++) {
                        String estado = estados[ThreadLocalRandom.current().nextInt(estados.length)];

                        Membresias membSeleccionada = opcionesMembresia[ThreadLocalRandom.current()
                                .nextInt(opcionesMembresia.length)];

                        PagoTransaccion pago = new PagoTransaccion();
                        pago.setUsuarioId(user.getId());
                        pago.setMembresia(membSeleccionada);
                        pago.setMonto(BigDecimal.valueOf(membSeleccionada.getPrecio()));
                        pago.setEstado(estado);

                        int diasAtras = ThreadLocalRandom.current().nextInt(0, 181);
                        int horasAtras = ThreadLocalRandom.current().nextInt(0, 24);

                        pago.setFechaCreacion(LocalDateTime.now().minusDays(diasAtras).minusHours(horasAtras));
                        pago.setPreferenciaId("PREF-" + user.getId() + "-" + i + "-" + System.nanoTime());
                        pagoRepository.save(pago);
                    }

                    Membresias membFinal = opcionesMembresia[ThreadLocalRandom.current()
                            .nextInt(opcionesMembresia.length)];
                    UsuarioMembresia um = new UsuarioMembresia();
                    um.setUsuario(user);
                    um.setMembresia(membFinal);
                    um.setActivo(true);
                    um.setFechaInicio(LocalDate.now());
                    um.setFechaFin(LocalDate.now().plusDays(30));
                    usuarioMembresiaRepository.save(um);
                }
            });

            System.out.println(">>> SEEDER: Pagos aleatorios (con membresías variadas) generados con éxito.");
        };
    }
}