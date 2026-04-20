package com.asistencia.backend.services.impl;

import com.asistencia.backend.dtos.EmpleadoRequestDTO;
import com.asistencia.backend.entities.Cargo;
import com.asistencia.backend.entities.Empleado;
import com.asistencia.backend.entities.Horario;
import com.asistencia.backend.repositories.EmpleadoRepository;
import com.asistencia.backend.services.CargoService;
import com.asistencia.backend.services.EmpleadoService;
import com.asistencia.backend.services.HorarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EmpleadoServiceImpl implements EmpleadoService {

    private final EmpleadoRepository empleadoRepository;
    private final CargoService cargoService;
    private final HorarioService horarioService;

    @Override
    public List<Empleado> obtenerEmpleadosActivos() {
        return empleadoRepository.findAll();
    }

    @Override
    public Empleado obtenerPorId(Long id) {
        return empleadoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Empleado no encontrado con ID: " + id));
    }

    @Override
    public Empleado crearEmpleado(EmpleadoRequestDTO dto) {
        Cargo cargo = cargoService.obtenerPorId(dto.cargoId());
        Horario horario = horarioService.obtenerPorId(dto.horarioId());

        // ---> LA MAGIA ESTÁ AQUÍ: Si viene vacío, lo volvemos "null" <---
        String nfcLimpio = (dto.nfcUid() != null && dto.nfcUid().trim().isEmpty()) ? null : dto.nfcUid();

        Empleado nuevoEmpleado = Empleado.builder()
                .nombre(dto.nombre())
                .apellido(dto.apellido())
                .cedula(dto.cedula())
                .correo(dto.correo())
                .telefono(dto.telefono())
                .nfcUid(nfcLimpio) // <-- Usamos el nfc limpio
                .fotoUrl(dto.fotoUrl())
                .fechaIngreso(LocalDate.now())
                .activo(true)
                .cargo(cargo)
                .horario(horario)
                .build();

        return empleadoRepository.save(nuevoEmpleado);
    }

    @Override
    public Empleado actualizarEmpleado(Long id, EmpleadoRequestDTO dto) {
        Empleado empleadoExistente = obtenerPorId(id);
        Cargo cargo = cargoService.obtenerPorId(dto.cargoId());
        Horario horario = horarioService.obtenerPorId(dto.horarioId());

        // ---> LA MISMA LIMPIEZA PARA ACTUALIZAR <---
        String nfcLimpio = (dto.nfcUid() != null && dto.nfcUid().trim().isEmpty()) ? null : dto.nfcUid();

        empleadoExistente.setNombre(dto.nombre());
        empleadoExistente.setApellido(dto.apellido());
        empleadoExistente.setCedula(dto.cedula());
        empleadoExistente.setCorreo(dto.correo());
        empleadoExistente.setTelefono(dto.telefono());
        empleadoExistente.setNfcUid(nfcLimpio); // <-- Usamos el nfc limpio
        empleadoExistente.setFotoUrl(dto.fotoUrl());
        empleadoExistente.setCargo(cargo);
        empleadoExistente.setHorario(horario);

        if (dto.activo() != null) {
            empleadoExistente.setActivo(dto.activo());
        }

        return empleadoRepository.save(empleadoExistente);
    }

    @Override
    public void desactivarEmpleado(Long id) {
        Empleado empleado = obtenerPorId(id);
        empleado.setActivo(false);
        empleadoRepository.save(empleado);
    }
}