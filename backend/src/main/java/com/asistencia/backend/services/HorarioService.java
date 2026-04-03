package com.asistencia.backend.services;

import com.asistencia.backend.entities.Horario;
import java.util.List;

public interface HorarioService {
    List<Horario> obtenerHorariosActivos();
    Horario obtenerPorId(Long id);
    Horario crearHorario(Horario horario);
    Horario actualizarHorario(Long id, Horario horario);
    void desactivarHorario(Long id);
}