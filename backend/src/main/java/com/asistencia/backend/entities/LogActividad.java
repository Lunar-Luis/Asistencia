package com.asistencia.backend.entities;

import jakarta.persistence.*; // Importa @Id, @Entity, @Table, etc.
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "logs_actividad")
public class LogActividad {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String usuario;
    private String accion;
    private String detalle;
    private LocalDateTime fecha = LocalDateTime.now();
}