package com.asistencia.backend.services;

import com.asistencia.backend.dtos.MarcajeHardwareDTO;
import com.asistencia.backend.entities.Asistencia;
import java.util.List;

public interface AsistenciaService {
    List<Asistencia> obtenerTodas();
    Asistencia procesarMarcajeHardware(MarcajeHardwareDTO dto); // La función estrella
}