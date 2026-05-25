package com.nemogym.backend.config;

import com.nemogym.backend.entity.*;
import com.nemogym.backend.enums.Genero;
import com.nemogym.backend.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Random;

@Configuration
public class DataSeeder {

    private final String[] NOMBRES = { "Juan", "Maria", "Carlos", "Ana", "Luis", "Elena", "Pedro", "Sofia", "Diego",
            "Lucia", "Javier", "Camila", "Mateo", "Valentina", "Nicolas", "Isabella" };
    private final String[] APELLIDOS = { "Garcia", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Perez",
            "Sanchez", "Ramirez", "Torres", "Flores", "Rivera", "Gomez", "Diaz", "Cruz", "Morales" };
    private final Random random = new Random();

    private String generarNombreAleatorio() {
        return NOMBRES[random.nextInt(NOMBRES.length)] + " " + APELLIDOS[random.nextInt(APELLIDOS.length)];
    }

    @Bean
    CommandLineRunner seedUserDatabase(
            UserRepository userRepository,
            MembresiaRepository membresiaRepository,
            UsuarioMembresiaRepository userMemRepo) {
        return args -> {
            if (userRepository.count() > 3) {
                return;
            }

            BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

            Membresias basic = new Membresias();
            basic.setId(1L);
            basic.setNombre("PLAN BASIC");
            basic.setPrecio(1500.0);
            basic.setPopular(false);
            basic.setTipo("BASIC");
            basic.setIcono("dumbbell");
            basic.setFeatures(new ArrayList<>());
            membresiaRepository.save(basic);

            Membresias full = new Membresias();
            full.setId(2L);
            full.setNombre("PLAN FULL");
            full.setPrecio(3000.0);
            full.setPopular(true);
            full.setTipo("FULL");
            full.setIcono("star");
            full.setFeatures(new ArrayList<>());
            membresiaRepository.save(full);

            // Generación de usuarios Full
            for (int i = 1; i <= 10; i++) {
                String nombreCompleto = generarNombreAleatorio();
                String email = nombreCompleto.toLowerCase().replace(" ", ".") + i + "@gym.com";
                User user = createAndSaveUser(
                        nombreCompleto,
                        email,
                        (i % 2 == 0 ? Genero.HOMBRE : Genero.MUJER),
                        userRepository,
                        encoder);
                assignMembership(user, full, userMemRepo);
            }

            // Generación de usuarios Basic
            for (int i = 1; i <= 10; i++) {
                String nombreCompleto = generarNombreAleatorio();
                String email = nombreCompleto.toLowerCase().replace(" ", ".") + (i + 10) + "@gym.com";
                User user = createAndSaveUser(
                        nombreCompleto,
                        email,
                        (i % 2 == 0 ? Genero.MUJER : Genero.HOMBRE),
                        userRepository,
                        encoder);
                assignMembership(user, basic, userMemRepo);
            }

            System.out.println(">>> SEEDER: 20 usuarios con nombres aleatorios cargados con éxito.");
        };
    }

    private User createAndSaveUser(String name, String email, Genero genero, UserRepository repo,
            BCryptPasswordEncoder encoder) {
        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(encoder.encode("123456"));
        user.setRole("USER");
        user.setGenero(genero);
        return repo.save(user);
    }

    private void assignMembership(User user, Membresias memb, UsuarioMembresiaRepository repo) {
        UsuarioMembresia um = new UsuarioMembresia();
        um.setUsuario(user);
        um.setMembresia(memb);
        um.setActivo(true);
        um.setFechaInicio(LocalDate.now());
        um.setFechaFin(LocalDate.now().plusMonths(1));
        repo.save(um);
    }
}