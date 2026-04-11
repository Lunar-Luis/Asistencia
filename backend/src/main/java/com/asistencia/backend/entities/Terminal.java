package com.asistencia.backend.entities;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "terminales")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Terminal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "mac_address", unique = true, nullable = false)
    private String macAddress; // El ID físico del ESP32

    @Column(nullable = false)
    private String nombre; // Ej: "Lector Principal"

    @Column
    private String ubicacion; // Ej: "Entrada Principal"

    @Column(name = "ultimo_ping")
    private LocalDateTime ultimoPing; // Para saber si está online

    @Column(nullable = false)
    private Boolean activo = true;
}