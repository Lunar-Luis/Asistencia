package com.asistencia.backend.controllers;

import com.asistencia.backend.entities.Horario;
import com.asistencia.backend.services.HorarioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/horarios")
@CrossOrigin(origins = "*")
public class HorarioController {

    private final HorarioService horarioService;

    public HorarioController(HorarioService horarioService) {
        this.horarioService = horarioService;
    }

    @GetMapping
    public ResponseEntity<List<Horario>> listarHorarios() {
        return ResponseEntity.ok(horarioService.obtenerHorariosActivos());
    }

    @PostMapping
    public ResponseEntity<Horario> crearHorario(@RequestBody Horario horario) {
        return new ResponseEntity<>(horarioService.crearHorario(horario), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Horario> actualizarHorario(@PathVariable Long id, @RequestBody Horario horario) {
        return ResponseEntity.ok(horarioService.actualizarHorario(id, horario));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> desactivarHorario(@PathVariable Long id) {
        horarioService.desactivarHorario(id);
        return ResponseEntity.noContent().build();
    }
}