package com.asistencia.backend.services.impl;

import com.asistencia.backend.entities.Horario;
import com.asistencia.backend.repositories.HorarioRepository;
import com.asistencia.backend.services.HorarioService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HorarioServiceImpl implements HorarioService {

    private final HorarioRepository horarioRepository;

    public HorarioServiceImpl(HorarioRepository horarioRepository) {
        this.horarioRepository = horarioRepository;
    }

    @Override
    public List<Horario> obtenerHorariosActivos() {
        return horarioRepository.findAllByActivoTrue();
    }

    @Override
    public Horario obtenerPorId(Long id) {
        return horarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Error: Horario no encontrado con ID: " + id));
    }

    @Override
    public Horario crearHorario(Horario horario) {
        horario.setActivo(true);
        return horarioRepository.save(horario);
    }

    @Override
    public Horario actualizarHorario(Long id, Horario detalles) {
        Horario horario = obtenerPorId(id);
        horario.setNombre(detalles.getNombre());
        horario.setHoraEntrada(detalles.getHoraEntrada());
        horario.setHoraSalida(detalles.getHoraSalida());
        horario.setToleranciaMinutos(detalles.getToleranciaMinutos());
        horario.setDiasLaborables(detalles.getDiasLaborables());
        return horarioRepository.save(horario);
    }

    @Override
    public void desactivarHorario(Long id) {
        Horario horario = obtenerPorId(id);
        horario.setActivo(false);
        horarioRepository.save(horario);
    }
}