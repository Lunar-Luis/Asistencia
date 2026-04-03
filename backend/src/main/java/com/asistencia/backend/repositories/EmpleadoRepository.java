package com.asistencia.backend.repositories;

import com.asistencia.backend.entities.Empleado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmpleadoRepository extends JpaRepository<Empleado, Long> {
    List<Empleado> findAllByActivoTrue();

    // ¡Esta consulta será vital para el ESP32 más adelante!
    Optional<Empleado> findByNfcUidAndActivoTrue(String nfcUid);
}