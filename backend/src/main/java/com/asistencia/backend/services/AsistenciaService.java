package com.asistencia.backend.services;

import com.asistencia.backend.dtos.MarcajeHardwareDTO;
import com.asistencia.backend.entities.Asistencia;
import com.asistencia.backend.dtos.DashboardResumenDTO;

import java.util.List;

public interface AsistenciaService {
    List<Asistencia> obtenerTodas();
    Asistencia procesarMarcajeHardware(MarcajeHardwareDTO dto);

    // ---> NUEVO: Para el dashboard <---
    DashboardResumenDTO obtenerResumenDashboard();
}