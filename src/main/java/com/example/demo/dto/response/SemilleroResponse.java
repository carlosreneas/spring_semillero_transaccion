package com.example.demo.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;

public record SemilleroResponse(
        @Schema(description = "Identificador único asignado al semillero", example = "1") Long id,

        @Schema(description = "Nombre completo del semillero", example = "Semillero de Aplicaciones Web") String nombre,

        @Schema(description = "Sigla del semillero", example = "SAW-01") String sigla,

        @Schema(description = "Grupo de investigación asociado", example = "Grupo de Ingeniería de Software") String grupoInvestigacion,

        @Schema(description = "Misión institucional del semillero") String mision,

        @Schema(description = "Visión proyectada del semillero") String vision,

        @Schema(description = "Objetivo general del semillero") String objetivoGeneral,

        @Schema(description = "Total de integrantes registrados", example = "2") int totalIntegrantes,

    String estado,

    @Schema(description = "Información del docente director")
    DirectorResumen director,

    @Schema(description = "Líneas de investigación asociadas")
    List<String> lineas,

    @Schema(description = "Lista de integrantes vinculados")
    List<IntegranteResumen> integrantes){

    public SemilleroResponse(Long id, String sigla, int totalIntegrantes, String estado) {
        this(id, null, sigla, null, null, null, null, totalIntegrantes, estado, null, List.of(), List.of());
    }

    public record DirectorResumen(Long id, String nombre, String correo) {
    }

    public record IntegranteResumen(Long id, String codigo, String nombre, String programa, boolean esLider) {
    }
}
