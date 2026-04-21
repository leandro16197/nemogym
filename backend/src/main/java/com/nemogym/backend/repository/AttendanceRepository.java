package com.nemogym.backend.repository;

import com.nemogym.backend.entity.Attendance;
import com.nemogym.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.time.LocalDateTime;
import java.util.List;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    boolean existsByUserAndCheckInBetween(User user, LocalDateTime start, LocalDateTime end);
    Optional<Attendance> findTopByUserAndCheckOutIsNotNullOrderByCheckInDesc(User user);
    Optional<Attendance> findTopByUserAndCheckOutIsNullOrderByCheckInDesc(User user);
    List<Attendance> findByUserOrderByCheckInDesc(User user);
}