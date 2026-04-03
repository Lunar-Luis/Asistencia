package com.asistencia.backend.entities;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalTime;

@Entity
@Table(name = "horarios")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Horario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String nombre;

    @Column(name = "hora_entrada", nullable = false)
    private LocalTime horaEntrada;

    @Column(name = "hora_salida", nullable = false)
    private LocalTime horaSalida;

    @Column(name = "tolerancia_minutos", nullable = false)
    private Integer toleranciaMinutos;

    @Column(name = "dias_laborables")
    private String diasLaborables; // Guardaremos algo como "Lunes,Martes,Miercoles"

    @Column(nullable = false)
    private Boolean activo = true;
}