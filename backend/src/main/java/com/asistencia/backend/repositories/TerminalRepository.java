package com.asistencia.backend.repositories;

import com.asistencia.backend.entities.Terminal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TerminalRepository extends JpaRepository<Terminal, Long> {
    List<Terminal> findAllByActivoTrue();

    // Lo usaremos cuando el ESP32 se conecte para saber quién es
    Optional<Terminal> findByMacAddressAndActivoTrue(String macAddress);
}