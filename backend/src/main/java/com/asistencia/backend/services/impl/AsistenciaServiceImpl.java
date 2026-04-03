package com.asistencia.backend.services.impl;

import com.asistencia.backend.dtos.MarcajeHardwareDTO;
import com.asistencia.backend.entities.Asistencia;
import com.asistencia.backend.entities.Empleado;
import com.asistencia.backend.entities.Horario;
import com.asistencia.backend.entities.Terminal;
import com.asistencia.backend.enums.EstadoAsistencia;
import com.asistencia.backend.repositories.AsistenciaRepository;
import com.asistencia.backend.repositories.EmpleadoRepository;
import com.asistencia.backend.repositories.TerminalRepository;
import com.asistencia.backend.services.AsistenciaService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Service
public class AsistenciaServiceImpl implements AsistenciaService {

    private final AsistenciaRepository asistenciaRepository;
    private final EmpleadoRepository empleadoRepository;
    private final TerminalRepository terminalRepository;

    public AsistenciaServiceImpl(AsistenciaRepository asistenciaRepository, EmpleadoRepository empleadoRepository, TerminalRepository terminalRepository) {
        this.asistenciaRepository = asistenciaRepository;
        this.empleadoRepository = empleadoRepository;
        this.terminalRepository = terminalRepository;
    }

    @Override
    public List<Asistencia> obtenerTodas() {
        return asistenciaRepository.findAll();
    }

    @Override
    public Asistencia procesarMarcajeHardware(MarcajeHardwareDTO dto) {
        Terminal terminal = terminalRepository.findByMacAddressAndActivoTrue(dto.macAddress())
                .orElseThrow(() -> new RuntimeException("Terminal no registrada o inactiva"));

        if (terminal.getModoEnrolamiento()) {
            throw new RuntimeException("La terminal está en modo enrolamiento, no se puede marcar asistencia.");
        }

        Empleado empleado = empleadoRepository.findByNfcUidAndActivoTrue(dto.nfcUid())
                .orElseThrow(() -> new RuntimeException("Tarjeta NFC no reconocida"));

        LocalDateTime ahora = LocalDateTime.now();
        LocalDate hoy = ahora.toLocalDate();

        Optional<Asistencia> registroDeHoy = asistenciaRepository.findByEmpleadoIdAndFechaRegistro(empleado.getId(), hoy);

        if (registroDeHoy.isEmpty()) {
            // === ES UNA ENTRADA ===
            return registrarEntrada(empleado, terminal, ahora, hoy, dto.fotoUrl());
        } else {
            Asistencia asistencia = registroDeHoy.get();
            if (asistencia.getMarcaSalida() == null) {

                // =================================================================
                // NUEVA VALIDACIÓN: TIEMPO MÍNIMO PARA SALIDA (Anti Doble-Tap)
                // =================================================================
                long minutosTranscurridos = Duration.between(asistencia.getMarcaEntrada(), ahora).toMinutes();

                // Aquí defines el tiempo mínimo. Puse 60 minutos como pediste.
                if (minutosTranscurridos < 60) {
                    throw new RuntimeException("Doble lectura detectada. Deben pasar al menos 60 minutos para marcar salida.");
                }
                // =================================================================

                // === ES UNA SALIDA ===
                return registrarSalida(asistencia, ahora, dto.fotoUrl());
            } else {
                // Ya marcó entrada y salida hoy
                throw new RuntimeException("El empleado ya completó su jornada de hoy.");
            }
        }
    }

    private Asistencia registrarEntrada(Empleado empleado, Terminal terminal, LocalDateTime ahora, LocalDate hoy, String fotoUrl) {
        Horario horario = empleado.getHorario();
        LocalTime horaRealEntrada = ahora.toLocalTime();

        // Calculamos el límite de tiempo sumando la tolerancia
        LocalTime limiteAceptable = horario.getHoraEntrada().plusMinutes(horario.getToleranciaMinutos());

        // Decidimos si llegó tarde
        EstadoAsistencia estado = horaRealEntrada.isAfter(limiteAceptable) ? EstadoAsistencia.TARDE : EstadoAsistencia.A_TIEMPO;

        Asistencia nuevaAsistencia = Asistencia.builder()
                .empleado(empleado)
                .terminal(terminal)
                .fechaRegistro(hoy)
                .marcaEntrada(ahora)
                .estadoEntrada(estado)
                .fotoEntradaUrl(fotoUrl)
                .build();

        return asistenciaRepository.save(nuevaAsistencia);
    }

    private Asistencia registrarSalida(Asistencia asistencia, LocalDateTime ahora, String fotoUrl) {
        asistencia.setMarcaSalida(ahora);
        asistencia.setFotoSalidaUrl(fotoUrl);

        // Calculamos horas trabajadas matemáticamente
        Duration duracion = Duration.between(asistencia.getMarcaEntrada(), ahora);
        double horas = duracion.toMinutes() / 60.0;

        // Redondeamos a 2 decimales (ej: 8.50 horas)
        BigDecimal horasTrabajadas = BigDecimal.valueOf(horas).setScale(2, RoundingMode.HALF_UP);
        asistencia.setHorasTrabajadas(horasTrabajadas);

        return asistenciaRepository.save(asistencia);
    }
}