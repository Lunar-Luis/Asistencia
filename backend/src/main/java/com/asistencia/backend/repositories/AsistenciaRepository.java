package com.asistencia.backend.repositories;

import com.asistencia.backend.entities.Asistencia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface AsistenciaRepository extends JpaRepository<Asistencia, Long> {

    // Método vital: Busca si el empleado YA marcó asistencia HOY
    Optional<Asistencia> findByEmpleadoIdAndFechaRegistro(Long empleadoId, LocalDate fechaRegistro);
}