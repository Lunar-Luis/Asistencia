package com.asistencia.backend.repositories;

import com.asistencia.backend.entities.Asistencia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AsistenciaRepository extends JpaRepository<Asistencia, Long> {

    Optional<Asistencia> findByEmpleadoIdAndFechaRegistro(Long empleadoId, LocalDate fechaRegistro);

    // ---> CAMBIADO A "LEFT JOIN" PARA INCLUIR LAS AUSENCIAS SIN TERMINAL <---
    @Query("SELECT a FROM Asistencia a " +
            "LEFT JOIN FETCH a.empleado e " +
            "LEFT JOIN FETCH e.cargo c " +
            "LEFT JOIN FETCH e.horario h " +
            "LEFT JOIN FETCH a.terminal t " +
            "WHERE a.fechaRegistro = :fechaRegistro")
    List<Asistencia> findAllByFechaRegistro(@Param("fechaRegistro") LocalDate fechaRegistro);

    @Query("SELECT a FROM Asistencia a " +
            "LEFT JOIN FETCH a.empleado e " +
            "LEFT JOIN FETCH e.cargo c " +
            "LEFT JOIN FETCH e.horario h " +
            "LEFT JOIN FETCH a.terminal t")
    List<Asistencia> findAll();
}