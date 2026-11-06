package com.example.demo.usuario;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@PreAuthorize("hasRole('ADMINISTRADOR')")
public class UsuarioController {
    private final UsuarioService service;
    public UsuarioController(UsuarioService service) { this.service = service; }

    @GetMapping
    public List<UsuarioResumen> listar() { return service.listar(); }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UsuarioResumen crear(@Valid @RequestBody CrearUsuarioRequest request) {
        return service.crear(request);
    }
}

