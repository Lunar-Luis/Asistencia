package com.asistencia.backend.security;

import com.asistencia.backend.entities.UsuarioAdmin;
import com.asistencia.backend.repositories.UsuarioAdminRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UsuarioAdminRepository repository;

    public CustomUserDetailsService(UsuarioAdminRepository repository) {
        this.repository = repository;
    }

    @Override
    public UserDetails loadUserByUsername(String identificador) throws UsernameNotFoundException {
        UsuarioAdmin admin = repository.findByUsernameOrEmailActivo(identificador)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado con esas credenciales"));

        return new User(
                admin.getUsername(),
                admin.getPasswordHash(),
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + admin.getRol().name()))
        );
    }
}