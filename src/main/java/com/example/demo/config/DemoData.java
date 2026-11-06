package com.example.demo.config;

import com.example.demo.usuario.RolRepository;
import com.example.demo.usuario.Usuario;
import com.example.demo.usuario.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DemoData {
    @Bean
    CommandLineRunner cargarUsuarios(UsuarioRepository usuarios, RolRepository roles,
                                     PasswordEncoder encoder) {
        return args -> {
            if (usuarios.count() > 0) return;
            String[][] cuentas = {
                {"Administración", "admin@universidad.edu.co",             "ADMINISTRADOR", null},
                {"Directora Software", "director.software@universidad.edu.co", "DIRECTOR",  null},
                {"Director Datos", "director.datos@universidad.edu.co",       "DIRECTOR",      null},
                {"Miembro Uno", "miembro1@universidad.edu.co",                "MIEMBRO",       "2026901"},
                {"Miembro Dos", "miembro2@universidad.edu.co",                "MIEMBRO",       "2026902"},
                {"Miembro Tres", "miembro3@universidad.edu.co",               "MIEMBRO",       "2026903"}
            };
            for (String[] c : cuentas) {
                Usuario u = new Usuario(c[0], c[1], encoder.encode("Clave123!"), c[3]);
                u.getRoles().add(roles.findByNombre(c[2]).orElseThrow());
                usuarios.save(u);
            }
        };
    }
}

