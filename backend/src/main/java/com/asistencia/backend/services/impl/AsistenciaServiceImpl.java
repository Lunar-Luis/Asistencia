package com.asistencia.backend.services.impl;

import com.asistencia.backend.dtos.MarcajeHardwareDTO;
import com.asistencia.backend.dtos.DashboardResumenDTO;
import com.asistencia.backend.entities.Asistencia;
import com.asistencia.backend.entities.Empleado;
import com.asistencia.backend.entities.Horario;
import com.asistencia.backend.entities.Terminal;
import com.asistencia.backend.enums.EstadoAsistencia;
import com.asistencia.backend.repositories.AsistenciaRepository;
import com.asistencia.backend.repositories.EmpleadoRepository;
import com.asistencia.backend.repositories.TerminalRepository;
import com.asistencia.backend.services.AsistenciaService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AsistenciaServiceImpl implements AsistenciaService {

    private final AsistenciaRepository asistenciaRepository;
    private final EmpleadoRepository empleadoRepository;
    private final TerminalRepository terminalRepository;

    @Override
    public List<Asistencia> obtenerTodas() {
        return asistenciaRepository.findAll();
    }

    @Override
    public Asistencia procesarMarcajeHardware(MarcajeHardwareDTO dto) {
        Terminal terminal = terminalRepository.findByMacAddressAndActivoTrue(dto.macAddress())
                .orElseThrow(() -> new RuntimeException("Terminal no registrada o inactiva"));

        Empleado empleado = empleadoRepository.findByNfcUidAndActivoTrue(dto.nfcUid())
                .orElseThrow(() -> new RuntimeException("Tarjeta NFC no reconocida"));

        LocalDateTime ahora = LocalDateTime.now();
        LocalDate hoy = ahora.toLocalDate();

        Optional<Asistencia> registroDeHoy = asistenciaRepository.findByEmpleadoIdAndFechaRegistro(empleado.getId(), hoy);

        if (registroDeHoy.isEmpty()) {
            return registrarEntrada(empleado, terminal, ahora, hoy, dto.fotoUrl());
        } else {
            Asistencia asistencia = registroDeHoy.get();

            if (asistencia.getEstadoEntrada() == EstadoAsistencia.AUSENTE) {
                throw new RuntimeException("Límite de tiempo excedido. El sistema ya registró una ausencia automática para hoy.");
            }

            if (asistencia.getMarcaSalida() == null) {
                long minutosTranscurridos = Duration.between(asistencia.getMarcaEntrada(), ahora).toMinutes();

                if (minutosTranscurridos < 15) {
                    throw new RuntimeException("Doble lectura detectada. Deben pasar al menos 15 minutos para marcar salida.");
                }

                return registrarSalida(asistencia, ahora, dto.fotoUrl());
            } else {
                throw new RuntimeException("El empleado ya completó su jornada de hoy.");
            }
        }
    }

    private Asistencia registrarEntrada(Empleado empleado, Terminal terminal, LocalDateTime ahora, LocalDate hoy, String fotoUrl) {
        Horario horario = empleado.getHorario();
        LocalTime horaRealEntrada = ahora.toLocalTime();
        LocalTime limiteAceptable = horario.getHoraEntrada().plusMinutes(horario.getToleranciaMinutos());

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

        Duration duracion = Duration.between(asistencia.getMarcaEntrada(), ahora);
        int minutosTotales = (int) duracion.toMinutes();

        asistencia.setHorasTrabajadas(minutosTotales);

        return asistenciaRepository.save(asistencia);
    }

    @Override
    public DashboardResumenDTO obtenerResumenDashboard() {
        LocalDate hoy = LocalDate.now();
        long totalEmpleados = empleadoRepository.countByActivoTrue();

        List<Asistencia> asistenciasHoy = asistenciaRepository.findAllByFechaRegistro(hoy);

        long aTiempoHoy = asistenciasHoy.stream().filter(a -> a.getEstadoEntrada() == EstadoAsistencia.A_TIEMPO).count();
        long tardeHoy = asistenciasHoy.stream().filter(a -> a.getEstadoEntrada() == EstadoAsistencia.TARDE).count();

        long presentesHoy = aTiempoHoy + tardeHoy;
        long ausentesHoy = Math.max(0, totalEmpleados - presentesHoy);

        java.util.List<com.asistencia.backend.dtos.ChartDataDTO> chartData = new java.util.ArrayList<>();

        for (int i = 4; i >= 0; i--) {
            LocalDate fechaIteracion = hoy.minusDays(i);
            List<Asistencia> asisDia = asistenciaRepository.findAllByFechaRegistro(fechaIteracion);

            long aTiempoDia = asisDia.stream().filter(a -> a.getEstadoEntrada() == EstadoAsistencia.A_TIEMPO).count();
            long tardeDia = asisDia.stream().filter(a -> a.getEstadoEntrada() == EstadoAsistencia.TARDE).count();

            long presentesDia = aTiempoDia + tardeDia;
            long ausentesDia = Math.max(0, totalEmpleados - presentesDia);

            String nombreDia = java.time.format.DateTimeFormatter.ofPattern("EEEE", new java.util.Locale("es", "ES")).format(fechaIteracion);
            nombreDia = nombreDia.substring(0, 1).toUpperCase() + nombreDia.substring(1);

            if (i == 0) nombreDia = "Hoy";

            chartData.add(com.asistencia.backend.dtos.ChartDataDTO.builder()
                    .dia(nombreDia)
                    .aTiempo(aTiempoDia)
                    .tarde(tardeDia)
                    .ausentes(ausentesDia)
                    .build());
        }

        return DashboardResumenDTO.builder()
                .totalEmpleados(totalEmpleados)
                .presentesHoy(presentesHoy)
                .tardeHoy(tardeHoy)
                .ausentesHoy(ausentesHoy)
                .chartData(chartData)
                .build();
    }
}