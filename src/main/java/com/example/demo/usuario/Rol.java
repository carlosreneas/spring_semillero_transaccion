package com.example.demo.usuario;

import jakarta.persistence.*;

@Entity
@Table(name = "roles")
public class Rol {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, unique = true)
    private String nombre;

    protected Rol() {}
    public Long getId() { return id; }
    public String getNombre() { return nombre; }
}

