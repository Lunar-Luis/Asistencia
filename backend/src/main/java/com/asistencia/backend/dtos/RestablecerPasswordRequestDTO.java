package com.asistencia.backend.dtos;

public record RestablecerPasswordRequestDTO(String token, String nuevaPassword) {}