package com.asistencia.backend.entities;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "empleados")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Empleado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private String apellido;

    @Column(unique = true, nullable = false)
    private String cedula;

    @Column(unique = true)
    private String correo;

    private String telefono;

    @Column(name = "nfc_uid", unique = true)
    private String nfcUid; // Aquí guardaremos el código de la tarjeta física

    @Column(name = "foto_url")
    private String fotoUrl;

    @Column(name = "fecha_ingreso")
    private LocalDate fechaIngreso;

    @Column(nullable = false)
    private Boolean activo = true;

    // Relación: Muchos Empleados tienen Un Cargo
    @ManyToOne
    @JoinColumn(name = "cargo_id", nullable = false)
    private Cargo cargo;

    // Relación: Muchos Empleados tienen Un Horario
    @ManyToOne
    @JoinColumn(name = "horario_id", nullable = false)
    private Horario horario;
}