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
    private String macAddress; // El ID físico e inmutable del ESP32

    @Column(nullable = false)
    private String nombre; // Ej: "Puerta Principal"

    @Column(name = "ip_local")
    private String ipLocal;

    @Column(name = "camara_stream_url")
    private String camaraStreamUrl;

    // Banderas para el enrolamiento remoto
    @Column(name = "modo_enrolamiento", nullable = false)
    private Boolean modoEnrolamiento = false;

    @Column(name = "ultimo_uid_leido")
    private String ultimoUidLeido;

    @Column(name = "ultimo_ping")
    private LocalDateTime ultimoPing; // Para saber si está online/offline

    @Column(nullable = false)
    private Boolean activo = true;
}