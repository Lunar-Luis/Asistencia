package com.asistencia.backend.controllers;

import com.asistencia.backend.dtos.EmpleadoRequestDTO;
import com.asistencia.backend.entities.Empleado;
import com.asistencia.backend.services.EmpleadoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Timer;
import java.util.TimerTask;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/empleados")
@CrossOrigin(origins = "*")
public class EmpleadoController {

    // ========================================================
    // VARIABLES PARA LA SALA DE ESPERA TEMPORAL DEL UID
    // ========================================================
    private static String ultimoUidEscaneado = "";
    private static boolean modoRegistroActivo = false;// Nos indica si React está esperando una tarjeta

    private final EmpleadoService empleadoService;

    public static boolean isModoRegistroGlobalActivo() {
        return modoRegistroActivo;
    }

    public EmpleadoController(EmpleadoService empleadoService) {
        this.empleadoService = empleadoService;
    }

    // ========================================================
    // ENDPOINTS ESTÁNDAR (CRUD)
    // ========================================================
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

    @PutMapping("/{id}")
    public ResponseEntity<Empleado> actualizarEmpleado(@PathVariable Long id, @RequestBody EmpleadoRequestDTO dto) {
        return ResponseEntity.ok(empleadoService.actualizarEmpleado(id, dto));
    }

    // ========================================================
    // LÓGICA DE HARDWARE (MODO REGISTRO CONTROLADO POR REACT)
    // ========================================================

    // ---> 1. REACT ACTIVA EL MODO REGISTRO (Al darle "Escanear Tarjeta") <---
    @PostMapping("/hardware/activar-modo-registro")
    public ResponseEntity<Map<String, String>> activarModoRegistro() {
        modoRegistroActivo = true; // Asumiendo que ya la hiciste estática
        ultimoUidEscaneado = "";

        // ---> AVISAMOS A LA ESP32 AL INSTANTE <---
        com.asistencia.backend.config.TerminalWebSocketHandler.enviarComandoGlobal("{\"comando\": \"SYS_REGISTRO\"}");

        // El modo registro se apaga automáticamente después de 15 segundos
        new Timer().schedule(
                new TimerTask() {
                    @Override
                    public void run() {
                        modoRegistroActivo = false;
                        // ---> AVISAMOS QUE SE ACABÓ EL TIEMPO <---
                        com.asistencia.backend.config.TerminalWebSocketHandler.enviarComandoGlobal("{\"comando\": \"SYS_ASISTENCIA\"}");
                    }
                },
                15000
        );

        Map<String, String> response = new HashMap<>();
        response.put("mensaje", "Modo registro activado por 15 segundos");
        return ResponseEntity.ok(response);
    }

    // ---> 2. EL CONTROLADOR DE ASISTENCIA LLAMA A ESTE MÉTODO <---
    // (Este NO es un endpoint @PostMapping. Es público para que AsistenciaController lo use)
    public boolean procesarPosibleRegistro(String uid) {
        if (this.modoRegistroActivo) {
            // Si estábamos esperando una tarjeta, la guardamos aquí
            this.ultimoUidEscaneado = uid;
            this.modoRegistroActivo = false; // Apagamos el modo porque ya tenemos la tarjeta
            return true; // Le decimos a AsistenciaController: "Sí, era un registro, aborta la asistencia"
        }
        return false; // Le decimos a AsistenciaController: "No era registro, procesa la asistencia normal"
    }

    // ---> 3. REACT PREGUNTA SI YA LLEGÓ LA TARJETA <---
    @GetMapping("/hardware/leer-registro")
    public ResponseEntity<Map<String, String>> obtenerUltimoEscaneo() {
        Map<String, String> response = new HashMap<>();

        if (!ultimoUidEscaneado.isEmpty()) {
            // Entregamos la tarjeta a React
            response.put("nfcUid", ultimoUidEscaneado);
            // La borramos de la memoria temporal para que no se lea dos veces
            ultimoUidEscaneado = "";
        } else {
            response.put("nfcUid", "");
        }
        return ResponseEntity.ok(response);
    }
}