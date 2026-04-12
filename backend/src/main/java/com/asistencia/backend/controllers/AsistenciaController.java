package com.asistencia.backend.controllers;

import com.asistencia.backend.dtos.MarcajeHardwareDTO;
import com.asistencia.backend.dtos.DashboardResumenDTO;
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
    private final EmpleadoController empleadoController;

    public AsistenciaController(AsistenciaService asistenciaService, EmpleadoController empleadoController) {
        this.asistenciaService = asistenciaService;
        this.empleadoController = empleadoController;
    }

    @GetMapping
    public ResponseEntity<List<Asistencia>> listarAsistencias() {
        return ResponseEntity.ok(asistenciaService.obtenerTodas());
    }

    // ---> NUEVO ENDPOINT PARA EL DASHBOARD <---
    @GetMapping("/dashboard/resumen")
    public ResponseEntity<DashboardResumenDTO> obtenerResumen() {
        return ResponseEntity.ok(asistenciaService.obtenerResumenDashboard());
    }

    @PostMapping("/hardware/marcar")
    public ResponseEntity<?> recibirMarcajeHardware(@RequestBody MarcajeHardwareDTO dto) {
        try {
            String uid = dto.nfcUid();

            if (empleadoController.procesarPosibleRegistro(uid)) {
                return ResponseEntity.ok("Tarjeta atrapada con éxito para registro de nuevo empleado");
            }

            Asistencia asistencia = asistenciaService.procesarMarcajeHardware(dto);
            return new ResponseEntity<>(asistencia, HttpStatus.OK);

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}