
package com.example.demo.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record DirectorRequest(
        @NotBlank String nombre,
        @NotBlank @Email String correo) {}