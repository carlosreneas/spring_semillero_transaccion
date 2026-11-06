package com.example.demo.config;

import com.example.demo.dto.request.DirectorRequest;
import com.example.demo.dto.request.IntegranteRequest;
import com.example.demo.dto.request.SemilleroRequest;
import com.example.demo.entity.Usuario;
import com.example.demo.repository.RolRepository;
import com.example.demo.repository.SemilleroRepository;
import com.example.demo.repository.UsuarioRepository;
import com.example.demo.service.SemilleroService;
import java.util.List;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DemoData {
    @Bean
    CommandLineRunner cargarUsuarios(UsuarioRepository usuarios, RolRepository roles,
                                     PasswordEncoder encoder,
                                     SemilleroRepository semilleros,
                                     SemilleroService semilleroService) {
        return args -> {
            if (usuarios.count() == 0) {
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
            }

            if (!semilleros.existsBySigla("SIS-01")) {
                semilleroService.crear(new SemilleroRequest(
                    "Semillero de Ingeniería de Software",
                    "SIS-01",
                    "Grupo de Ingeniería de Software",
                    "Promover buenas prácticas de arquitectura, seguridad y calidad en el desarrollo de software institucional.",
                    "Consolidarse como referente regional en ingeniería de software segura y sistemas distribuidos.",
                    "Desarrollar investigación formativa en diseño de APIs seguras, pruebas automatizadas y aseguramiento de calidad.",
                    new DirectorRequest("Directora Software", "director.software@universidad.edu.co"),
                    List.of("APIs seguras", "Calidad de software"),
                    List.of(
                        new IntegranteRequest("2026901", "Miembro Uno", "Ingeniería de Sistemas", true),
                        new IntegranteRequest("2026902", "Miembro Dos", "Ingeniería de Sistemas", false)
                    )
                ));
            }

            if (!semilleros.existsBySigla("SAD-01")) {
                semilleroService.crear(new SemilleroRequest(
                    "Semillero de Analítica de Datos",
                    "SAD-01",
                    "Grupo de Analítica",
                    "Impulsar la analítica avanzada y la ciencia de datos aplicada a problemáticas académicas y productivas.",
                    "Ser líderes en proyectos de modelado predictivo e inteligencia de negocios en el entorno universitario.",
                    "Formar estudiantes en técnicas de minería de datos, visualización estadística y aprendizaje automático.",
                    new DirectorRequest("Director Datos", "director.datos@universidad.edu.co"),
                    List.of("Ciencia de datos"),
                    List.of(
                        new IntegranteRequest("2026903", "Miembro Tres", "Ingeniería de Sistemas", true)
                    )
                ));
            }
        };
    }
}
