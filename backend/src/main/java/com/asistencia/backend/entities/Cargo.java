package com.asistencia.backend.entities;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Formula;

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

    // ---> 2. AGREGA ESTO <---
    // Ejecuta código SQL puro para contar los empleados vinculados a este cargo que estén activos
    @Formula("(SELECT COUNT(e.id) FROM empleados e WHERE e.cargo_id = id AND e.activo = true)")
    private Integer empleadosCount;
}
