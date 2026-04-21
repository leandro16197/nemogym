package com.nemogym.backend.repository;

import com.nemogym.backend.entity.Subscription;
import com.nemogym.backend.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import jakarta.transaction.Transactional;

import java.util.Optional;

public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {

    Optional<Subscription> findFirstByUserAndActiveTrue(User user);

    @Modifying
    @Transactional
    @Query("UPDATE Subscription s SET s.active = false WHERE s.user.id = :userId")
    void deactivateUserSubscriptions(Long userId);
}