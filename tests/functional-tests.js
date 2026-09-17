const testCases = [];

function testCase(id, description, callback) {
  testCases.push({ id, description, callback });
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function baseInventory() {
  return [{ id: 1, name: 'Paquete prueba', total: 5, available: 5, rented: 0, sold: 0, repair: 0, stock: 5 }];
}

function createAuthUser(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  return crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits'])
    .then(key => crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations: 150000, hash: 'SHA-256' }, key, 256))
    .then(bits => ({ passwordHash: btoa(String.fromCharCode(...new Uint8Array(bits))), passwordSalt: btoa(String.fromCharCode(...salt)) }));
}

testCase('CP01', 'Login y hashing seguro', async () => {
  const auth = new AppAuthentication.AuthenticationService(null, 'test-session');
  const credentials = await createAuthUser('Prueba123!');
  const user = { email: 'test@local', passwordHash: credentials.passwordHash, passwordSalt: credentials.passwordSalt };
  assert(await auth.verifyPassword('Prueba123!', user), 'La contraseña válida debe verificarse.');
  assert(!(await auth.verifyPassword('incorrecta', user)), 'Una contraseña incorrecta debe rechazarse.');
  auth.setSession({ email: user.email, name: 'Prueba', role: 'Vendedor' });
  assert(auth.getSession().role === 'Vendedor', 'La sesión debe guardar el rol.');
  auth.clearSession();
});

testCase('CP02', 'Registrar y buscar cliente', () => {
  const service = new ClientService();
  const clients = [];
  service.save(clients, { id: 1, firstName: 'Ana', lastName: 'Rojas', document: 'DOC-1', city: 'La Paz' });
  assert(clients.length === 1, 'El cliente debe guardarse.');
  assert(service.search(clients, 'DOC-1').length === 1, 'El cliente debe poder buscarse.');
});

testCase('CP03', 'Registrar alquiler y aplicar períodos', () => {
  const rental = new RentalService();
  const result = rental.calculateCost('2026-09-01', '2026-09-06', 700);
  assert(result.daysRequested === 5, 'Debe calcular 5 días solicitados.');
  assert(result.chargedDays === 6, '5 días deben cobrarse como 6.');
  assert(result.periods === 3, '5 días deben equivaler a 3 períodos.');
  assert(result.total === 2100, 'El costo debe ser 3 x BS 700.');
  assert(rental.validatePayment(0) === false, 'El alquiler exige pago anticipado.');
  assert(rental.validatePayment(100) === true, 'Un pago anticipado positivo debe aceptarse.');
});

testCase('CP04', 'Registrar venta con pago completo', () => {
  const sale = new SaleService();
  const inventory = baseInventory();
  const items = [{ packageId: 1, quantity: 2, unitPrice: 100 }];
  const total = sale.calculateTotal(items);
  assert(total === 200, 'El total de la venta debe calcularse.');
  assert(sale.validateFullPayment(total, 200), 'El pago completo debe aceptarse.');
  assert(!sale.validateFullPayment(total, 100), 'El pago incompleto debe rechazarse.');
  assert(sale.validateAvailability(items, inventory), 'La venta debe validar disponibilidad.');
});

testCase('DISP-01', 'Rechazar alquiler superior al disponible', () => {
  const inventory = baseInventory();
  const service = new InventoryService();
  const result = service.move(inventory, 1, 'rental', 6);
  assert(result.success === false, 'No debe permitir alquilar más unidades disponibles.');
  assert(inventory[0].available === 5, 'El inventario no debe cambiar al rechazar.');
});

testCase('DEV-01', 'Devolución actualiza inventario', () => {
  const inventory = [{ id: 1, total: 5, available: 3, rented: 2, sold: 0, repair: 0, stock: 3 }];
  const result = new InventoryService().move(inventory, 1, 'return', 2);
  assert(result.success, 'La devolución debe registrarse.');
  assert(inventory[0].available === 5 && inventory[0].rented === 0, 'La devolución debe liberar inventario.');
});

testCase('MORA-01', '3 días de retraso generan 2 períodos', () => {
  const result = new ReturnService().calculateLateFee('2026-09-10', '2026-09-13', 650, 1);
  assert(result.lateDays === 3, 'Debe calcular 3 días de retraso.');
  assert(result.latePeriods === 2, '3 días deben generar 2 períodos de mora.');
  assert(result.surcharge === 1300, 'El recargo debe ser BS 1.300.');
});

testCase('INV-01', 'Venta descuenta inventario', () => {
  const inventory = baseInventory();
  const result = new InventoryService().move(inventory, 1, 'sale', 2);
  assert(result.success && inventory[0].available === 3 && inventory[0].sold === 2, 'La venta debe actualizar inventario.');
});

testCase('FAB-01', 'Fabricación incorpora activos disponibles', () => {
  const inventory = baseInventory();
  inventory[0].available = 0;
  inventory[0].total = 0;
  const result = new ManufacturingService().complete({ status: 'en_proceso', packageId: 1, quantity: 4 }, new InventoryService(), inventory);
  assert(result.success && inventory[0].available === 4 && inventory[0].total === 4, 'La fabricación completada debe generar disponibles.');
});

testCase('REP-01', 'Reportes filtran por fecha', () => {
  const service = new ReportService();
  const result = service.summarize([{ date: '2026-09-10' }, { date: '2026-09-20' }], 'date', '2026-09-01', '2026-09-15');
  assert(result.length === 1, 'El filtro de fechas debe devolver un registro.');
});

async function runTests() {
  const rows = [];
  let passed = 0;
  for (const test of testCases) {
    try {
      await test.callback();
      passed += 1;
      rows.push(`<tr><td>${test.id}</td><td><span class="badge success">PASÓ</span></td><td>${test.description}</td></tr>`);
    } catch (error) {
      rows.push(`<tr><td>${test.id}</td><td><span class="badge danger">FALLÓ</span></td><td>${test.description}<div class="test-error">${error.message}</div></td></tr>`);
    }
  }
  document.querySelector('#test-results').innerHTML = rows.join('');
  document.querySelector('#test-summary').innerHTML = `<span class="test-pass">${passed} pasaron</span><span class="${passed === testCases.length ? 'test-pass' : 'test-fail'}">${testCases.length - passed} fallaron</span><span>Total: ${testCases.length}</span>`;
}

document.querySelector('#run-tests').addEventListener('click', runTests);
