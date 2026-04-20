package com.asistencia.backend.controllers;

import com.asistencia.backend.dtos.MarcajeHardwareDTO;
import com.asistencia.backend.dtos.DashboardResumenDTO;
import com.asistencia.backend.entities.Asistencia;
import com.asistencia.backend.services.AsistenciaService;
import com.asistencia.backend.services.HardwareRegistroService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/asistencias")
@RequiredArgsConstructor
public class AsistenciaController {

    private final AsistenciaService asistenciaService;
    private final HardwareRegistroService hardwareRegistroService;

    @GetMapping
    public ResponseEntity<List<Asistencia>> listarAsistencias() {
        return ResponseEntity.ok(asistenciaService.obtenerTodas());
    }

    @GetMapping("/dashboard/resumen")
    public ResponseEntity<DashboardResumenDTO> obtenerResumen() {
        return ResponseEntity.ok(asistenciaService.obtenerResumenDashboard());
    }

    @PostMapping("/hardware/marcar")
    public ResponseEntity<?> recibirMarcajeHardware(@RequestBody MarcajeHardwareDTO dto) {

        if (hardwareRegistroService.procesarPosibleRegistro(dto.nfcUid())) {
            return ResponseEntity.ok(Map.of("mensaje", "Tarjeta atrapada con éxito para registro"));
        }

        Asistencia asistencia = asistenciaService.procesarMarcajeHardware(dto);
        return new ResponseEntity<>(asistencia, HttpStatus.OK);
    }
}