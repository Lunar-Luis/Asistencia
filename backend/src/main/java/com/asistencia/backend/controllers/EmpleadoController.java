package com.asistencia.backend.controllers;

import com.asistencia.backend.dtos.EmpleadoRequestDTO;
import com.asistencia.backend.entities.Empleado;
import com.asistencia.backend.services.EmpleadoService;
import com.asistencia.backend.services.HardwareRegistroService;
import jakarta.validation.Valid; // <--- NUEVO IMPORT DE VALIDACIÓN
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/empleados")
@RequiredArgsConstructor
public class EmpleadoController {

    private final EmpleadoService empleadoService;
    private final HardwareRegistroService hardwareRegistroService;

    @GetMapping
    public ResponseEntity<List<Empleado>> listarEmpleados() {
        return ResponseEntity.ok(empleadoService.obtenerEmpleadosActivos());
    }

    // ---> ESCUDO @Valid ACTIVADO AQUÍ <---
    @PostMapping
    public ResponseEntity<Empleado> crearEmpleado(@Valid @RequestBody EmpleadoRequestDTO dto) {
        return new ResponseEntity<>(empleadoService.crearEmpleado(dto), HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> desactivarEmpleado(@PathVariable Long id) {
        empleadoService.desactivarEmpleado(id);
        return ResponseEntity.noContent().build();
    }

    // ---> ESCUDO @Valid ACTIVADO AQUÍ <---
    @PutMapping("/{id}")
    public ResponseEntity<Empleado> actualizarEmpleado(@PathVariable Long id, @Valid @RequestBody EmpleadoRequestDTO dto) {
        return ResponseEntity.ok(empleadoService.actualizarEmpleado(id, dto));
    }

    @PostMapping("/hardware/activar-modo-registro")
    public ResponseEntity<Map<String, String>> activarModoRegistro() {
        hardwareRegistroService.activarModoRegistro();
        return ResponseEntity.ok(Map.of("mensaje", "Modo registro activado por 15 segundos"));
    }

    @GetMapping("/hardware/leer-registro")
    public ResponseEntity<Map<String, String>> obtenerUltimoEscaneo() {
        String uid = hardwareRegistroService.obtenerYLimpiarUltimoEscaneo();
        return ResponseEntity.ok(Map.of("nfcUid", uid));
    }
}