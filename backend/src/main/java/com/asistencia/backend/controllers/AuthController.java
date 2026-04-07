package com.asistencia.backend.controllers;

import com.asistencia.backend.dtos.AuthRequestDTO;
import com.asistencia.backend.dtos.AuthResponseDTO;
import com.asistencia.backend.entities.UsuarioAdmin;
import com.asistencia.backend.repositories.UsuarioAdminRepository;
import com.asistencia.backend.security.JwtService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
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

        return ResponseEntity.ok(new AuthResponseDTO(token, admin.getUsername(), admin.getRol().name()));
    }
}