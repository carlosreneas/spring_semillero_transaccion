package com.example.demo.usuario;

import jakarta.validation.constraints.*;

public record CrearUsuarioRequest(
    @NotBlank @Size(max = 120) String nombre,
    @NotBlank @Email @Size(max = 150) String email,
    @NotBlank @Size(min = 8, max = 72) String password,
    @NotBlank String rol,
    @Size(max = 20) String codigo) {}

