package com.example.demo.seguridad;

import com.example.demo.repository.IntegranteRepository;
import com.example.demo.repository.SemilleroRepository;
import com.example.demo.usuario.Usuario;
import com.example.demo.usuario.UsuarioRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;
import java.util.Optional;

@Component("acceso")
public class AccesoSemillero {
    private final SemilleroRepository semilleros;
    private final IntegranteRepository integrantes;
    private final UsuarioRepository usuarios;

    public AccesoSemillero(SemilleroRepository semilleros, IntegranteRepository integrantes,
                           UsuarioRepository usuarios) {
        this.semilleros = semilleros;
        this.integrantes = integrantes;
        this.usuarios = usuarios;
    }

    public boolean tieneRol(Authentication auth, String rol) {
        return auth.getAuthorities().stream().map(GrantedAuthority::getAuthority)
            .anyMatch(a -> a.equals("ROLE_" + rol));
    }

    /** Código estudiantil de la cuenta autenticada, si lo tiene. */
    public Optional<String> codigoDe(Authentication auth) {
        return usuarios.findByEmailIgnoreCase(auth.getName()).map(Usuario::getCodigo);
    }

    public boolean esDirector(Long semilleroId, Authentication auth) {
        return tieneRol(auth, "DIRECTOR")
            && semilleros.existsByIdAndDirectorCorreoIgnoreCase(semilleroId, auth.getName());
    }

    public boolean esMiembro(Long semilleroId, Authentication auth) {
        return tieneRol(auth, "MIEMBRO")
            && codigoDe(auth).map(c -> integrantes.existsBySemilleroIdAndCodigo(semilleroId, c))
                             .orElse(false);
    }

    public boolean puedeVer(Long semilleroId, Authentication auth) {
        return tieneRol(auth, "ADMINISTRADOR")
            || esDirector(semilleroId, auth)
            || esMiembro(semilleroId, auth);
    }
}

