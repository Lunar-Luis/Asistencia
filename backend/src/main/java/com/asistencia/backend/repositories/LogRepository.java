package com.asistencia.backend.repositories;

import com.asistencia.backend.entities.LogActividad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LogRepository extends JpaRepository<LogActividad, Long> {
}