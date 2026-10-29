CREATE TABLE directores (
    id     BIGSERIAL    PRIMARY KEY,
    nombre VARCHAR(160) NOT NULL,
    correo VARCHAR(180) NOT NULL UNIQUE
);

CREATE TABLE semilleros (
    id                  BIGSERIAL    PRIMARY KEY,
    nombre              VARCHAR(180) NOT NULL,
    sigla               VARCHAR(30)  NOT NULL UNIQUE,
    grupo_investigacion VARCHAR(180) NOT NULL,
    mision              TEXT,
    vision              TEXT,
    objetivo_general    TEXT,
    director_id         BIGINT       NOT NULL REFERENCES directores(id)
);