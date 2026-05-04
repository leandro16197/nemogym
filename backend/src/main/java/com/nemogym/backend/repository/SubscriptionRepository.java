package com.nemogym.backend.repository;

import com.nemogym.backend.entity.Subscription;
import com.nemogym.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import jakarta.transaction.Transactional;
import java.util.Optional;

public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {

    Optional<Subscription> findFirstByUserAndActiveTrue(User user);

    @Query("SELECT COUNT(s) > 0 FROM Subscription s WHERE s.user.email = :email AND s.active = true")
    boolean existsByUsuarioEmailAndActivoTrue(@Param("email") String email);

    @Modifying
    @Transactional
    @Query("UPDATE Subscription s SET s.active = false WHERE s.user.id = :userId")
    void deactivateUserSubscriptions(@Param("userId") Long userId);

    @Query(" SELECT s FROM Subscription s WHERE s.user.email = :email AND s.active = true ")
    Optional<Subscription> findActiveByEmail(@Param("email") String email);
}