package com.nemogym.backend.services;

import com.nemogym.backend.dto.UserDTO;
import com.nemogym.backend.entity.User;
import com.nemogym.backend.entity.UsuarioMembresia;
import com.nemogym.backend.repository.UserRepository;
import com.nemogym.backend.repository.UsuarioMembresiaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.temporal.ChronoUnit;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UsuarioService {

        @Autowired
        private UserRepository userRepository;

        @Autowired
        private UsuarioMembresiaRepository usuarioMembresiaRepo;

        public List<UserDTO> listarSociosFullActivos() {
                return usuarioMembresiaRepo.findUsuariosConPlanFullActivo()
                                .stream()
                                .map(this::convertToDTO)
                                .collect(Collectors.toList());
        }

        private UserDTO convertToDTO(User user) {
                UsuarioMembresia membresiaActiva = usuarioMembresiaRepo.findByUsuarioIdAndActivoTrue(user.getId())
                                .stream()
                                .filter(um -> !um.getFechaFin().isBefore(LocalDate.now()))
                                .findFirst()
                                .orElse(null);

                boolean tienePlan = membresiaActiva != null;
                String nombrePlan = tienePlan ? membresiaActiva.getMembresia().getNombre() : "SIN PLAN";

                Long diasRestantes = 0L;
                if (tienePlan) {
                        diasRestantes = ChronoUnit.DAYS.between(LocalDate.now(), membresiaActiva.getFechaFin());
                }

                Set<String> rolesNames = user.getRoles().stream()
                                .map(role -> role.getName())
                                .collect(Collectors.toSet());

                return new UserDTO(
                                user.getId(),
                                user.getEmail(),
                                user.getName(),
                                rolesNames,
                                user.getGenero(),
                                tienePlan,
                                nombrePlan,
                                diasRestantes);
        }
}