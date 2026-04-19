package com.asistencia.backend.repositories;

import com.asistencia.backend.entities.ConfiguracionSistema;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ConfiguracionRepository extends JpaRepository<ConfiguracionSistema, Long> {
}