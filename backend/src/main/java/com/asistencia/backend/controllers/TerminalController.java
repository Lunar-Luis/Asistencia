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

    @PutMapping("/{id}")
    public ResponseEntity<Terminal> actualizarTerminal(@PathVariable Long id, @RequestBody Terminal terminal) {
        return ResponseEntity.ok(terminalService.actualizarTerminal(id, terminal));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> desactivarTerminal(@PathVariable Long id) {
        terminalService.desactivarTerminal(id);
        return ResponseEntity.noContent().build();
    }

    // Endpoint público para que el ESP32 mande el ping sin necesidad de token JWT
    @PostMapping("/hardware/ping")
    public ResponseEntity<String> recibirPing(@RequestBody java.util.Map<String, String> payload) {
        String mac = payload.get("macAddress");
        if (mac != null && !mac.isEmpty()) {
            terminalService.reportarPing(mac);
            return ResponseEntity.ok("Ping recibido");
        }
        return ResponseEntity.badRequest().body("Falta macAddress");
    }
}