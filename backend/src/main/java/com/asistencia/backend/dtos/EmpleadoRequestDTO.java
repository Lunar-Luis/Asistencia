package com.asistencia.backend.dtos;

// Un DTO es un objeto "tonto" que solo sirve para transportar datos desde Postman al Controlador
public record EmpleadoRequestDTO(
        String nombre,
        String apellido,
        String cedula,
        String correo,
        String telefono,
        String nfcUid,
        Long cargoId,
        Long horarioId
) {}