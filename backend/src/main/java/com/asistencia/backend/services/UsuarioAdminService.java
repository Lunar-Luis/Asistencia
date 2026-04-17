package com.asistencia.backend.services;

import com.asistencia.backend.dtos.ActualizarPerfilRequestDTO;
import com.asistencia.backend.entities.UsuarioAdmin;
import com.asistencia.backend.repositories.UsuarioAdminRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UsuarioAdminService {

    private final UsuarioAdminRepository repository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioAdminService(UsuarioAdminRepository repository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public UsuarioAdmin actualizarPerfil(String usernameActual, ActualizarPerfilRequestDTO dto) {
        UsuarioAdmin admin = repository.findByUsernameAndActivoTrue(usernameActual)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Verificar si está cambiando el username y si el nuevo ya está en uso
        if (dto.username() != null && !dto.username().isBlank() && !admin.getUsername().equals(dto.username())) {
            if (repository.findByUsernameAndActivoTrue(dto.username()).isPresent()) {
                throw new RuntimeException("El nombre de usuario ya está ocupado por otra persona.");
            }
            admin.setUsername(dto.username());
        }

        if (dto.email() != null && !dto.email().isBlank()) {
            admin.setEmail(dto.email());
        }

        if (dto.avatarUrl() != null) {
            admin.setAvatarUrl(dto.avatarUrl());
        }

        // Si se envió una nueva contraseña, la ciframos
        if (dto.password() != null && !dto.password().isBlank()) {
            admin.setPasswordHash(passwordEncoder.encode(dto.password()));
        }

        return repository.save(admin);
    }

    // Añade esto en tu UsuarioAdminService
    public UsuarioAdmin obtenerUsuario(String usernameActual) {
        return repository.findByUsernameAndActivoTrue(usernameActual)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }
}