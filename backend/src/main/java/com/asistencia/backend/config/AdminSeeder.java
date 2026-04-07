package com.asistencia.backend.config;

import com.asistencia.backend.entities.UsuarioAdmin;
import com.asistencia.backend.enums.RolUsuario;
import com.asistencia.backend.repositories.UsuarioAdminRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminSeeder implements CommandLineRunner {

    private final UsuarioAdminRepository repository;
    private final PasswordEncoder passwordEncoder;

    public AdminSeeder(UsuarioAdminRepository repository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (repository.count() == 0) {
            UsuarioAdmin admin = UsuarioAdmin.builder()
                    .username("admin")
                    .email("admin@hospital.com")
                    // Contraseña real: "123456" (encriptada con BCrypt)
                    .passwordHash(passwordEncoder.encode("123456"))
                    .rol(RolUsuario.SUPERADMIN)
                    .activo(true)
                    .build();
            repository.save(admin);
            System.out.println("✅ Administrador por defecto creado: admin / 123456");
        }
    }
}