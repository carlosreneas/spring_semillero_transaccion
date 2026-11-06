package com.example.demo.controller;

import com.example.demo.dto.request.SemilleroRequest;
import com.example.demo.dto.response.ErrorResponse;
import com.example.demo.dto.response.SemilleroResponse;
import com.example.demo.service.SemilleroService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Semilleros", description = "Registro transaccional de semilleros de investigación")
@RestController
@RequestMapping("/api/semilleros")
public class SemilleroController {

    private final SemilleroService service;

    public SemilleroController(SemilleroService service) {
        this.service = service;
    }

    @Operation(
            summary = "Registrar semillero",
            description = "Crea un semillero con su director, líneas de investigación e integrantes en una única transacción atómica."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "201",
                    description = "Semillero creado exitosamente",
                    content = @Content(schema = @Schema(implementation = SemilleroResponse.class))
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Datos inválidos o regla de negocio no cumplida",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            ),
            @ApiResponse(
                    responseCode = "409",
                    description = "Conflicto: la sigla ya se encuentra registrada",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            )
    })
    @PostMapping
    @PreAuthorize("hasRole('ADMINISTRADOR')")                               // NUEVO
    public ResponseEntity<SemilleroResponse> crear(
            @Valid @RequestBody SemilleroRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.crear(request));
    }

    @GetMapping                                                             // NUEVO
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public List<SemilleroResponse> listar() {
        return service.listar();
    }

    @GetMapping("/mios")                                                    // NUEVO
    @PreAuthorize("hasAnyRole('DIRECTOR','MIEMBRO')")
    public List<SemilleroResponse> mios(Authentication auth) {
        return service.mios(auth);
    }

    @GetMapping("/{semilleroId}")                                           // NUEVO
    @PreAuthorize("@acceso.puedeVer(#semilleroId, authentication)")
    public SemilleroResponse obtener(@PathVariable Long semilleroId) {
        return service.obtener(semilleroId);
    }
}
