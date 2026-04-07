package com.asistencia.backend.repositories;

import com.asistencia.backend.entities.UsuarioAdmin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UsuarioAdminRepository extends JpaRepository<UsuarioAdmin, Long> {
    Optional<UsuarioAdmin> findByUsernameAndActivoTrue(String username);
}