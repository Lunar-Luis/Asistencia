package com.asistencia.backend.services;

import com.asistencia.backend.entities.Cargo;
import java.util.List;

public interface CargoService {
    List<Cargo> obtenerCargosActivos();
    Cargo obtenerPorId(Long id);
    Cargo crearCargo(Cargo cargo);
    Cargo actualizarCargo(Long id, Cargo cargo);
    void desactivarCargo(Long id);
}