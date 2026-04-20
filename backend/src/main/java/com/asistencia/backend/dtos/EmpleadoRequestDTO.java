package com.asistencia.backend.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public record EmpleadoRequestDTO(

        @NotBlank(message = "El nombre es obligatorio")
        String nombre,

        @NotBlank(message = "El apellido es obligatorio")
        String apellido,

        @NotBlank(message = "La cédula es obligatoria")
        @Pattern(regexp = "^[0-9]+$", message = "La cédula solo debe contener números")
        String cedula,

        @NotBlank(message = "El correo es obligatorio")
        @Email(message = "El formato del correo no es válido (ejemplo@correo.com)")
        String correo,

        String telefono, // Lo dejamos sin anotaciones porque puede ser opcional

        String nfcUid,

        String fotoUrl,

        @NotNull(message = "Debe asignar un cargo válido")
        Long cargoId,

        @NotNull(message = "Debe asignar un horario válido")
        Long horarioId,

        Boolean activo
) {}