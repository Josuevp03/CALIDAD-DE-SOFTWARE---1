-- Esquema MySQL 8.0+ / MariaDB 10.4+
-- Importar este archivo primero en phpMyAdmin.

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

DROP VIEW IF EXISTS v_calculo_mora;
DROP VIEW IF EXISTS v_calculo_alquiler;
DROP VIEW IF EXISTS v_disponibilidad;
DROP TABLE IF EXISTS pago;
DROP TABLE IF EXISTS factura;
DROP TABLE IF EXISTS reparacion;
DROP TABLE IF EXISTS desmontaje;
DROP TABLE IF EXISTS montaje;
DROP TABLE IF EXISTS servicio_alquiler;
DROP TABLE IF EXISTS servicio_venta;
DROP TABLE IF EXISTS servicio_adicional;
DROP TABLE IF EXISTS transporte;
DROP TABLE IF EXISTS mora;
DROP TABLE IF EXISTS devolucion;
DROP TABLE IF EXISTS detalle_alquiler;
DROP TABLE IF EXISTS alquiler;
DROP TABLE IF EXISTS detalle_venta;
DROP TABLE IF EXISTS venta;
DROP TABLE IF EXISTS inventario;
DROP TABLE IF EXISTS detalle_fabricacion;
DROP TABLE IF EXISTS fabricacion;
DROP TABLE IF EXISTS supervisor;
DROP TABLE IF EXISTS disenador;
DROP TABLE IF EXISTS artesano;
DROP TABLE IF EXISTS paquete_decorativo;
DROP TABLE IF EXISTS categoria;
DROP TABLE IF EXISTS evento;
DROP TABLE IF EXISTS tipo_evento;
DROP TABLE IF EXISTS cliente;
DROP TABLE IF EXISTS usuario;
DROP TABLE IF EXISTS rol;
DROP TABLE IF EXISTS registro_cambio;

CREATE TABLE rol (
    id_rol INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(60) NOT NULL UNIQUE,
    descripcion VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    id_rol INT NOT NULL,
    nombre VARCHAR(80) NOT NULL,
    apellido VARCHAR(80) NOT NULL,
    correo VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    password_salt VARCHAR(255) NOT NULL,
    activo TINYINT(1) NOT NULL DEFAULT 1,
    creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_rol) REFERENCES rol(id_rol) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE cliente (
    id_cliente INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    documento VARCHAR(30) NOT NULL UNIQUE,
    telefono VARCHAR(30) NOT NULL,
    correo VARCHAR(150) UNIQUE,
    direccion VARCHAR(200),
    ciudad VARCHAR(80) NOT NULL,
    observaciones VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE tipo_evento (
    id_tipo_evento INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(80) NOT NULL UNIQUE,
    activo TINYINT(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE evento (
    id_evento INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT NOT NULL,
    id_tipo_evento INT NOT NULL,
    nombre VARCHAR(120) NOT NULL,
    fecha DATE NOT NULL,
    hora TIME,
    lugar VARCHAR(150) NOT NULL,
    ciudad VARCHAR(80) NOT NULL,
    direccion VARCHAR(200),
    preferencias VARCHAR(255),
    observaciones VARCHAR(255),
    FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente) ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (id_tipo_evento) REFERENCES tipo_evento(id_tipo_evento) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE categoria (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE paquete_decorativo (
    id_paquete INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(30) NOT NULL UNIQUE,
    id_categoria INT NOT NULL,
    nombre VARCHAR(120) NOT NULL,
    descripcion VARCHAR(255),
    precio_venta DECIMAL(12,2) NOT NULL DEFAULT 0 CHECK (precio_venta >= 0),
    precio_alquiler_periodo DECIMAL(12,2) NOT NULL DEFAULT 0 CHECK (precio_alquiler_periodo >= 0),
    color VARCHAR(80),
    material VARCHAR(100),
    tematica VARCHAR(100),
    capacidad INT NOT NULL CHECK (capacidad > 0),
    activo TINYINT(1) NOT NULL DEFAULT 1,
    FOREIGN KEY (id_categoria) REFERENCES categoria(id_categoria) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE artesano (
    id_artesano INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT UNIQUE,
    nombre VARCHAR(120) NOT NULL,
    especialidad VARCHAR(120),
    activo TINYINT(1) NOT NULL DEFAULT 1,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE disenador (
    id_disenador INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT UNIQUE,
    nombre VARCHAR(120) NOT NULL,
    especialidad VARCHAR(120),
    activo TINYINT(1) NOT NULL DEFAULT 1,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE supervisor (
    id_supervisor INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT UNIQUE,
    nombre VARCHAR(120) NOT NULL,
    activo TINYINT(1) NOT NULL DEFAULT 1,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE fabricacion (
    id_fabricacion INT AUTO_INCREMENT PRIMARY KEY,
    id_paquete INT NOT NULL,
    id_disenador INT,
    id_supervisor INT,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE,
    cantidad INT NOT NULL CHECK (cantidad > 0),
    eficiencia_equipo DECIMAL(6,2) CHECK (eficiencia_equipo IS NULL OR eficiencia_equipo BETWEEN 0 AND 100),
    estado VARCHAR(20) NOT NULL DEFAULT 'planificada',
    observaciones VARCHAR(255),
    FOREIGN KEY (id_paquete) REFERENCES paquete_decorativo(id_paquete) ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (id_disenador) REFERENCES disenador(id_disenador) ON UPDATE CASCADE ON DELETE SET NULL,
    FOREIGN KEY (id_supervisor) REFERENCES supervisor(id_supervisor) ON UPDATE CASCADE ON DELETE SET NULL,
    CHECK (estado IN ('planificada','en_proceso','completada','cancelada')),
    CHECK (fecha_fin IS NULL OR fecha_fin >= fecha_inicio)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE detalle_fabricacion (
    id_fabricacion INT NOT NULL,
    id_artesano INT NOT NULL,
    horas_trabajadas DECIMAL(8,2) NOT NULL CHECK (horas_trabajadas > 0),
    actividad VARCHAR(160) NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'asignada',
    PRIMARY KEY (id_fabricacion, id_artesano),
    FOREIGN KEY (id_fabricacion) REFERENCES fabricacion(id_fabricacion) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (id_artesano) REFERENCES artesano(id_artesano) ON UPDATE CASCADE ON DELETE RESTRICT,
    CHECK (estado IN ('asignada','en_proceso','completada'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE inventario (
    id_inventario INT AUTO_INCREMENT PRIMARY KEY,
    id_paquete INT NOT NULL UNIQUE,
    total INT NOT NULL DEFAULT 0 CHECK (total >= 0),
    disponible INT NOT NULL DEFAULT 0 CHECK (disponible >= 0),
    alquilado INT NOT NULL DEFAULT 0 CHECK (alquilado >= 0),
    vendido INT NOT NULL DEFAULT 0 CHECK (vendido >= 0),
    reparacion INT NOT NULL DEFAULT 0 CHECK (reparacion >= 0),
    FOREIGN KEY (id_paquete) REFERENCES paquete_decorativo(id_paquete) ON UPDATE CASCADE ON DELETE RESTRICT,
    CHECK (total = disponible + alquilado + vendido + reparacion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE venta (
    id_venta INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT NOT NULL,
    fecha DATE NOT NULL DEFAULT (CURRENT_DATE),
    subtotal DECIMAL(12,2) NOT NULL DEFAULT 0 CHECK (subtotal >= 0),
    total DECIMAL(12,2) NOT NULL DEFAULT 0 CHECK (total >= 0),
    monto_pagado DECIMAL(12,2) NOT NULL DEFAULT 0 CHECK (monto_pagado >= 0 AND monto_pagado <= total),
    estado VARCHAR(20) NOT NULL DEFAULT 'pendiente',
    FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente) ON UPDATE CASCADE ON DELETE RESTRICT,
    CHECK (estado IN ('pendiente','confirmada','cancelada')),
    CHECK (estado <> 'confirmada' OR monto_pagado = total)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE detalle_venta (
    id_venta INT NOT NULL,
    linea INT NOT NULL,
    id_paquete INT NOT NULL,
    cantidad INT NOT NULL CHECK (cantidad > 0),
    precio_unitario DECIMAL(12,2) NOT NULL CHECK (precio_unitario >= 0),
    subtotal DECIMAL(12,2) NOT NULL,
    PRIMARY KEY (id_venta, linea),
    FOREIGN KEY (id_venta) REFERENCES venta(id_venta) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (id_paquete) REFERENCES paquete_decorativo(id_paquete) ON UPDATE CASCADE ON DELETE RESTRICT,
    CHECK (subtotal = cantidad * precio_unitario)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE alquiler (
    id_alquiler INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT NOT NULL,
    id_evento INT NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_devolucion_acordada DATE NOT NULL,
    dias_solicitados INT NOT NULL CHECK (dias_solicitados > 0),
    dias_cobrados INT NOT NULL,
    periodos INT NOT NULL,
    precio_por_periodo DECIMAL(12,2) NOT NULL CHECK (precio_por_periodo >= 0),
    total DECIMAL(12,2) NOT NULL,
    pago_anticipado DECIMAL(12,2) NOT NULL DEFAULT 0 CHECK (pago_anticipado >= 0),
    estado VARCHAR(25) NOT NULL DEFAULT 'pendiente',
    FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente) ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (id_evento) REFERENCES evento(id_evento) ON UPDATE CASCADE ON DELETE RESTRICT,
    CHECK (dias_cobrados = CEIL(dias_solicitados / 2) * 2),
    CHECK (periodos = CEIL(dias_solicitados / 2)),
    CHECK (total = periodos * precio_por_periodo),
    CHECK (fecha_devolucion_acordada > fecha_inicio),
    CHECK (estado IN ('pendiente','confirmado','activo','devuelto','devuelto_reparacion','cancelado'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE detalle_alquiler (
    id_alquiler INT NOT NULL,
    linea INT NOT NULL,
    id_paquete INT NOT NULL,
    cantidad INT NOT NULL CHECK (cantidad > 0),
    PRIMARY KEY (id_alquiler, linea),
    FOREIGN KEY (id_alquiler) REFERENCES alquiler(id_alquiler) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (id_paquete) REFERENCES paquete_decorativo(id_paquete) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE devolucion (
    id_devolucion INT AUTO_INCREMENT PRIMARY KEY,
    id_alquiler INT NOT NULL UNIQUE,
    fecha_real DATE NOT NULL,
    estado_mobiliario VARCHAR(20) NOT NULL,
    observaciones VARCHAR(255),
    FOREIGN KEY (id_alquiler) REFERENCES alquiler(id_alquiler) ON UPDATE CASCADE ON DELETE RESTRICT,
    CHECK (estado_mobiliario IN ('bueno','reparacion'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE mora (
    id_mora INT AUTO_INCREMENT PRIMARY KEY,
    id_devolucion INT NOT NULL UNIQUE,
    dias_retraso INT NOT NULL DEFAULT 0 CHECK (dias_retraso >= 0),
    periodos_mora INT NOT NULL DEFAULT 0 CHECK (periodos_mora >= 0),
    recargo DECIMAL(12,2) NOT NULL DEFAULT 0 CHECK (recargo >= 0),
    FOREIGN KEY (id_devolucion) REFERENCES devolucion(id_devolucion) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE transporte (
    id_transporte INT AUTO_INCREMENT PRIMARY KEY,
    id_evento INT NOT NULL,
    id_alquiler INT,
    vehiculo VARCHAR(80) NOT NULL,
    conductor VARCHAR(120),
    fecha_salida DATE,
    estado VARCHAR(20) NOT NULL DEFAULT 'programado',
    FOREIGN KEY (id_evento) REFERENCES evento(id_evento) ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (id_alquiler) REFERENCES alquiler(id_alquiler) ON UPDATE CASCADE ON DELETE SET NULL,
    CHECK (estado IN ('programado','en_transito','entregado','cancelado'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE servicio_adicional (
    id_servicio INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(120) NOT NULL UNIQUE,
    tipo VARCHAR(80) NOT NULL,
    precio DECIMAL(12,2) NOT NULL CHECK (precio >= 0),
    disponibilidad INT NOT NULL DEFAULT 0 CHECK (disponibilidad >= 0),
    activo TINYINT(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE servicio_venta (
    id_venta INT NOT NULL,
    id_servicio INT NOT NULL,
    cantidad INT NOT NULL CHECK (cantidad > 0),
    precio_unitario DECIMAL(12,2) NOT NULL CHECK (precio_unitario >= 0),
    PRIMARY KEY (id_venta, id_servicio),
    FOREIGN KEY (id_venta) REFERENCES venta(id_venta) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (id_servicio) REFERENCES servicio_adicional(id_servicio) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE servicio_alquiler (
    id_alquiler INT NOT NULL,
    id_servicio INT NOT NULL,
    cantidad INT NOT NULL CHECK (cantidad > 0),
    precio_unitario DECIMAL(12,2) NOT NULL CHECK (precio_unitario >= 0),
    PRIMARY KEY (id_alquiler, id_servicio),
    FOREIGN KEY (id_alquiler) REFERENCES alquiler(id_alquiler) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (id_servicio) REFERENCES servicio_adicional(id_servicio) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE montaje (
    id_montaje INT AUTO_INCREMENT PRIMARY KEY,
    id_alquiler INT NOT NULL UNIQUE,
    fecha_programada DATE NOT NULL,
    responsable VARCHAR(120),
    estado VARCHAR(20) NOT NULL DEFAULT 'pendiente',
    observaciones VARCHAR(255),
    FOREIGN KEY (id_alquiler) REFERENCES alquiler(id_alquiler) ON UPDATE CASCADE ON DELETE RESTRICT,
    CHECK (estado IN ('pendiente','en_proceso','completado','cancelado'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE desmontaje (
    id_desmontaje INT AUTO_INCREMENT PRIMARY KEY,
    id_alquiler INT NOT NULL UNIQUE,
    fecha_programada DATE NOT NULL,
    responsable VARCHAR(120),
    estado VARCHAR(20) NOT NULL DEFAULT 'pendiente',
    observaciones VARCHAR(255),
    FOREIGN KEY (id_alquiler) REFERENCES alquiler(id_alquiler) ON UPDATE CASCADE ON DELETE RESTRICT,
    CHECK (estado IN ('pendiente','en_proceso','completado','cancelado'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE reparacion (
    id_reparacion INT AUTO_INCREMENT PRIMARY KEY,
    id_paquete INT NOT NULL,
    id_devolucion INT,
    fecha_ingreso DATE NOT NULL DEFAULT (CURRENT_DATE),
    fecha_salida DATE,
    motivo VARCHAR(255) NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'pendiente',
    FOREIGN KEY (id_paquete) REFERENCES paquete_decorativo(id_paquete) ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (id_devolucion) REFERENCES devolucion(id_devolucion) ON UPDATE CASCADE ON DELETE SET NULL,
    CHECK (estado IN ('pendiente','en_proceso','completada','cancelada')),
    CHECK (fecha_salida IS NULL OR fecha_salida >= fecha_ingreso)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE registro_cambio (
    id_cambio INT AUTO_INCREMENT PRIMARY KEY,
    tabla VARCHAR(80) NOT NULL,
    operacion VARCHAR(10) NOT NULL,
    clave VARCHAR(80),
    creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CHECK (operacion IN ('INSERT','UPDATE','DELETE'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_usuario_rol ON usuario(id_rol);
CREATE INDEX idx_evento_cliente_fecha ON evento(id_cliente, fecha);
CREATE INDEX idx_evento_tipo_fecha ON evento(id_tipo_evento, fecha);
CREATE INDEX idx_paquete_categoria ON paquete_decorativo(id_categoria);
CREATE INDEX idx_fabricacion_paquete_estado ON fabricacion(id_paquete, estado);
CREATE INDEX idx_venta_cliente_fecha ON venta(id_cliente, fecha);
CREATE INDEX idx_alquiler_cliente_estado ON alquiler(id_cliente, estado);
CREATE INDEX idx_alquiler_fechas ON alquiler(fecha_inicio, fecha_devolucion_acordada);
CREATE INDEX idx_devolucion_fecha ON devolucion(fecha_real);
CREATE INDEX idx_mora_retraso ON mora(dias_retraso);
CREATE INDEX idx_transporte_evento_estado ON transporte(id_evento, estado);
CREATE INDEX idx_reparacion_paquete_estado ON reparacion(id_paquete, estado);
CREATE INDEX idx_registro_cambio_tabla_fecha ON registro_cambio(tabla, creado_en);

CREATE OR REPLACE VIEW v_disponibilidad AS
SELECT p.id_paquete, p.codigo, p.nombre,
       COALESCE(i.total, 0) AS total,
       COALESCE(i.disponible, 0) AS disponible,
       COALESCE(i.alquilado, 0) AS alquilado,
       COALESCE(i.vendido, 0) AS vendido,
       COALESCE(i.reparacion, 0) AS reparacion
FROM paquete_decorativo p
LEFT JOIN inventario i ON i.id_paquete = p.id_paquete;

CREATE OR REPLACE VIEW v_calculo_alquiler AS
SELECT id_alquiler, dias_solicitados,
       CEIL(dias_solicitados / 2) AS periodos,
       CEIL(dias_solicitados / 2) * 2 AS dias_cobrados,
       precio_por_periodo,
       CEIL(dias_solicitados / 2) * precio_por_periodo AS costo_total
FROM alquiler;

CREATE OR REPLACE VIEW v_calculo_mora AS
SELECT d.id_devolucion, a.fecha_devolucion_acordada, d.fecha_real,
       GREATEST(0, DATEDIFF(d.fecha_real, a.fecha_devolucion_acordada)) AS dias_retraso,
       CASE WHEN d.fecha_real > a.fecha_devolucion_acordada
            THEN CEIL(DATEDIFF(d.fecha_real, a.fecha_devolucion_acordada) / 2)
            ELSE 0 END AS periodos_mora
FROM devolucion d
JOIN alquiler a ON a.id_alquiler = d.id_alquiler;

SET FOREIGN_KEY_CHECKS = 1;
