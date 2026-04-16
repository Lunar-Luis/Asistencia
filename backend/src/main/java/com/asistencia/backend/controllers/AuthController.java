package com.asistencia.backend.controllers;

import com.asistencia.backend.dtos.AuthRequestDTO;
import com.asistencia.backend.dtos.AuthResponseDTO;
import com.asistencia.backend.entities.UsuarioAdmin;
import com.asistencia.backend.repositories.UsuarioAdminRepository;
import com.asistencia.backend.security.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtService jwtService;
    private final UsuarioAdminRepository repository;

    public AuthController(AuthenticationManager authenticationManager, UserDetailsService userDetailsService, JwtService jwtService, UsuarioAdminRepository repository) {
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.jwtService = jwtService;
        this.repository = repository;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@RequestBody AuthRequestDTO request) {
        // 1. Validar credenciales
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.username(), request.password())
        );

        // 2. Generar Token
        UserDetails userDetails = userDetailsService.loadUserByUsername(request.username());
        String token = jwtService.generarToken(userDetails);

        // 3. Actualizar último acceso
        UsuarioAdmin admin = repository.findByUsernameAndActivoTrue(request.username()).get();
        admin.setUltimoAcceso(LocalDateTime.now());
        repository.save(admin);

        return ResponseEntity.ok(new AuthResponseDTO(token, admin.getUsername(), admin.getRol().name(), admin.getAvatarUrl()));
    }

    // ---> NUEVO ENDPOINT DE REFRESH <---
    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(Authentication authentication) {
        try {
            // Si llega aquí, significa que el token original AÚN ES VÁLIDO (el JwtAuthenticationFilter lo dejó pasar)
            String username = authentication.getName();
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);

            // Generamos un token fresco con otros 5 minutos
            String nuevoToken = jwtService.generarToken(userDetails);

            // Buscamos los datos del admin para armar la respuesta completa
            UsuarioAdmin admin = repository.findByUsernameAndActivoTrue(username).get();
            admin.setUltimoAcceso(LocalDateTime.now()); // Opcional: Actualizar acceso
            repository.save(admin);

            return ResponseEntity.ok(new AuthResponseDTO(nuevoToken, admin.getUsername(), admin.getRol().name(), admin.getAvatarUrl()));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No se pudo renovar el token");
        }
    }
}