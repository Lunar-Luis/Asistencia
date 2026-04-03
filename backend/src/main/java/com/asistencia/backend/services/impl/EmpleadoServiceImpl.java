package com.asistencia.backend.services.impl;

import com.asistencia.backend.dtos.EmpleadoRequestDTO;
import com.asistencia.backend.entities.Cargo;
import com.asistencia.backend.entities.Empleado;
import com.asistencia.backend.entities.Horario;
import com.asistencia.backend.repositories.EmpleadoRepository;
import com.asistencia.backend.services.CargoService;
import com.asistencia.backend.services.EmpleadoService;
import com.asistencia.backend.services.HorarioService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class EmpleadoServiceImpl implements EmpleadoService {

    private final EmpleadoRepository empleadoRepository;
    private final CargoService cargoService;
    private final HorarioService horarioService;

    public EmpleadoServiceImpl(EmpleadoRepository empleadoRepository,
                               CargoService cargoService,
                               HorarioService horarioService) {
        this.empleadoRepository = empleadoRepository;
        this.cargoService = cargoService;
        this.horarioService = horarioService;
    }

    @Override
    public List<Empleado> obtenerEmpleadosActivos() {
        return empleadoRepository.findAllByActivoTrue();
    }

    @Override
    public Empleado obtenerPorId(Long id) {
        return empleadoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Empleado no encontrado con ID: " + id));
    }

    @Override
    public Empleado crearEmpleado(EmpleadoRequestDTO dto) {
        // 1. Buscamos el Cargo y el Horario en la base de datos
        Cargo cargo = cargoService.obtenerPorId(dto.cargoId());
        Horario horario = horarioService.obtenerPorId(dto.horarioId());

        // 2. Armamos el nuevo empleado
        Empleado nuevoEmpleado = Empleado.builder()
                .nombre(dto.nombre())
                .apellido(dto.apellido())
                .cedula(dto.cedula())
                .correo(dto.correo())
                .telefono(dto.telefono())
                .nfcUid(dto.nfcUid())
                .fechaIngreso(LocalDate.now()) // Se pone la fecha de hoy automáticamente
                .activo(true)
                .cargo(cargo)
                .horario(horario)
                .build();

        // 3. Lo guardamos
        return empleadoRepository.save(nuevoEmpleado);
    }

    @Override
    public void desactivarEmpleado(Long id) {
        Empleado empleado = obtenerPorId(id);
        empleado.setActivo(false);
        empleadoRepository.save(empleado);
    }
}