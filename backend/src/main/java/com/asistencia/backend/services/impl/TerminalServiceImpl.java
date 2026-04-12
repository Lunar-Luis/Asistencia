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
        // ---> CAMBIO CLAVE AQUÍ <---
        // Devolvemos TODAS las terminales (activas e inactivas) para que React pueda mostrarlas en gris.
        return terminalRepository.findAll();
    }

    @Override
    public Terminal obtenerPorId(Long id) {
        return terminalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Terminal no encontrada con ID: " + id));
    }

    @Override
    public Terminal crearTerminal(Terminal terminal) {
        terminal.setActivo(true);
        return terminalRepository.save(terminal);
    }

    @Override
    public Terminal actualizarTerminal(Long id, Terminal terminalDatosNuevos) {
        Terminal terminalActual = obtenerPorId(id);
        terminalActual.setNombre(terminalDatosNuevos.getNombre());
        terminalActual.setMacAddress(terminalDatosNuevos.getMacAddress());
        terminalActual.setUbicacion(terminalDatosNuevos.getUbicacion());

        if(terminalDatosNuevos.getActivo() != null){
            terminalActual.setActivo(terminalDatosNuevos.getActivo());
        }

        return terminalRepository.save(terminalActual);
    }

    @Override
    public void desactivarTerminal(Long id) {
        Terminal terminal = obtenerPorId(id);
        terminal.setActivo(false);
        terminalRepository.save(terminal);
    }

    @Override
    public void reportarPing(String macAddress) {
        terminalRepository.findByMacAddressAndActivoTrue(macAddress).ifPresent(terminal -> {
            terminal.setUltimoPing(LocalDateTime.now());
            terminalRepository.save(terminal);
        });
    }
}