package com.asistencia.backend.controllers;

import com.asistencia.backend.entities.ConfiguracionSistema;
import com.asistencia.backend.repositories.ConfiguracionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/configuracion")
public class ConfiguracionController {

    @Autowired
    private ConfiguracionRepository repository;

    @GetMapping
    public ResponseEntity<ConfiguracionSistema> obtenerConfiguracion() {
        ConfiguracionSistema config = repository.findById(1L).orElseGet(() -> {
            ConfiguracionSistema nueva = new ConfiguracionSistema();
            return repository.save(nueva);
        });
        return ResponseEntity.ok(config);
    }

    @PutMapping
    public ResponseEntity<ConfiguracionSistema> actualizarConfiguracion(@RequestBody ConfiguracionSistema configActualizada) {
        configActualizada.setId(1L);
        ConfiguracionSistema guardada = repository.save(configActualizada);
        return ResponseEntity.ok(guardada);
    }
}