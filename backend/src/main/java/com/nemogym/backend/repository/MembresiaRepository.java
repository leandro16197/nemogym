package com.nemogym.backend.repository;

import com.nemogym.backend.entity.Membresias;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MembresiaRepository extends JpaRepository<Membresias, Long> {

}