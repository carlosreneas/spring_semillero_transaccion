package com.example.demo.seguridad;

import com.example.demo.usuario.Usuario;
import com.example.demo.usuario.UsuarioRepository;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class DbUserDetailsService implements UserDetailsService {
    private final UsuarioRepository usuarios;
    public DbUserDetailsService(UsuarioRepository usuarios) { this.usuarios = usuarios; }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Usuario u = usuarios.findByEmailIgnoreCase(email)
            .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));
        String[] authorities = u.getRoles().stream()
            .map(r -> "ROLE_" + r.getNombre())
            .toArray(String[]::new);
        return User.withUsername(u.getEmail())   // el email tal como está guardado
            .password(u.getPassword())
            .authorities(authorities)
            .disabled(!u.isActivo())
            .build();
    }
}

