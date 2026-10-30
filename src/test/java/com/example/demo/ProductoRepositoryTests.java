package com.example.demo;

import com.example.demo.entity.Integrante;
import com.example.demo.entity.Producto;
import com.example.demo.entity.Semillero;
import com.example.demo.entity.TipoProducto;
import com.example.demo.repository.IntegranteRepository;
import com.example.demo.repository.ProductoRepository;
import com.example.demo.repository.SemilleroRepository;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional
class ProductoRepositoryTests {

    @Autowired
    private SemilleroRepository semilleroRepository;

    @Autowired
    private IntegranteRepository integranteRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Test
    @DisplayName("Verificar métodos requeridos de Semillero, Integrante y Producto Repository")
    void testMetodosRequeridos() {
        // 1. Validar semilleroRepository.findById(Long id) usando los datos de prueba V2 (SIAWEB)
        Semillero siaweb = semilleroRepository.findBySigla("SIAWEB")
                .orElseThrow(() -> new IllegalStateException("Semillero SIAWEB no encontrado"));

        Optional<Semillero> semilleroPorId = semilleroRepository.findById(siaweb.getId());
        assertThat(semilleroPorId).isPresent();
        assertThat(semilleroPorId.get().getSigla()).isEqualTo("SIAWEB");

        // 2. Validar integranteRepository.findBySemilleroIdAndCodigo(Long semilleroId, String codigo)
        Optional<Integrante> integranteOpt = integranteRepository.findBySemilleroIdAndCodigo(siaweb.getId(), "1152001");
        assertThat(integranteOpt).isPresent();
        assertThat(integranteOpt.get().getNombre()).isEqualTo("Valentina Ruiz Peña");

        // 3. Validar productoRepository.saveAll(List<Producto> productos)
        Producto prod1 = Producto.builder()
                .semillero(siaweb)
                .integrante(integranteOpt.get())
                .titulo("Sistema Web de Gestión Académica")
                .tipo(TipoProducto.SOFTWARE)
                .anio(2026)
                .build();

        Producto prod2 = Producto.builder()
                .semillero(siaweb)
                .integrante(integranteOpt.get())
                .titulo("Arquitecturas Reactivas en Spring Boot")
                .tipo(TipoProducto.ARTICULO)
                .anio(2026)
                .build();

        List<Producto> guardados = productoRepository.saveAll(List.of(prod1, prod2));
        assertThat(guardados).hasSize(2);
        assertThat(guardados.get(0).getId()).isNotNull();

        // 4. Validar productoRepository.existsBySemilleroIdAndTituloIgnoreCase(Long semilleroId, String titulo)
        boolean existeTituloExacto = productoRepository.existsBySemilleroIdAndTituloIgnoreCase(
                siaweb.getId(), "Sistema Web de Gestión Académica"
        );
        boolean existeTituloCaseInsensitive = productoRepository.existsBySemilleroIdAndTituloIgnoreCase(
                siaweb.getId(), "sistema web de gestión académica"
        );
        boolean noExiste = productoRepository.existsBySemilleroIdAndTituloIgnoreCase(
                siaweb.getId(), "Título Inexistente"
        );

        assertThat(existeTituloExacto).isTrue();
        assertThat(existeTituloCaseInsensitive).isTrue();
        assertThat(noExiste).isFalse();
    }
}
