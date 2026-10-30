CREATE UNIQUE INDEX uk_productos_semillero_titulo
ON productos (semillero_id, LOWER(titulo));