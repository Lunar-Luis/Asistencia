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

    // Método vital: Busca si el empleado YA marcó asistencia HOY
    Optional<Asistencia> findByEmpleadoIdAndFechaRegistro(Long empleadoId, LocalDate fechaRegistro);

    // ---> 1. REPARAMOS LA CONSULTA DEL DASHBOARD <---
    @Query("SELECT a FROM Asistencia a " +
            "JOIN FETCH a.empleado e " +
            "JOIN FETCH e.cargo c " +
            "JOIN FETCH e.horario h " +
            "JOIN FETCH a.terminal t " +
            "WHERE a.fechaRegistro = :fechaRegistro")
    List<Asistencia> findAllByFechaRegistro(@Param("fechaRegistro") LocalDate fechaRegistro);

    // ---> 2. REPARAMOS LA CONSULTA DE LA LISTA GENERAL <---
    @Query("SELECT a FROM Asistencia a " +
            "JOIN FETCH a.empleado e " +
            "JOIN FETCH e.cargo c " +
            "JOIN FETCH e.horario h " +
            "JOIN FETCH a.terminal t")
    List<Asistencia> findAll();
}