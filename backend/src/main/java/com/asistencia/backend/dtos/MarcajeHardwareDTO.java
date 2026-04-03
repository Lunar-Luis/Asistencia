package com.asistencia.backend.dtos;

public record MarcajeHardwareDTO(
        String macAddress, // Para saber de qué puerta viene
        String nfcUid,     // La tarjeta que se pasó
        String fotoUrl     // (Opcional) si la cámara capturó algo
) {}