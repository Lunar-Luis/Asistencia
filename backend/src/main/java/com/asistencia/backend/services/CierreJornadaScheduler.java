package com.asistencia.backend.services;

import com.asistencia.backend.entities.Asistencia;
import com.asistencia.backend.entities.Empleado;
import com.asistencia.backend.entities.Horario;
import com.asistencia.backend.entities.Terminal;
import com.asistencia.backend.enums.EstadoAsistencia;
import com.asistencia.backend.repositories.AsistenciaRepository;
import com.asistencia.backend.repositories.EmpleadoRepository;
import com.asistencia.backend.repositories.TerminalRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Service
public class CierreJornadaScheduler {

    private final AsistenciaRepository asistenciaRepository;
    private final EmpleadoRepository empleadoRepository;
    private final TerminalRepository terminalRepository;

    public CierreJornadaScheduler(AsistenciaRepository asistenciaRepository, EmpleadoRepository empleadoRepository, TerminalRepository terminalRepository) {
        this.asistenciaRepository = asistenciaRepository;
        this.empleadoRepository = empleadoRepository;
        this.terminalRepository = terminalRepository;
    }

    /**
     * Esta tarea se ejecutará automáticamente TODOS LOS DÍAS a las 23:59:00
     * Expresión Cron: "Segundos Minutos Horas Día Mes DíaDeLaSemana"
     */
    @Scheduled(cron = "0 59 23 * * ?")
    @Transactional
    public void ejecutarCierreDeJornadaDiario() {
        System.out.println("INICIANDO CIERRE AUTOMÁTICO DE JORNADA...");

        LocalDate hoy = LocalDate.now();
        List<Empleado> empleadosActivos = empleadoRepository.findAllByActivoTrue();

        // Obtenemos una terminal genérica (o la primera activa) para registrar a los ausentes.
        // Si no hay terminales, no podremos registrar ausencias.
        Optional<Terminal> terminalGenericaOpt = terminalRepository.findAll().stream().filter(Terminal::getActivo).findFirst();

        if (terminalGenericaOpt.isEmpty()) {
            System.err.println("Cierre abortado: No hay terminales activas en el sistema para registrar las inasistencias.");
            return;
        }

        Terminal terminalSistema = terminalGenericaOpt.get();

        for (Empleado empleado : empleadosActivos) {
            Optional<Asistencia> registroDeHoy = asistenciaRepository.findByEmpleadoIdAndFechaRegistro(empleado.getId(), hoy);

            if (registroDeHoy.isEmpty()) {
                // CASO 1: EL EMPLEADO NO VINO EN TODO EL DÍA (AUSENTE)
                marcarAusente(empleado, terminalSistema, hoy);
            } else {
                // CASO 2: VINO, PERO ¿MARCÓ SALIDA?
                Asistencia asistencia = registroDeHoy.get();
                if (asistencia.getMarcaSalida() == null && asistencia.getEstadoEntrada() != EstadoAsistencia.AUSENTE) {
                    forzarSalidaOficial(asistencia);
                }
            }
        }

        System.out.println("CIERRE AUTOMÁTICO FINALIZADO CON ÉXITO.");
    }

    private void marcarAusente(Empleado empleado, Terminal terminal, LocalDate fecha) {
        Horario horario = empleado.getHorario();
        // Para que quede registro visual, marcamos la entrada a la hora que DEBÍA llegar
        LocalDateTime supuestaEntrada = LocalDateTime.of(fecha, horario.getHoraEntrada());

        Asistencia ausencia = Asistencia.builder()
                .empleado(empleado)
                .terminal(terminal)
                .fechaRegistro(fecha)
                .marcaEntrada(supuestaEntrada)
                .estadoEntrada(EstadoAsistencia.AUSENTE)
                .horasTrabajadas(0) // 0 minutos trabajados
                .fotoEntradaUrl("SISTEMA_AUTOMATICO")
                .build();

        asistenciaRepository.save(ausencia);
    }

    private void forzarSalidaOficial(Asistencia asistencia) {
        Horario horario = asistencia.getEmpleado().getHorario();
        LocalDate fecha = asistencia.getFechaRegistro();

        // Calculamos la hora de salida ideal según su horario
        LocalTime horaSalidaIdeal = horario.getHoraSalida();
        LocalDateTime marcaSalidaAutomatica = LocalDateTime.of(fecha, horaSalidaIdeal);

        // Validar: ¿Qué pasa si el empleado entró MÁS TARDE que su hora de salida oficial?
        // (Por ejemplo, un error o turno extraño). Evitamos horas negativas.
        if (marcaSalidaAutomatica.isBefore(asistencia.getMarcaEntrada())) {
            marcaSalidaAutomatica = asistencia.getMarcaEntrada().plusMinutes(1);
        }

        asistencia.setMarcaSalida(marcaSalidaAutomatica);
        asistencia.setFotoSalidaUrl("CIERRE_AUTOMATICO");

        // Calculamos minutos totales basados en esta salida automática
        Duration duracion = Duration.between(asistencia.getMarcaEntrada(), marcaSalidaAutomatica);
        int minutosTotales = (int) duracion.toMinutes();

        asistencia.setHorasTrabajadas(minutosTotales);
        asistenciaRepository.save(asistencia);
    }
}