package com.asistencia.backend.services;

import com.asistencia.backend.entities.Asistencia;
import com.asistencia.backend.entities.ConfiguracionSistema;
import com.asistencia.backend.entities.Empleado;
import com.asistencia.backend.enums.EstadoAsistencia;
import com.asistencia.backend.repositories.AsistenciaRepository;
import com.asistencia.backend.repositories.ConfiguracionRepository;
import com.asistencia.backend.repositories.EmpleadoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class AsistenciaTaskService {

    private final AsistenciaRepository asistenciaRepository;
    private final EmpleadoRepository empleadoRepository;
    private final ConfiguracionRepository configuracionRepository;

    @Scheduled(cron = "0 0/15 * * * *") // Cada 15 minutos en producción
    public void marcarAusenciasAutomaticas() {
        ConfiguracionSistema config = configuracionRepository.findById(1L).orElse(null);
        if (config == null || !config.isCierreAutomatico()) return;

        log.debug("Ejecutando tarea: Revisión de ausencias automáticas");

        LocalDate hoy = LocalDate.now();
        LocalTime horaActual = LocalTime.now();
        List<Empleado> empleadosActivos = empleadoRepository.findAllByActivoTrue();

        for (Empleado emp : empleadosActivos) {
            if (emp.getHorario() == null) continue;

            LocalTime limiteEntrada = emp.getHorario().getHoraEntrada().plusHours(2);

            if (horaActual.isAfter(limiteEntrada)) {
                boolean yaTieneRegistro = asistenciaRepository
                        .findByEmpleadoIdAndFechaRegistro(emp.getId(), hoy)
                        .isPresent();

                if (!yaTieneRegistro) {
                    Asistencia ausencia = Asistencia.builder()
                            .empleado(emp)
                            .fechaRegistro(hoy)
                            .estadoEntrada(EstadoAsistencia.AUSENTE)
                            .marcaEntrada(null)
                            .build();

                    asistenciaRepository.save(ausencia);
                    log.warn("Empleado {} {} marcado como AUSENTE. Límite excedido.",
                            emp.getNombre(), emp.getApellido());
                }
            }
        }
    }
}