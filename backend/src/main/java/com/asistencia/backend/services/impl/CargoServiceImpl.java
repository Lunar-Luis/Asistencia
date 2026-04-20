package com.asistencia.backend.services.impl;

import com.asistencia.backend.entities.Cargo;
import com.asistencia.backend.repositories.CargoRepository;
import com.asistencia.backend.services.CargoService;
import lombok.RequiredArgsConstructor; // <--- Importación de Lombok
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor // <--- Magia de Lombok
public class CargoServiceImpl implements CargoService {

    private final CargoRepository cargoRepository;

    // ¡Adiós al constructor manual!

    @Override
    public List<Cargo> obtenerCargosActivos() {
        return cargoRepository.findAll();
    }

    @Override
    public Cargo obtenerPorId(Long id) {
        return cargoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Error: Cargo no encontrado con ID: " + id));
    }

    @Override
    public Cargo crearCargo(Cargo cargo) {
        cargo.setActivo(true);
        return cargoRepository.save(cargo);
    }

    @Override
    public Cargo actualizarCargo(Long id, Cargo cargoDetalles) {
        Cargo cargoExistente = obtenerPorId(id);
        cargoExistente.setNombre(cargoDetalles.getNombre());
        cargoExistente.setDescripcion(cargoDetalles.getDescripcion());

        if (cargoDetalles.getActivo() != null) {
            cargoExistente.setActivo(cargoDetalles.getActivo());
        }

        return cargoRepository.save(cargoExistente);
    }

    @Override
    public void desactivarCargo(Long id) {
        Cargo cargoExistente = obtenerPorId(id);
        cargoExistente.setActivo(false);
        cargoRepository.save(cargoExistente);
    }
}