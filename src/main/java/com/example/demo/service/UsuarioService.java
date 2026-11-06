package com.example.demo.service;

import com.example.demo.dto.request.CrearUsuarioRequest;
import com.example.demo.dto.response.UsuarioResumen;
import com.example.demo.entity.Rol;
import com.example.demo.entity.Usuario;
import com.example.demo.exception.ConflictoException;
import com.example.demo.exception.ReglaNegocioException;
import com.example.demo.repository.RolRepository;
import com.example.demo.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Locale;

@Service
public class UsuarioService {
    private final UsuarioRepository usuarios;
    private final RolRepository roles;
    private final PasswordEncoder encoder;

    public UsuarioService(UsuarioRepository usuarios, RolRepository roles, PasswordEncoder encoder) {
        this.usuarios = usuarios;
        this.roles = roles;
        this.encoder = encoder;
    }

    @Transactional(readOnly = true)
    public List<UsuarioResumen> listar() {
        return usuarios.findAll().stream().map(UsuarioResumen::de).toList();
    }

    @Transactional
    public UsuarioResumen crear(CrearUsuarioRequest r) {
        String email = r.email().trim().toLowerCase(Locale.ROOT);
        if (usuarios.existsByEmailIgnoreCase(email))
            throw new ConflictoException("Ya existe una cuenta con ese correo");                  // 409

        Rol rol = roles.findByNombre(r.rol().trim().toUpperCase(Locale.ROOT))
            .orElseThrow(() -> new ReglaNegocioException("Rol inválido: " + r.rol()));          // 400

        String codigo = (r.codigo() == null || r.codigo().isBlank()) ? null : r.codigo().trim();
        if (rol.getNombre().equals("MIEMBRO") && codigo == null)
            throw new ReglaNegocioException("Una cuenta de MIEMBRO necesita código estudiantil"); // 400
        if (codigo != null && usuarios.existsByCodigo(codigo))
            throw new ConflictoException("Ese código ya tiene una cuenta");                      // 409

        Usuario u = new Usuario(r.nombre().trim(), email, encoder.encode(r.password()), codigo);
        u.getRoles().add(rol);
        return UsuarioResumen.de(usuarios.save(u));
    }
}

