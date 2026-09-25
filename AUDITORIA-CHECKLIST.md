# Checklist de auditoría — Mi Coche Control

Última revisión: 2026-09-25 (revisión estática del código en `main` @ 5ad1199).
Orden de trabajo: **P0 → P1 → P2 → P3**. Cada punto se marca `[x]` cuando está arreglado y verificado.

> Node.js 24 LTS instalado el 2026-09-25: ya se puede compilar y probar en local.

## ✅ Ya arreglado (commit 5ad1199 «Arreglos criticos de la auditoria»)

- [x] PIN de 4 a 6 cifras validado a su longitud real + re-bloqueo tras 1 min en segundo plano
- [x] Guardar un mantenimiento conserva fechaProxima/kmProxima y no duplica el gasto
- [x] Datos corruptos se apartan (`mcc:v1:corrupto`) y se avisa; aviso si falla el guardado
- [x] Arranque vacío sin datos de ejemplo; `storage.persist()`; sincronización entre pestañas
- [x] Copia de seguridad JSON (exportar / restaurar)
- [x] Compartir ubicación con coordenadas
- [x] Excel/PDF con carga diferida (bundle 299 KB → 72 KB gzip)
- [x] Fuentes locales (sin Google Fonts) y precacheadas
- [x] `BASE_PATH` configurable + `public/_headers` con CSP para Cloudflare
- [x] Zoom permitido; manifest con `lang` e `id`

## 🔴 P0 — Pérdida de datos o cuelgues (primero)

> Verificado el 2026-09-25: `npm run build` compila sin errores y los cuatro arreglos se probaron en la app real (dev server). Datos en formato antiguo cargan y se reparan; Seguro y Asistencia abren sin errores; al quitar el coste de un mantenimiento desaparece su gasto; 0 errores en consola. Además, 13/13 pruebas de la lógica de fechas y normalización.

- [x] **P0-1 Fechas desplazadas un día.** `todayIso()` usaba UTC y `new Date('AAAA-MM-DD')` se interpreta como medianoche UTC. En Canarias (UTC+0/+1) solo fallaba entre las 00:00 y la 01:00 locales; en América (UTC-3…-8) desplazaba todas las fechas elegidas al día anterior, incluso al mes anterior. — `utils/date.ts:18`, `pages/Expenses.tsx:19,41`, `pages/Dashboard.tsx:48`, `pages/Onboarding.tsx:31`
  - Arreglo: `parseDate`, `dateInputToIso` y `toDateInput` en `utils/date.ts` interpretan las fechas sin hora como mediodía local; se usan en Gastos, Seguro, Vehículo, Mantenimiento, estados, totales y en los exportes Excel/PDF (que antes escribían la fecha ISO en crudo). Los gastos ya guardados a medianoche UTC se pasan a mediodía UTC al cargar.
- [x] **P0-2 Gasto huérfano.** Si en un mantenimiento se borraba el coste, el registro perdía `expenseId` pero el gasto seguía sumando en Gastos. — `pages/MaintenanceDetail.tsx`
  - Arreglo: al guardar sin coste se borra el gasto vinculado (`DELETE_EXPENSE`).
- [x] **P0-3 Restaurar una copia antigua podía colgar la app.** `readBackup` no rellenaba `insurances`, `itvRecords`, `tireSets`, `roadsideContacts` ni `settings`, e `isAppData` aceptaba `settings: null`. — `store/storage.ts`
  - Arreglo: `normalizeAppData` valida y completa los datos (listas, ajustes con `DEFAULT_SETTINGS`, vehículo activo inexistente). La usan la carga inicial, la restauración y la sincronización entre pestañas. Un JSON mal formado da un mensaje claro.
- [x] **P0-4 Hook después de un `return`.** El `useState` de `shareMsg` iba detrás de `if (!activeVehicle) return null`. — `pages/Roadside.tsx`
  - Arreglo: el hook se movió antes del `return`. Revisadas las demás pantallas: no hay otro caso.

## 🟠 P1 — Seguridad y privacidad

- [ ] **P1-1 PIN sin límite de intentos.** Añadir espera creciente tras 5 fallos (persistida para que recargar no la salte). — `components/LockScreen.tsx:35-52`
- [ ] **P1-2 Hash del PIN débil.** SHA-256 de una pasada: con acceso al `localStorage` se prueban los 1,1 M de PIN posibles en segundos. Pasar a PBKDF2 (≥100k iteraciones) con migración de PIN existentes. — `utils/crypto.ts`
- [ ] **P1-3 Dejar claro qué protege el bloqueo.** Es un bloqueo de pantalla: los datos del coche siguen sin cifrar en `localStorage`. Ajustar el texto de Perfil › Seguridad y el README.
- [ ] **P1-4 Dependencias con vulnerabilidades conocidas** (`npm audit`, 2026-09-25: 1 crítica, 3 altas, 5 moderadas). Todas se arreglan con un salto de versión mayor, así que hay que actualizar y probar una por una. — `package.json`
  - `jspdf` 2.5 → 4.x (**crítica**: ReDoS/DoS) y `jspdf-autotable` → 5.x (alta). Arrastra `dompurify` (XSS, moderada). Afecta a la ficha PDF.
  - `xlsx` 0.18.5 (alta: prototype pollution, ReDoS). npm no tiene versión corregida: pasar a SheetJS 0.20.x desde su CDN oficial o a `exceljs`. Riesgo real bajo, porque solo se usa para escribir.
  - `react-router-dom` 6 → 7 (moderada: open redirect).
  - `vite` 5 → 8, `esbuild` y `vite-plugin-pwa` → 1.x (alta/moderada). Solo afectan al servidor de desarrollo, no a la app publicada; prioridad menor.
- [ ] **P1-5 Huella activable sin PIN.** Se puede activar la biometría con el bloqueo apagado (no hace nada) y queda activa tras quitar el PIN a medias. Exigir PIN antes de ofrecer la huella. — `pages/Profile.tsx:38-54,116-120`

## 🟡 P2 — Funcionalidad y experiencia

- [ ] **P2-1 Botón Emergencia sin teléfono.** Sin contactos guardados abre `tel:` vacío; debe caer en 112. — `pages/Roadside.tsx:55`
- [ ] **P2-2 Borrar vehículo deja datos huérfanos** (mantenimientos, gastos, km, seguro, contactos). — `context/AppContext.tsx:40-43`
- [ ] **P2-3 Gastos no se pueden editar ni borrar** (la acción `DELETE_EXPENSE` existe pero no hay botón) y el importe acepta negativos/0. — `pages/Expenses.tsx`
- [ ] **P2-4 Km menor al actual se acepta sin avisar** y distorsiona «km recorridos». — `pages/Dashboard.tsx:45-51`
- [ ] **P2-5 Nombre «Gaby / Gaby Franco» fijo en el código.** Guardarlo en ajustes y pedirlo en el alta. — `pages/Dashboard.tsx`, `pages/Profile.tsx:63,66`
- [ ] **P2-6 Botones que no hacen nada:** «Adjuntar factura o foto», «Cambiar foto», «Permiso circulación», «Ficha técnica» e interruptores de notificaciones push/correo/SMS. Implementar u ocultar con «Próximamente».
- [ ] **P2-7 `navigate()` durante el render** en Vehículo sin coche (aviso de React). Usar `<Navigate>`. — `pages/Vehicle.tsx:23-26`
- [ ] **P2-8 Tema «Sistema» no reacciona** si el móvil cambia de claro a oscuro con la app abierta. — `context/AppContext.tsx:147-154`
- [ ] **P2-9 El aviso rojo de error de guardado no se va** aunque el siguiente guardado funcione. — `context/AppContext.tsx:129-131`

## 🔵 P3 — Calidad, tests y mantenimiento

- [ ] **P3-1 No hay ningún test.** Añadir Vitest + tests de `status.ts` (verde/amarillo/rojo), `date.ts` (zona horaria), `expenses.ts`, `storage.ts` (carga/corruptos/restaurar) y el reducer.
- [ ] **P3-2 Sin ESLint** (la regla `react-hooks` habría detectado P0-4).
- [ ] **P3-3 El workflow de deploy no ejecuta tests ni lint** antes de publicar. — `.github/workflows/deploy.yml`
- [ ] **P3-4 Carpeta del proyecto desordenada:** hay 3 copias del código (`mi-coche-control/mi-coche-control`, `mi-coche-control/src`, `_clone`), un `.zip` y dos `.patch`. Dejar solo el repo `_clone` y archivar el resto.
- [x] **P3-5 Instalar Node.js en este PC** para poder compilar y ejecutar los tests en local. Instalado Node 24.21 LTS (2026-09-25); `npm ci` + `npm run build` funcionan.
- [ ] **P3-6 Workflow de deploy con Node 20**, que ya no recibe actualizaciones. Subir a 24 en `.github/workflows/deploy.yml`, igual que en local.
