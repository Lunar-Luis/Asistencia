package com.asistencia.backend.services;

import com.asistencia.backend.config.TerminalWebSocketHandler;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
public class HardwareRegistroService {

    private String ultimoUidEscaneado = "";
    private boolean modoRegistroActivo = false;
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);

    public void activarModoRegistro() {
        this.modoRegistroActivo = true;
        this.ultimoUidEscaneado = "";

        TerminalWebSocketHandler.enviarComandoGlobal("{\"comando\": \"SYS_REGISTRO\"}");
        log.info("Modo registro de hardware activado por 15 segundos");

        // Usamos un hilo seguro administrado, en lugar del peligroso 'new Timer()'
        scheduler.schedule(() -> {
            if (this.modoRegistroActivo) {
                this.modoRegistroActivo = false;
                TerminalWebSocketHandler.enviarComandoGlobal("{\"comando\": \"SYS_ASISTENCIA\"}");
                log.info("Modo registro desactivado automáticamente por timeout");
            }
        }, 15, TimeUnit.SECONDS);
    }

    public boolean procesarPosibleRegistro(String uid) {
        if (this.modoRegistroActivo) {
            this.ultimoUidEscaneado = uid;
            this.modoRegistroActivo = false;
            log.info("Tarjeta atrapada para nuevo registro: {}", uid);
            return true;
        }
        return false;
    }

    public String obtenerYLimpiarUltimoEscaneo() {
        String uid = this.ultimoUidEscaneado;
        if (!uid.isEmpty()) {
            this.ultimoUidEscaneado = ""; // Limpiamos tras leer
        }
        return uid;
    }

    public boolean isModoRegistroActivo() {
        return this.modoRegistroActivo;
    }
}