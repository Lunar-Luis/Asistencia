package com.asistencia.backend.controllers;

import com.asistencia.backend.dtos.ActualizarPerfilRequestDTO;
import com.asistencia.backend.dtos.AuthResponseDTO;
import com.asistencia.backend.entities.UsuarioAdmin;
import com.asistencia.backend.security.JwtService;
import com.asistencia.backend.services.UsuarioAdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioAdminController {

    private final UsuarioAdminService usuarioService;
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    public UsuarioAdminController(UsuarioAdminService usuarioService, JwtService jwtService, UserDetailsService userDetailsService) {
        this.usuarioService = usuarioService;
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    @PutMapping("/perfil")
    public ResponseEntity<?> actualizarMiPerfil(Authentication authentication, @RequestBody ActualizarPerfilRequestDTO dto) {
        try {
            // authentication.getName() extrae el username directo del token JWT actual de forma segura
            UsuarioAdmin actualizado = usuarioService.actualizarPerfil(authentication.getName(), dto);

            // Generamos un NUEVO token con el username actualizado por si lo cambió
            UserDetails userDetails = userDetailsService.loadUserByUsername(actualizado.getUsername());
            String nuevoToken = jwtService.generarToken(userDetails);

            // ---> AQUÍ ESTÁ LA CORRECCIÓN <---
            // Pasamos los 4 parámetros exactos que definimos en el record AuthResponseDTO
            AuthResponseDTO response = new AuthResponseDTO(
                    nuevoToken,
                    actualizado.getUsername(),
                    actualizado.getRol().name(),
                    actualizado.getAvatarUrl() // Añadimos la imagen aquí
            );

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", e.getMessage()));
        }
    }

    // Añade esto debajo de tu @PutMapping("/perfil")
    @GetMapping("/perfil")
    public ResponseEntity<?> obtenerMiPerfil(Authentication authentication) {
        try {
            // Spring Security nos garantiza que este 'authentication.getName()' es el usuario legítimo del token
            UsuarioAdmin admin = usuarioService.obtenerUsuario(authentication.getName());

            // Devolvemos un JSON (Mapa) con los datos, OMITIENDO la contraseña por seguridad
            return ResponseEntity.ok(java.util.Map.of(
                    "username", admin.getUsername(),
                    "email", admin.getEmail(),
                    "rol", admin.getRol().name(),
                    "avatarUrl", admin.getAvatarUrl() != null ? admin.getAvatarUrl() : ""
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", e.getMessage()));
        }
    }
}