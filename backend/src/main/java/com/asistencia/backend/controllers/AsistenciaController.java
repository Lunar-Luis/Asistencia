package com.asistencia.backend.controllers;

import com.asistencia.backend.dtos.MarcajeHardwareDTO;
import com.asistencia.backend.entities.Asistencia;
import com.asistencia.backend.services.AsistenciaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/asistencias")
@CrossOrigin(origins = "*")
public class AsistenciaController {

    private final AsistenciaService asistenciaService;

    public AsistenciaController(AsistenciaService asistenciaService) {
        this.asistenciaService = asistenciaService;
    }

    // Endpoint para que React vea la tabla
    @GetMapping
    public ResponseEntity<List<Asistencia>> listarAsistencias() {
        return ResponseEntity.ok(asistenciaService.obtenerTodas());
    }

    // Endpoint ESPECÍFICO para el ESP32
    @PostMapping("/hardware/marcar")
    public ResponseEntity<?> recibirMarcajeHardware(@RequestBody MarcajeHardwareDTO dto) {
        try {
            Asistencia asistencia = asistenciaService.procesarMarcajeHardware(dto);
            return new ResponseEntity<>(asistencia, HttpStatus.OK);
        } catch (RuntimeException e) {
            // Si hay error (ej: ya marcó salida, o tarjeta no existe), le respondemos al ESP32 con error 400
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}