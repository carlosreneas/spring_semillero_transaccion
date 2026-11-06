package com.example.demo.usuario;

import java.util.List;

public record UsuarioResumen(Long id, String nombre, String email, String codigo,
                             boolean activo, List<String> roles) {
    public static UsuarioResumen de(Usuario u) {
        return new UsuarioResumen(u.getId(), u.getNombre(), u.getEmail(), u.getCodigo(),
            u.isActivo(), u.getRoles().stream().map(Rol::getNombre).sorted().toList());
    }
}

