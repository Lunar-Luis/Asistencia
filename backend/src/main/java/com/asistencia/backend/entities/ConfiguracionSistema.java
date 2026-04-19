package com.asistencia.backend.entities;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "configuracion_sistema")
public class ConfiguracionSistema {

    @Id
    private Long id = 1L; // Siempre será 1, es un Singleton en BD

    @Column(name = "cierre_automatico")
    private boolean cierreAutomatico = true;

    @Column(name = "alertas_retraso")
    private boolean lateAlerts = true;

    @Column(name = "reportes_semanales")
    private boolean weeklyReports = true;

    @Column(name = "registro_actividad")
    private boolean activityLog = true;
}