package com.example.demo.repository;

import com.example.demo.entity.Integrante;
import com.example.demo.entity.Semillero;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface IntegranteRepository extends JpaRepository<Integrante, Long> {
    List<Integrante> findBySemilleroId(Long semilleroId);
    boolean existsBySemilleroIdAndCodigo(Long semilleroId, String codigo);
    java.util.Optional<Integrante> findBySemilleroIdAndCodigo(Long semilleroId, String codigo);

    @Query("select distinct i.semillero from Integrante i where i.codigo = :codigo")   // NUEVO
    List<Semillero> findSemillerosPorCodigo(@Param("codigo") String codigo);
}
