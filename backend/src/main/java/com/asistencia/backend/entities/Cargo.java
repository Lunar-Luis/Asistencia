package com.asistencia.backend.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "cargos")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Cargo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String nombre;

    private String descripcion;

    @Column(nullable = false)
    private Boolean activo = true;
}
