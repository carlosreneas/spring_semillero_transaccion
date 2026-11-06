package com.example.demo.entity;

import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "usuarios")
public class Usuario {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false) private String nombre;
    @Column(nullable = false, unique = true) private String email;
    @Column(nullable = false) private String password;
    @Column(unique = true) private String codigo;
    @Column(nullable = false) private boolean activo = true;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "usuarios_roles",
        joinColumns = @JoinColumn(name = "usuario_id"),
        inverseJoinColumns = @JoinColumn(name = "rol_id"))
    private Set<Rol> roles = new HashSet<>();

    protected Usuario() {}
    public Usuario(String nombre, String email, String password, String codigo) {
        this.nombre = nombre;
        this.email = email;
        this.password = password;
        this.codigo = codigo;
    }
    public Long getId() { return id; }
    public String getNombre() { return nombre; }
    public String getEmail() { return email; }
    public String getPassword() { return password; }
    public String getCodigo() { return codigo; }
    public boolean isActivo() { return activo; }
    public Set<Rol> getRoles() { return roles; }
}

