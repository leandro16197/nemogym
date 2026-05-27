package com.nemogym.backend.repository;

import com.nemogym.backend.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.nemogym.backend.enums.Genero;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
        Optional<User> findByEmail(String email);

        @Query("SELECT DISTINCT u FROM User u LEFT JOIN u.roles r WHERE " +
                        "(:search IS NULL OR :search = '' OR LOWER(u.name) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%'))) AND "
                        +
                        "(:genero IS NULL OR :genero = '' OR u.genero = :genero) AND " +
                        "(:rolId IS NULL OR r.id = :rolId)")
        Page<User> findByFilters(
                        @Param("search") String search,
                        @Param("genero") Genero genero,
                        @Param("rolId") Long rolId,
                        Pageable pageable);
}