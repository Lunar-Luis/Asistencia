package com.asistencia.backend.services.impl;

import com.asistencia.backend.entities.Terminal;
import com.asistencia.backend.repositories.TerminalRepository;
import com.asistencia.backend.services.TerminalService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TerminalServiceImpl implements TerminalService {

    private final TerminalRepository terminalRepository;

    public TerminalServiceImpl(TerminalRepository terminalRepository) {
        this.terminalRepository = terminalRepository;
    }

    @Override
    public List<Terminal> obtenerTerminalesActivas() {
        return terminalRepository.findAllByActivoTrue();
    }

    @Override
    public Terminal obtenerPorId(Long id) {
        return terminalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Terminal no encontrada con ID: " + id));
    }

    @Override
    public Terminal crearTerminal(Terminal terminal) {
        terminal.setActivo(true);
        terminal.setModoEnrolamiento(false);
        return terminalRepository.save(terminal);
    }

    @Override
    public Terminal cambiarModoEnrolamiento(Long id, boolean estado) {
        Terminal terminal = obtenerPorId(id);
        terminal.setModoEnrolamiento(estado);
        if(estado) {
            terminal.setUltimoUidLeido(null); // Limpiamos lecturas anteriores al activar
        }
        return terminalRepository.save(terminal);
    }

    @Override
    public void reportarPing(String macAddress, String ipLocal) {
        // Busca la terminal por su MAC, y si existe, actualiza su hora y su IP
        terminalRepository.findByMacAddressAndActivoTrue(macAddress).ifPresent(terminal -> {
            terminal.setUltimoPing(LocalDateTime.now());
            terminal.setIpLocal(ipLocal);
            terminalRepository.save(terminal);
        });
    }
}