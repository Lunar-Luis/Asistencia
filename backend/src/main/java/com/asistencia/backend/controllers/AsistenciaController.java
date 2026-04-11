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
    // 1. Inyectamos el controlador de empleados para poder hablar con él
    private final EmpleadoController empleadoController;

    public AsistenciaController(AsistenciaService asistenciaService, EmpleadoController empleadoController) {
        this.asistenciaService = asistenciaService;
        this.empleadoController = empleadoController;
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
            // ---> NUEVA LÓGICA: INTERCEPTAR TARJETA SI ESTAMOS EN MODO REGISTRO <---

            // Nota: Si tu MarcajeHardwareDTO es un 'record', cambia .getNfcUid() por .nfcUid()
            String uid = dto.nfcUid();

            // Le preguntamos al EmpleadoController si la jefa estaba esperando esta tarjeta
            if (empleadoController.procesarPosibleRegistro(uid)) {
                // Si la respuesta es TRUE, la tarjeta se guardó en la "sala de espera" para React.
                // Abortamos la asistencia y le respondemos al ESP32 con éxito.
                return ResponseEntity.ok("Tarjeta atrapada con éxito para registro de nuevo empleado");
            }

            // =========================================================================
            // Si la respuesta fue FALSE (no estábamos esperando registrar a nadie),
            // el código continúa normalmente y marca la asistencia.
            // =========================================================================

            Asistencia asistencia = asistenciaService.procesarMarcajeHardware(dto);
            return new ResponseEntity<>(asistencia, HttpStatus.OK);

        } catch (RuntimeException e) {
            // Si hay error (ej: ya marcó salida, o tarjeta no existe), le respondemos al ESP32 con error 400
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}