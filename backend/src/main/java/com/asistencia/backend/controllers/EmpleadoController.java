package com.asistencia.backend.controllers;

import com.asistencia.backend.dtos.EmpleadoRequestDTO;
import com.asistencia.backend.entities.Empleado;
import com.asistencia.backend.services.EmpleadoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/empleados")
@CrossOrigin(origins = "*")
public class EmpleadoController {

    private final EmpleadoService empleadoService;

    public EmpleadoController(EmpleadoService empleadoService) {
        this.empleadoService = empleadoService;
    }

    @GetMapping
    public ResponseEntity<List<Empleado>> listarEmpleados() {
        return ResponseEntity.ok(empleadoService.obtenerEmpleadosActivos());
    }

    @PostMapping
    public ResponseEntity<Empleado> crearEmpleado(@RequestBody EmpleadoRequestDTO dto) {
        return new ResponseEntity<>(empleadoService.crearEmpleado(dto), HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> desactivarEmpleado(@PathVariable Long id) {
        empleadoService.desactivarEmpleado(id);
        return ResponseEntity.noContent().build();
    }
}