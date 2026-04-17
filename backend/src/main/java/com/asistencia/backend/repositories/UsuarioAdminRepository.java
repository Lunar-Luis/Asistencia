package com.asistencia.backend.repositories;

import com.asistencia.backend.entities.UsuarioAdmin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UsuarioAdminRepository extends JpaRepository<UsuarioAdmin, Long> {
    Optional<UsuarioAdmin> findByUsernameAndActivoTrue(String username);

    @Query("SELECT u FROM UsuarioAdmin u WHERE (u.username = :identificador OR u.email = :identificador) AND u.activo = true")
    Optional<UsuarioAdmin> findByUsernameOrEmailActivo(@Param("identificador") String identificador);
}