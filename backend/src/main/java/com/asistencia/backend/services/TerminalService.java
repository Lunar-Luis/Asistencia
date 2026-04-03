package com.asistencia.backend.services;

import com.asistencia.backend.entities.Terminal;
import java.util.List;

public interface TerminalService {
    List<Terminal> obtenerTerminalesActivas();
    Terminal obtenerPorId(Long id);
    Terminal crearTerminal(Terminal terminal);

    // Métodos especiales para controlar el hardware desde React
    Terminal cambiarModoEnrolamiento(Long id, boolean estado);
    void reportarPing(String macAddress, String ipLocal); // Para que el ESP32 avise que está vivo
}