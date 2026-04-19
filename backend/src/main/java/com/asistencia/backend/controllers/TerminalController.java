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

    // Endpoint público para que el ESP32 mande el ping y reciba comandos
    @PostMapping("/hardware/ping")
    public ResponseEntity<java.util.Map<String, String>> recibirPing(@RequestBody java.util.Map<String, String> payload) {
        String mac = payload.get("macAddress");
        java.util.Map<String, String> response = new java.util.HashMap<>();

        if (mac != null && !mac.isEmpty()) {
            terminalService.reportarPing(mac);

            // Verificamos el estado global del sistema
            if (EmpleadoController.isModoRegistroGlobalActivo()) {
                response.put("comando", "SYS_REGISTRO");
            } else {
                response.put("comando", "SYS_ASISTENCIA");
            }

            return ResponseEntity.ok(response);
        }

        response.put("error", "Falta macAddress");
        return ResponseEntity.badRequest().body(response);
    }
}