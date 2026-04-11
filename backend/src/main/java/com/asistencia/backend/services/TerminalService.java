package com.asistencia.backend.services;

import com.asistencia.backend.entities.Terminal;
import java.util.List;

public interface TerminalService {
    List<Terminal> obtenerTerminalesActivas();
    Terminal obtenerPorId(Long id);
    Terminal crearTerminal(Terminal terminal);
    Terminal actualizarTerminal(Long id, Terminal terminal);
    void desactivarTerminal(Long id);

    // Método para que el ESP32 avise que está vivo
    void reportarPing(String macAddress);
}