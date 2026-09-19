<?php
// API de la aplicacion. Cambia DB_NAME si creaste la base con otro nombre.
const DB_HOST = '127.0.0.1';
const DB_NAME = 'test2';
const DB_USER = 'root';
const DB_PASS = '';

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

function respond($data, $status = 200) {
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function database() {
    static $pdo;
    if ($pdo) return $pdo;
    try {
        $pdo = new PDO(
            'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4',
            DB_USER,
            DB_PASS,
            [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]
        );
        return $pdo;
    } catch (Throwable $error) {
        respond(['success' => false, 'message' => 'No se pudo conectar a MySQL. Revisa DB_NAME, usuario y contraseña.', 'detail' => $error->getMessage()], 500);
    }
}

function input() {
    $raw = file_get_contents('php://input');
    $data = json_decode($raw ?: '{}', true);
    return is_array($data) ? $data : [];
}

function bootstrap() {
    $pdo = database();
    $data = [
        'packages' => [], 'rentals' => [], 'clients' => [], 'events' => [], 'returns' => [],
        'repairs' => [], 'fabrication' => [], 'sales' => [], 'services' => [], 'users' => []
    ];

    $rows = $pdo->query("SELECT p.*, c.nombre AS categoria, COALESCE(i.total, 0) AS total, COALESCE(i.disponible, 0) AS disponible, COALESCE(i.alquilado, 0) AS alquilado, COALESCE(i.vendido, 0) AS vendido, COALESCE(i.reparacion, 0) AS reparacion FROM paquete_decorativo p JOIN categoria c ON c.id_categoria = p.id_categoria LEFT JOIN inventario i ON i.id_paquete = p.id_paquete ORDER BY p.id_paquete")->fetchAll();
    foreach ($rows as $row) {
        $data['packages'][] = [
            'id' => (int)$row['id_paquete'], 'code' => $row['codigo'], 'name' => $row['nombre'],
            'description' => $row['descripcion'] ?? '', 'category' => $row['categoria'],
            'salePrice' => (float)$row['precio_venta'], 'rentalPrice' => (float)$row['precio_alquiler_periodo'],
            'color' => $row['color'] ?? '', 'material' => $row['material'] ?? '', 'theme' => $row['tematica'] ?? '',
            'capacity' => (int)$row['capacidad'], 'total' => (int)$row['total'], 'available' => (int)$row['disponible'],
            'rented' => (int)$row['alquilado'], 'sold' => (int)$row['vendido'], 'repair' => (int)$row['reparacion'],
            'stock' => (int)$row['disponible'], 'status' => (int)$row['reparacion'] > 0 ? 'reparacion' : ((int)$row['disponible'] > 0 ? 'disponible' : 'alquilado')
        ];
    }

    foreach ($pdo->query('SELECT * FROM cliente ORDER BY id_cliente')->fetchAll() as $row) {
        $data['clients'][] = ['id' => (int)$row['id_cliente'], 'firstName' => $row['nombre'], 'lastName' => $row['apellido'], 'document' => $row['documento'], 'phone' => $row['telefono'], 'email' => $row['correo'] ?? '', 'address' => $row['direccion'] ?? '', 'city' => $row['ciudad'], 'notes' => $row['observaciones'] ?? ''];
    }

    foreach ($pdo->query('SELECT e.*, t.nombre AS tipo_evento, CONCAT(c.nombre, " ", c.apellido) AS cliente FROM evento e JOIN tipo_evento t ON t.id_tipo_evento = e.id_tipo_evento JOIN cliente c ON c.id_cliente = e.id_cliente ORDER BY e.fecha')->fetchAll() as $row) {
        $data['events'][] = ['id' => (int)$row['id_evento'], 'event' => $row['nombre'], 'eventType' => $row['tipo_evento'], 'client' => $row['cliente'], 'date' => $row['fecha'], 'time' => $row['hora'] ?? '', 'place' => $row['lugar'], 'city' => $row['ciudad'], 'address' => $row['direccion'] ?? '', 'preferences' => $row['preferencias'] ?? '', 'notes' => $row['observaciones'] ?? '', 'status' => 'Confirmado'];
    }

    $rentalSql = "SELECT a.*, CONCAT(c.nombre, ' ', c.apellido) AS cliente, e.nombre AS evento, p.nombre AS paquete, p.id_paquete, da.cantidad, p.precio_alquiler_periodo, EXISTS (SELECT 1 FROM devolucion d WHERE d.id_alquiler = a.id_alquiler) AS ya_devuelto FROM alquiler a JOIN cliente c ON c.id_cliente = a.id_cliente JOIN evento e ON e.id_evento = a.id_evento JOIN detalle_alquiler da ON da.id_alquiler = a.id_alquiler JOIN paquete_decorativo p ON p.id_paquete = da.id_paquete ORDER BY a.id_alquiler";
    foreach ($pdo->query($rentalSql)->fetchAll() as $row) {
        $status = ($row['ya_devuelto'] ? 'devuelto' : $row['estado']);
        $data['rentals'][] = ['id' => 'AL-' . $row['id_alquiler'], 'dbId' => (int)$row['id_alquiler'], 'client' => $row['cliente'], 'event' => $row['evento'], 'package' => $row['paquete'], 'packageId' => (int)$row['id_paquete'], 'eventId' => null, 'quantity' => (int)$row['cantidad'], 'startDate' => $row['fecha_inicio'], 'returnDate' => $row['fecha_devolucion_acordada'], 'daysRequested' => (int)$row['dias_solicitados'], 'chargedDays' => (int)$row['dias_cobrados'], 'periods' => (int)$row['periodos'], 'pricePerPeriod' => (float)$row['precio_por_periodo'], 'total' => (float)$row['total'], 'paid' => (float)$row['pago_anticipado'], 'status' => $status, 'inventoryReserved' => in_array($status, ['confirmado', 'activo'], true), 'createdAt' => $row['fecha_inicio']];
    }

    foreach ($pdo->query('SELECT d.*, a.id_alquiler, a.fecha_devolucion_acordada, a.pago_anticipado, a.total, CONCAT(c.nombre, " ", c.apellido) AS cliente, p.nombre AS paquete FROM devolucion d JOIN alquiler a ON a.id_alquiler = d.id_alquiler JOIN cliente c ON c.id_cliente = a.id_cliente JOIN detalle_alquiler da ON da.id_alquiler = a.id_alquiler JOIN paquete_decorativo p ON p.id_paquete = da.id_paquete ORDER BY d.id_devolucion')->fetchAll() as $row) {
        $lateDays = max(0, (int)((strtotime($row['fecha_real']) - strtotime($row['fecha_devolucion_acordada'])) / 86400));
        $data['returns'][] = ['id' => 'DEV-' . str_pad($row['id_devolucion'], 3, '0', STR_PAD_LEFT), 'rentalId' => 'AL-' . $row['id_alquiler'], 'client' => $row['cliente'], 'package' => $row['paquete'], 'agreedDate' => $row['fecha_devolucion_acordada'], 'actualDate' => $row['fecha_real'], 'lateDays' => $lateDays, 'latePeriods' => $lateDays > 0 ? (int)ceil($lateDays / 2) : 0, 'surcharge' => 0, 'condition' => $row['estado_mobiliario'], 'notes' => $row['observaciones'] ?? '', 'status' => $lateDays > 0 ? 'atrasado' : 'entregado'];
    }

    foreach ($pdo->query('SELECT u.*, r.nombre AS rol FROM usuario u JOIN rol r ON r.id_rol = u.id_rol WHERE u.activo = 1 ORDER BY u.id_usuario')->fetchAll() as $row) {
        $data['users'][] = ['id' => (int)$row['id_usuario'], 'email' => $row['correo'], 'name' => trim($row['nombre'] . ' ' . $row['apellido']), 'role' => $row['rol'], 'passwordHash' => $row['password_hash'], 'passwordSalt' => $row['password_salt'], 'activo' => true];
    }

    foreach ($pdo->query('SELECT * FROM servicio_adicional ORDER BY id_servicio')->fetchAll() as $row) {
        $data['services'][] = ['id' => (int)$row['id_servicio'], 'name' => $row['nombre'], 'type' => $row['tipo'], 'price' => (float)$row['precio'], 'availability' => (int)$row['disponibilidad'], 'status' => (int)$row['activo'] ? 'disponible' : 'agotado', 'associations' => []];
    }
    foreach ($pdo->query('SELECT v.*, CONCAT(c.nombre, " ", c.apellido) AS cliente FROM venta v JOIN cliente c ON c.id_cliente = v.id_cliente ORDER BY v.id_venta')->fetchAll() as $row) {
        $data['sales'][] = ['id' => 'FV-' . $row['id_venta'], 'dbId' => (int)$row['id_venta'], 'client' => $row['cliente'], 'amount' => (float)$row['total'], 'total' => (float)$row['total'], 'paid' => (float)$row['monto_pagado'], 'date' => $row['fecha'], 'status' => $row['estado'] === 'confirmada' ? 'pagado' : $row['estado']];
    }
    return $data;
}

function saveClient($data) {
    $pdo = database();
    $fields = [$data['firstName'] ?? '', $data['lastName'] ?? '', $data['document'] ?? '', $data['phone'] ?? '', $data['email'] ?? null, $data['address'] ?? null, $data['city'] ?? '', $data['notes'] ?? null];
    if (!empty($data['id'])) {
        $stmt = $pdo->prepare('UPDATE cliente SET nombre=?, apellido=?, documento=?, telefono=?, correo=?, direccion=?, ciudad=?, observaciones=? WHERE id_cliente=?');
        $stmt->execute([...$fields, (int)$data['id']]);
        return ['id' => (int)$data['id']];
    }
    $stmt = $pdo->prepare('INSERT INTO cliente (nombre, apellido, documento, telefono, correo, direccion, ciudad, observaciones) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
    $stmt->execute($fields);
    return ['id' => (int)$pdo->lastInsertId()];
}

function createRental($data) {
    $pdo = database();
    $pdo->beginTransaction();
    try {
        $stmt = $pdo->prepare('INSERT INTO alquiler (id_cliente, id_evento, fecha_inicio, fecha_devolucion_acordada, dias_solicitados, dias_cobrados, periodos, precio_por_periodo, total, pago_anticipado, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
        $stmt->execute([(int)$data['clientId'], (int)$data['eventId'], $data['startDate'], $data['returnDate'], (int)$data['daysRequested'], (int)$data['chargedDays'], (int)$data['periods'], (float)$data['pricePerPeriod'], (float)$data['total'], (float)$data['paid'], $data['status'] ?? 'confirmado']);
        $id = (int)$pdo->lastInsertId();
        $detail = $pdo->prepare('INSERT INTO detalle_alquiler (id_alquiler, linea, id_paquete, cantidad) VALUES (?, 1, ?, ?)');
        $detail->execute([$id, (int)$data['packageId'], (int)$data['quantity']]);
        if (in_array($data['status'] ?? 'confirmado', ['confirmado', 'activo'], true)) $pdo->prepare('UPDATE inventario SET disponible = disponible - ?, alquilado = alquilado + ? WHERE id_paquete = ? AND disponible >= ?')->execute([(int)$data['quantity'], (int)$data['quantity'], (int)$data['packageId'], (int)$data['quantity']]);
        $pdo->commit();
        return ['id' => $id];
    } catch (Throwable $error) {
        $pdo->rollBack();
        throw $error;
    }
}

function saveEvent($data) {
    $pdo = database();
    $type = $pdo->prepare('SELECT id_tipo_evento FROM tipo_evento WHERE nombre=?');
    $type->execute([$data['eventType'] ?? 'Otro']);
    $typeId = $type->fetchColumn();
    if (!$typeId) { $pdo->prepare('INSERT INTO tipo_evento (nombre) VALUES (?)')->execute([$data['eventType'] ?? 'Otro']); $typeId = $pdo->lastInsertId(); }
    $client = $pdo->prepare('SELECT id_cliente FROM cliente WHERE CONCAT(nombre, " ", apellido)=?');
    $client->execute([$data['client'] ?? '']);
    $clientId = $client->fetchColumn();
    if (!$clientId) throw new RuntimeException('El cliente del evento no existe.');
    $fields = [$clientId, $typeId, $data['event'] ?? $data['eventType'], $data['date'], $data['time'] ?: null, $data['place'], $data['city'], $data['address'] ?? null, $data['preferences'] ?? null, $data['notes'] ?? null];
    if (!empty($data['id'])) {
        $stmt = $pdo->prepare('UPDATE evento SET id_cliente=?, id_tipo_evento=?, nombre=?, fecha=?, hora=?, lugar=?, ciudad=?, direccion=?, preferencias=?, observaciones=? WHERE id_evento=?');
        $stmt->execute([...$fields, (int)$data['id']]);
        return ['id' => (int)$data['id']];
    }
    $stmt = $pdo->prepare('INSERT INTO evento (id_cliente, id_tipo_evento, nombre, fecha, hora, lugar, ciudad, direccion, preferencias, observaciones) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    $stmt->execute($fields);
    return ['id' => (int)$pdo->lastInsertId()];
}

function createSale($data) {
    $pdo = database();
    $pdo->beginTransaction();
    try {
        $stmt = $pdo->prepare('INSERT INTO venta (id_cliente, fecha, subtotal, total, monto_pagado, estado) VALUES (?, ?, ?, ?, ?, ?)');
        $stmt->execute([(int)$data['clientId'], date('Y-m-d'), (float)$data['total'], (float)$data['total'], (float)$data['paid'], 'confirmada']);
        $id = (int)$pdo->lastInsertId();
        $line = $pdo->prepare('INSERT INTO detalle_venta (id_venta, linea, id_paquete, cantidad, precio_unitario, subtotal) VALUES (?, ?, ?, ?, ?, ?)');
        foreach (($data['items'] ?? []) as $index => $item) {
            $line->execute([$id, $index + 1, (int)$item['packageId'], (int)$item['quantity'], (float)$item['unitPrice'], (float)$item['quantity'] * (float)$item['unitPrice']]);
            $pdo->prepare('UPDATE inventario SET disponible=disponible-?, vendido=vendido+? WHERE id_paquete=? AND disponible>=?')->execute([(int)$item['quantity'], (int)$item['quantity'], (int)$item['packageId'], (int)$item['quantity']]);
        }
        $pdo->commit();
        return ['id' => $id];
    } catch (Throwable $error) { $pdo->rollBack(); throw $error; }
}

function createReturn($data) {
    $pdo = database();
    $rentalId = (int)($data['dbId'] ?? 0);
    if ($rentalId <= 0) throw new InvalidArgumentException('Falta el id del alquiler a devolver.');
    if (empty($data['actualDate'])) throw new InvalidArgumentException('Falta la fecha real de devolución.');
    $existing = $pdo->prepare('SELECT id_devolucion FROM devolucion WHERE id_alquiler = ? LIMIT 1');
    $existing->execute([$rentalId]);
    $existingId = $existing->fetchColumn();
    if ($existingId) throw new RuntimeException('Este alquiler ya tiene una devolución registrada.');

    $pdo->beginTransaction();
    try {
        $stmt = $pdo->prepare('INSERT INTO devolucion (id_alquiler, fecha_real, estado_mobiliario, observaciones) VALUES (?, ?, ?, ?)');
        $stmt->execute([$rentalId, $data['actualDate'], $data['condition'], $data['notes'] ?? null]);
        $returnId = (int)$pdo->lastInsertId();
        $lateDays = max(0, (int)((strtotime($data['actualDate']) - strtotime($data['agreedDate'])) / 86400));
        $pdo->prepare('INSERT INTO mora (id_devolucion, dias_retraso, periodos_mora, recargo) VALUES (?, ?, ?, ?)')->execute([$returnId, $lateDays, $lateDays > 0 ? (int)ceil($lateDays / 2) : 0, (float)($data['surcharge'] ?? 0)]);
        $details = $pdo->prepare('SELECT id_paquete, cantidad FROM detalle_alquiler WHERE id_alquiler=?');
        $details->execute([$rentalId]);
        foreach ($details->fetchAll() as $row) {
            $pdo->prepare('UPDATE inventario SET disponible=disponible+?, alquilado=alquilado-? WHERE id_paquete=?')->execute([(int)$row['cantidad'], (int)$row['cantidad'], (int)$row['id_paquete']]);
            if (($data['condition'] ?? 'bueno') === 'reparacion') $pdo->prepare('UPDATE inventario SET disponible=disponible-?, reparacion=reparacion+? WHERE id_paquete=?')->execute([(int)$row['cantidad'], (int)$row['cantidad'], (int)$row['id_paquete']]);
        }
        $pdo->prepare("UPDATE alquiler SET estado=? WHERE id_alquiler=?")->execute([$data['condition'] === 'reparacion' ? 'devuelto_reparacion' : 'devuelto', $rentalId]);
        $pdo->commit();
        return ['id' => $returnId];
    } catch (Throwable $error) { $pdo->rollBack(); throw $error; }
}

function cancelRental($data) {
    $pdo = database();
    $pdo->beginTransaction();
    try {
        $id = (int)$data['dbId'];
        $statusStmt = $pdo->prepare('SELECT estado FROM alquiler WHERE id_alquiler=?');
        $statusStmt->execute([$id]);
        $status = $statusStmt->fetchColumn();
        $detail = $pdo->prepare('SELECT id_paquete, cantidad FROM detalle_alquiler WHERE id_alquiler=?');
        $detail->execute([$id]);
        if (in_array($status, ['confirmado', 'activo'], true)) {
            foreach ($detail->fetchAll() as $row) $pdo->prepare('UPDATE inventario SET disponible=disponible+?, alquilado=alquilado-? WHERE id_paquete=?')->execute([(int)$row['cantidad'], (int)$row['cantidad'], (int)$row['id_paquete']]);
        }
        $pdo->prepare("UPDATE alquiler SET estado='cancelado' WHERE id_alquiler=?")->execute([$id]);
        $pdo->commit();
        return ['id' => $id];
    } catch (Throwable $error) {
        $pdo->rollBack();
        throw $error;
    }
}

function updateRental($data) {
    $pdo = database();
    $id = (int)$data['dbId'];
    $stmt = $pdo->prepare('UPDATE alquiler SET fecha_inicio=?, fecha_devolucion_acordada=?, dias_solicitados=?, dias_cobrados=?, periodos=?, total=?, pago_anticipado=?, estado=? WHERE id_alquiler=?');
    $stmt->execute([$data['startDate'], $data['returnDate'], (int)$data['daysRequested'], (int)$data['chargedDays'], (int)$data['periods'], (float)$data['total'], (float)$data['paid'], $data['status'], $id]);
    $pdo->prepare('UPDATE detalle_alquiler SET cantidad=? WHERE id_alquiler=?')->execute([(int)$data['quantity'], $id]);
    return ['id' => $id];
}

try {
    $action = $_GET['action'] ?? (input()['action'] ?? 'bootstrap');
    $payload = input();
    if ($action === 'bootstrap') respond(['success' => true, 'data' => bootstrap()]);
    if ($action === 'client_save') respond(['success' => true, 'data' => saveClient($payload)]);
    if ($action === 'event_save') respond(['success' => true, 'data' => saveEvent($payload)]);
    if ($action === 'rental_create') respond(['success' => true, 'data' => createRental($payload)]);
    if ($action === 'rental_update') respond(['success' => true, 'data' => updateRental($payload)]);
    if ($action === 'rental_cancel') respond(['success' => true, 'data' => cancelRental($payload)]);
    if ($action === 'sale_create') respond(['success' => true, 'data' => createSale($payload)]);
    if ($action === 'return_create') respond(['success' => true, 'data' => createReturn($payload)]);
    respond(['success' => false, 'message' => 'Accion no reconocida.'], 400);
} catch (Throwable $error) {
    respond(['success' => false, 'message' => $error->getMessage()], 400);
}
