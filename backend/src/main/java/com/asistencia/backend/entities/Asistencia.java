package com.asistencia.backend.entities;

import com.asistencia.backend.enums.EstadoAsistencia;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "asistencias")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Asistencia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "empleado_id", nullable = false)
    private Empleado empleado;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "terminal_id", nullable = false)
    private Terminal terminal;

    @Column(name = "fecha_registro", nullable = false)
    private LocalDate fechaRegistro;

    @Column(name = "marca_entrada", nullable = false)
    private LocalDateTime marcaEntrada;

    @Column(name = "marca_salida")
    private LocalDateTime marcaSalida;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado_entrada", nullable = false)
    private EstadoAsistencia estadoEntrada;

    @Column(name = "horas_trabajadas", precision = 5, scale = 2)
    private BigDecimal horasTrabajadas;

    @Column(name = "foto_entrada_url")
    private String fotoEntradaUrl;

    @Column(name = "foto_salida_url")
    private String fotoSalidaUrl;
}