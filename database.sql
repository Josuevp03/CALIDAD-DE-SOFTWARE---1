PRAGMA foreign_keys = ON;
PRAGMA journal_mode = WAL;

BEGIN TRANSACTION;

CREATE TABLE rol (
    id_rol INTEGER PRIMARY KEY,
    nombre TEXT NOT NULL UNIQUE,
    descripcion TEXT
);

CREATE TABLE usuario (
    id_usuario INTEGER PRIMARY KEY,
    id_rol INTEGER NOT NULL,
    nombre TEXT NOT NULL,
    apellido TEXT NOT NULL,
    correo TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    activo INTEGER NOT NULL DEFAULT 1 CHECK (activo IN (0, 1)),
    creado_en TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_rol) REFERENCES rol(id_rol) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE cliente (
    id_cliente INTEGER PRIMARY KEY,
    nombre TEXT NOT NULL,
    apellido TEXT NOT NULL,
    documento TEXT NOT NULL UNIQUE,
    telefono TEXT NOT NULL,
    correo TEXT UNIQUE,
    direccion TEXT,
    ciudad TEXT NOT NULL,
    observaciones TEXT
);

CREATE TABLE tipo_evento (
    id_tipo_evento INTEGER PRIMARY KEY,
    nombre TEXT NOT NULL UNIQUE,
    activo INTEGER NOT NULL DEFAULT 1 CHECK (activo IN (0, 1))
);

CREATE TABLE evento (
    id_evento INTEGER PRIMARY KEY,
    id_cliente INTEGER NOT NULL,
    id_tipo_evento INTEGER NOT NULL,
    nombre TEXT NOT NULL,
    fecha TEXT NOT NULL CHECK (date(fecha) IS NOT NULL),
    hora TEXT CHECK (hora IS NULL OR time(hora) IS NOT NULL),
    lugar TEXT NOT NULL,
    ciudad TEXT NOT NULL,
    direccion TEXT,
    preferencias TEXT,
    observaciones TEXT,
    FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente) ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (id_tipo_evento) REFERENCES tipo_evento(id_tipo_evento) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE categoria (
    id_categoria INTEGER PRIMARY KEY,
    nombre TEXT NOT NULL UNIQUE,
    descripcion TEXT
);

CREATE TABLE paquete_decorativo (
    id_paquete INTEGER PRIMARY KEY,
    codigo TEXT NOT NULL UNIQUE,
    id_categoria INTEGER NOT NULL,
    nombre TEXT NOT NULL,
    descripcion TEXT,
    precio_venta NUMERIC NOT NULL CHECK (precio_venta >= 0),
    precio_alquiler_periodo NUMERIC NOT NULL CHECK (precio_alquiler_periodo >= 0),
    color TEXT,
    material TEXT,
    tematica TEXT,
    capacidad INTEGER NOT NULL CHECK (capacidad > 0),
    activo INTEGER NOT NULL DEFAULT 1 CHECK (activo IN (0, 1)),
    FOREIGN KEY (id_categoria) REFERENCES categoria(id_categoria) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE artesano (
    id_artesano INTEGER PRIMARY KEY,
    id_usuario INTEGER UNIQUE,
    nombre TEXT NOT NULL,
    especialidad TEXT,
    activo INTEGER NOT NULL DEFAULT 1 CHECK (activo IN (0, 1)),
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON UPDATE CASCADE ON DELETE SET NULL
);

CREATE TABLE disenador (
    id_disenador INTEGER PRIMARY KEY,
    id_usuario INTEGER UNIQUE,
    nombre TEXT NOT NULL,
    especialidad TEXT,
    activo INTEGER NOT NULL DEFAULT 1 CHECK (activo IN (0, 1)),
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON UPDATE CASCADE ON DELETE SET NULL
);

CREATE TABLE supervisor (
    id_supervisor INTEGER PRIMARY KEY,
    id_usuario INTEGER UNIQUE,
    nombre TEXT NOT NULL,
    activo INTEGER NOT NULL DEFAULT 1 CHECK (activo IN (0, 1)),
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON UPDATE CASCADE ON DELETE SET NULL
);

CREATE TABLE fabricacion (
    id_fabricacion INTEGER PRIMARY KEY,
    id_paquete INTEGER NOT NULL,
    id_disenador INTEGER,
    id_supervisor INTEGER,
    fecha_inicio TEXT NOT NULL CHECK (date(fecha_inicio) IS NOT NULL),
    fecha_fin TEXT CHECK (fecha_fin IS NULL OR date(fecha_fin) IS NOT NULL),
    cantidad INTEGER NOT NULL CHECK (cantidad > 0),
    eficiencia_equipo NUMERIC CHECK (eficiencia_equipo IS NULL OR (eficiencia_equipo >= 0 AND eficiencia_equipo <= 100)),
    estado TEXT NOT NULL DEFAULT 'planificada' CHECK (estado IN ('planificada', 'en_proceso', 'completada', 'cancelada')),
    observaciones TEXT,
    FOREIGN KEY (id_paquete) REFERENCES paquete_decorativo(id_paquete) ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (id_disenador) REFERENCES disenador(id_disenador) ON UPDATE CASCADE ON DELETE SET NULL,
    FOREIGN KEY (id_supervisor) REFERENCES supervisor(id_supervisor) ON UPDATE CASCADE ON DELETE SET NULL,
    CHECK (fecha_fin IS NULL OR date(fecha_fin) >= date(fecha_inicio))
);

CREATE TABLE detalle_fabricacion (
    id_fabricacion INTEGER NOT NULL,
    id_artesano INTEGER NOT NULL,
    horas_trabajadas NUMERIC NOT NULL CHECK (horas_trabajadas > 0),
    actividad TEXT NOT NULL,
    estado TEXT NOT NULL DEFAULT 'asignada' CHECK (estado IN ('asignada', 'en_proceso', 'completada')),
    PRIMARY KEY (id_fabricacion, id_artesano),
    FOREIGN KEY (id_fabricacion) REFERENCES fabricacion(id_fabricacion) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (id_artesano) REFERENCES artesano(id_artesano) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE inventario (
    id_inventario INTEGER PRIMARY KEY,
    id_paquete INTEGER NOT NULL UNIQUE,
    total INTEGER NOT NULL DEFAULT 0 CHECK (total >= 0),
    disponible INTEGER NOT NULL DEFAULT 0 CHECK (disponible >= 0),
    alquilado INTEGER NOT NULL DEFAULT 0 CHECK (alquilado >= 0),
    vendido INTEGER NOT NULL DEFAULT 0 CHECK (vendido >= 0),
    reparacion INTEGER NOT NULL DEFAULT 0 CHECK (reparacion >= 0),
    CHECK (total = disponible + alquilado + vendido + reparacion),
    FOREIGN KEY (id_paquete) REFERENCES paquete_decorativo(id_paquete) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE venta (
    id_venta INTEGER PRIMARY KEY,
    id_cliente INTEGER NOT NULL,
    fecha TEXT NOT NULL DEFAULT (date('now')) CHECK (date(fecha) IS NOT NULL),
    subtotal NUMERIC NOT NULL DEFAULT 0 CHECK (subtotal >= 0),
    total NUMERIC NOT NULL DEFAULT 0 CHECK (total >= 0),
    monto_pagado NUMERIC NOT NULL DEFAULT 0 CHECK (monto_pagado >= 0 AND monto_pagado <= total),
    estado TEXT NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'confirmada', 'cancelada')),
    FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente) ON UPDATE CASCADE ON DELETE RESTRICT,
    CHECK (estado <> 'confirmada' OR monto_pagado = total)
);

CREATE TABLE detalle_venta (
    id_venta INTEGER NOT NULL,
    linea INTEGER NOT NULL,
    id_paquete INTEGER NOT NULL,
    cantidad INTEGER NOT NULL CHECK (cantidad > 0),
    precio_unitario NUMERIC NOT NULL CHECK (precio_unitario >= 0),
    subtotal NUMERIC NOT NULL CHECK (subtotal = cantidad * precio_unitario),
    PRIMARY KEY (id_venta, linea),
    FOREIGN KEY (id_venta) REFERENCES venta(id_venta) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (id_paquete) REFERENCES paquete_decorativo(id_paquete) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE alquiler (
    id_alquiler INTEGER PRIMARY KEY,
    id_cliente INTEGER NOT NULL,
    id_evento INTEGER NOT NULL,
    fecha_inicio TEXT NOT NULL CHECK (date(fecha_inicio) IS NOT NULL),
    fecha_devolucion_acordada TEXT NOT NULL CHECK (date(fecha_devolucion_acordada) IS NOT NULL),
    dias_solicitados INTEGER NOT NULL CHECK (dias_solicitados > 0),
    dias_cobrados INTEGER NOT NULL CHECK (dias_cobrados = ((dias_solicitados + 1) / 2) * 2),
    periodos INTEGER NOT NULL CHECK (periodos = (dias_solicitados + 1) / 2),
    precio_por_periodo NUMERIC NOT NULL CHECK (precio_por_periodo >= 0),
    total NUMERIC NOT NULL CHECK (total = periodos * precio_por_periodo),
    pago_anticipado NUMERIC NOT NULL DEFAULT 0 CHECK (pago_anticipado >= 0),
    estado TEXT NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'confirmado', 'activo', 'devuelto', 'devuelto_reparacion', 'cancelado')),
    FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente) ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (id_evento) REFERENCES evento(id_evento) ON UPDATE CASCADE ON DELETE RESTRICT,
    CHECK (date(fecha_devolucion_acordada) > date(fecha_inicio))
);

CREATE TABLE detalle_alquiler (
    id_alquiler INTEGER NOT NULL,
    linea INTEGER NOT NULL,
    id_paquete INTEGER NOT NULL,
    cantidad INTEGER NOT NULL CHECK (cantidad > 0),
    PRIMARY KEY (id_alquiler, linea),
    FOREIGN KEY (id_alquiler) REFERENCES alquiler(id_alquiler) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (id_paquete) REFERENCES paquete_decorativo(id_paquete) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE devolucion (
    id_devolucion INTEGER PRIMARY KEY,
    id_alquiler INTEGER NOT NULL UNIQUE,
    fecha_real TEXT NOT NULL CHECK (date(fecha_real) IS NOT NULL),
    estado_mobiliario TEXT NOT NULL CHECK (estado_mobiliario IN ('bueno', 'reparacion')),
    observaciones TEXT,
    FOREIGN KEY (id_alquiler) REFERENCES alquiler(id_alquiler) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE mora (
    id_mora INTEGER PRIMARY KEY,
    id_devolucion INTEGER NOT NULL UNIQUE,
    dias_retraso INTEGER NOT NULL DEFAULT 0 CHECK (dias_retraso >= 0),
    periodos_mora INTEGER NOT NULL DEFAULT 0 CHECK (periodos_mora = (dias_retraso + 1) / 2 OR dias_retraso = 0),
    recargo NUMERIC NOT NULL DEFAULT 0 CHECK (recargo >= 0),
    FOREIGN KEY (id_devolucion) REFERENCES devolucion(id_devolucion) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE transporte (
    id_transporte INTEGER PRIMARY KEY,
    id_evento INTEGER NOT NULL,
    id_alquiler INTEGER,
    vehiculo TEXT NOT NULL,
    conductor TEXT,
    fecha_salida TEXT CHECK (fecha_salida IS NULL OR date(fecha_salida) IS NOT NULL),
    estado TEXT NOT NULL DEFAULT 'programado' CHECK (estado IN ('programado', 'en_transito', 'entregado', 'cancelado')),
    FOREIGN KEY (id_evento) REFERENCES evento(id_evento) ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (id_alquiler) REFERENCES alquiler(id_alquiler) ON UPDATE CASCADE ON DELETE SET NULL
);

CREATE TABLE servicio_adicional (
    id_servicio INTEGER PRIMARY KEY,
    nombre TEXT NOT NULL UNIQUE,
    tipo TEXT NOT NULL,
    precio NUMERIC NOT NULL CHECK (precio >= 0),
    disponibilidad INTEGER NOT NULL DEFAULT 0 CHECK (disponibilidad >= 0),
    activo INTEGER NOT NULL DEFAULT 1 CHECK (activo IN (0, 1))
);

CREATE TABLE servicio_venta (
    id_venta INTEGER NOT NULL,
    id_servicio INTEGER NOT NULL,
    cantidad INTEGER NOT NULL CHECK (cantidad > 0),
    precio_unitario NUMERIC NOT NULL CHECK (precio_unitario >= 0),
    PRIMARY KEY (id_venta, id_servicio),
    FOREIGN KEY (id_venta) REFERENCES venta(id_venta) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (id_servicio) REFERENCES servicio_adicional(id_servicio) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE servicio_alquiler (
    id_alquiler INTEGER NOT NULL,
    id_servicio INTEGER NOT NULL,
    cantidad INTEGER NOT NULL CHECK (cantidad > 0),
    precio_unitario NUMERIC NOT NULL CHECK (precio_unitario >= 0),
    PRIMARY KEY (id_alquiler, id_servicio),
    FOREIGN KEY (id_alquiler) REFERENCES alquiler(id_alquiler) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (id_servicio) REFERENCES servicio_adicional(id_servicio) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE montaje (
    id_montaje INTEGER PRIMARY KEY,
    id_alquiler INTEGER NOT NULL UNIQUE,
    fecha_programada TEXT NOT NULL CHECK (date(fecha_programada) IS NOT NULL),
    responsable TEXT,
    estado TEXT NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'en_proceso', 'completado', 'cancelado')),
    observaciones TEXT,
    FOREIGN KEY (id_alquiler) REFERENCES alquiler(id_alquiler) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE desmontaje (
    id_desmontaje INTEGER PRIMARY KEY,
    id_alquiler INTEGER NOT NULL UNIQUE,
    fecha_programada TEXT NOT NULL CHECK (date(fecha_programada) IS NOT NULL),
    responsable TEXT,
    estado TEXT NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'en_proceso', 'completado', 'cancelado')),
    observaciones TEXT,
    FOREIGN KEY (id_alquiler) REFERENCES alquiler(id_alquiler) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE reparacion (
    id_reparacion INTEGER PRIMARY KEY,
    id_paquete INTEGER NOT NULL,
    id_devolucion INTEGER,
    fecha_ingreso TEXT NOT NULL DEFAULT (date('now')) CHECK (date(fecha_ingreso) IS NOT NULL),
    fecha_salida TEXT CHECK (fecha_salida IS NULL OR date(fecha_salida) IS NOT NULL),
    motivo TEXT NOT NULL,
    estado TEXT NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'en_proceso', 'completada', 'cancelada')),
    FOREIGN KEY (id_paquete) REFERENCES paquete_decorativo(id_paquete) ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (id_devolucion) REFERENCES devolucion(id_devolucion) ON UPDATE CASCADE ON DELETE SET NULL,
    CHECK (fecha_salida IS NULL OR date(fecha_salida) >= date(fecha_ingreso))
);

CREATE INDEX idx_usuario_rol ON usuario(id_rol);
CREATE INDEX idx_evento_cliente_fecha ON evento(id_cliente, fecha);
CREATE INDEX idx_evento_tipo_fecha ON evento(id_tipo_evento, fecha);
CREATE INDEX idx_paquete_categoria ON paquete_decorativo(id_categoria);
CREATE INDEX idx_fabricacion_paquete_estado ON fabricacion(id_paquete, estado);
CREATE INDEX idx_detalle_fabricacion_artesano ON detalle_fabricacion(id_artesano);
CREATE INDEX idx_venta_cliente_fecha ON venta(id_cliente, fecha);
CREATE INDEX idx_detalle_venta_paquete ON detalle_venta(id_paquete);
CREATE INDEX idx_alquiler_cliente_estado ON alquiler(id_cliente, estado);
CREATE INDEX idx_alquiler_fechas ON alquiler(fecha_inicio, fecha_devolucion_acordada);
CREATE INDEX idx_detalle_alquiler_paquete ON detalle_alquiler(id_paquete);
CREATE INDEX idx_devolucion_fecha ON devolucion(fecha_real);
CREATE INDEX idx_mora_retraso ON mora(dias_retraso);
CREATE INDEX idx_transporte_evento_estado ON transporte(id_evento, estado);
CREATE INDEX idx_servicio_venta_servicio ON servicio_venta(id_servicio);
CREATE INDEX idx_servicio_alquiler_servicio ON servicio_alquiler(id_servicio);
CREATE INDEX idx_reparacion_paquete_estado ON reparacion(id_paquete, estado);

CREATE TABLE registro_cambio (
    id_cambio INTEGER PRIMARY KEY,
    tabla TEXT NOT NULL,
    operacion TEXT NOT NULL CHECK (operacion IN ('INSERT', 'UPDATE', 'DELETE')),
    clave TEXT,
    creado_en TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_registro_cambio_tabla_fecha ON registro_cambio(tabla, creado_en);

CREATE VIEW v_disponibilidad AS
SELECT p.id_paquete, p.codigo, p.nombre,
       COALESCE(i.total, 0) AS total,
       COALESCE(i.disponible, 0) AS disponible,
       COALESCE(i.alquilado, 0) AS alquilado,
       COALESCE(i.vendido, 0) AS vendido,
       COALESCE(i.reparacion, 0) AS reparacion
FROM paquete_decorativo p
LEFT JOIN inventario i ON i.id_paquete = p.id_paquete;

CREATE VIEW v_calculo_alquiler AS
SELECT a.id_alquiler, a.dias_solicitados,
       ((a.dias_solicitados + 1) / 2) AS periodos,
       (((a.dias_solicitados + 1) / 2) * 2) AS dias_cobrados,
       a.precio_por_periodo,
       (((a.dias_solicitados + 1) / 2) * a.precio_por_periodo) AS costo_total
FROM alquiler a;

CREATE VIEW v_calculo_mora AS
SELECT d.id_devolucion, a.fecha_devolucion_acordada, d.fecha_real,
       MAX(0, CAST(julianday(d.fecha_real) - julianday(a.fecha_devolucion_acordada) AS INTEGER)) AS dias_retraso,
       CASE WHEN julianday(d.fecha_real) > julianday(a.fecha_devolucion_acordada)
            THEN CAST((julianday(d.fecha_real) - julianday(a.fecha_devolucion_acordada) + 1) / 2 AS INTEGER)
            ELSE 0 END AS periodos_mora
FROM devolucion d
JOIN alquiler a ON a.id_alquiler = d.id_alquiler;

CREATE TRIGGER fabricar_activo_disponible
AFTER UPDATE OF estado ON fabricacion
WHEN NEW.estado = 'completada' AND OLD.estado <> 'completada'
BEGIN
    INSERT INTO inventario (id_paquete, total, disponible, alquilado, vendido, reparacion)
    VALUES (NEW.id_paquete, NEW.cantidad, NEW.cantidad, 0, 0, 0)
    ON CONFLICT(id_paquete) DO UPDATE SET total = total + NEW.cantidad, disponible = disponible + NEW.cantidad;
END;

CREATE TRIGGER auditar_venta
AFTER INSERT ON venta
BEGIN
    INSERT INTO registro_cambio (tabla, operacion, clave) VALUES ('venta', 'INSERT', CAST(NEW.id_venta AS TEXT));
END;

CREATE TRIGGER auditar_alquiler
AFTER INSERT ON alquiler
BEGIN
    INSERT INTO registro_cambio (tabla, operacion, clave) VALUES ('alquiler', 'INSERT', CAST(NEW.id_alquiler AS TEXT));
END;

CREATE TRIGGER auditar_devolucion
AFTER INSERT ON devolucion
BEGIN
    INSERT INTO registro_cambio (tabla, operacion, clave) VALUES ('devolucion', 'INSERT', CAST(NEW.id_devolucion AS TEXT));
END;

CREATE TRIGGER auditar_fabricacion
AFTER UPDATE OF estado ON fabricacion
WHEN NEW.estado = 'completada' AND OLD.estado <> 'completada'
BEGIN
    INSERT INTO registro_cambio (tabla, operacion, clave) VALUES ('fabricacion', 'UPDATE', CAST(NEW.id_fabricacion AS TEXT));
END;

-- SQLite no dispone de procedimientos almacenados. Estas operaciones se ejecutan
-- desde los servicios con la misma unidad transaccional:
-- BEGIN IMMEDIATE;
--   validar disponibilidad;
--   INSERT maestro;
--   INSERT detalle;
--   registrar pago;
--   actualizar inventario;
-- COMMIT;
-- Ante cualquier error se ejecuta ROLLBACK.

CREATE TRIGGER validar_detalle_venta_disponibilidad
BEFORE INSERT ON detalle_venta
WHEN (SELECT estado FROM venta WHERE id_venta = NEW.id_venta) = 'confirmada'
BEGIN
    SELECT CASE WHEN (SELECT disponible FROM inventario WHERE id_paquete = NEW.id_paquete) < NEW.cantidad
        THEN RAISE(ABORT, 'Inventario insuficiente para la venta') END;
END;

CREATE TRIGGER actualizar_inventario_venta
AFTER INSERT ON detalle_venta
WHEN (SELECT estado FROM venta WHERE id_venta = NEW.id_venta) = 'confirmada'
BEGIN
    UPDATE inventario SET disponible = disponible - NEW.cantidad, vendido = vendido + NEW.cantidad WHERE id_paquete = NEW.id_paquete;
END;

CREATE TRIGGER validar_detalle_alquiler_disponibilidad
BEFORE INSERT ON detalle_alquiler
WHEN (SELECT estado FROM alquiler WHERE id_alquiler = NEW.id_alquiler) IN ('confirmado', 'activo')
BEGIN
    SELECT CASE WHEN (SELECT disponible FROM inventario WHERE id_paquete = NEW.id_paquete) < NEW.cantidad
        THEN RAISE(ABORT, 'Inventario insuficiente para el alquiler') END;
END;

CREATE TRIGGER actualizar_inventario_alquiler
AFTER INSERT ON detalle_alquiler
WHEN (SELECT estado FROM alquiler WHERE id_alquiler = NEW.id_alquiler) IN ('confirmado', 'activo')
BEGIN
    UPDATE inventario SET disponible = disponible - NEW.cantidad, alquilado = alquilado + NEW.cantidad WHERE id_paquete = NEW.id_paquete;
END;

CREATE TRIGGER validar_devolucion_fecha
BEFORE INSERT ON devolucion
BEGIN
    SELECT CASE WHEN date(NEW.fecha_real) < (SELECT date(fecha_inicio) FROM alquiler WHERE id_alquiler = NEW.id_alquiler)
        THEN RAISE(ABORT, 'La devolución no puede ser anterior al inicio del alquiler') END;
END;

CREATE TRIGGER actualizar_inventario_devolucion
AFTER INSERT ON devolucion
BEGIN
    UPDATE inventario
    SET alquilado = alquilado - (SELECT SUM(cantidad) FROM detalle_alquiler WHERE id_alquiler = NEW.id_alquiler),
        disponible = disponible + (SELECT SUM(cantidad) FROM detalle_alquiler WHERE id_alquiler = NEW.id_alquiler)
    WHERE id_paquete IN (SELECT id_paquete FROM detalle_alquiler WHERE id_alquiler = NEW.id_alquiler);
    UPDATE alquiler SET estado = CASE WHEN NEW.estado_mobiliario = 'reparacion' THEN 'devuelto_reparacion' ELSE 'devuelto' END WHERE id_alquiler = NEW.id_alquiler;
END;

CREATE TRIGGER registrar_reparacion_devolucion
AFTER INSERT ON devolucion
WHEN NEW.estado_mobiliario = 'reparacion'
BEGIN
    INSERT INTO reparacion (id_paquete, id_devolucion, motivo, estado)
    SELECT id_paquete, NEW.id_devolucion, 'Mobiliario recibido con daños', 'pendiente'
    FROM detalle_alquiler WHERE id_alquiler = NEW.id_alquiler;
    UPDATE inventario
    SET disponible = disponible - (SELECT SUM(cantidad) FROM detalle_alquiler WHERE id_alquiler = NEW.id_alquiler),
        reparacion = reparacion + (SELECT SUM(cantidad) FROM detalle_alquiler WHERE id_alquiler = NEW.id_alquiler)
    WHERE id_paquete IN (SELECT id_paquete FROM detalle_alquiler WHERE id_alquiler = NEW.id_alquiler);
END;

COMMIT;
