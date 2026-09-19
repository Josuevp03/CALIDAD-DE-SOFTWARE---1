const STORAGE_KEY = 'decoraciones_fiesta_boliviana_db';
const API_URL = 'api.php';
let databaseMode = false;

const defaultDatabase = {
  packages: [
    {
      id: 1,
      code: 'PK-101',
      name: 'Clásico Elegante',
      description: 'Set formal para bodas con mantelería, centros y ambientación sobria.',
      category: 'Boda',
      salePrice: 1800,
      rentalPrice: 650,
      color: 'Blanco',
      material: 'Tela premium',
      theme: 'Clásico',
      capacity: 80,
      status: 'disponible',
      stock: 8
    },
    {
      id: 2,
      code: 'PK-102',
      name: 'Temático',
      description: 'Kit festivo con tonos vivos para quinceañeras y cumpleaños.',
      category: 'Fiesta',
      salePrice: 2400,
      rentalPrice: 820,
      color: 'Rojo',
      material: 'Vinil y tela',
      theme: 'Fiesta',
      capacity: 60,
      status: 'alquilado',
      stock: 12
    },
    {
      id: 3,
      code: 'PK-103',
      name: 'Rustic',
      description: 'Ambientación campestre con materiales naturales y tonos cálidos.',
      category: 'Campestre',
      salePrice: 1950,
      rentalPrice: 700,
      color: 'Madera',
      material: 'Madera y yute',
      theme: 'Rustic',
      capacity: 50,
      status: 'disponible',
      stock: 6
    },
    {
      id: 4,
      code: 'PK-104',
      name: 'Moderno',
      description: 'Diseño minimalista para eventos corporativos y lanzamientos.',
      category: 'Corporativo',
      salePrice: 2700,
      rentalPrice: 900,
      color: 'Gris',
      material: 'Aluminio y tela',
      theme: 'Moderno',
      capacity: 70,
      status: 'reparacion',
      stock: 4
    },
    {
      id: 5,
      code: 'PK-105',
      name: 'Boda Premium',
      description: 'Ambiente VIP con florales, iluminación y piezas premium.',
      category: 'Boda',
      salePrice: 3500,
      rentalPrice: 1200,
      color: 'Blanco dorado',
      material: 'Tela y metal',
      theme: 'Premium',
      capacity: 100,
      status: 'vendido',
      stock: 3
    },
    {
      id: 6,
      code: 'PK-106',
      name: 'Corporativo',
      description: 'Paquete para ferias, convenciones y recibimientos institucionales.',
      category: 'Empresa',
      salePrice: 2600,
      rentalPrice: 880,
      color: 'Azul',
      material: 'Tela y aluminio',
      theme: 'Corporativo',
      capacity: 90,
      status: 'disponible',
      stock: 9
    }
  ],
  rentals: [
    { id: 'AL-104', client: 'María López', event: 'Boda', package: 'Clásico Elegante', status: 'activo', createdAt: '2026-09-12' },
    { id: 'AL-105', client: 'Carlos Pérez', event: 'Quinceañero', package: 'Temático', status: 'confirmado', createdAt: '2026-09-13' },
    { id: 'AL-106', client: 'Empresa ABC', event: 'Evento empresarial', package: 'Moderno', status: 'activo', createdAt: '2026-09-10' },
    { id: 'AL-107', client: 'Grupo Sol', event: 'Aniversario', package: 'Rustic', status: 'activo', createdAt: '2026-09-15' },
    { id: 'AL-108', client: 'Julio R.', event: 'Cena gala', package: 'Boda Premium', status: 'confirmado', createdAt: '2026-09-16' }
  ],
  clients: [
    { id: 1, firstName: 'María', lastName: 'López', document: '4587210 LP', phone: '70123456', email: 'maria.lopez@email.com', address: 'Av. Arce 120', city: 'La Paz', notes: 'Cliente frecuente' },
    { id: 2, firstName: 'Carlos', lastName: 'Pérez', document: '6234187 CB', phone: '71234567', email: 'carlos.perez@email.com', address: 'Calle Sucre 45', city: 'Cochabamba', notes: '' },
    { id: 3, firstName: 'Empresa', lastName: 'ABC', document: '10203040 SC', phone: '76543210', email: 'eventos@empresaabc.com', address: 'Av. Banzer 500', city: 'Santa Cruz', notes: 'Cliente corporativo' },
    { id: 4, firstName: 'Grupo', lastName: 'Sol', document: '7845123 OR', phone: '69876543', email: 'contacto@gruposol.com', address: 'Calle Bolívar 88', city: 'Oruro', notes: '' }
  ],
  events: [
    { id: 1, event: 'Boda', eventType: 'Boda', client: 'María López', date: '2026-09-20', time: '18:00', place: 'Salón Colonial', city: 'La Paz', address: 'Av. Costanera 120', preferences: 'Tonos blancos y dorados', notes: '', package: 'Clásico Elegante', status: 'Alquilado' },
    { id: 2, event: 'Quinceañero', eventType: 'Quinceañero', client: 'Carlos Pérez', date: '2026-09-25', time: '19:30', place: 'Salón Imperial', city: 'Cochabamba', address: 'Av. Blanco Galindo 50', preferences: 'Decoración rosada', notes: '', package: 'Temático', status: 'Confirmado' },
    { id: 3, event: 'Evento empresarial', eventType: 'Evento empresarial', client: 'Empresa ABC', date: '2026-10-02', time: '09:00', place: 'Centro de Convenciones', city: 'Santa Cruz', address: 'Av. Las Palmas 400', preferences: 'Imagen corporativa azul', notes: '', package: 'Moderno', status: 'Confirmado' },
    { id: 4, event: 'Aniversario', eventType: 'Celebración tradicional', client: 'Grupo Sol', date: '2026-10-10', time: '20:00', place: 'Quinta Los Álamos', city: 'Oruro', address: 'Calle Aroma 10', preferences: 'Elementos tradicionales', notes: '', package: 'Rustic', status: 'Pendiente' },
    { id: 5, event: 'Cena gala', eventType: 'Otro', client: 'Julio R.', date: '2026-10-12', time: '20:30', place: 'Hotel Central', city: 'La Paz', address: 'Calle Comercio 22', preferences: 'Iluminación cálida', notes: '', package: 'Boda Premium', status: 'Confirmado' }
  ],
  returns: [
    { id: 'DEV-021', client: 'Pedro R.', dueDate: '2026-09-12', actualDate: null, status: 'atrasado' },
    { id: 'DEV-022', client: 'Lucía M.', dueDate: '2026-09-15', actualDate: null, status: 'pendiente' },
    { id: 'DEV-023', client: 'José T.', dueDate: '2026-09-10', actualDate: '2026-09-10', status: 'entregado' },
    { id: 'DEV-024', client: 'María López', dueDate: '2026-09-20', actualDate: null, status: 'pendiente' }
  ],
  repairs: [
    { id: 'REP-07', item: 'Sillas con forro', status: 'en_reparacion' },
    { id: 'REP-08', item: 'Equipo de audio', status: 'en_reparacion' },
    { id: 'REP-09', item: 'Ambientación floral', status: 'en_espera' }
  ],
  fabrication: [
    { id: 'FAB-001', packageId: 3, package: 'Rustic', person: 'Juan Quispe', responsible: 'Supervisor de Taller', date: '2026-09-10', status: 'completada', efficiency: 92 },
    { id: 'FAB-002', packageId: 4, package: 'Moderno', person: 'María Condori', responsible: 'Supervisor de Taller', date: '2026-09-15', status: 'en_proceso', efficiency: 78 }
  ],
  sales: [
    { id: 'FV-204', client: 'María López', amount: 2100, date: '2026-09-12', status: 'pagado' },
    { id: 'FV-205', client: 'Empresa ABC', amount: 7500, date: '2026-09-14', status: 'abono' },
    { id: 'FV-206', client: 'Grupo Sol', amount: 3250, date: '2026-09-15', status: 'pendiente' },
    { id: 'FV-207', client: 'Julio R.', amount: 4800, date: '2026-09-16', status: 'pagado' }
  ],
  services: [
    { id: 1, name: 'Decoradores especializados', type: 'Decoración', price: 1500, availability: 4, status: 'disponible', associations: [] },
    { id: 2, name: 'Iluminación ambiental', type: 'Iluminación', price: 1200, availability: 12, status: 'disponible', associations: [] },
    { id: 3, name: 'Mantelería premium', type: 'Complemento', price: 850, availability: 20, status: 'disponible', associations: [] },
    { id: 4, name: 'Montaje', type: 'Logística', price: 950, availability: 6, status: 'disponible', associations: [] },
    { id: 5, name: 'Desmontaje', type: 'Logística', price: 700, availability: 6, status: 'disponible', associations: [] }
  ]
};

function requestApi(action, payload = null) {
  const request = new XMLHttpRequest();
  request.open(payload ? 'POST' : 'GET', `${API_URL}?action=${encodeURIComponent(action)}`, false);
  request.setRequestHeader('Content-Type', 'application/json');
  request.send(payload ? JSON.stringify(payload) : null);
  if (request.status < 200 || request.status >= 300) throw new Error(`API ${action}: ${request.status}`);
  const response = JSON.parse(request.responseText);
  if (!response.success) throw new Error(response.message || 'La API rechazó la operación.');
  return response.data;
}

function loadDatabase() {
  try {
    const remote = requestApi('bootstrap');
    databaseMode = true;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(remote));
    return remote;
  } catch (error) {
    console.warn('No se pudo cargar MySQL; se usarán datos locales de respaldo.', error);
  }
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.warn('No se pudo cargar la base local, usando datos iniciales.', error);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultDatabase));
  return defaultDatabase;
}

const db = loadDatabase();

function runAtomicTransaction(operation) {
  const snapshot = JSON.stringify(db);
  try {
    const result = operation();
    if (result && result.success === false) throw new Error(result.message || 'La operación no pudo completarse.');
    saveDatabase();
    return { success: true, result };
  } catch (error) {
    const restored = JSON.parse(snapshot);
    Object.keys(db).forEach(key => delete db[key]);
    Object.assign(db, restored);
    localStorage.setItem(STORAGE_KEY, snapshot);
    return { success: false, message: error.message || 'La operación fue revertida.' };
  }
}

function saveDatabase() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

function normalizePackageInventory() {
  (db.packages || []).forEach((pkg) => {
    const total = Math.max(0, Number(pkg.total ?? pkg.stock ?? 0));
    const rented = Math.max(0, Number(pkg.rented ?? (pkg.status === 'alquilado' ? 1 : 0)));
    const sold = Math.max(0, Number(pkg.sold ?? (pkg.status === 'vendido' ? 1 : 0)));
    const repair = Math.max(0, Number(pkg.repair ?? (pkg.status === 'reparacion' ? 1 : 0)));
    const available = Math.max(0, total - rented - sold - repair);

    pkg.total = total;
    pkg.rented = rented;
    pkg.sold = sold;
    pkg.repair = repair;
    pkg.available = available;
    pkg.stock = available;
    pkg.status = repair > 0 ? 'reparacion' : rented > 0 ? 'alquilado' : sold >= total && total > 0 ? 'vendido' : 'disponible';
  });
  saveDatabase();
}

normalizePackageInventory();

function normalizeClientEventData() {
  if (!Array.isArray(db.clients) || db.clients.length === 0) {
    db.clients = defaultDatabase.clients.map(client => ({ ...client }));
  }
  db.events = db.events || [];
  db.events.forEach((event) => {
    event.eventType = event.eventType || event.event || 'Otro';
    event.time = event.time || '09:00';
    event.place = event.place || 'Por definir';
    event.city = event.city || '';
    event.address = event.address || '';
    event.preferences = event.preferences || '';
    event.notes = event.notes || '';
  });
  saveDatabase();
}

normalizeClientEventData();

function normalizeServicesData() {
  if (!Array.isArray(db.services) || db.services.length === 0) {
    db.services = defaultDatabase.services.map(service => ({ ...service, associations: [] }));
  }
  db.services.forEach(service => {
    service.associations = Array.isArray(service.associations) ? service.associations : [];
    service.availability = Math.max(0, Number(service.availability ?? 0));
    service.price = Number(service.price || 0);
    service.status = service.availability > 0 ? 'disponible' : 'agotado';
  });
  saveDatabase();
}

normalizeServicesData();

function normalizeFabricationData() {
  if (!Array.isArray(db.fabrication) || db.fabrication.length === 0) db.fabrication = defaultDatabase.fabrication.map(item => ({ ...item }));
  saveDatabase();
}

normalizeFabricationData();

const clientEventState = {
  clientSearch: '',
  eventSearch: '',
  month: new Date().getMonth(),
  year: new Date().getFullYear()
};

const rentalClientState = { search: '' };
const salesClientState = { search: '' };

const eventTypes = ['Boda', 'Quinceañero', 'Graduación', 'Evento empresarial', 'Bautizo', 'Fiesta patronal', 'Celebración tradicional', 'Otro'];

function getClientName(client) {
  return `${client.firstName || ''} ${client.lastName || ''}`.trim();
}

function getClientByName(name) {
  return (db.clients || []).find(client => getClientName(client) === name);
}

function formatEventDate(date) {
  if (!date) return '';
  return new Date(`${date}T00:00:00`).toLocaleDateString('es-BO', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function renderClientForm(client = null) {
  const value = client || { firstName: '', lastName: '', document: '', phone: '', email: '', address: '', city: '', notes: '' };
  return `
    <div class="modal open" role="dialog" aria-modal="true">
      <div class="modal-card">
        <div class="modal-header"><h3>${client ? 'Editar cliente' : 'Registrar cliente'}</h3><button type="button" class="close-btn" data-client-event-action="close">×</button></div>
        <form id="client-form" data-id="${client?.id || ''}">
          <div class="form-grid">
            <label class="field"><span>Nombre</span><input name="firstName" value="${value.firstName}" required></label>
            <label class="field"><span>Apellido</span><input name="lastName" value="${value.lastName}" required></label>
            <label class="field"><span>Documento</span><input name="document" value="${value.document}" required></label>
            <label class="field"><span>Teléfono</span><input name="phone" value="${value.phone}" required></label>
            <label class="field"><span>Correo</span><input name="email" type="email" value="${value.email}"></label>
            <label class="field"><span>Ciudad</span><input name="city" value="${value.city}" required></label>
            <label class="field" style="grid-column:1 / -1;"><span>Dirección</span><input name="address" value="${value.address}"></label>
            <label class="field" style="grid-column:1 / -1;"><span>Observaciones</span><textarea name="notes">${value.notes}</textarea></label>
          </div>
          <div class="module-actions" style="justify-content:flex-end; margin-top:20px;"><button type="button" class="secondary-btn" data-client-event-action="close">Cancelar</button><button type="submit" class="primary-btn">Guardar cliente</button></div>
        </form>
      </div>
    </div>
  `;
}

function renderEventForm(event = null) {
  const value = event || { client: '', eventType: 'Boda', date: '', time: '09:00', place: '', city: '', address: '', preferences: '', notes: '' };
  return `
    <div class="modal open" role="dialog" aria-modal="true">
      <div class="modal-card">
        <div class="modal-header"><h3>${event ? 'Editar evento' : 'Registrar evento'}</h3><button type="button" class="close-btn" data-client-event-action="close">×</button></div>
        <form id="event-form" data-id="${event?.id || ''}">
          <div class="form-grid">
            <label class="field"><span>Cliente</span><select name="client" required><option value="">Seleccionar cliente</option>${db.clients.map(client => `<option value="${getClientName(client)}" ${value.client === getClientName(client) ? 'selected' : ''}>${getClientName(client)}</option>`).join('')}</select></label>
            <label class="field"><span>Tipo de evento</span><select name="eventType" required>${eventTypes.map(type => `<option ${value.eventType === type ? 'selected' : ''}>${type}</option>`).join('')}</select></label>
            <label class="field"><span>Fecha</span><input name="date" type="date" value="${value.date}" required></label>
            <label class="field"><span>Hora</span><input name="time" type="time" value="${value.time}" required></label>
            <label class="field"><span>Lugar</span><input name="place" value="${value.place}" required></label>
            <label class="field"><span>Ciudad</span><input name="city" value="${value.city}" required></label>
            <label class="field" style="grid-column:1 / -1;"><span>Dirección</span><input name="address" value="${value.address}"></label>
            <label class="field" style="grid-column:1 / -1;"><span>Preferencias</span><textarea name="preferences">${value.preferences}</textarea></label>
            <label class="field" style="grid-column:1 / -1;"><span>Observaciones</span><textarea name="notes">${value.notes}</textarea></label>
          </div>
          <div class="module-actions" style="justify-content:flex-end; margin-top:20px;"><button type="button" class="secondary-btn" data-client-event-action="close">Cancelar</button><button type="submit" class="primary-btn">Guardar evento</button></div>
        </form>
      </div>
    </div>
  `;
}

function renderEventsCalendar() {
  const firstDay = new Date(clientEventState.year, clientEventState.month, 1).getDay();
  const daysInMonth = new Date(clientEventState.year, clientEventState.month + 1, 0).getDate();
  const monthLabel = new Date(clientEventState.year, clientEventState.month, 1).toLocaleDateString('es-BO', { month: 'long', year: 'numeric' });
  const cells = [];
  for (let index = 0; index < (firstDay === 0 ? 6 : firstDay - 1); index += 1) cells.push('<div class="calendar-day empty"></div>');
  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = `${clientEventState.year}-${String(clientEventState.month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayEvents = db.events.filter(event => event.date === date);
    cells.push(`<div class="calendar-day"><strong>${day}</strong>${dayEvents.map(event => `<button type="button" class="calendar-event" data-client-event-action="view-event" data-id="${event.id}">${event.time} · ${event.eventType}</button>`).join('')}</div>`);
  }
  return `<div class="calendar-header"><button type="button" class="secondary-btn" data-client-event-action="previous-month">Anterior</button><strong>${monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1)}</strong><button type="button" class="secondary-btn" data-client-event-action="next-month">Siguiente</button></div><div class="calendar-weekdays">${['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(day => `<strong>${day}</strong>`).join('')}</div><div class="calendar-grid">${cells.join('')}</div>`;
}

function renderClientsEventsUI() {
  const clientSearch = clientEventState.clientSearch.toLowerCase();
  const eventSearch = clientEventState.eventSearch.toLowerCase();
  const clients = window.AppArchitecture?.services?.client
    ? window.AppArchitecture.services.client.search(db.clients, clientSearch)
    : db.clients.filter(client => [getClientName(client), client.document, client.phone, client.city].some(value => String(value || '').toLowerCase().includes(clientSearch)));
  const events = db.events.filter(event => [event.eventType, event.client, event.place, event.city].some(value => String(value || '').toLowerCase().includes(eventSearch))).sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));
  return `
    <div class="list-grid">
      <section class="panel"><div class="module-header"><h2>Clientes</h2><button type="button" class="primary-btn" data-client-event-action="new-client">Nuevo cliente</button></div><label class="field"><span>Buscar cliente</span><input id="client-search" type="search" placeholder="Nombre, documento o ciudad" value="${clientEventState.clientSearch}"></label><div class="table-wrap" style="margin-top:16px;"><table><thead><tr><th>Cliente</th><th>Documento</th><th>Teléfono</th><th>Ciudad</th><th>Acciones</th></tr></thead><tbody>${clients.length ? clients.map(client => `<tr><td>${getClientName(client)}</td><td>${client.document}</td><td>${client.phone}</td><td>${client.city}</td><td><button type="button" class="chip-btn" data-client-event-action="edit-client" data-id="${client.id}">Editar</button></td></tr>`).join('') : '<tr><td colspan="5" style="text-align:center; padding:20px;">No se encontraron clientes.</td></tr>'}</tbody></table></div></section>
      <section class="panel"><div class="module-header"><h2>Eventos</h2><button type="button" class="primary-btn" data-client-event-action="new-event">Nuevo evento</button></div><label class="field"><span>Buscar evento</span><input id="event-search" type="search" placeholder="Tipo, cliente, lugar o ciudad" value="${clientEventState.eventSearch}"></label><div class="table-wrap" style="margin-top:16px;"><table><thead><tr><th>Evento</th><th>Cliente</th><th>Fecha</th><th>Lugar</th><th>Acciones</th></tr></thead><tbody>${events.length ? events.map(event => `<tr><td>${event.eventType}</td><td>${event.client}</td><td>${formatEventDate(event.date)} ${event.time}</td><td>${event.place}</td><td><button type="button" class="chip-btn" data-client-event-action="edit-event" data-id="${event.id}">Editar</button></td></tr>`).join('') : '<tr><td colspan="5" style="text-align:center; padding:20px;">No se encontraron eventos.</td></tr>'}</tbody></table></div></section>
    </div>
    <section class="panel"><div class="module-header"><h2>Calendario de eventos</h2><span class="badge info">${db.events.length} eventos registrados</span></div>${renderEventsCalendar()}</section>
  `;
}

function bindClientEventForms(root, rerender) {
  root.querySelectorAll('[data-client-event-action="close"]').forEach(button => button.addEventListener('click', () => button.closest('.modal')?.remove()));
  root.querySelector('#client-form')?.addEventListener('submit', event => {
    event.preventDefault();
    const payload = Object.fromEntries(new FormData(event.target).entries());
    const clientData = { firstName: payload.firstName, lastName: payload.lastName, document: payload.document, phone: payload.phone, email: payload.email, address: payload.address, city: payload.city, notes: payload.notes };
    const id = Number(event.target.dataset.id);
    try {
      const result = requestApi('client_save', { ...clientData, id: id || null });
      if (id) Object.assign(db.clients.find(client => client.id === id), clientData);
      else db.clients.push({ id: Number(result.id), ...clientData });
    } catch (error) {
      window.alert(`No se pudo guardar el cliente en MySQL: ${error.message}`);
      return;
    }
    saveDatabase(); event.target.closest('.modal').remove(); rerender();
  });
  root.querySelector('#event-form')?.addEventListener('submit', event => {
    event.preventDefault();
    const payload = Object.fromEntries(new FormData(event.target).entries());
    const eventData = { event: payload.eventType, eventType: payload.eventType, client: payload.client, date: payload.date, time: payload.time, place: payload.place, city: payload.city, address: payload.address, preferences: payload.preferences, notes: payload.notes, status: 'Pendiente' };
    const id = Number(event.target.dataset.id);
    try {
      const result = requestApi('event_save', { ...eventData, id: id || null });
      if (id) Object.assign(db.events.find(item => item.id === id), eventData);
      else db.events.push({ id: Number(result.id), ...eventData });
    } catch (error) {
      window.alert(`No se pudo guardar el evento en MySQL: ${error.message}`);
      return;
    }
    saveDatabase(); event.target.closest('.modal').remove(); rerender();
  });
}

function bindClientsEventsActions() {
  const root = moduleContent;
  const rerender = () => { root.innerHTML = renderClientsEventsUI(); bindClientsEventsActions(); };
  root.querySelector('#client-search')?.addEventListener('input', event => { clientEventState.clientSearch = event.target.value; rerender(); });
  root.querySelector('#event-search')?.addEventListener('input', event => { clientEventState.eventSearch = event.target.value; rerender(); });
  root.querySelectorAll('[data-client-event-action]').forEach(button => button.addEventListener('click', () => {
    const action = button.dataset.clientEventAction;
    const id = Number(button.dataset.id);
    if (action === 'new-client') { root.insertAdjacentHTML('beforeend', renderClientForm()); bindClientEventForms(root, rerender); }
    if (action === 'new-event') { root.insertAdjacentHTML('beforeend', renderEventForm()); bindClientEventForms(root, rerender); }
    if (action === 'edit-client') { const client = db.clients.find(item => item.id === id); if (client) { root.insertAdjacentHTML('beforeend', renderClientForm(client)); bindClientEventForms(root, rerender); } }
    if (action === 'edit-event') { const event = db.events.find(item => item.id === id); if (event) { root.insertAdjacentHTML('beforeend', renderEventForm(event)); bindClientEventForms(root, rerender); } }
    if (action === 'view-event') { const event = db.events.find(item => item.id === id); if (event) window.alert(`${event.eventType} · ${event.client}\n${formatEventDate(event.date)} ${event.time}\n${event.place}, ${event.city}\n${event.address}`); }
    if (action === 'close') button.closest('.modal')?.remove();
    if (action === 'previous-month') { clientEventState.month -= 1; if (clientEventState.month < 0) { clientEventState.month = 11; clientEventState.year -= 1; } rerender(); }
    if (action === 'next-month') { clientEventState.month += 1; if (clientEventState.month > 11) { clientEventState.month = 0; clientEventState.year += 1; } rerender(); }
  }));
  bindClientEventForms(root, rerender);
}

function getPackageInventoryStatus(pkg) {
  if (pkg.repair > 0) return 'reparacion';
  if (pkg.available > 0) return 'disponible';
  if (pkg.rented > 0) return 'alquilado';
  return 'vendido';
}

function getInventoryTotals() {
  return getPackageCollection().reduce((totals, pkg) => {
    totals.total += pkg.total;
    totals.available += pkg.available;
    totals.rented += pkg.rented;
    totals.sold += pkg.sold;
    totals.repair += pkg.repair;
    return totals;
  }, { total: 0, available: 0, rented: 0, sold: 0, repair: 0 });
}

function applyInventoryMovement({ packageId, type, quantity }) {
  const pkg = getPackageCollection().find(item => item.id === Number(packageId));
  const amount = Number(quantity);
  if (!pkg || !Number.isInteger(amount) || amount <= 0) {
    return { success: false, message: 'Indica un paquete y una cantidad entera mayor que cero.' };
  }

  if (window.AppArchitecture?.services?.inventory) {
    const result = window.AppArchitecture.services.inventory.move(getPackageCollection(), packageId, type, amount);
    if (!result.success) return { success: false, message: result.message };
    pkg.status = getPackageInventoryStatus(pkg);
    saveDatabase();
    return { success: true, message: 'Movimiento registrado y cantidades actualizadas.' };
  }

  if (['rental', 'sale', 'repair'].includes(type) && pkg.available < amount) {
    return { success: false, message: `Movimiento rechazado: solo hay ${pkg.available} unidades disponibles de ${pkg.name}.` };
  }

  if (type === 'return' && pkg.rented < amount) {
    return { success: false, message: `Devolución rechazada: solo hay ${pkg.rented} unidades alquiladas de ${pkg.name}.` };
  }

  if (type === 'rental') {
    pkg.available -= amount;
    pkg.rented += amount;
  }
  if (type === 'sale') {
    pkg.available -= amount;
    pkg.sold += amount;
  }
  if (type === 'return') {
    pkg.rented -= amount;
    pkg.available += amount;
  }
  if (type === 'repair') {
    pkg.available -= amount;
    pkg.repair += amount;
  }

  pkg.stock = pkg.available;
  pkg.status = getPackageInventoryStatus(pkg);
  saveDatabase();
  return { success: true, message: 'Movimiento registrado y cantidades actualizadas.' };
}

function completeFabrication({ packageId, quantity, fabricationId = null }) {
  const transaction = runAtomicTransaction(() => {
    const result = window.AppArchitecture?.services?.inventory
      ? window.AppArchitecture.services.inventory.completeManufacturing(getPackageCollection(), packageId, quantity)
      : null;
    if (result && !result.success) return result;
    const pkg = getPackageCollection().find(item => item.id === Number(packageId));
    const amount = Number(quantity);
    if (!result && (!pkg || !Number.isInteger(amount) || amount <= 0)) return { success: false, message: 'La fabricación debe indicar un paquete y una cantidad válida.' };
    if (!result) { pkg.total += amount; pkg.available += amount; pkg.stock = pkg.available; pkg.status = getPackageInventoryStatus(pkg); }
    if (fabricationId && db.fabrication) {
      const fabrication = db.fabrication.find(item => item.id === fabricationId);
      if (fabrication) fabrication.status = 'completada';
    }
    return result || { success: true, message: `${amount} unidad(es) fabricada(s) agregada(s) al inventario disponible.` };
  });
  return transaction.success ? transaction.result : transaction;
}

function getInventoryMovementLabel(type) {
  return { rental: 'Alquiler', sale: 'Venta', return: 'Devolución', repair: 'Reparación' }[type] || type;
}

function renderInventoryMovementModal() {
  return `
    <div class="modal open" role="dialog" aria-modal="true">
      <div class="modal-card">
        <div class="modal-header">
          <h3>Registrar movimiento de inventario</h3>
          <button type="button" class="close-btn" aria-label="Cerrar" data-inventory-action="close">×</button>
        </div>
        <form id="inventory-movement-form">
          <div class="form-grid">
            <label class="field">
              <span>Tipo de movimiento</span>
              <select name="type" required>
                <option value="rental">Alquiler</option>
                <option value="sale">Venta</option>
                <option value="return">Devolución</option>
                <option value="repair">Reparación</option>
              </select>
            </label>
            <label class="field">
              <span>Paquete</span>
              <select name="packageId" required>
                ${getPackageCollection().map(pkg => `<option value="${pkg.id}">${pkg.code} - ${pkg.name} (${pkg.available} disponibles)</option>`).join('')}
              </select>
            </label>
            <label class="field">
              <span>Cantidad</span>
              <input name="quantity" type="number" min="1" value="1" required>
            </label>
          </div>
          <div class="alert-box info" style="margin-top:16px;">Las ventas y alquileres se bloquean automáticamente cuando superan las unidades disponibles.</div>
          <div class="module-actions" style="justify-content:flex-end; margin-top:20px;">
            <button type="button" class="secondary-btn" data-inventory-action="close">Cancelar</button>
            <button type="submit" class="primary-btn">Registrar movimiento</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

function renderInventoryModuleUI() {
  const filter = document.getElementById('inventory-filter')?.value || 'todos';
  const search = document.getElementById('inventory-search')?.value?.toLowerCase() || '';
  const totals = getInventoryTotals();
  const packages = getPackageCollection().filter((pkg) => {
    const status = getInventoryStatus(pkg);
    return (filter === 'todos' || status === filter) && [pkg.code, pkg.name, pkg.category].some(value => String(value || '').toLowerCase().includes(search));
  });

  return `
    <div class="summary-grid inventory-summary">
      <div class="mini-card"><div class="label">Paquetes</div><div class="value">${totals.total}</div></div>
      <div class="mini-card"><div class="label">Total disponible</div><div class="value">${totals.available}</div></div>
      <div class="mini-card"><div class="label">Alquilado</div><div class="value">${totals.rented}</div></div>
      <div class="mini-card"><div class="label">Vendido</div><div class="value">${totals.sold}</div></div>
      <div class="mini-card"><div class="label">Reparación</div><div class="value">${totals.repair}</div></div>
    </div>
    <section class="panel">
      <div class="module-header">
        <h2>Control de inventario</h2>
        <button type="button" class="primary-btn" data-inventory-action="new-movement">Registrar movimiento</button>
      </div>
      <div class="filter-card">
        <div class="filter-row" style="flex:1;">
          <label class="field" style="min-width:220px; flex:1;">
            <span>Buscar paquete</span>
            <input id="inventory-search" type="search" placeholder="Código, nombre o categoría" value="${search}">
          </label>
          <label class="field" style="min-width:190px;">
            <span>Filtrar estado</span>
            <select id="inventory-filter">
              ${[['todos', 'Todos'], ['disponible', 'Disponible'], ['alquilado', 'Alquilado'], ['vendido', 'Vendido'], ['reparacion', 'Reparación']].map(([value, label]) => `<option value="${value}" ${filter === value ? 'selected' : ''}>${label}</option>`).join('')}
            </select>
          </label>
        </div>
      </div>
      <div class="table-wrap" style="margin-top:18px;">
        <table>
          <thead><tr><th>Paquete</th><th>Total</th><th>Disponible</th><th>Alquilado</th><th>Vendido</th><th>Reparación</th><th>Estado</th></tr></thead>
          <tbody>
            ${packages.length ? packages.map(pkg => {
              const status = getInventoryStatus(pkg);
              return `<tr><td><strong>${pkg.code}</strong><br><span style="color:#697680;">${pkg.name}</span></td><td>${pkg.total}</td><td>${pkg.available}</td><td>${pkg.rented}</td><td>${pkg.sold}</td><td>${pkg.repair}</td><td><span class="badge ${getPackageStatusClass(status)}">${getPackageStatusLabel(status)}</span></td></tr>`;
            }).join('') : '<tr><td colspan="7" style="text-align:center; padding:22px; color:#687680;">No se encontraron paquetes.</td></tr>'}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function getInventoryStatus(pkg) {
  return getPackageInventoryStatus(pkg);
}

function bindInventoryMovementForm(root) {
  root.querySelector('#inventory-movement-form')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target).entries());
    const result = applyInventoryMovement({ packageId: data.packageId, type: data.type, quantity: data.quantity });
    if (!result.success) {
      window.alert(result.message);
      return;
    }
    event.target.closest('.modal').remove();
    root.innerHTML = renderInventoryModuleUI();
    bindInventoryActions();
  });
}

function bindInventoryActions() {
  const root = moduleContent;
  const rerender = () => {
    root.innerHTML = renderInventoryModuleUI();
    bindInventoryActions();
  };

  root.querySelector('#inventory-search')?.addEventListener('input', rerender);
  root.querySelector('#inventory-filter')?.addEventListener('change', rerender);
  root.querySelectorAll('[data-inventory-action]').forEach(button => {
    button.addEventListener('click', () => {
      if (button.dataset.inventoryAction === 'new-movement') {
        root.insertAdjacentHTML('beforeend', renderInventoryMovementModal());
        bindInventoryMovementForm(root);
      }
      if (button.dataset.inventoryAction === 'close') button.closest('.modal')?.remove();
    });
  });
}

function getDashboardData() {
  const today = new Date();
  const upcomingEvents = db.events.filter(event => new Date(event.date) >= today).length;
  const availablePackages = db.packages.filter(pkg => pkg.status === 'disponible').length;
  const activeRentals = db.rentals.filter(rental => rental.status === 'activo').length;
  const pendingReturns = db.returns.filter(item => item.status === 'pendiente').length;
  const lateReturns = db.returns.filter(item => item.status === 'atrasado').length;
  const repairItems = db.repairs.filter(item => item.status === 'en_reparacion').length;
  const recentSales = [...db.sales].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 4);
  const recentRentals = [...db.rentals].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4);

  return {
    cards: [
      { label: 'Paquetes disponibles', value: String(availablePackages), status: 'Inventario actual' },
      { label: 'Alquileres activos', value: String(activeRentals), status: 'En seguimiento' },
      { label: 'Próximos eventos', value: String(upcomingEvents), status: 'Calendario' },
      { label: 'Devoluciones pendientes', value: String(pendingReturns), status: 'Requieren atención' },
      { label: 'Devoluciones atrasadas', value: String(lateReturns), status: 'Revisión urgente' },
      { label: 'Elementos en reparación', value: String(repairItems), status: 'Revisión técnica' },
      { label: 'Ventas recientes', value: String(recentSales.length), status: 'Últimos 4 registros' },
      { label: 'Alquileres recientes', value: String(recentRentals.length), status: 'Últimos 4 registros' }
    ],
    quickActions: [
      { title: 'Registrar alquiler', text: 'Crear un nuevo alquiler y calcular el periodo.' },
      { title: 'Registrar venta', text: 'Registrar venta y pago anticipado.' },
      { title: 'Registrar devolución', text: 'Controlar fechas y posibles recargos por mora.' },
      { title: 'Consultar inventario', text: 'Ver disponibilidad y estado del mobiliario.' }
    ],
    activities: [
      { title: 'Alquiler registrado', detail: `${recentRentals[0]?.client || 'Cliente'} · ${recentRentals[0]?.event || 'Evento reciente'}` },
      { title: 'Fabricación finalizada', detail: 'Lote #024 · Paquete Rustic' },
      { title: 'Devolución pendiente', detail: `${db.returns.find(item => item.status === 'atrasado')?.client || 'Cliente'} · requiere revisión` }
    ],
    events: db.events.slice(0, 4).map(event => ({
      event: event.event,
      client: event.client,
      date: new Date(event.date).toLocaleDateString('es-BO', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      package: event.package,
      status: event.status
    })),
    recentSales,
    recentRentals
  };
}

const reusableComponents = {
  toolbar: ({ title, actions = [] }) => `
    <div class="module-header">
      <h2>${title}</h2>
      <div class="module-actions">${actions.map(action => `<button class="${action.type || 'secondary-btn'}" type="button" ${action.attrs || ''}>${action.label}</button>`).join('')}</div>
    </div>
  `,
  filterBar: ({ filters = [], actions = [] }) => `
    <div class="filter-card">
      <div class="filter-row">${filters.map(filter => `
        <label class="field" style="min-width:140px;">
          <span>${filter.label}</span>
          <select>
            ${filter.options.map(option => `<option ${option.selected ? 'selected' : ''}>${option.label}</option>`).join('')}
          </select>
        </label>
      `).join('')}</div>
      <div class="action-row">${actions.map(action => `<button class="${action.type || 'secondary-btn'}" type="button">${action.label}</button>`).join('')}</div>
    </div>
  `,
  alert: ({ message, type = 'info' }) => `<div class="alert-box ${type}">${message}</div>`,
  pagination: ({ total = 5, active = 1 }) => `
    <div class="pagination">
      <button type="button">«</button>
      ${Array.from({ length: total }, (_, index) => `<button type="button" class="${index + 1 === active ? 'active' : ''}">${index + 1}</button>`).join('')}
      <button type="button">»</button>
    </div>
  `,
  modal: ({ title, content, footer = '' }) => `
    <div class="modal open" role="dialog" aria-modal="true">
      <div class="modal-card">
        <div class="modal-header">
          <h3>${title}</h3>
          <button type="button" class="close-btn" aria-label="Cerrar">×</button>
        </div>
        ${content}
        ${footer ? `<div class="module-actions" style="margin-top:16px; justify-content:flex-end;">${footer}</div>` : ''}
      </div>
    </div>
  `
};

const packageState = {
  search: '',
  status: 'todos',
  category: 'todas'
};

function formatCurrency(value) {
  return `BS ${Number(value || 0).toLocaleString('es-BO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

function getPackageStatusLabel(status) {
  const map = {
    disponible: 'Disponible',
    alquilado: 'Alquilado',
    vendido: 'Vendido',
    reparacion: 'En reparación'
  };
  return map[status] || 'Disponible';
}

function getPackageStatusClass(status) {
  const map = {
    disponible: 'success',
    alquilado: 'info',
    vendido: 'warning',
    reparacion: 'danger'
  };
  return map[status] || 'success';
}

function getPackageCollection() {
  return db.packages || [];
}

function getFilteredPackages() {
  return getPackageCollection().filter((pkg) => {
    const matchesSearch = [
      pkg.code,
      pkg.name,
      pkg.category,
      pkg.theme,
      pkg.color,
      pkg.material
    ].some((value) => String(value || '').toLowerCase().includes(packageState.search.toLowerCase()));

    const matchesStatus = packageState.status === 'todos' || pkg.status === packageState.status;
    const matchesCategory = packageState.category === 'todas' || pkg.category === packageState.category;

    return matchesSearch && matchesStatus && matchesCategory;
  });
}

function renderPackageForm(mode = 'create', pkg = null) {
  const selectedPackage = pkg || {
    code: '',
    name: '',
    description: '',
    category: 'Boda',
    salePrice: 0,
    rentalPrice: 0,
    color: '',
    material: '',
    theme: '',
    capacity: 0,
    status: 'disponible'
  };

  return `
    <div class="modal open" role="dialog" aria-modal="true">
      <div class="modal-card">
        <div class="modal-header">
          <h3>${mode === 'create' ? 'Registrar paquete' : 'Editar paquete'}</h3>
          <button type="button" class="close-btn" aria-label="Cerrar" data-action="close-modal">×</button>
        </div>
        <form id="package-form">
          <div class="form-grid">
            <label class="field">
              <span>Código</span>
              <input name="code" value="${selectedPackage.code || ''}" required>
            </label>
            <label class="field">
              <span>Nombre</span>
              <input name="name" value="${selectedPackage.name || ''}" required>
            </label>
            <label class="field" style="grid-column:1 / -1;">
              <span>Descripción</span>
              <textarea name="description">${selectedPackage.description || ''}</textarea>
            </label>
            <label class="field">
              <span>Categoría</span>
              <select name="category">
                ${['Boda', 'Fiesta', 'Campestre', 'Corporativo', 'Empresa'].map((option) => `<option value="${option}" ${selectedPackage.category === option ? 'selected' : ''}>${option}</option>`).join('')}
              </select>
            </label>
            <label class="field">
              <span>Temática</span>
              <input name="theme" value="${selectedPackage.theme || ''}">
            </label>
            <label class="field">
              <span>Precio de venta</span>
              <input name="salePrice" type="number" value="${selectedPackage.salePrice || 0}">
            </label>
            <label class="field">
              <span>Precio de alquiler</span>
              <input name="rentalPrice" type="number" value="${selectedPackage.rentalPrice || 0}">
            </label>
            <label class="field">
              <span>Color</span>
              <input name="color" value="${selectedPackage.color || ''}">
            </label>
            <label class="field">
              <span>Material</span>
              <input name="material" value="${selectedPackage.material || ''}">
            </label>
            <label class="field">
              <span>Capacidad</span>
              <input name="capacity" type="number" value="${selectedPackage.capacity || 0}">
            </label>
            <label class="field">
              <span>Estado</span>
              <select name="status">
                ${Object.entries({ disponible: 'Disponible', alquilado: 'Alquilado', vendido: 'Vendido', reparacion: 'En reparación' }).map(([key, value]) => `<option value="${key}" ${selectedPackage.status === key ? 'selected' : ''}>${value}</option>`).join('')}
              </select>
            </label>
          </div>
          <div class="module-actions" style="margin-top:20px; justify-content:flex-end;">
            <button type="button" class="secondary-btn" data-action="close-modal">Cancelar</button>
            <button type="submit" class="primary-btn">${mode === 'create' ? 'Guardar paquete' : 'Actualizar paquete'}</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

function renderPackageDetailsModal(pkg) {
  return `
    <div class="modal open" role="dialog" aria-modal="true">
      <div class="modal-card">
        <div class="modal-header">
          <h3>${pkg.name}</h3>
          <button type="button" class="close-btn" aria-label="Cerrar" data-action="close-modal">×</button>
        </div>
        <div class="form-grid">
          <div class="field"><span>Código</span><strong>${pkg.code}</strong></div>
          <div class="field"><span>Categoria</span><strong>${pkg.category}</strong></div>
          <div class="field"><span>Temática</span><strong>${pkg.theme}</strong></div>
          <div class="field"><span>Color</span><strong>${pkg.color}</strong></div>
          <div class="field"><span>Material</span><strong>${pkg.material}</strong></div>
          <div class="field"><span>Capacidad</span><strong>${pkg.capacity} personas</strong></div>
          <div class="field"><span>Precio de venta</span><strong>${formatCurrency(pkg.salePrice)}</strong></div>
          <div class="field"><span>Precio de alquiler</span><strong>${formatCurrency(pkg.rentalPrice)}</strong></div>
          <div class="field" style="grid-column:1 / -1;"><span>Descripción</span><strong>${pkg.description}</strong></div>
          <div class="field" style="grid-column:1 / -1;"><span>Disponibilidad</span><strong><span class="badge ${getPackageStatusClass(pkg.status)}">${getPackageStatusLabel(pkg.status)}</span></strong></div>
        </div>
        <div class="module-actions" style="justify-content:flex-end; margin-top:20px;">
          <button type="button" class="secondary-btn" data-action="close-modal">Cerrar</button>
          <button type="button" class="primary-btn" data-action="edit-package" data-id="${pkg.id}">Editar</button>
        </div>
      </div>
    </div>
  `;
}

function renderPackageAvailabilityModal(pkg) {
  const statusText = getPackageStatusLabel(pkg.status);
  return `
    <div class="modal open" role="dialog" aria-modal="true">
      <div class="modal-card">
        <div class="modal-header">
          <h3>Disponibilidad de ${pkg.name}</h3>
          <button type="button" class="close-btn" aria-label="Cerrar" data-action="close-modal">×</button>
        </div>
        <div class="alert-box ${pkg.status === 'disponible' ? 'success' : pkg.status === 'alquilado' ? 'info' : pkg.status === 'vendido' ? 'warning' : 'danger'}">
          El paquete se encuentra actualmente en estado: <strong>${statusText}</strong>
        </div>
        <div class="form-grid" style="margin-top:18px;">
          <div class="field"><span>Disponibilidad</span><strong>${pkg.stock} unidades disponibles</strong></div>
          <div class="field"><span>Capacidad</span><strong>${pkg.capacity} personas</strong></div>
          <div class="field"><span>Precio alquiler</span><strong>${formatCurrency(pkg.rentalPrice)}</strong></div>
          <div class="field"><span>Precio venta</span><strong>${formatCurrency(pkg.salePrice)}</strong></div>
        </div>
        <div class="module-actions" style="justify-content:flex-end; margin-top:20px;">
          <button type="button" class="secondary-btn" data-action="close-modal">Cerrar</button>
          <button type="button" class="primary-btn" data-action="edit-package" data-id="${pkg.id}">Actualizar estado</button>
        </div>
      </div>
    </div>
  `;
}

function renderPackageModuleUI() {
  const packages = getFilteredPackages();
  const categoryOptions = ['todas', ...new Set(getPackageCollection().map(pkg => pkg.category))];
  const statusOptions = ['todos', 'disponible', 'alquilado', 'vendido', 'reparacion'];

  return `
    <div class="summary-grid">
      <div class="mini-card"><div class="label">Paquetes activos</div><div class="value">${getPackageCollection().length}</div></div>
      <div class="mini-card"><div class="label">Disponibles</div><div class="value">${getPackageCollection().filter(pkg => pkg.status === 'disponible').length}</div></div>
      <div class="mini-card"><div class="label">En alquiler</div><div class="value">${getPackageCollection().filter(pkg => pkg.status === 'alquilado').length}</div></div>
    </div>

    <section class="panel">
      <div class="module-header">
        <h2>Catálogo de paquetes</h2>
        <div class="module-actions">
          <button type="button" class="secondary-btn" data-action="reset-package-filters">Limpiar filtros</button>
          <button type="button" class="primary-btn" data-action="new-package">Nuevo paquete</button>
        </div>
      </div>

      <div class="filter-card">
        <div class="filter-row" style="flex:1;">
          <label class="field" style="min-width:220px; flex:1;">
            <span>Buscar</span>
            <input id="package-search" type="text" value="${packageState.search}" placeholder="Código, nombre, temática, color..." />
          </label>
          <label class="field" style="min-width:180px;">
            <span>Estado</span>
            <select id="package-status-filter">
              ${statusOptions.map((option) => `<option value="${option}" ${packageState.status === option ? 'selected' : ''}>${option === 'todos' ? 'Todos' : getPackageStatusLabel(option)}</option>`).join('')}
            </select>
          </label>
          <label class="field" style="min-width:180px;">
            <span>Categoría</span>
            <select id="package-category-filter">
              ${categoryOptions.map((option) => `<option value="${option === 'todas' ? 'todas' : option}" ${packageState.category === (option === 'todas' ? 'todas' : option) ? 'selected' : ''}>${option === 'todas' ? 'Todas' : option}</option>`).join('')}
            </select>
          </label>
        </div>
      </div>

      <div class="table-wrap" style="margin-top:18px;">
        <table>
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio venta</th>
              <th>Precio alquiler</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            ${packages.length ? packages.map((pkg) => `
              <tr>
                <td>${pkg.code}</td>
                <td>${pkg.name}</td>
                <td>${pkg.category}</td>
                <td>${formatCurrency(pkg.salePrice)}</td>
                <td>${formatCurrency(pkg.rentalPrice)}</td>
                <td><span class="badge ${getPackageStatusClass(pkg.status)}">${getPackageStatusLabel(pkg.status)}</span></td>
                <td>
                  <div class="module-actions">
                    <button type="button" class="chip-btn" data-action="view-package" data-id="${pkg.id}">Consultar</button>
                    <button type="button" class="chip-btn" data-action="edit-package" data-id="${pkg.id}">Editar</button>
                    <button type="button" class="chip-btn" data-action="availability-package" data-id="${pkg.id}">Disponibilidad</button>
                  </div>
                </td>
              </tr>
            `).join('') : `
              <tr>
                <td colspan="7" style="text-align:center; color:#687680; padding:22px;">No se encontraron paquetes con los filtros seleccionados.</td>
              </tr>
            `}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function bindPackageModuleActions() {
  const root = moduleContent;
  if (!root) return;

  const searchInput = root.querySelector('#package-search');
  if (searchInput) {
    searchInput.addEventListener('input', (event) => {
      packageState.search = event.target.value;
      root.innerHTML = renderPackageModuleUI();
      bindPackageModuleActions();
    });
  }

  const statusSelect = root.querySelector('#package-status-filter');
  if (statusSelect) {
    statusSelect.addEventListener('change', (event) => {
      packageState.status = event.target.value;
      root.innerHTML = renderPackageModuleUI();
      bindPackageModuleActions();
    });
  }

  const categorySelect = root.querySelector('#package-category-filter');
  if (categorySelect) {
    categorySelect.addEventListener('change', (event) => {
      packageState.category = event.target.value;
      root.innerHTML = renderPackageModuleUI();
      bindPackageModuleActions();
    });
  }

  root.querySelectorAll('[data-action]').forEach((button) => {
    button.addEventListener('click', () => {
      const action = button.dataset.action;
      const packageId = Number(button.dataset.id || 0);

      if (action === 'reset-package-filters') {
        packageState.search = '';
        packageState.status = 'todos';
        packageState.category = 'todas';
        root.innerHTML = renderPackageModuleUI();
        bindPackageModuleActions();
      }

      if (action === 'new-package') {
        root.insertAdjacentHTML('beforeend', renderPackageForm('create'));
      }

      if (action === 'close-modal') {
        const modal = root.querySelector('.modal.open');
        if (modal) modal.remove();
      }

      if (action === 'edit-package' && packageId) {
        const pkg = getPackageCollection().find(item => item.id === packageId);
        if (pkg) root.insertAdjacentHTML('beforeend', renderPackageForm('edit', pkg));
      }

      if (action === 'view-package' && packageId) {
        const pkg = getPackageCollection().find(item => item.id === packageId);
        if (pkg) root.insertAdjacentHTML('beforeend', renderPackageDetailsModal(pkg));
      }

      if (action === 'availability-package' && packageId) {
        const pkg = getPackageCollection().find(item => item.id === packageId);
        if (pkg) root.insertAdjacentHTML('beforeend', renderPackageAvailabilityModal(pkg));
      }
    });
  });

  const form = root.querySelector('#package-form');
  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(form);
      const payload = Object.fromEntries(formData.entries());
      const packageData = {
        code: payload.code,
        name: payload.name,
        description: payload.description,
        category: payload.category,
        salePrice: Number(payload.salePrice || 0),
        rentalPrice: Number(payload.rentalPrice || 0),
        color: payload.color,
        material: payload.material,
        theme: payload.theme,
        capacity: Number(payload.capacity || 0),
        status: payload.status || 'disponible',
        stock: Number(payload.capacity ? Math.max(1, Math.round(payload.capacity / 10)) : 1)
      };

      const existingPackage = getPackageCollection().find(pkg => pkg.code === payload.code);
      if (existingPackage && !root.querySelector('[data-id]')) {
        Object.assign(existingPackage, packageData);
      } else if (!databaseMode) {
        const maxId = getPackageCollection().reduce((id, pkg) => Math.max(id, pkg.id || 0), 0);
        getPackageCollection().push({ id: maxId + 1, ...packageData });
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
      form.closest('.modal').remove();
      root.innerHTML = renderPackageModuleUI();
      bindPackageModuleActions();
    });
  }
}

const salesState = {
  clientId: '',
  items: [],
  notice: ''
};

function getSaleTotals() {
  if (window.AppArchitecture?.services?.sale) {
    const total = window.AppArchitecture.services.sale.calculateTotal(salesState.items);
    return { subtotal: total, total };
  }
  return salesState.items.reduce((totals, item) => {
    const subtotal = item.quantity * item.unitPrice;
    totals.subtotal += subtotal;
    totals.total += subtotal;
    return totals;
  }, { subtotal: 0, total: 0 });
}

function getSalesClientName(clientId) {
  const client = db.clients.find(item => item.id === Number(clientId));
  return client ? getClientName(client) : '';
}

function renderSalesUI() {
  const totals = getSaleTotals();
  const paid = Number(salesState.paid || 0);
  const completedSales = db.sales.filter(sale => sale.status === 'pagado').length;
  const income = db.sales.reduce((sum, sale) => sum + Number(sale.amount || sale.total || 0), 0);
  const filteredClients = db.clients.filter(client => getClientName(client).toLowerCase().includes(salesClientState.search.toLowerCase()) || String(client.document || '').toLowerCase().includes(salesClientState.search.toLowerCase()));
  const latestSale = [...db.sales].reverse()[0];
  return `
    <div class="summary-grid">
      <div class="mini-card"><div class="label">Ventas registradas</div><div class="value">${db.sales.length}</div></div>
      <div class="mini-card"><div class="label">Ventas confirmadas</div><div class="value">${completedSales}</div></div>
      <div class="mini-card"><div class="label">Ingresos registrados</div><div class="value">${formatCurrency(income)}</div></div>
    </div>
    ${salesState.notice ? reusableComponents.alert({ message: salesState.notice, type: 'success' }) : ''}
    <section class="panel">
      <div class="module-header"><h2>Registrar venta</h2><span class="badge warning">Pago anticipado obligatorio: 100%</span></div>
      <div class="form-grid">
        <label class="field"><span>Buscar cliente</span><input id="sale-client-search" type="search" placeholder="Nombre o documento" value="${salesClientState.search}"></label>
        <label class="field"><span>Cliente</span><select id="sale-client"><option value="">Seleccionar cliente</option>${filteredClients.map(client => `<option value="${client.id}" ${salesState.clientId === String(client.id) ? 'selected' : ''}>${getClientName(client)} · ${client.document}</option>`).join('')}</select></label>
        <label class="field"><span>Producto o paquete</span><select id="sale-product"><option value="">Seleccionar paquete</option>${getPackageCollection().map(pkg => `<option value="${pkg.id}">${pkg.code} - ${pkg.name} · ${formatCurrency(pkg.salePrice)} · ${pkg.available} disponibles</option>`).join('')}</select></label>
        <label class="field"><span>Cantidad</span><input id="sale-quantity" type="number" min="1" value="1"></label>
        <div class="field" style="justify-content:flex-end;"><button type="button" class="secondary-btn" data-sales-action="add-item">Agregar al detalle</button></div>
      </div>
      <div class="table-wrap" style="margin-top:18px;"><table><thead><tr><th>Paquete</th><th>Precio unitario</th><th>Cantidad</th><th>Subtotal</th><th>Acción</th></tr></thead><tbody>${salesState.items.length ? salesState.items.map((item, index) => `<tr><td>${item.code} - ${item.name}</td><td>${formatCurrency(item.unitPrice)}</td><td><input class="sale-item-quantity" data-index="${index}" type="number" min="1" value="${item.quantity}" style="width:78px;"></td><td>${formatCurrency(item.quantity * item.unitPrice)}</td><td><button type="button" class="chip-btn" data-sales-action="remove-item" data-index="${index}">Quitar</button></td></tr>`).join('') : '<tr><td colspan="5" style="text-align:center; padding:22px; color:#687680;">Agrega al menos un paquete para registrar la venta.</td></tr>'}</tbody></table></div>
      <div class="sale-total-box"><div><span>Subtotal</span><strong>${formatCurrency(totals.subtotal)}</strong></div><div><span>Total</span><strong>${formatCurrency(totals.total)}</strong></div><label class="field"><span>Registrar pago</span><input id="sale-payment" type="number" min="0" step="0.01" value="${paid || ''}" placeholder="${totals.total}"></label><button type="button" class="primary-btn" data-sales-action="confirm-sale">Confirmar venta</button></div>
    </section>
    <section class="panel"><div class="module-header"><h2>Ventas registradas</h2><span class="subtitle">Una venta confirmada descuenta unidades disponibles.</span></div><div class="table-wrap"><table><thead><tr><th>Factura</th><th>Cliente</th><th>Fecha</th><th>Total</th><th>Pagado</th><th>Estado</th></tr></thead><tbody>${db.sales.length ? [...db.sales].reverse().map(sale => `<tr><td>${sale.id}</td><td>${sale.client}</td><td>${sale.date || '-'}</td><td>${formatCurrency(sale.amount || sale.total)}</td><td>${formatCurrency(sale.paid || sale.amount || sale.total)}</td><td><span class="badge ${sale.status === 'pagado' ? 'success' : 'warning'}">${sale.status === 'pagado' ? 'Pagado 100%' : sale.status}</span></td></tr>`).join('') : '<tr><td colspan="6" style="text-align:center; padding:20px;">No hay ventas registradas.</td></tr>'}</tbody></table></div></section>
    <section class="panel invoice-panel"><div class="module-header"><h2>Facturación</h2><span class="badge info">Vista previa</span></div>${latestSale ? `<div class="invoice-preview"><div><strong>Decoraciones Fiesta Boliviana S.A.</strong><span>Comprobante ${latestSale.id}</span></div><div><span>Cliente</span><strong>${latestSale.client}</strong></div><div><span>Fecha</span><strong>${latestSale.date || '-'}</strong></div><div><span>Total</span><strong>${formatCurrency(latestSale.total || latestSale.amount)}</strong></div><div><span>Estado</span><strong>${latestSale.status === 'pagado' ? 'Pagado completamente' : 'Pendiente de pago'}</strong></div></div>` : '<p class="subtitle">La factura aparecerá al confirmar una venta.</p>'}</section>
  `;
}

function bindSalesActions() {
  const root = moduleContent;
  const rerender = () => { root.innerHTML = renderSalesUI(); bindSalesActions(); };
  root.querySelector('#sale-client-search')?.addEventListener('input', event => { salesClientState.search = event.target.value; rerender(); });
  root.querySelector('#sale-client')?.addEventListener('change', event => { salesState.clientId = event.target.value; });
  root.querySelector('#sale-payment')?.addEventListener('input', event => { salesState.paid = event.target.value; });
  root.querySelectorAll('.sale-item-quantity').forEach(input => input.addEventListener('change', event => {
    const index = Number(event.target.dataset.index);
    const quantity = Number(event.target.value);
    if (Number.isInteger(quantity) && quantity > 0 && salesState.items[index]) salesState.items[index].quantity = quantity;
    rerender();
  }));
  root.querySelectorAll('[data-sales-action]').forEach(button => button.addEventListener('click', () => {
    const action = button.dataset.salesAction;
    if (action === 'add-item') {
      const productId = Number(root.querySelector('#sale-product')?.value);
      const quantity = Number(root.querySelector('#sale-quantity')?.value);
      const pkg = getPackageCollection().find(item => item.id === productId);
      if (!pkg || !Number.isInteger(quantity) || quantity <= 0) { window.alert('Selecciona un paquete y una cantidad válida.'); return; }
      const existing = salesState.items.find(item => item.packageId === productId);
      if (existing) existing.quantity += quantity;
      else salesState.items.push({ packageId: pkg.id, code: pkg.code, name: pkg.name, unitPrice: Number(pkg.salePrice || 0), quantity });
      rerender();
    }
    if (action === 'remove-item') { salesState.items.splice(Number(button.dataset.index), 1); rerender(); }
    if (action === 'confirm-sale') {
      const totals = getSaleTotals();
      const paid = Number(root.querySelector('#sale-payment')?.value || 0);
      if (!salesState.clientId) { window.alert('Selecciona un cliente antes de confirmar la venta.'); return; }
      if (!salesState.items.length) { window.alert('Agrega al menos un producto o paquete.'); return; }
      if (!Number.isFinite(paid) || paid !== totals.total) { window.alert(`La venta exige el 100% anticipado: debes registrar exactamente ${formatCurrency(totals.total)}.`); return; }
      const unavailable = salesState.items.find(item => {
        const pkg = getPackageCollection().find(product => product.id === item.packageId);
        return !pkg || pkg.available < item.quantity;
      });
      if (unavailable) { window.alert(`Venta rechazada: no hay suficientes unidades disponibles de ${unavailable.name}.`); return; }
      const transaction = runAtomicTransaction(() => {
        if (!databaseMode) {
          for (const item of salesState.items) {
            const movement = applyInventoryMovement({ packageId: item.packageId, type: 'sale', quantity: item.quantity });
            if (!movement.success) return movement;
          }
        }
        const highestInvoiceNumber = db.sales.reduce((highest, sale) => {
          const number = Number(String(sale.id || '').replace(/^FV-/, ''));
          return Number.isFinite(number) ? Math.max(highest, number) : highest;
        }, 200);
        const remote = requestApi('sale_create', { clientId: Number(salesState.clientId), items: salesState.items, total: totals.total, paid });
        const invoiceNumber = `FV-${Number(remote.id)}`;
        db.sales.push({ id: invoiceNumber, client: getSalesClientName(salesState.clientId), items: salesState.items.map(item => ({ ...item })), amount: totals.total, total: totals.total, paid, date: new Date().toISOString().slice(0, 10), status: 'pagado' });
        return { success: true, invoiceNumber };
      });
      if (!transaction.success) { window.alert(`Venta revertida: ${transaction.message}`); return; }
      const invoiceNumber = transaction.result.invoiceNumber;
      salesState.clientId = ''; salesState.items = []; salesState.paid = 0; salesState.notice = `Venta ${invoiceNumber} confirmada con pago anticipado del 100%.`;
      rerender();
    }
  }));
}

function calculateRentalCost(startDate, returnDate, pricePerPeriod) {
  if (window.AppArchitecture?.services?.rental) return window.AppArchitecture.services.rental.calculateCost(startDate, returnDate, pricePerPeriod);
  if (!startDate || !returnDate) return { daysRequested: 0, chargedDays: 0, periods: 0, pricePerPeriod: Number(pricePerPeriod || 0), total: 0 };
  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${returnDate}T00:00:00`);
  const daysRequested = Math.ceil((end - start) / 86400000);
  if (!Number.isFinite(daysRequested) || daysRequested < 1) return { daysRequested, chargedDays: 0, periods: 0, pricePerPeriod: Number(pricePerPeriod || 0), total: 0 };
  const periods = Math.ceil(daysRequested / 2);
  const chargedDays = periods * 2;
  const periodPrice = Number(pricePerPeriod || 0);
  return { daysRequested, chargedDays, periods, pricePerPeriod: periodPrice, total: periods * periodPrice };
}

const rentalState = {
  clientId: '',
  eventId: '',
  packageId: '',
  quantity: 1,
  startDate: '',
  returnDate: '',
  paid: 0,
  status: 'confirmado',
  notice: ''
};

function normalizeRentalData() {
  db.rentals = db.rentals || [];
  db.rentals.forEach((rental) => {
    const event = db.events.find(item => item.event === rental.event || item.client === rental.client);
    rental.startDate = rental.startDate || event?.date || '';
    rental.returnDate = rental.returnDate || (rental.startDate ? new Date(new Date(`${rental.startDate}T00:00:00`).getTime() + (2 * 86400000)).toISOString().slice(0, 10) : '');
    rental.quantity = Number(rental.quantity || 1);
    const pkg = getPackageCollection().find(item => item.name === rental.package);
    rental.packageId = rental.packageId || pkg?.id || '';
    rental.pricePerPeriod = Number(rental.pricePerPeriod || pkg?.rentalPrice || 0);
    const calculation = calculateRentalCost(rental.startDate, rental.returnDate, rental.pricePerPeriod);
    rental.daysRequested = rental.daysRequested || calculation.daysRequested;
    rental.chargedDays = rental.chargedDays || calculation.chargedDays;
    rental.periods = rental.periods || calculation.periods;
    rental.total = rental.total || calculation.total;
    rental.paid = rental.paid ?? 0;
    rental.inventoryReserved = rental.inventoryReserved ?? false;
    rental.status = rental.status || 'confirmado';
  });
  saveDatabase();
}

normalizeRentalData();

function getRentalFormValues(root) {
  const packageField = root.querySelector('#rental-package');
  const startDateField = root.querySelector('#rental-start-date');
  const returnDateField = root.querySelector('#rental-return-date');
  const quantityField = root.querySelector('#rental-quantity');
  const packageId = Number(packageField ? packageField.value : rentalState.packageId);
  const pkg = getPackageCollection().find(item => item.id === packageId);
  const startDate = startDateField ? startDateField.value : rentalState.startDate;
  const returnDate = returnDateField ? returnDateField.value : rentalState.returnDate;
  const quantity = Number(quantityField ? quantityField.value : rentalState.quantity || 1);
  const calculation = calculateRentalCost(startDate, returnDate, pkg?.rentalPrice || 0);
  return { packageId, pkg, startDate, returnDate, quantity, calculation };
}

function rentalDatesOverlap(startA, endA, startB, endB) {
  if (!startA || !endA || !startB || !endB) return false;
  return new Date(`${startA}T00:00:00`) < new Date(`${endB}T00:00:00`) && new Date(`${startB}T00:00:00`) < new Date(`${endA}T00:00:00`);
}

function getReservedRentalQuantity(packageId, startDate, returnDate) {
  return db.rentals.filter(rental => Number(rental.packageId) === Number(packageId) && !['devuelto', 'devuelto_reparacion', 'cancelado'].includes(rental.status) && rentalDatesOverlap(startDate, returnDate, rental.startDate, rental.returnDate)).reduce((sum, rental) => sum + Number(rental.quantity || 0), 0);
}

function cancelRental(rental, rerender) {
  if (!rental || ['devuelto', 'devuelto_reparacion', 'cancelado'].includes(rental.status)) return;
  if (!window.confirm(`¿Deseas cancelar el alquiler ${rental.id}? Se liberarán las unidades reservadas.`)) return;
  const transaction = runAtomicTransaction(() => {
    const remoteId = Number(rental.dbId || String(rental.id).replace(/^AL-/, ''));
    if (remoteId) requestApi('rental_cancel', { dbId: remoteId });
    if (rental.inventoryReserved) {
      if (!databaseMode) {
        const movement = applyInventoryMovement({ packageId: rental.packageId, type: 'return', quantity: rental.quantity });
        if (!movement.success) return movement;
      }
      rental.inventoryReserved = false;
    }
    rental.status = 'cancelado';
    rental.cancelledAt = new Date().toISOString().slice(0, 10);
    return { success: true };
  });
  if (!transaction.success) {
    window.alert(`No se pudo cancelar el alquiler: ${transaction.message}`);
    return;
  }
  rentalState.notice = `Alquiler ${rental.id} cancelado y ${rental.quantity} unidad(es) liberada(s).`;
  rerender();
}

function renderRentalEditForm(rental) {
  return `<div class="modal open" role="dialog" aria-modal="true"><div class="modal-card"><div class="modal-header"><h3>Editar alquiler ${rental.id}</h3><button type="button" class="close-btn" data-rental-action="close-edit">×</button></div><form id="rental-edit-form" data-id="${rental.id}"><div class="form-grid"><label class="field"><span>Cliente</span><input name="client" value="${rental.client}" readonly></label><label class="field"><span>Paquete</span><input name="package" value="${rental.package}" readonly></label><label class="field"><span>Cantidad</span><input name="quantity" type="number" min="1" value="${rental.quantity}" required></label><label class="field"><span>Fecha de inicio</span><input name="startDate" type="date" value="${rental.startDate}" required></label><label class="field"><span>Fecha de devolución</span><input name="returnDate" type="date" value="${rental.returnDate}" required></label><label class="field"><span>Pago anticipado</span><input name="paid" type="number" min="0" step="0.01" value="${rental.paid || 0}" required></label><label class="field"><span>Estado</span><select name="status"><option value="confirmado" ${rental.status === 'confirmado' ? 'selected' : ''}>Confirmado</option><option value="activo" ${rental.status === 'activo' ? 'selected' : ''}>Activo</option><option value="pendiente" ${rental.status === 'pendiente' ? 'selected' : ''}>Pendiente</option></select></label></div><div class="module-actions" style="justify-content:flex-end;margin-top:20px;"><button type="button" class="secondary-btn" data-rental-action="close-edit">Cancelar</button><button type="submit" class="primary-btn">Guardar cambios</button></div></form></div></div>`;
}

function bindRentalEditForm(root, rerender) {
  root.querySelectorAll('[data-rental-action="close-edit"]').forEach(button => button.addEventListener('click', () => button.closest('.modal')?.remove()));
  root.querySelector('#rental-edit-form')?.addEventListener('submit', event => {
    event.preventDefault();
    const rental = db.rentals.find(item => item.id === event.target.dataset.id);
    if (!rental) return;
    const payload = Object.fromEntries(new FormData(event.target).entries());
    const calculation = calculateRentalCost(payload.startDate, payload.returnDate, rental.pricePerPeriod);
    const paid = Number(payload.paid || 0);
    if (!payload.startDate || !payload.returnDate || calculation.daysRequested < 2) { window.alert('El alquiler debe tener fechas válidas y una duración mínima de 2 días.'); return; }
    if (paid < calculation.total * 0.5) { window.alert(`El anticipo mínimo es ${formatCurrency(calculation.total * 0.5)}.`); return; }
    if (!Number.isInteger(Number(payload.quantity)) || Number(payload.quantity) < 1) { window.alert('La cantidad debe ser un número entero mayor que cero.'); return; }
    const otherReservedQuantity = db.rentals
      .filter(item => item.id !== rental.id && Number(item.packageId) === Number(rental.packageId) && !['devuelto', 'devuelto_reparacion', 'cancelado'].includes(item.status))
      .filter(item => rentalDatesOverlap(payload.startDate, payload.returnDate, item.startDate, item.returnDate))
      .reduce((sum, item) => sum + Number(item.quantity || 0), 0);
    const packageData = getPackageCollection().find(item => Number(item.id) === Number(rental.packageId));
    const rentalCapacity = packageData ? Number(packageData.total || packageData.stock || 0) - Number(packageData.sold || 0) - Number(packageData.repair || 0) : 0;
    if (otherReservedQuantity + Number(payload.quantity) > rentalCapacity) { window.alert('El alquiler editado se cruza con reservas existentes o supera la disponibilidad.'); return; }
    const transaction = runAtomicTransaction(() => {
      if (databaseMode) requestApi('rental_update', { dbId: Number(rental.dbId || String(rental.id).replace(/^AL-/, '')), startDate: payload.startDate, returnDate: payload.returnDate, daysRequested: calculation.daysRequested, chargedDays: calculation.chargedDays, periods: calculation.periods, total: calculation.total, paid, quantity: Number(payload.quantity), status: payload.status });
      if (rental.inventoryReserved && !databaseMode) {
        const quantityDifference = Number(payload.quantity) - Number(rental.quantity);
        if (quantityDifference > 0) {
          const increase = applyInventoryMovement({ packageId: rental.packageId, type: 'rental', quantity: quantityDifference });
          if (!increase.success) return increase;
        } else if (quantityDifference < 0) {
          const decrease = applyInventoryMovement({ packageId: rental.packageId, type: 'return', quantity: Math.abs(quantityDifference) });
          if (!decrease.success) return decrease;
        }
      } else {
        const reservation = applyInventoryMovement({ packageId: rental.packageId, type: 'rental', quantity: Number(payload.quantity) });
        if (!reservation.success) return reservation;
        rental.inventoryReserved = true;
      }
      rental.startDate = payload.startDate;
      rental.returnDate = payload.returnDate;
      rental.quantity = Number(payload.quantity);
      rental.daysRequested = calculation.daysRequested;
      rental.chargedDays = calculation.chargedDays;
      rental.periods = calculation.periods;
      rental.total = calculation.total;
      rental.paid = paid;
      rental.status = payload.status;
      return { success: true };
    });
    if (!transaction.success) { window.alert(`Alquiler revertido: ${transaction.message}`); return; }
    event.target.closest('.modal')?.remove();
    rerender();
  });
}

function renderRentalsUI() {
  const activeRentals = db.rentals.filter(rental => ['activo', 'confirmado'].includes(rental.status));
  const income = db.rentals.reduce((sum, rental) => sum + Number(rental.total || 0), 0);
  const values = getRentalFormValues(moduleContent);
  const filteredClients = db.clients.filter(client => getClientName(client).toLowerCase().includes(rentalClientState.search.toLowerCase()) || String(client.document || '').toLowerCase().includes(rentalClientState.search.toLowerCase()));
  const minimumAdvance = values.calculation.total * 0.5;
  const remainingBalance = Math.max(0, values.calculation.total - Number(rentalState.paid || 0));
  return `
    <div class="summary-grid"><div class="mini-card"><div class="label">Alquileres activos</div><div class="value">${activeRentals.length}</div></div><div class="mini-card"><div class="label">Período de alquiler</div><div class="value">2 días</div></div><div class="mini-card"><div class="label">Ingresos registrados</div><div class="value">${formatCurrency(income)}</div></div></div>
    ${rentalState.notice ? reusableComponents.alert({ message: rentalState.notice, type: 'success' }) : ''}
    <section class="panel"><div class="module-header"><h2>Registrar alquiler</h2><span class="badge info">Cada período equivale a 2 días</span></div>
      <div class="form-grid">
        <label class="field"><span>Buscar cliente</span><input id="rental-client-search" type="search" placeholder="Nombre o documento" value="${rentalClientState.search}"></label>
        <label class="field"><span>Cliente</span><select id="rental-client"><option value="">Seleccionar cliente</option>${filteredClients.map(client => `<option value="${client.id}" ${rentalState.clientId === String(client.id) ? 'selected' : ''}>${getClientName(client)} · ${client.document}</option>`).join('')}</select></label>
        <label class="field"><span>Evento</span><select id="rental-event"><option value="">Seleccionar evento</option>${db.events.map(event => `<option value="${event.id}" ${rentalState.eventId === String(event.id) ? 'selected' : ''}>${event.eventType || event.event} · ${event.date}</option>`).join('')}</select></label>
        <label class="field"><span>Paquete</span><select id="rental-package"><option value="">Seleccionar paquete</option>${getPackageCollection().map(pkg => `<option value="${pkg.id}" ${rentalState.packageId === String(pkg.id) ? 'selected' : ''}>${pkg.code} - ${pkg.name} · ${formatCurrency(pkg.rentalPrice)} · ${pkg.available} disponibles</option>`).join('')}</select></label>
        <label class="field"><span>Cantidad</span><input id="rental-quantity" type="number" min="1" value="${values.quantity}"></label>
        <label class="field"><span>Fecha de inicio</span><input id="rental-start-date" type="date" value="${values.startDate}"></label>
        <label class="field"><span>Fecha de devolución</span><input id="rental-return-date" type="date" value="${values.returnDate}"></label>
        <label class="field"><span>Pago anticipado (mínimo 50%)</span><input id="rental-payment" type="number" min="${minimumAdvance}" step="0.01" value="${rentalState.paid || ''}"></label>
        <label class="field"><span>Estado</span><select id="rental-status"><option value="confirmado" ${rentalState.status === 'confirmado' ? 'selected' : ''}>Confirmado</option><option value="activo" ${rentalState.status === 'activo' ? 'selected' : ''}>Activo</option><option value="pendiente" ${rentalState.status === 'pendiente' ? 'selected' : ''}>Pendiente</option></select></label>
      </div>
      <div class="rental-calculation"><div><span>Días solicitados</span><strong>${values.calculation.daysRequested > 0 ? values.calculation.daysRequested : '-'}</strong></div><div><span>Días cobrados</span><strong>${values.calculation.chargedDays || '-'}</strong></div><div><span>Períodos</span><strong>${values.calculation.periods || '-'}</strong></div><div><span>Precio por período</span><strong>${formatCurrency(values.calculation.pricePerPeriod)}</strong></div><div><span>Costo total</span><strong>${formatCurrency(values.calculation.total)}</strong></div><div><span>Anticipo mínimo</span><strong>${formatCurrency(minimumAdvance)}</strong></div><div><span>Saldo pendiente</span><strong>${formatCurrency(remainingBalance)}</strong></div></div>
      <div class="module-actions" style="justify-content:flex-end; margin-top:18px;"><button type="button" class="primary-btn" data-rental-action="confirm">Confirmar alquiler</button></div>
    </section>
    <section class="panel"><div class="module-header"><h2>Alquileres registrados</h2><span class="subtitle">Las unidades se reservan al confirmar.</span></div><div class="table-wrap"><table><thead><tr><th>ID</th><th>Cliente</th><th>Paquete</th><th>Días</th><th>Períodos</th><th>Total</th><th>Anticipo</th><th>Saldo</th><th>Estado</th><th>Acción</th></tr></thead><tbody>${db.rentals.length ? [...db.rentals].reverse().map(rental => `<tr><td>${rental.id}</td><td>${rental.client}</td><td>${rental.package}</td><td>${rental.daysRequested || '-'}/${rental.chargedDays || '-'}</td><td>${rental.periods || '-'}</td><td>${formatCurrency(rental.total)}</td><td>${formatCurrency(rental.paid)}</td><td>${formatCurrency(Math.max(0, Number(rental.total || 0) - Number(rental.paid || 0)))}</td><td><span class="badge ${rental.status === 'activo' || rental.status === 'confirmado' ? 'success' : 'warning'}">${rental.status}</span></td><td>${!['devuelto', 'devuelto_reparacion', 'cancelado'].includes(rental.status) ? `<button type="button" class="chip-btn" data-rental-action="edit" data-id="${rental.id}">Editar</button><button type="button" class="chip-btn" data-rental-action="cancel" data-id="${rental.id}">Cancelar</button>` : '-'}</td></tr>`).join('') : '<tr><td colspan="10" style="text-align:center; padding:20px;">No hay alquileres registrados.</td></tr>'}</tbody></table></div></section>
  `;
}

function bindRentalsActions() {
  const root = moduleContent;
  const rerender = () => { root.innerHTML = renderRentalsUI(); bindRentalsActions(); };
  root.querySelector('#rental-client-search')?.addEventListener('input', event => {
    rentalClientState.search = event.target.value;
    const clientSelect = root.querySelector('#rental-client');
    if (!clientSelect) return;
    const selectedClientId = clientSelect.value;
    const filteredClients = db.clients.filter(client => getClientName(client).toLowerCase().includes(rentalClientState.search.toLowerCase()) || String(client.document || '').toLowerCase().includes(rentalClientState.search.toLowerCase()));
    clientSelect.innerHTML = `<option value="">Seleccionar cliente</option>${filteredClients.map(client => `<option value="${client.id}">${getClientName(client)} · ${client.document}</option>`).join('')}`;
    if (filteredClients.some(client => String(client.id) === selectedClientId)) clientSelect.value = selectedClientId;
  });
  ['#rental-client', '#rental-event', '#rental-package', '#rental-quantity', '#rental-start-date', '#rental-return-date', '#rental-payment', '#rental-status'].forEach(selector => {
    const eventName = ['#rental-client', '#rental-event', '#rental-package', '#rental-status'].includes(selector) ? 'change' : 'input';
    root.querySelector(selector)?.addEventListener(eventName, event => {
    const map = { '#rental-client': 'clientId', '#rental-event': 'eventId', '#rental-package': 'packageId', '#rental-quantity': 'quantity', '#rental-start-date': 'startDate', '#rental-return-date': 'returnDate', '#rental-payment': 'paid', '#rental-status': 'status' };
    rentalState[map[selector]] = event.target.value;
    if (['#rental-package', '#rental-start-date', '#rental-return-date'].includes(selector)) rerender();
    });
  });
  root.querySelector('[data-rental-action="confirm"]')?.addEventListener('click', () => {
    const values = getRentalFormValues(root);
    const client = db.clients.find(item => item.id === Number(rentalState.clientId));
    const event = db.events.find(item => item.id === Number(rentalState.eventId));
    const paid = Number(root.querySelector('#rental-payment')?.value || 0);
    if (!client || !event || !values.pkg) { window.alert('Selecciona cliente, evento y paquete.'); return; }
    if (!values.startDate || !values.returnDate || values.calculation.daysRequested < 1) { window.alert('La fecha de devolución debe ser posterior a la fecha de inicio.'); return; }
    if (values.calculation.daysRequested < 2) { window.alert('El alquiler mínimo es de 2 días.'); return; }
    if (!Number.isInteger(values.quantity) || values.quantity < 1) { window.alert('La cantidad debe ser un número entero mayor que cero.'); return; }
    if (values.quantity > values.pkg.available) { window.alert(`Alquiler rechazado: solo hay ${values.pkg.available} unidades disponibles de ${values.pkg.name}.`); return; }
    const rentalCapacity = values.pkg.total - values.pkg.sold - values.pkg.repair;
    if (getReservedRentalQuantity(values.pkg.id, values.startDate, values.returnDate) + values.quantity > rentalCapacity) { window.alert('Alquiler rechazado: la cantidad solicitada se cruza con reservas existentes para esas fechas.'); return; }
    if (!Number.isFinite(paid) || paid < values.calculation.total * 0.5) { window.alert(`El alquiler requiere un anticipo mínimo del 50%: ${formatCurrency(values.calculation.total * 0.5)}.`); return; }
    const transaction = runAtomicTransaction(() => {
      if (!databaseMode) {
        const movement = applyInventoryMovement({ packageId: values.pkg.id, type: 'rental', quantity: values.quantity });
        if (!movement.success) return movement;
      }
      const highestRentalNumber = db.rentals.reduce((highest, rental) => {
        const number = Number(String(rental.id || '').replace(/^AL-/, ''));
        return Number.isFinite(number) ? Math.max(highest, number) : highest;
      }, 100);
      const remote = requestApi('rental_create', { clientId: client.id, eventId: event.id, packageId: values.pkg.id, quantity: values.quantity, startDate: values.startDate, returnDate: values.returnDate, daysRequested: values.calculation.daysRequested, chargedDays: values.calculation.chargedDays, periods: values.calculation.periods, pricePerPeriod: values.calculation.pricePerPeriod, total: values.calculation.total, paid, status: rentalState.status });
      const rentalId = `AL-${Number(remote.id)}`;
      db.rentals.push({ id: rentalId, dbId: Number(remote.id), client: getClientName(client), event: event.eventType || event.event, package: values.pkg.name, packageId: values.pkg.id, eventId: event.id, quantity: values.quantity, startDate: values.startDate, returnDate: values.returnDate, daysRequested: values.calculation.daysRequested, chargedDays: values.calculation.chargedDays, periods: values.calculation.periods, pricePerPeriod: values.calculation.pricePerPeriod, total: values.calculation.total, paid, status: rentalState.status, inventoryReserved: true, createdAt: new Date().toISOString().slice(0, 10) });
      return { success: true, rentalId };
    });
    if (!transaction.success) { window.alert(`Alquiler revertido: ${transaction.message}`); return; }
    const rentalId = transaction.result.rentalId;
    rentalState.clientId = ''; rentalState.eventId = ''; rentalState.packageId = ''; rentalState.quantity = 1; rentalState.startDate = ''; rentalState.returnDate = ''; rentalState.paid = 0; rentalState.status = 'confirmado'; rentalState.notice = `Alquiler ${rentalId} registrado y ${values.quantity} unidad(es) reservada(s).`;
    rerender();
  });
  root.querySelectorAll('[data-rental-action="edit"]').forEach(button => button.addEventListener('click', () => {
    const rental = db.rentals.find(item => item.id === button.dataset.id);
    if (rental) { root.insertAdjacentHTML('beforeend', renderRentalEditForm(rental)); bindRentalEditForm(root, rerender); }
  }));
  root.querySelectorAll('[data-rental-action="cancel"]').forEach(button => button.addEventListener('click', () => {
    const rental = db.rentals.find(item => item.id === button.dataset.id);
    cancelRental(rental, rerender);
  }));
  bindRentalEditForm(root, rerender);
}

function calculateLateFee(agreedDate, actualDate, pricePerPeriod, quantity = 1) {
  if (window.AppArchitecture?.services?.returns) return window.AppArchitecture.services.returns.calculateLateFee(agreedDate, actualDate, pricePerPeriod, quantity);
  if (!agreedDate || !actualDate) return { lateDays: 0, latePeriods: 0, surcharge: 0 };
  const agreed = new Date(`${agreedDate}T00:00:00`);
  const actual = new Date(`${actualDate}T00:00:00`);
  const lateDays = Math.max(0, Math.ceil((actual - agreed) / 86400000));
  const latePeriods = lateDays > 0 ? Math.ceil(lateDays / 2) : 0;
  const surcharge = latePeriods * Number(pricePerPeriod || 0) * Number(quantity || 1);
  return { lateDays, latePeriods, surcharge };
}

const returnState = {
  rentalId: '',
  actualDate: new Date().toISOString().slice(0, 10),
  condition: 'bueno',
  notes: '',
  payment: 0,
  notice: ''
};

function getReturnableRentals() {
  return db.rentals.filter(rental => !['devuelto', 'devuelto_reparacion', 'cancelado'].includes(rental.status) && rental.packageId);
}

function renderReturnsUI() {
  const rentals = getReturnableRentals();
  const rental = rentals.find(item => String(item.id) === String(returnState.rentalId));
  const lateFee = rental ? calculateLateFee(rental.returnDate, returnState.actualDate, rental.pricePerPeriod, rental.quantity) : { lateDays: 0, latePeriods: 0, surcharge: 0 };
  const rentalBalance = rental ? Math.max(0, Number(rental.total || 0) - Number(rental.paid || 0)) : 0;
  const totalDue = rentalBalance + lateFee.surcharge;
  const pending = rentals.length;
  const late = db.returns.filter(item => item.status === 'atrasado').length;
  const surcharges = db.returns.reduce((sum, item) => sum + Number(item.surcharge || item.recharge || 0), 0);
  return `
    <div class="summary-grid"><div class="mini-card"><div class="label">Devoluciones pendientes</div><div class="value">${pending}</div></div><div class="mini-card"><div class="label">Con mora</div><div class="value">${late}</div></div><div class="mini-card"><div class="label">Recargos registrados</div><div class="value">${formatCurrency(surcharges)}</div></div></div>
    ${returnState.notice ? reusableComponents.alert({ message: returnState.notice, type: 'success' }) : ''}
    <section class="panel"><div class="module-header"><h2>Registrar devolución</h2><span class="badge info">La mora se calcula en períodos de 2 días</span></div>
      <div class="form-grid">
        <label class="field" style="grid-column:1 / -1;"><span>Seleccionar alquiler</span><select id="return-rental"><option value="">Seleccionar alquiler pendiente</option>${rentals.map(item => `<option value="${item.id}" ${returnState.rentalId === String(item.id) ? 'selected' : ''}>${item.id} · ${item.client} · ${item.package} · ${item.quantity} unidad(es)</option>`).join('')}</select></label>
        <label class="field"><span>Fecha acordada</span><input type="date" value="${rental?.returnDate || ''}" readonly></label>
        <label class="field"><span>Fecha real</span><input id="return-actual-date" type="date" value="${returnState.actualDate}"></label>
        <label class="field"><span>Estado del mobiliario</span><select id="return-condition"><option value="bueno" ${returnState.condition === 'bueno' ? 'selected' : ''}>Bueno</option><option value="reparacion" ${returnState.condition === 'reparacion' ? 'selected' : ''}>En reparación</option></select></label>
        <label class="field" style="grid-column:1 / -1;"><span>Observaciones</span><textarea id="return-notes">${returnState.notes}</textarea></label>
      </div>
      <div class="return-detail"><div><span>Cliente</span><strong>${rental?.client || '-'}</strong></div><div><span>Evento</span><strong>${rental?.event || '-'}</strong></div><div><span>Paquete</span><strong>${rental?.package || '-'}</strong></div><div><span>Cantidad</span><strong>${rental?.quantity || '-'}</strong></div></div>
      <div class="rental-calculation"><div><span>Días de retraso</span><strong>${lateFee.lateDays}</strong></div><div><span>Períodos de mora</span><strong>${lateFee.latePeriods}</strong></div><div><span>Total alquiler</span><strong>${formatCurrency(rental?.total || 0)}</strong></div><div><span>Anticipo pagado</span><strong>${formatCurrency(rental?.paid || 0)}</strong></div><div><span>Saldo alquiler</span><strong>${formatCurrency(rentalBalance)}</strong></div><div><span>Recargo por mora</span><strong>${formatCurrency(lateFee.surcharge)}</strong></div><div><span>Total a pagar</span><strong>${formatCurrency(totalDue)}</strong></div><label class="field"><span>Pago del saldo y mora</span><input id="return-payment" type="number" min="${totalDue}" step="0.01" value="${returnState.payment || ''}" placeholder="${totalDue}"></label></div>
      <div class="module-actions" style="justify-content:flex-end; margin-top:18px;"><button type="button" class="primary-btn" data-return-action="confirm">Registrar devolución</button></div>
    </section>
    <section class="panel"><div class="module-header"><h2>Devoluciones registradas</h2><span class="subtitle">El inventario se actualiza según el estado recibido.</span></div><div class="table-wrap"><table><thead><tr><th>ID</th><th>Cliente</th><th>Paquete</th><th>Fecha acordada</th><th>Fecha real</th><th>Retraso</th><th>Recargo</th><th>Estado mobiliario</th></tr></thead><tbody>${db.returns.length ? [...db.returns].reverse().map(item => `<tr><td>${item.id}</td><td>${item.client}</td><td>${item.package || '-'}</td><td>${item.agreedDate || item.dueDate || '-'}</td><td>${item.actualDate || '-'}</td><td>${item.lateDays ?? '-'}</td><td>${formatCurrency(item.surcharge || item.recharge || 0)}</td><td><span class="badge ${item.condition === 'reparacion' ? 'warning' : 'success'}">${item.condition === 'reparacion' ? 'En reparación' : 'Bueno'}</span></td></tr>`).join('') : '<tr><td colspan="8" style="text-align:center; padding:20px;">No hay devoluciones registradas.</td></tr>'}</tbody></table></div></section>
  `;
}

function bindReturnsActions() {
  const root = moduleContent;
  const rerender = () => { root.innerHTML = renderReturnsUI(); bindReturnsActions(); };
  root.querySelector('#return-rental')?.addEventListener('change', event => { returnState.rentalId = event.target.value; rerender(); });
  root.querySelector('#return-actual-date')?.addEventListener('input', event => { returnState.actualDate = event.target.value; rerender(); });
  root.querySelector('#return-condition')?.addEventListener('change', event => { returnState.condition = event.target.value; });
  root.querySelector('#return-notes')?.addEventListener('input', event => { returnState.notes = event.target.value; });
  root.querySelector('#return-payment')?.addEventListener('input', event => { returnState.payment = event.target.value; });
  root.querySelector('[data-return-action="confirm"]')?.addEventListener('click', () => {
    const rental = getReturnableRentals().find(item => String(item.id) === String(returnState.rentalId));
    if (!rental) { window.alert('Selecciona un alquiler pendiente.'); return; }
    if (!returnState.actualDate) { window.alert('Registra la fecha real de devolución.'); return; }
    if (new Date(`${returnState.actualDate}T00:00:00`) < new Date(`${rental.startDate}T00:00:00`)) { window.alert('La fecha real no puede ser anterior al inicio del alquiler.'); return; }
    const lateFee = calculateLateFee(rental.returnDate, returnState.actualDate, rental.pricePerPeriod, rental.quantity);
    const rentalBalance = Math.max(0, Number(rental.total || 0) - Number(rental.paid || 0));
    const totalDue = rentalBalance + lateFee.surcharge;
    if (Number(returnState.payment || 0) < totalDue) { window.alert(`Debes registrar el saldo completo: ${formatCurrency(totalDue)}.`); return; }
    const transaction = runAtomicTransaction(() => {
      const remote = requestApi('return_create', { dbId: Number(rental.dbId || String(rental.id).replace(/^AL-/, '')), agreedDate: rental.returnDate, actualDate: returnState.actualDate, condition: returnState.condition, notes: returnState.notes, surcharge: lateFee.surcharge, payment: Number(returnState.payment) });
      if (rental.inventoryReserved) {
        if (rental.inventoryReserved && !databaseMode) {
          const movement = applyInventoryMovement({ packageId: rental.packageId, type: 'return', quantity: rental.quantity });
          if (!movement.success) return movement;
          if (returnState.condition === 'reparacion') {
            const repairMovement = applyInventoryMovement({ packageId: rental.packageId, type: 'repair', quantity: rental.quantity });
            if (!repairMovement.success) return repairMovement;
          }
        }
        rental.inventoryReserved = false;
      }
      const returnId = `DEV-${String(remote.id).padStart(3, '0')}`;
      db.returns.push({ id: returnId, rentalId: rental.id, client: rental.client, event: rental.event, package: rental.package, quantity: rental.quantity, agreedDate: rental.returnDate, dueDate: rental.returnDate, actualDate: returnState.actualDate, lateDays: lateFee.lateDays, latePeriods: lateFee.latePeriods, surcharge: lateFee.surcharge, balancePaid: Number(returnState.payment), totalCollected: Number(rental.paid || 0) + Number(returnState.payment), condition: returnState.condition, notes: returnState.notes, status: lateFee.lateDays > 0 ? 'atrasado' : 'entregado' });
      rental.status = returnState.condition === 'reparacion' ? 'devuelto_reparacion' : 'devuelto';
      return { success: true, returnId };
    });
    if (!transaction.success) { window.alert(`Devolución revertida: ${transaction.message}`); return; }
    const returnId = transaction.result.returnId;
    returnState.rentalId = ''; returnState.actualDate = new Date().toISOString().slice(0, 10); returnState.condition = 'bueno'; returnState.notes = ''; returnState.payment = 0; returnState.notice = `Devolución ${returnId} registrada. ${lateFee.lateDays ? `Recargo aplicado: ${formatCurrency(lateFee.surcharge)}.` : 'Sin mora.'}`;
    rerender();
  });
}

const serviceState = { search: '', type: 'todos' };

function renderServiceForm(service = null) {
  const value = service || { name: '', type: 'Decoración', price: 0, availability: 1, status: 'disponible', associations: [] };
  const association = value.associations?.[0] || {};
  return `
    <div class="modal open" role="dialog" aria-modal="true">
      <div class="modal-card">
        <div class="modal-header"><h3>${service ? 'Editar servicio' : 'Registrar servicio'}</h3><button type="button" class="close-btn" data-service-action="close">×</button></div>
        <form id="service-form" data-id="${service?.id || ''}">
          <div class="form-grid">
            <label class="field"><span>Servicio</span><input name="name" value="${value.name}" required></label>
            <label class="field"><span>Tipo</span><select name="type">${['Decoración', 'Iluminación', 'Complemento', 'Logística', 'Otro'].map(type => `<option ${value.type === type ? 'selected' : ''}>${type}</option>`).join('')}</select></label>
            <label class="field"><span>Precio</span><input name="price" type="number" min="0" value="${value.price}" required></label>
            <label class="field"><span>Disponibilidad</span><input name="availability" type="number" min="0" value="${value.availability}" required></label>
            <label class="field"><span>Asociar a</span><select name="associationType"><option value="none" ${!association.type ? 'selected' : ''}>Sin asociación</option><option value="sale" ${association.type === 'sale' ? 'selected' : ''}>Venta</option><option value="rental" ${association.type === 'rental' ? 'selected' : ''}>Alquiler</option></select></label>
            <label class="field"><span>Registro</span><select name="associationId"><option value="">Seleccionar registro</option>${db.sales.map(sale => `<option value="${sale.id}" data-kind="sale" ${association.type === 'sale' && association.id === sale.id ? 'selected' : ''}>Venta ${sale.id} · ${sale.client}</option>`).join('')}${db.rentals.map(rental => `<option value="${rental.id}" data-kind="rental" ${association.type === 'rental' && association.id === rental.id ? 'selected' : ''}>Alquiler ${rental.id} · ${rental.client}</option>`).join('')}</select></label>
          </div>
          <div class="module-actions" style="justify-content:flex-end; margin-top:20px;"><button type="button" class="secondary-btn" data-service-action="close">Cancelar</button><button type="submit" class="primary-btn">Guardar servicio</button></div>
        </form>
      </div>
    </div>
  `;
}

function getServiceAssociationLabel(service) {
  const association = service.associations?.[0];
  if (!association) return 'Sin asociación';
  return `${association.type === 'sale' ? 'Venta' : 'Alquiler'} ${association.id}`;
}

function renderServicesUI() {
  const services = db.services.filter(service => {
    const matchesSearch = [service.name, service.type, getServiceAssociationLabel(service)].some(value => String(value).toLowerCase().includes(serviceState.search.toLowerCase()));
    return matchesSearch && (serviceState.type === 'todos' || service.type === serviceState.type);
  });
  const totalAvailability = db.services.reduce((sum, service) => sum + service.availability, 0);
  return `
    <div class="summary-grid"><div class="mini-card"><div class="label">Servicios activos</div><div class="value">${db.services.length}</div></div><div class="mini-card"><div class="label">Unidades disponibles</div><div class="value">${totalAvailability}</div></div><div class="mini-card"><div class="label">Asociaciones</div><div class="value">${db.services.reduce((sum, service) => sum + service.associations.length, 0)}</div></div></div>
    <section class="panel"><div class="module-header"><h2>Catálogo de servicios adicionales</h2><button type="button" class="primary-btn" data-service-action="new">Nuevo servicio</button></div>
      <div class="filter-card"><div class="filter-row" style="flex:1;"><label class="field" style="min-width:240px; flex:1;"><span>Buscar</span><input id="service-search" type="search" placeholder="Servicio o asociación" value="${serviceState.search}"></label><label class="field" style="min-width:180px;"><span>Tipo</span><select id="service-type"><option value="todos">Todos</option>${['Decoración', 'Iluminación', 'Complemento', 'Logística', 'Otro'].map(type => `<option value="${type}" ${serviceState.type === type ? 'selected' : ''}>${type}</option>`).join('')}</select></label></div></div>
      <div class="table-wrap" style="margin-top:18px;"><table><thead><tr><th>Servicio</th><th>Tipo</th><th>Precio</th><th>Disponibilidad</th><th>Asociado a</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>${services.length ? services.map(service => `<tr><td>${service.name}</td><td>${service.type}</td><td>${formatCurrency(service.price)}</td><td>${service.availability}</td><td>${getServiceAssociationLabel(service)}</td><td><span class="badge ${service.availability > 0 ? 'success' : 'danger'}">${service.availability > 0 ? 'Disponible' : 'Agotado'}</span></td><td><button type="button" class="chip-btn" data-service-action="edit" data-id="${service.id}">Editar</button></td></tr>`).join('') : '<tr><td colspan="7" style="text-align:center; padding:20px;">No se encontraron servicios.</td></tr>'}</tbody></table></div>
    </section>
  `;
}

function bindServicesActions() {
  const root = moduleContent;
  const rerender = () => { root.innerHTML = renderServicesUI(); bindServicesActions(); };
  const bindServiceForm = () => root.querySelector('#service-form')?.addEventListener('submit', event => {
    event.preventDefault();
    const payload = Object.fromEntries(new FormData(event.target).entries());
    const association = payload.associationType !== 'none' && payload.associationId ? [{ type: payload.associationType, id: payload.associationId }] : [];
    const serviceData = { name: payload.name, type: payload.type, price: Number(payload.price || 0), availability: Number(payload.availability || 0), status: Number(payload.availability || 0) > 0 ? 'disponible' : 'agotado', associations: association };
    const id = Number(event.target.dataset.id);
    if (id) Object.assign(db.services.find(service => service.id === id), serviceData);
    else db.services.push({ id: Math.max(0, ...db.services.map(service => service.id)) + 1, ...serviceData });
    saveDatabase(); event.target.closest('.modal').remove(); rerender();
  });
  root.querySelector('#service-search')?.addEventListener('input', event => { serviceState.search = event.target.value; rerender(); });
  root.querySelector('#service-type')?.addEventListener('change', event => { serviceState.type = event.target.value; rerender(); });
  root.querySelectorAll('[data-service-action]').forEach(button => button.addEventListener('click', () => {
    const action = button.dataset.serviceAction;
    if (action === 'new') { root.insertAdjacentHTML('beforeend', renderServiceForm()); bindServiceForm(); }
    if (action === 'edit') { const service = db.services.find(item => item.id === Number(button.dataset.id)); if (service) { root.insertAdjacentHTML('beforeend', renderServiceForm(service)); bindServiceForm(); } }
    if (action === 'close') button.closest('.modal')?.remove();
  }));
  bindServiceForm();
}

const reportState = { from: '', to: '' };

function reportDateInRange(date) {
  if (window.AppArchitecture?.services?.report) return window.AppArchitecture.services.report.inRange(date, reportState.from, reportState.to);
  if (!date) return false;
  const value = String(date).slice(0, 10);
  return (!reportState.from || value >= reportState.from) && (!reportState.to || value <= reportState.to);
}

function getReportData() {
  const sales = db.sales.filter(sale => reportDateInRange(sale.date));
  const rentals = db.rentals.filter(rental => reportDateInRange(rental.createdAt || rental.startDate));
  const events = db.events.filter(event => reportDateInRange(event.date));
  const returns = db.returns.filter(item => reportDateInRange(item.actualDate || item.dueDate || item.agreedDate));
  const inventory = getPackageCollection();
  const salesIncome = sales.reduce((sum, sale) => sum + Number(sale.amount || sale.total || 0), 0);
  const rentalIncome = rentals.reduce((sum, rental) => sum + Number(rental.total || 0), 0);
  const productSales = {};
  sales.forEach(sale => (sale.items || []).forEach(item => { productSales[item.name] = (productSales[item.name] || 0) + Number(item.quantity || 0); }));
  const frequentClients = {};
  [...sales, ...rentals].forEach(record => { if (record.client) frequentClients[record.client] = (frequentClients[record.client] || 0) + 1; });
  const fabrication = (db.fabrication || []).filter(item => reportDateInRange(item.date));
  return { sales, rentals, events, returns, inventory, salesIncome, rentalIncome, productSales, frequentClients, fabrication };
}

function reportRowsOrEmpty(rows, columns) {
  return rows.length ? rows.join('') : `<tr><td colspan="${columns}" style="text-align:center; padding:20px; color:#687680;">Sin registros para el período seleccionado.</td></tr>`;
}

function renderReportsUI() {
  const data = getReportData();
  const lateReturns = data.returns.filter(item => item.status === 'atrasado' || Number(item.lateDays || 0) > 0);
  const pendingReturns = getReturnableRentals().filter(rental => reportDateInRange(rental.createdAt || rental.startDate));
  const repairs = (db.repairs || []).filter(item => item.status === 'en_reparacion' || item.status === 'en_espera');
  const totalIncome = data.salesIncome + data.rentalIncome;
  const topProducts = Object.entries(data.productSales).sort((a, b) => b[1] - a[1]);
  const topClients = Object.entries(data.frequentClients).sort((a, b) => b[1] - a[1]);
  return `
    <section class="panel"><div class="module-header"><h2>Filtros de reportes</h2><button type="button" class="secondary-btn" data-report-action="clear">Limpiar filtros</button></div><div class="filter-row"><label class="field"><span>Desde</span><input id="report-from" type="date" value="${reportState.from}"></label><label class="field"><span>Hasta</span><input id="report-to" type="date" value="${reportState.to}"></label></div></section>
    <div class="summary-grid"><div class="mini-card"><div class="label">Ingresos totales</div><div class="value">${formatCurrency(totalIncome)}</div></div><div class="mini-card"><div class="label">Alquileres actuales</div><div class="value">${data.rentals.filter(rental => ['activo', 'confirmado'].includes(rental.status)).length}</div></div><div class="mini-card"><div class="label">Devoluciones atrasadas</div><div class="value">${lateReturns.length}</div></div><div class="mini-card"><div class="label">Reparaciones pendientes</div><div class="value">${repairs.length}</div></div></div>
    <section class="panel"><div class="module-header"><h2>Reporte de inventario</h2><span class="subtitle">Cantidades actuales por paquete o modelo.</span></div><div class="table-wrap"><table><thead><tr><th>Paquete / modelo</th><th>Total</th><th>Disponibles</th><th>Alquilados</th><th>Vendidos</th><th>En reparación</th></tr></thead><tbody>${reportRowsOrEmpty(data.inventory.map(pkg => `<tr><td>${pkg.code} · ${pkg.name}</td><td>${pkg.total}</td><td>${pkg.available}</td><td>${pkg.rented}</td><td>${pkg.sold}</td><td>${pkg.repair}</td></tr>`), 6)}</tbody></table></div></section>
    <div class="list-grid"><section class="panel"><div class="module-header"><h2>Reporte de alquileres</h2></div><div class="metric-row"><span>Alquileres actuales</span><strong>${data.rentals.filter(rental => ['activo', 'confirmado'].includes(rental.status)).length}</strong></div><div class="metric-row"><span>Próximos eventos</span><strong>${data.events.filter(event => new Date(`${event.date}T00:00:00`) >= new Date()).length}</strong></div><div class="metric-row"><span>Ingresos por alquiler</span><strong>${formatCurrency(data.rentalIncome)}</strong></div><div class="metric-row"><span>Devoluciones pendientes</span><strong>${pendingReturns.length}</strong></div></section><section class="panel"><div class="module-header"><h2>Reporte de ventas</h2></div><div class="metric-row"><span>Ventas del período</span><strong>${data.sales.length}</strong></div><div class="metric-row"><span>Ingresos por ventas</span><strong>${formatCurrency(data.salesIncome)}</strong></div><h3 class="report-subtitle">Productos más vendidos</h3><div class="table-wrap"><table><thead><tr><th>Producto</th><th>Cantidad</th></tr></thead><tbody>${reportRowsOrEmpty(topProducts.map(([name, quantity]) => `<tr><td>${name}</td><td>${quantity}</td></tr>`), 2)}</tbody></table></div></section></div>
    <section class="panel"><div class="module-header"><h2>Clientes frecuentes</h2><span class="subtitle">Ventas y alquileres registrados.</span></div><div class="table-wrap"><table><thead><tr><th>Cliente</th><th>Operaciones</th></tr></thead><tbody>${reportRowsOrEmpty(topClients.map(([name, count]) => `<tr><td>${name}</td><td>${count}</td></tr>`), 2)}</tbody></table></div></section>
    <div class="list-grid"><section class="panel"><div class="module-header"><h2>Reporte de fabricación</h2></div><div class="metric-row"><span>Personal involucrado</span><strong>${new Set(data.fabrication.map(item => item.person || item.responsible).filter(Boolean)).size}</strong></div><div class="metric-row"><span>Fabricaciones realizadas</span><strong>${data.fabrication.filter(item => item.status === 'realizada' || item.status === 'completada').length}</strong></div><div class="metric-row"><span>Eficiencia de equipos</span><strong>${data.fabrication.length ? `${Math.round(data.fabrication.reduce((sum, item) => sum + Number(item.efficiency || 0), 0) / data.fabrication.length)}%` : 'Sin registros'}</strong></div><div class="table-wrap"><table><thead><tr><th>Fabricación</th><th>Responsable</th><th>Estado</th></tr></thead><tbody>${reportRowsOrEmpty(data.fabrication.map(item => `<tr><td>${item.name || item.package || '-'}</td><td>${item.person || item.responsible || '-'}</td><td>${item.status || '-'}</td></tr>`), 3)}</tbody></table></div></section><section class="panel"><div class="module-header"><h2>Reporte de control</h2></div><div class="metric-row"><span>Devoluciones atrasadas</span><strong>${lateReturns.length}</strong></div><div class="metric-row"><span>Recargos</span><strong>${formatCurrency(lateReturns.reduce((sum, item) => sum + Number(item.surcharge || item.recharge || 0), 0))}</strong></div><div class="metric-row"><span>Clientes con retrasos frecuentes</span><strong>${new Set(lateReturns.map(item => item.client)).size}</strong></div><div class="metric-row"><span>Reparaciones pendientes</span><strong>${repairs.length}</strong></div></section></div>
  `;
}

function bindReportsActions() {
  const root = moduleContent;
  const rerender = () => { root.innerHTML = renderReportsUI(); bindReportsActions(); };
  root.querySelector('#report-from')?.addEventListener('change', event => { reportState.from = event.target.value; rerender(); });
  root.querySelector('#report-to')?.addEventListener('change', event => { reportState.to = event.target.value; rerender(); });
  root.querySelector('[data-report-action="clear"]')?.addEventListener('click', () => { reportState.from = ''; reportState.to = ''; rerender(); });
}

const modules = {
  dashboard: {
    title: 'Panel principal',
    subtitle: 'Resumen de las operaciones de Decoraciones Fiesta Boliviana S.A.',
    render: () => {
      const dashboardData = getDashboardData();
      return `
        <section class="cards">
          ${dashboardData.cards.map(item => `
            <div class="card">
              <div class="label">${item.label}</div>
              <div class="number">${item.value}</div>
              <div class="status">${item.status}</div>
            </div>
          `).join('')}
        </section>

        <div class="grid">
          <section class="panel">
            <h2>Accesos rápidos</h2>
            <div class="quick">
              ${dashboardData.quickActions.map(action => `
                <button type="button" data-module="${action.title.toLowerCase().includes('alquiler') ? 'alquileres' : action.title.toLowerCase().includes('venta') ? 'ventas' : action.title.toLowerCase().includes('devoluci') ? 'devoluciones' : 'inventario'}">
                  <strong>${action.title}</strong>
                  <span>${action.text}</span>
                </button>
              `).join('')}
            </div>
          </section>

          <section class="panel">
            <h2>Actividad reciente</h2>
            ${dashboardData.activities.map(activity => `
              <div class="activity">
                <div class="dot"></div>
                <div>
                  <b>${activity.title}</b>
                  <p>${activity.detail}</p>
                </div>
              </div>
            `).join('')}
          </section>
        </div>

        <div class="list-grid" style="margin-top:20px;">
          <section class="panel">
            <h2>Ventas recientes</h2>
            <div class="table-wrap">
              <table>
                <thead><tr><th>ID</th><th>Cliente</th><th>Monto</th><th>Estado</th></tr></thead>
                <tbody>
                  ${dashboardData.recentSales.map(sale => `
                    <tr>
                      <td>${sale.id}</td>
                      <td>${sale.client}</td>
                      <td>BS ${sale.amount}</td>
                      <td><span class="badge ${sale.status === 'pagado' ? 'success' : sale.status === 'abono' ? 'info' : 'warning'}">${sale.status}</span></td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </section>

          <section class="panel">
            <h2>Alquileres recientes</h2>
            <div class="table-wrap">
              <table>
                <thead><tr><th>ID</th><th>Cliente</th><th>Evento</th><th>Estado</th></tr></thead>
                <tbody>
                  ${dashboardData.recentRentals.map(rental => `
                    <tr>
                      <td>${rental.id}</td>
                      <td>${rental.client}</td>
                      <td>${rental.event}</td>
                      <td><span class="badge ${rental.status === 'activo' ? 'success' : 'info'}">${rental.status}</span></td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <section class="panel" style="margin-top:20px">
          <h2>Próximos eventos</h2>
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Evento</th>
                  <th>Cliente</th>
                  <th>Fecha</th>
                  <th>Paquete</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                ${dashboardData.events.map(event => `
                  <tr>
                    <td>${event.event}</td>
                    <td>${event.client}</td>
                    <td>${event.date}</td>
                    <td>${event.package}</td>
                    <td><span class="badge ${event.status === 'Alquilado' || event.status === 'Activo' ? 'warning' : 'success'}">${event.status}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </section>
      `;
    }
  },
  paquetes: {
    title: 'Paquetes decorativos',
    subtitle: 'Catálogo y estado de paquetes disponibles.',
    render: () => {
      return renderPackageModuleUI();
    }
  },
  fabricacion: {
    title: 'Fabricación',
    subtitle: 'Control de producción y montaje de paquetes.',
    render: () => `
      <div class="summary-grid">
        <div class="mini-card"><div class="label">Lotes abiertos</div><div class="value">9</div></div>
        <div class="mini-card"><div class="label">Producción hoy</div><div class="value">14</div></div>
        <div class="mini-card"><div class="label">Tasa de avance</div><div class="value">78%</div></div>
      </div>
      <div class="list-grid">
        <section class="panel">
          <h2>Órdenes de trabajo</h2>
          <div class="metric-row"><span>Lote #024 - Rustic</span><strong>82%</strong></div>
          <div class="progress"><span style="width:82%"></span></div>
          <div class="metric-row"><span>Lote #025 - Moderno</span><strong>63%</strong></div>
          <div class="progress"><span style="width:63%"></span></div>
          <div class="metric-row"><span>Lote #026 - Temático</span><strong>45%</strong></div>
          <div class="progress"><span style="width:45%"></span></div>
        </section>
        <section class="panel">
          <h2>Personal y tareas</h2>
          <table>
            <thead><tr><th>Responsable</th><th>Actividad</th><th>Estado</th></tr></thead>
            <tbody>
              <tr><td>Juan</td><td>Montaje de centros</td><td><span class="badge success">Listo</span></td></tr>
              <tr><td>María</td><td>Armado de sillas</td><td><span class="badge warning">En proceso</span></td></tr>
              <tr><td>Pedro</td><td>Decoración floral</td><td><span class="badge info">Programado</span></td></tr>
            </tbody>
          </table>
        </section>
      </div>
    `
  },
  inventario: {
    title: 'Inventario',
    subtitle: 'Disponibilidad, estado y control de stock.',
    render: () => {
      return renderInventoryModuleUI();
    }
  },
  ventas: {
    title: 'Ventas',
    subtitle: 'Registro de ventas, pagos anticipados e inventario.',
    render: () => renderSalesUI()
  },
  alquileres: {
    title: 'Alquileres',
    subtitle: 'Registro de alquileres, períodos y reservas de inventario.',
    render: () => renderRentalsUI()
  },
  devoluciones: {
    title: 'Devoluciones',
    subtitle: 'Control de devoluciones, recargos y moras.',
    render: () => renderReturnsUI()
  },
  logistica: {
    title: 'Logística',
    subtitle: 'Transporte, montaje y desmontaje de eventos.',
    render: () => `
      <div class="summary-grid">
        <div class="mini-card"><div class="label">Entregas hoy</div><div class="value">5</div></div>
        <div class="mini-card"><div class="label">Vehículos</div><div class="value">6</div></div>
        <div class="mini-card"><div class="label">Rutas activas</div><div class="value">3</div></div>
      </div>
      <section class="panel">
        <h2>Programación de logística</h2>
        <table>
          <thead><tr><th>Ruta</th><th>Evento</th><th>Vehículo</th><th>Hora</th><th>Estado</th></tr></thead>
          <tbody>
            <tr><td>La Paz</td><td>Boda María López</td><td>Camión 2</td><td>08:30</td><td><span class="badge success">En tránsito</span></td></tr>
            <tr><td>Santa Cruz</td><td>Quinceañero</td><td>Van 1</td><td>12:00</td><td><span class="badge info">Programado</span></td></tr>
            <tr><td>Cochabamba</td><td>Empresa ABC</td><td>Camión 3</td><td>15:40</td><td><span class="badge warning">Revisión</span></td></tr>
          </tbody>
        </table>
      </section>
    `
  },
  servicios: {
    title: 'Servicios adicionales',
    subtitle: 'Servicios especializados asociados a ventas y alquileres.',
    render: () => renderServicesUI()
  },
  clientes: {
    title: 'Clientes y eventos',
    subtitle: 'CRM y gestión de clientes, eventos y calendario.',
    render: () => renderClientsEventsUI()
  },
  reportes: {
    title: 'Reportes gerenciales',
    subtitle: 'Indicadores de inventario, operaciones, ventas y control.',
    render: () => renderReportsUI()
  },
  configuracion: {
    title: 'Configuración',
    subtitle: 'Usuarios, roles y configuración del sistema.',
    render: () => `
      <section class="panel">
        ${reusableComponents.toolbar({ title: 'Configuración general', actions: [{ label: 'Guardar cambios', type: 'primary-btn' }] })}
        <div class="form-grid">
          <div class="field">
            <label>Empresa</label>
            <input type="text" value="Decoraciones Fiesta Boliviana S.A." />
          </div>
          <div class="field">
            <label>Moneda</label>
            <select>
              <option selected>Bolivianos (BS)</option>
              <option>Dólares (USD)</option>
            </select>
          </div>
          <div class="field">
            <label>Alquiler mínimo</label>
            <input type="text" value="2 días" />
          </div>
          <div class="field">
            <label>Pago anticipado</label>
            <select>
              <option selected>30%</option>
              <option>50%</option>
              <option>100%</option>
            </select>
          </div>
          <div class="field">
            <label>Usuario administrador</label>
            <input type="text" value="Administrador" />
          </div>
          <div class="field">
            <label>Rol asignado</label>
            <select>
              <option selected>Administrador</option>
              <option>Vendedor</option>
              <option>Supervisor</option>
              <option>Logística</option>
            </select>
          </div>
        </div>
      </section>
    `
  },
  logout: {
    title: 'Cerrar sesión',
    subtitle: 'La sesión ha finalizado correctamente.',
    render: () => `
      <section class="panel">
        <h2>Cierre de sesión</h2>
        <p style="margin-bottom:16px; color:#657381;">Has finalizado la sesión actual. Puedes volver a ingresar para continuar con la gestión del sistema.</p>
        <button class="primary-btn" type="button" data-login="relogin">Iniciar sesión nuevamente</button>
      </section>
    `
  }
};

const navMap = {
  dashboard: 'Inicio',
  paquetes: 'Paquetes decorativos',
  fabricacion: 'Fabricación',
  inventario: 'Inventario',
  ventas: 'Ventas',
  alquileres: 'Alquileres',
  devoluciones: 'Devoluciones',
  logistica: 'Logística',
  servicios: 'Servicios adicionales',
  clientes: 'Clientes y eventos',
  reportes: 'Reportes',
  configuracion: 'Configuración',
  logout: 'Cerrar sesión'
};

const rolePermissions = {
  'Administrador': Object.keys(navMap),
  'Coordinador comercial': ['dashboard', 'paquetes', 'ventas', 'alquileres', 'devoluciones', 'clientes', 'reportes', 'logout'],
  'Diseñador': ['dashboard', 'paquetes', 'fabricacion', 'logout'],
  'Supervisor de taller': ['dashboard', 'fabricacion', 'inventario', 'logout'],
  'Artesano': ['dashboard', 'fabricacion', 'logout'],
  'Vendedor': ['dashboard', 'ventas', 'alquileres', 'devoluciones', 'clientes', 'logout']
};

const seededUsers = [
  { email: 'admin@fiestaboliviana.local', password: 'Admin123!', name: 'Administrador', role: 'Administrador' },
  { email: 'coordinador@fiestaboliviana.local', password: 'Coord123!', name: 'Coordinador Comercial', role: 'Coordinador comercial' },
  { email: 'disenador@fiestaboliviana.local', password: 'Diseno123!', name: 'Diseñador', role: 'Diseñador' },
  { email: 'supervisor@fiestaboliviana.local', password: 'Taller123!', name: 'Supervisor de Taller', role: 'Supervisor de taller' },
  { email: 'artesano@fiestaboliviana.local', password: 'Artesano123!', name: 'Artesano', role: 'Artesano' },
  { email: 'vendedor@fiestaboliviana.local', password: 'Vendedor123!', name: 'Vendedor', role: 'Vendedor' }
];

const AUTH_SESSION_KEY = 'decoraciones_fiesta_boliviana_session';
const PBKDF2_ITERATIONS = 150000;
let currentSession = null;

function bytesToBase64(bytes) {
  return btoa(String.fromCharCode(...new Uint8Array(bytes)));
}

function base64ToBytes(value) {
  return Uint8Array.from(atob(value), character => character.charCodeAt(0));
}

async function hashPassword(password, salt = crypto.getRandomValues(new Uint8Array(16))) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' }, key, 256);
  return { hash: bytesToBase64(bits), salt: bytesToBase64(salt) };
}

async function ensureAuthUsers() {
  db.users = Array.isArray(db.users) ? db.users : [];
  for (const seed of seededUsers) {
    if (db.users.some(user => user.email.toLowerCase() === seed.email.toLowerCase() && user.passwordHash && user.passwordSalt)) continue;
    const credentials = await hashPassword(seed.password);
    const existingIndex = db.users.findIndex(user => user.email.toLowerCase() === seed.email.toLowerCase());
    const user = { email: seed.email, name: seed.name, role: seed.role, passwordHash: credentials.hash, passwordSalt: credentials.salt, activo: true };
    if (existingIndex >= 0) db.users[existingIndex] = user;
    else db.users.push(user);
  }
  saveDatabase();
}

async function verifyPassword(password, user) {
  if (window.AppArchitecture?.authentication) return window.AppArchitecture.authentication.verifyPassword(password, user, PBKDF2_ITERATIONS);
  const result = await hashPassword(password, base64ToBytes(user.passwordSalt));
  return result.hash === user.passwordHash;
}

function getAllowedModules() {
  return rolePermissions[currentSession?.role] || [];
}

function applyPermissions() {
  const allowed = getAllowedModules();
  document.querySelectorAll('.nav-item').forEach(button => {
    button.hidden = !allowed.includes(button.dataset.target);
  });
  const userBadge = document.querySelector('.user');
  if (userBadge && currentSession) userBadge.textContent = `${currentSession.name} · ${currentSession.role}`;
}

function renderLoginScreen(message = '') {
  document.body.classList.add('auth-required');
  let screen = document.getElementById('login-screen');
  if (!screen) {
    screen = document.createElement('section');
    screen.id = 'login-screen';
    document.body.appendChild(screen);
  }
  screen.innerHTML = `
    <div class="login-card">
      <div class="brand login-brand">Decoraciones Fiesta Boliviana S.A.<span>Sistema de Gestión</span></div>
      <h1>Iniciar sesión</h1>
      <p class="subtitle">Accede según tu rol autorizado.</p>
      ${message ? `<div class="alert-box danger" role="alert">${message}</div>` : ''}
      <form id="login-form" class="login-form">
        <label class="field"><span>Correo electrónico</span><input name="email" type="email" autocomplete="username" required></label>
        <label class="field"><span>Contraseña</span><input name="password" type="password" autocomplete="current-password" required></label>
        <button type="submit" class="primary-btn">Ingresar</button>
      </form>
      <small class="login-note">La contraseña se verifica con PBKDF2-SHA-256 y no se almacena en texto plano.</small>
    </div>
  `;
  screen.querySelector('#login-form').addEventListener('submit', async event => {
    event.preventDefault();
    const formData = Object.fromEntries(new FormData(event.target).entries());
    const user = db.users.find(item => item.email.toLowerCase() === formData.email.toLowerCase() && item.activo);
    if (!user || !(await verifyPassword(formData.password, user))) {
      renderLoginScreen('Correo o contraseña incorrectos.');
      return;
    }
    currentSession = { email: user.email, name: user.name, role: user.role };
    if (window.AppArchitecture?.authentication) window.AppArchitecture.authentication.setSession(user);
    else sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(currentSession));
    document.body.classList.remove('auth-required');
    screen.remove();
    applyPermissions();
    const firstAllowed = getAllowedModules().find(moduleKey => moduleKey !== 'logout') || 'dashboard';
    renderModule(firstAllowed);
  });
}

function logoutUser() {
  currentSession = null;
  if (window.AppArchitecture?.authentication) window.AppArchitecture.authentication.clearSession();
  else sessionStorage.removeItem(AUTH_SESSION_KEY);
  renderLoginScreen();
}

async function initializeAuthentication() {
  await ensureAuthUsers();
  const savedSession = window.AppArchitecture?.authentication?.getSession() || sessionStorage.getItem(AUTH_SESSION_KEY);
  if (savedSession) {
    currentSession = typeof savedSession === 'string' ? JSON.parse(savedSession) : savedSession;
    document.body.classList.remove('auth-required');
    applyPermissions();
    renderModule(getAllowedModules().includes('dashboard') ? 'dashboard' : getAllowedModules()[0]);
  } else {
    renderLoginScreen();
  }
}

const moduleContent = document.getElementById('module-content');
const topTitle = document.getElementById('page-title');
const topSubtitle = document.getElementById('page-subtitle');

function renderModule(moduleKey) {
  if (moduleKey === 'logout') {
    logoutUser();
    return;
  }
  if (!currentSession || !getAllowedModules().includes(moduleKey)) {
    renderLoginScreen('No tienes permisos para acceder a este módulo.');
    return;
  }
  const module = modules[moduleKey] || modules.dashboard;
  const btns = document.querySelectorAll('.nav-item');

  btns.forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.target === moduleKey);
  });

  topTitle.textContent = module.title;
  topSubtitle.textContent = module.subtitle;
  moduleContent.innerHTML = module.render();

  if (moduleKey === 'paquetes') bindPackageModuleActions();
  if (moduleKey === 'inventario') bindInventoryActions();
  if (moduleKey === 'clientes') bindClientsEventsActions();
  if (moduleKey === 'ventas') bindSalesActions();
  if (moduleKey === 'alquileres') bindRentalsActions();
  if (moduleKey === 'devoluciones') bindReturnsActions();
  if (moduleKey === 'servicios') bindServicesActions();
  if (moduleKey === 'reportes') bindReportsActions();

  document.querySelectorAll('[data-module]').forEach((button) => {
    button.addEventListener('click', () => {
      const target = button.dataset.module;
      if (modules[target]) {
        renderModule(target);
      }
    });
  });

  document.querySelectorAll('[data-login="relogin"]').forEach((button) => {
    button.addEventListener('click', () => renderModule('dashboard'));
  });
}

document.querySelectorAll('.nav-item').forEach((button) => {
  button.addEventListener('click', () => renderModule(button.dataset.target));
});

initializeAuthentication();
