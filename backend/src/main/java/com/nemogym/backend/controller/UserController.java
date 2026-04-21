package com.nemogym.backend.controller;

import com.nemogym.backend.entity.User;
import com.nemogym.backend.repository.UserRepository;
import org.springframework.web.bind.annotation.*;
import com.nemogym.backend.repository.SubscriptionRepository;
import java.time.LocalDate;
import java.util.List;
import com.nemogym.backend.repository.AttendanceRepository;
import java.time.LocalDateTime;
import com.nemogym.backend.entity.Attendance;

@RestController
@RequestMapping("/users")
public class UserController {
    private final SubscriptionRepository subscriptionRepository;
    private final UserRepository userRepository;
    private final AttendanceRepository attendanceRepository;

    public UserController(UserRepository userRepository,SubscriptionRepository subscriptionRepository,AttendanceRepository attendanceRepository) {
        this.userRepository = userRepository;
        this.subscriptionRepository = subscriptionRepository;
        this.attendanceRepository = attendanceRepository;
    }

    @GetMapping
    public List<User> getAll() {
        return userRepository.findAll();
    }

    @PostMapping
    public User create(@RequestBody User user) {
        return userRepository.save(user);
    }

    @PutMapping("/{id}")
    public User update(@PathVariable Long id, @RequestBody User user) {
        User existing = userRepository.findById(id).orElseThrow();
        existing.setName(user.getName());
        existing.setEmail(user.getEmail());
        return userRepository.save(existing);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        userRepository.deleteById(id);
    }

    @GetMapping("/{id}/can-access")
    public Boolean canAccess(@PathVariable Long id) {

        User user = userRepository.findById(id).orElseThrow();

        return subscriptionRepository
                .findFirstByUserAndActiveTrue(user)
                .map(sub -> sub.getEndDate().isAfter(LocalDate.now()) || sub.getEndDate().isEqual(LocalDate.now()))
                .orElse(false);
    }

    @PostMapping("/{id}/check-in")
    public String checkIn(@PathVariable Long id) {

        User user = userRepository.findById(id).orElseThrow();

        boolean canAccess = subscriptionRepository
                .findFirstByUserAndActiveTrue(user)
                .map(sub -> sub.getEndDate().isAfter(java.time.LocalDate.now())
                        || sub.getEndDate().isEqual(java.time.LocalDate.now()))
                .orElse(false);

        if (!canAccess) {
            return "Acceso denegado";
        }

        LocalDateTime startOfDay = LocalDateTime.now().toLocalDate().atStartOfDay();
        LocalDateTime endOfDay = startOfDay.plusDays(1);

        boolean alreadyChecked = attendanceRepository
                .existsByUserAndCheckInBetween(user, startOfDay, endOfDay);

        if (alreadyChecked) {
            return "Ya registró ingreso hoy";
        }

        Attendance attendance = new Attendance();
        attendance.setUser(user);
        attendance.setCheckIn(LocalDateTime.now());

        attendanceRepository.save(attendance);

        return "Ingreso registrado";
    }

    @GetMapping("/{id}/last-session-duration")
    public String getLastSessionDuration(@PathVariable Long id) {

        User user = userRepository.findById(id).orElseThrow();

        Attendance attendance = attendanceRepository
                .findTopByUserAndCheckOutIsNotNullOrderByCheckInDesc(user)
                .orElse(null);

        if (attendance == null) {
            return "No hay sesiones completadas";
        }

        java.time.Duration duration = java.time.Duration.between(
                attendance.getCheckIn(),
                attendance.getCheckOut()
        );

        long hours = duration.toHours();
        long minutes = duration.toMinutesPart();

        return "Última sesión: " + hours + "h " + minutes + "m";
    }
    
    @PostMapping("/{id}/check-out")
    public String checkOut(@PathVariable Long id) {

        User user = userRepository.findById(id).orElseThrow();

        Attendance attendance = attendanceRepository
                .findTopByUserAndCheckOutIsNullOrderByCheckInDesc(user)
                .orElse(null);

        if (attendance == null) {
            return "No hay ingreso activo";
        }

        attendance.setCheckOut(java.time.LocalDateTime.now());
        attendanceRepository.save(attendance);

        return "Salida registrada";
    }
    
    @GetMapping("/{id}/sessions")
    public List<java.util.Map<String, Object>> getSessions(@PathVariable Long id) {

        User user = userRepository.findById(id).orElseThrow();

        List<Attendance> sessions = attendanceRepository.findByUserOrderByCheckInDesc(user);

        return sessions.stream().map(att -> {

            java.util.Map<String, Object> map = new java.util.HashMap<>();

            map.put("checkIn", att.getCheckIn());
            map.put("checkOut", att.getCheckOut());

            if (att.getCheckOut() != null) {
                java.time.Duration duration = java.time.Duration.between(
                        att.getCheckIn(),
                        att.getCheckOut()
                );

                map.put("duration", duration.toHours() + "h " + duration.toMinutesPart() + "m");
            } else {
                map.put("duration", "En curso");
            }

            return map;

        }).toList();
    }
}