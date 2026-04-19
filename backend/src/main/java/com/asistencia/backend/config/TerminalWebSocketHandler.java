package com.asistencia.backend.config;

import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import java.io.IOException;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

public class TerminalWebSocketHandler extends TextWebSocketHandler {

    // Lista de todas las terminales ESP32 conectadas en tiempo real
    private static final List<WebSocketSession> sesionesActivas = new CopyOnWriteArrayList<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        sesionesActivas.add(session);
        System.out.println("[WebSocket] Terminal ESP32 conectada. ID: " + session.getId());
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        sesionesActivas.remove(session);
        System.out.println("[WebSocket] Terminal ESP32 desconectada. ID: " + session.getId());
    }

    // Método que usaremos para "empujar" la orden a la ESP32 al instante
    public static void enviarComandoGlobal(String jsonPayload) {
        for (WebSocketSession session : sesionesActivas) {
            try {
                if (session.isOpen()) {
                    session.sendMessage(new TextMessage(jsonPayload));
                }
            } catch (IOException e) {
                System.err.println("Error enviando WS a ESP32: " + e.getMessage());
            }
        }
    }
}