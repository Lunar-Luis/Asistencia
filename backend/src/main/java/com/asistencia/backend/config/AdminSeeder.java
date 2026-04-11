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
        // Solo ejecuta si la tabla está vacía
        if (repository.count() == 0) {

            // 1. USUARIO SUPERADMIN (Tú / Soporte)
            UsuarioAdmin admin = UsuarioAdmin.builder()
                    .username("admin")
                    .email("admin@hospital.com")
                    .passwordHash(passwordEncoder.encode("123456"))
                    .rol(RolUsuario.SUPERADMIN)
                    .activo(true)
                    .build();
            repository.save(admin);
            System.out.println("✅ Administrador por defecto creado: admin / 123456");

            // 2. USUARIO RRHH (La Jefa)
            UsuarioAdmin jefa = UsuarioAdmin.builder()
                    .username("jefa")
                    .email("rrhh@hospital.com")
                    .passwordHash(passwordEncoder.encode("123456")) // Misma clave para probar rápido
                    // OJO: Asegúrate de que 'RRHH' o 'USER' exista en tu enum RolUsuario
                    .rol(RolUsuario.RRHH)
                    .activo(true)
                    .build();
            repository.save(jefa);
            System.out.println("✅ Usuario de RRHH creado: jefa / 123456");
        }
    }
}