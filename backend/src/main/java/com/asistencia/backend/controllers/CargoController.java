package com.asistencia.backend.controllers;

import com.asistencia.backend.entities.Cargo;
import com.asistencia.backend.services.CargoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cargos")
@CrossOrigin(origins = "*")
public class CargoController {

    private final CargoService cargoService;

    public CargoController(CargoService cargoService) {
        this.cargoService = cargoService;
    }

    @GetMapping
    public ResponseEntity<List<Cargo>> listarCargos() {
        return ResponseEntity.ok(cargoService.obtenerCargosActivos());
    }

    @PostMapping
    public ResponseEntity<Cargo> crearCargo(@RequestBody Cargo cargo) {
        return new ResponseEntity<>(cargoService.crearCargo(cargo), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Cargo> actualizarCargo(@PathVariable Long id, @RequestBody Cargo cargo) {
        return ResponseEntity.ok(cargoService.actualizarCargo(id, cargo));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> desactivarCargo(@PathVariable Long id) {
        cargoService.desactivarCargo(id);
        return ResponseEntity.noContent().build();
    }
}