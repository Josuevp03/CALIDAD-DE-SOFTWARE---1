-- Datos de demostracion para database_mysql.sql.
-- Importar este archivo despues de database_mysql.sql.

SET NAMES utf8mb4;
START TRANSACTION;

INSERT IGNORE INTO rol (id_rol, nombre, descripcion) VALUES
(1, 'Administrador', 'Acceso completo al sistema'),
(2, 'Coordinador comercial', 'Ventas, alquileres, clientes y reportes'),
(3, 'Diseñador', 'Paquetes y fabricacion'),
(4, 'Supervisor de taller', 'Fabricacion, inventario y control'),
(5, 'Artesano', 'Ejecucion de fabricaciones'),
(6, 'Vendedor', 'Ventas y atencion comercial');

INSERT IGNORE INTO usuario (id_usuario, id_rol, nombre, apellido, correo, password_hash, password_salt) VALUES
(1, 1, 'Ana', 'Administrador', 'admin@fiestaboliviana.local', 'houEGGLqPllcVPOvfzbtAV/dctSVlVF74H+bkfKEPbE=', 'iCjmdl058mESnDihvRWeXg=='),
(2, 2, 'Carlos', 'Coordinador', 'coordinador@fiestaboliviana.local', 'HoOiyNBHHtmgLDPu5s8CBuSporJZrj9Eqz7mCjZaZmg=', '+I5+JTnnPOEeSNDbH2DVuw=='),
(3, 3, 'Laura', 'Diseñadora', 'disenador@fiestaboliviana.local', 'ceC5ewjgD33g0wj1eeNIzP6ojgQC0jtHDLIINyMOp6I=', 'RgUW1yxmPsNKxTCDERjI3g=='),
(4, 4, 'Miguel', 'Supervisor', 'supervisor@fiestaboliviana.local', '6Kcu98o1ioa5WZRYJjlpgGmAtQVIy+gh/9/l8shy03Y=', 'a7O7APvXf/7W2wSNDZn/Yw=='),
(5, 5, 'Juan', 'Artesano', 'artesano@fiestaboliviana.local', 'Dp7zuzpUjielaxQc+a44KHI5ICNtm6yJX8ed9J9usdA=', 'nEcRzCIgLzE1bq48D8eA6g=='),
(6, 6, 'Sofía', 'Vendedora', 'vendedor@fiestaboliviana.local', 'yWLMMaphhAMMgmOxGPpqaqb4M3xg3mpW2YTPUNduFzo=', 'PfDeI9fCsDozeLBS+qQSbg==');

INSERT IGNORE INTO cliente (id_cliente, nombre, apellido, documento, telefono, correo, direccion, ciudad, observaciones) VALUES
(1, 'María', 'López', '4587210 LP', '70123456', 'maria.lopez@email.com', 'Av. Arce 120', 'La Paz', 'Cliente frecuente'),
(2, 'Carlos', 'Pérez', '6234187 CB', '71234567', 'carlos.perez@email.com', 'Calle Sucre 45', 'Cochabamba', 'Quinceañeros'),
(3, 'Empresa', 'ABC', '10203040 SC', '76543210', 'eventos@empresaabc.com', 'Av. Banzer 500', 'Santa Cruz', 'Cliente corporativo'),
(4, 'Grupo', 'Sol', '7845123 OR', '69876543', 'contacto@gruposol.com', 'Calle Bolívar 88', 'Oruro', 'Eventos tradicionales');

INSERT IGNORE INTO tipo_evento (id_tipo_evento, nombre) VALUES
(1, 'Boda'), (2, 'Quinceañero'), (3, 'Graduación'), (4, 'Evento empresarial'),
(5, 'Bautizo'), (6, 'Fiesta patronal'), (7, 'Celebración tradicional'), (8, 'Otro');

INSERT IGNORE INTO evento (id_evento, id_cliente, id_tipo_evento, nombre, fecha, hora, lugar, ciudad, direccion, preferencias, observaciones) VALUES
(1, 1, 1, 'Boda María López', '2026-09-20', '18:00:00', 'Salón Colonial', 'La Paz', 'Av. Costanera 120', 'Tonos blancos y dorados', ''),
(2, 2, 2, 'Quinceañero Carlos Pérez', '2026-09-25', '19:30:00', 'Salón Imperial', 'Cochabamba', 'Av. Blanco Galindo 50', 'Decoración rosada', ''),
(3, 3, 4, 'Evento empresarial ABC', '2026-10-02', '09:00:00', 'Centro de Convenciones', 'Santa Cruz', 'Av. Las Palmas 400', 'Imagen corporativa azul', 'Montaje temprano');

INSERT IGNORE INTO categoria (id_categoria, nombre, descripcion) VALUES
(1, 'Boda', 'Paquetes para bodas'), (2, 'Fiesta', 'Celebraciones sociales'), (3, 'Campestre', 'Ambientaciones rústicas'), (4, 'Corporativo', 'Eventos empresariales');

INSERT IGNORE INTO paquete_decorativo (id_paquete, codigo, id_categoria, nombre, descripcion, precio_venta, precio_alquiler_periodo, color, material, tematica, capacidad) VALUES
(1, 'PK-101', 1, 'Clásico Elegante', 'Set formal para bodas', 1800, 650, 'Blanco', 'Tela premium', 'Clásico', 80),
(2, 'PK-102', 2, 'Temático', 'Kit festivo para quinceañeros', 2400, 820, 'Rojo', 'Vinil y tela', 'Fiesta', 60),
(3, 'PK-103', 3, 'Rustic', 'Ambientación campestre', 1950, 700, 'Madera', 'Madera y yute', 'Rustic', 50),
(4, 'PK-104', 4, 'Moderno', 'Diseño minimalista corporativo', 2700, 900, 'Gris', 'Aluminio y tela', 'Moderno', 70);

INSERT IGNORE INTO artesano (id_artesano, id_usuario, nombre, especialidad) VALUES
(1, 5, 'Juan Quispe', 'Montaje de estructuras'), (2, NULL, 'María Condori', 'Decoración floral');
INSERT IGNORE INTO disenador (id_disenador, id_usuario, nombre, especialidad) VALUES
(1, 3, 'Laura Diseñadora', 'Diseño temático');
INSERT IGNORE INTO supervisor (id_supervisor, id_usuario, nombre) VALUES
(1, 4, 'Miguel Supervisor');

INSERT IGNORE INTO fabricacion (id_fabricacion, id_paquete, id_disenador, id_supervisor, fecha_inicio, fecha_fin, cantidad, eficiencia_equipo, estado, observaciones) VALUES
(1, 3, 1, 1, '2026-09-05', '2026-09-10', 4, 92, 'completada', 'Lote Rustic terminado'),
(2, 4, 1, 1, '2026-09-12', NULL, 3, 78, 'en_proceso', 'Revision de estructura');
INSERT IGNORE INTO detalle_fabricacion (id_fabricacion, id_artesano, horas_trabajadas, actividad, estado) VALUES
(1, 1, 24, 'Armado de estructuras', 'completada'),
(1, 2, 18, 'Decoracion floral', 'completada'),
(2, 1, 12, 'Montaje de paneles', 'en_proceso');

INSERT IGNORE INTO inventario (id_inventario, id_paquete, total, disponible, alquilado, vendido, reparacion) VALUES
(1, 1, 8, 6, 1, 1, 0),
(2, 2, 12, 9, 2, 1, 0),
(3, 3, 10, 7, 2, 0, 1),
(4, 4, 4, 2, 1, 0, 1);

INSERT IGNORE INTO venta (id_venta, id_cliente, fecha, subtotal, total, monto_pagado, estado) VALUES
(1, 1, '2026-09-12', 2100, 2100, 2100, 'confirmada'),
(2, 3, '2026-09-14', 7500, 7500, 3500, 'pendiente');
INSERT IGNORE INTO detalle_venta (id_venta, linea, id_paquete, cantidad, precio_unitario, subtotal) VALUES
(1, 1, 1, 1, 1800, 1800);

INSERT IGNORE INTO alquiler (id_alquiler, id_cliente, id_evento, fecha_inicio, fecha_devolucion_acordada, dias_solicitados, dias_cobrados, periodos, precio_por_periodo, total, pago_anticipado, estado) VALUES
(1, 1, 1, '2026-09-20', '2026-09-24', 4, 4, 2, 650, 1300, 1300, 'activo'),
(2, 2, 2, '2026-09-25', '2026-09-29', 4, 4, 2, 820, 1640, 820, 'pendiente');
INSERT IGNORE INTO detalle_alquiler (id_alquiler, linea, id_paquete, cantidad) VALUES
(1, 1, 1, 1), (2, 1, 2, 2);

INSERT IGNORE INTO devolucion (id_devolucion, id_alquiler, fecha_real, estado_mobiliario, observaciones) VALUES
(1, 1, '2026-09-27', 'bueno', 'Entrega con 3 días de retraso');
INSERT IGNORE INTO mora (id_mora, id_devolucion, dias_retraso, periodos_mora, recargo) VALUES
(1, 1, 3, 2, 1300);

INSERT IGNORE INTO transporte (id_transporte, id_evento, id_alquiler, vehiculo, conductor, fecha_salida, estado) VALUES
(1, 1, 1, 'Camión 2', 'Pedro Rojas', '2026-09-20', 'programado'),
(2, 2, 2, 'Van 1', 'Lucía Méndez', '2026-09-25', 'programado');

INSERT IGNORE INTO servicio_adicional (id_servicio, nombre, tipo, precio, disponibilidad) VALUES
(1, 'Decoradores especializados', 'Decoración', 1500, 4),
(2, 'Iluminación ambiental', 'Iluminación', 1200, 12),
(3, 'Mantelería premium', 'Complemento', 850, 20),
(4, 'Montaje', 'Logística', 950, 6),
(5, 'Desmontaje', 'Logística', 700, 6);
INSERT IGNORE INTO servicio_venta (id_venta, id_servicio, cantidad, precio_unitario) VALUES (1, 2, 1, 1200);
INSERT IGNORE INTO servicio_alquiler (id_alquiler, id_servicio, cantidad, precio_unitario) VALUES (1, 4, 1, 950), (1, 3, 1, 850);

INSERT IGNORE INTO montaje (id_montaje, id_alquiler, fecha_programada, responsable, estado) VALUES
(1, 1, '2026-09-20', 'Juan Quispe', 'completado');
INSERT IGNORE INTO desmontaje (id_desmontaje, id_alquiler, fecha_programada, responsable, estado) VALUES
(1, 1, '2026-09-27', 'María Condori', 'pendiente');
INSERT IGNORE INTO reparacion (id_reparacion, id_paquete, motivo, estado) VALUES
(1, 3, 'Cambio de soporte decorativo', 'en_proceso');

COMMIT;
