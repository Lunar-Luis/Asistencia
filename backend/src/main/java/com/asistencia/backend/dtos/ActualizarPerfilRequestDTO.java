package com.asistencia.backend.dtos;

public record ActualizarPerfilRequestDTO(
        String username,
        String email,
        String password,
        String avatarUrl
) {}