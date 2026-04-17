package com.asistencia.backend.controllers;

import com.asistencia.backend.dtos.AuthRequestDTO;
import com.asistencia.backend.dtos.AuthResponseDTO;
import com.asistencia.backend.dtos.RecuperarPasswordRequestDTO;
import com.asistencia.backend.dtos.RestablecerPasswordRequestDTO;
import com.asistencia.backend.entities.UsuarioAdmin;
import com.asistencia.backend.repositories.UsuarioAdminRepository;
import com.asistencia.backend.security.JwtService;
import com.asistencia.backend.services.EmailService; // <--- 1. NUEVO IMPORT DE TU SERVICIO
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtService jwtService;
    private final UsuarioAdminRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService; // <--- 2. DECLARACIÓN DEL SERVICIO

    // ---> CORRECCIÓN AQUÍ: Se añadió EmailService al constructor <---
    public AuthController(AuthenticationManager authenticationManager,
                          UserDetailsService userDetailsService,
                          JwtService jwtService,
                          UsuarioAdminRepository repository,
                          PasswordEncoder passwordEncoder,
                          EmailService emailService) { // <--- 3. AÑADIDO AL CONSTRUCTOR
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.jwtService = jwtService;
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService; // <--- 4. INICIALIZADO
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
        UsuarioAdmin admin = repository.findByUsernameOrEmailActivo(request.username()).get();
        admin.setUltimoAcceso(LocalDateTime.now());
        repository.save(admin);

        return ResponseEntity.ok(new AuthResponseDTO(token, admin.getUsername(), admin.getRol().name(), admin.getAvatarUrl()));
    }

    // ---> ENDPOINT DE REFRESH <---
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

    @PostMapping("/recuperar")
    public ResponseEntity<?> solicitarRecuperacion(@RequestBody RecuperarPasswordRequestDTO request) {
        Optional<UsuarioAdmin> userOpt = repository.findByUsernameOrEmailActivo(request.email());

        if (userOpt.isPresent()) {
            UsuarioAdmin admin = userOpt.get();
            // Generamos un token único y aleatorio
            String token = UUID.randomUUID().toString();

            admin.setResetToken(token);
            admin.setResetTokenExpiration(LocalDateTime.now().plusMinutes(15)); // Expira en 15 min
            repository.save(admin);

            // Generamos el link para React
            String linkEnReact = "http://localhost:5173/restablecer-clave?token=" + token;

            // ---> 5. ENVÍO DE CORREO REAL USANDO EL EMAIL SERVICE <---
            try {
                emailService.enviarCorreoRecuperacion(admin.getEmail(), linkEnReact);
                System.out.println("Correo de recuperación enviado exitosamente a: " + admin.getEmail());
            } catch (Exception e) {
                System.err.println("Error al enviar el correo a " + admin.getEmail() + ": " + e.getMessage());
            }
        }

        // Por seguridad, SIEMPRE devolvemos el mismo mensaje, exista o no el correo.
        // Esto evita que un atacante use el formulario para adivinar qué correos existen en tu empresa.
        return ResponseEntity.ok(java.util.Map.of("message", "Si el correo existe en nuestro sistema, hemos enviado las instrucciones de recuperación."));
    }

    @PostMapping("/restablecer")
    public ResponseEntity<?> restablecerClave(@RequestBody RestablecerPasswordRequestDTO request) {
        try {
            // Buscamos al usuario que tenga ese token específico
            UsuarioAdmin admin = repository.findAll().stream()
                    .filter(u -> request.token().equals(u.getResetToken()))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("El enlace de recuperación es inválido o no existe."));

            // Verificamos si ya pasaron los 15 minutos
            if (admin.getResetTokenExpiration() == null || admin.getResetTokenExpiration().isBefore(LocalDateTime.now())) {
                throw new RuntimeException("El enlace de recuperación ha expirado. Por favor, solicita uno nuevo.");
            }

            // Cambiamos la clave y limpiamos el token para que no se pueda reusar
            admin.setPasswordHash(passwordEncoder.encode(request.nuevaPassword()));
            admin.setResetToken(null);
            admin.setResetTokenExpiration(null);
            repository.save(admin);

            return ResponseEntity.ok(java.util.Map.of("message", "Contraseña actualizada correctamente. Ya puedes iniciar sesión."));

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", e.getMessage()));
        }
    }
}