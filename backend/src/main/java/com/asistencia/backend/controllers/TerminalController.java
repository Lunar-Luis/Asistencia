package com.asistencia.backend.controllers;

import com.asistencia.backend.entities.Terminal;
import com.asistencia.backend.services.TerminalService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/terminales")
@CrossOrigin(origins = "*")
public class TerminalController {

    private final TerminalService terminalService;

    public TerminalController(TerminalService terminalService) {
        this.terminalService = terminalService;
    }

    @GetMapping
    public ResponseEntity<List<Terminal>> listarTerminales() {
        return ResponseEntity.ok(terminalService.obtenerTerminalesActivas());
    }

    @PostMapping
    public ResponseEntity<Terminal> crearTerminal(@RequestBody Terminal terminal) {
        return new ResponseEntity<>(terminalService.crearTerminal(terminal), HttpStatus.CREATED);
    }

    // Endpoint para que React active o desactive el enrolamiento
    @PatchMapping("/{id}/enrolamiento")
    public ResponseEntity<Terminal> toggleEnrolamiento(@PathVariable Long id, @RequestParam boolean estado) {
        return ResponseEntity.ok(terminalService.cambiarModoEnrolamiento(id, estado));
    }
}