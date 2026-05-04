package com.nemogym.backend.config;

import com.nemogym.backend.entity.Membresias;
import com.nemogym.backend.repository.MembresiaRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(MembresiaRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                Membresias basico = new Membresias(null, "Plan Básico", 3500.0, "Dumbbell", "basic", false,
                        Arrays.asList("Acceso a máquinas", "Vestuarios", "App de asistencia"));

                Membresias full = new Membresias(null, "Plan Full", 6000.0, "Zap", "full", true,
                        Arrays.asList("Acceso a máquinas", "Clases grupales", "Rutinas personalizadas", "Seguimiento"));

                repository.saveAll(Arrays.asList(basico, full));
                System.out.println("Datos de membresías cargados correctamente.");
            }
        };
    }
}