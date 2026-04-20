package com.asistencia.backend.controllers;

import com.asistencia.backend.entities.Terminal;
import com.asistencia.backend.services.HardwareRegistroService;
import com.asistencia.backend.services.TerminalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/terminales")
@RequiredArgsConstructor
public class TerminalController {

    private final TerminalService terminalService;
    private final HardwareRegistroService hardwareRegistroService; // Inyectamos el nuevo servicio

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
    public ResponseEntity<Map<String, String>> recibirPing(@RequestBody Map<String, String> payload) {
        String mac = payload.get("macAddress");
        Map<String, String> response = new HashMap<>();

        if (mac != null && !mac.isEmpty()) {
            terminalService.reportarPing(mac);

            // ---> AHORA USAMOS EL SERVICIO DE HARDWARE <---
            if (hardwareRegistroService.isModoRegistroActivo()) {
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