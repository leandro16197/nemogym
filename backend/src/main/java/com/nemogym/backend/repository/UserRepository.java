package com.nemogym.backend.repository;

import com.nemogym.backend.entity.User;
import org.springframework.data.domain.Page; // IMPORTANTE
import org.springframework.data.domain.Pageable; // IMPORTANTE
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    @Query("SELECT u FROM User u WHERE " +
            "(:search IS NULL OR LOWER(u.name) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%'))) AND "
            +
            "(:genero IS NULL OR u.genero = :genero)")
    Page<User> findByFilters(@Param("search") String search,
            @Param("genero") String genero,
            Pageable pageable);
}