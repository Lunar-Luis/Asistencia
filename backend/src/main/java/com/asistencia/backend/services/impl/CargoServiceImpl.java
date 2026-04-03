package com.asistencia.backend.services.impl;

import com.asistencia.backend.entities.Cargo;
import com.asistencia.backend.repositories.CargoRepository;
import com.asistencia.backend.services.CargoService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CargoServiceImpl implements CargoService {

    private final CargoRepository cargoRepository;

    public CargoServiceImpl(CargoRepository cargoRepository) {
        this.cargoRepository = cargoRepository;
    }

    @Override
    public List<Cargo> obtenerCargosActivos() {
        return cargoRepository.findAllByActivoTrue();
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
        return cargoRepository.save(cargoExistente);
    }

    @Override
    public void desactivarCargo(Long id) {
        Cargo cargoExistente = obtenerPorId(id);
        cargoExistente.setActivo(false);
        cargoRepository.save(cargoExistente);
    }
}