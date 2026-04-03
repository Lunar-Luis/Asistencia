package com.asistencia.backend.services;

import com.asistencia.backend.dtos.EmpleadoRequestDTO;
import com.asistencia.backend.entities.Empleado;
import java.util.List;

public interface EmpleadoService {
    List<Empleado> obtenerEmpleadosActivos();
    Empleado obtenerPorId(Long id);
    Empleado crearEmpleado(EmpleadoRequestDTO dto);
    void desactivarEmpleado(Long id);
}