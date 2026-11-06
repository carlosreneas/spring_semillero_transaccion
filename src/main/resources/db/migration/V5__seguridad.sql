CREATE TABLE usuarios (
  id BIGSERIAL PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  email VARCHAR(150) NOT NULL,
  password VARCHAR(255) NOT NULL,
  codigo VARCHAR(20),
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  CONSTRAINT uk_usuarios_email UNIQUE (email),
  CONSTRAINT uk_usuarios_codigo UNIQUE (codigo)
);

CREATE TABLE roles (
  id BIGSERIAL PRIMARY KEY,
  nombre VARCHAR(30) NOT NULL,
  CONSTRAINT uk_roles_nombre UNIQUE (nombre)
);

CREATE TABLE usuarios_roles (
  usuario_id BIGINT NOT NULL REFERENCES usuarios(id),
  rol_id BIGINT NOT NULL REFERENCES roles(id),
  PRIMARY KEY (usuario_id, rol_id)
);

INSERT INTO roles (nombre) VALUES ('ADMINISTRADOR'), ('DIRECTOR'), ('MIEMBRO');

