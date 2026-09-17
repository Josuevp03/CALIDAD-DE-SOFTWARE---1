# Arquitectura del proyecto

La aplicación mantiene la maqueta HTML/CSS y separa la lógica por responsabilidades:

- `src/models.js`: modelos de dominio y normalización de tipos.
- `src/data-access.js`: repositorio de persistencia local.
- `src/authentication-service.js`: sesión y permisos de autenticación.
- `src/services/`: servicios de negocio independientes.
- `src/controllers/application-controller.js`: coordinación de casos de uso y persistencia.
- `src/ui/architecture-bootstrap.js`: composición de dependencias.
- `app.js`: composición de pantallas, eventos de interfaz y navegación.

Servicios disponibles:

- `RentalService`: períodos de 2 días, costos y validación de alquiler.
- `SaleService`: totales, pago completo y disponibilidad para ventas.
- `InventoryService`: movimientos y fabricación completada.
- `ReturnService`: fechas, mora y recargos.
- `ManufacturingService`: finalización y eficiencia de fabricación.
- `ClientService`: búsqueda y persistencia de clientes.
- `EventService`: eventos próximos y consultas por cliente.
- `LogisticsService`: rutas pendientes y planificación.
- `ReportService`: filtrado temporal y resúmenes.

El HTML carga las capas en orden: modelos, acceso a datos, autenticación, servicios, controlador, bootstrap y finalmente la UI.
