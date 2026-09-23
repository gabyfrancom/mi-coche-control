# Mi Coche Control

App de mantenimiento preventivo y control integral de vehiculos. PWA (React + TypeScript + Vite + Tailwind) instalable en Android e iPhone desde el navegador, con tema violeta y modo oscuro/claro.

Todos los datos se guardan en el dispositivo (localStorage) — no hay backend ni base de datos todavia. Es el punto de partida ideal para probar la app y, mas adelante, conectarla a una API real (ver "Proximos pasos").

## Funcionalidades incluidas

- Gestion del vehiculo: marca, modelo, version, año, matricula, VIN, combustible, potencia, foto (placeholder).
- Actualizacion de kilometraje con calculo de promedio y kilometros recorridos.
- Seguimiento de los 30 puntos de mantenimiento del brief (aceite, filtros, frenos, neumaticos, distribucion, ITV, seguro, etc.) con estados **verde / amarillo / rojo** segun km y fecha restante.
- Detalle editable por cada mantenimiento: fecha, km, coste, taller, notas (el coste se refleja automaticamente en Gastos).
- Control economico: gastos por categoria, totales del mes/año y grafico de los ultimos 6 meses.
- Seguro del vehiculo (poliza, vencimiento, boton de llamada) y Asistencia en carretera (grua, taller, boton de emergencia, compartir ubicacion).
- Tema violeta con modo oscuro (por defecto), claro y "seguir sistema".
- Instalable como PWA (icono, splash, funciona sin conexion tras la primera carga).
- Bloqueo de la app con PIN (4 a 6 digitos, guardado como hash en el dispositivo) y desbloqueo con huella / Face ID / Windows Hello (WebAuthn) donde el dispositivo lo permita — todo se activa desde Perfil > Seguridad.
- Exportacion de todos los datos del vehiculo a Excel (.xlsx) y de una ficha tecnica en PDF, desde Perfil > Exportar datos.
- Campo de marca del producto y especificaciones en cada mantenimiento (aceite, filtros, etc.), ademas de fecha, km, coste y taller.
- Los recordatorios y estados (verde/amarillo/rojo) usan siempre la fecha del dispositivo donde se abre la app (movil u ordenador).

## Requisitos

- Node.js 18 o superior
- npm (o pnpm/yarn si preferis)

## Poner en marcha en local

```bash
npm install
npm run dev
```

Abri `http://localhost:5173` en el navegador. Para probarla como se veria en el movil, abri las herramientas de desarrollador y activa la vista responsive, o entra desde el navegador de tu telefono usando la IP de tu red local.

## Subir este proyecto a GitHub

Si todavia no tenes el repositorio creado:

```bash
git init
git add .
git commit -m "Version inicial de Mi Coche Control"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/mi-coche-control.git
git push -u origin main
```

Si ya creaste el repo vacio en GitHub, copia la URL que te da GitHub y usala en el `git remote add origin ...`.

## Desplegarla (gratis) para usarla desde el movil

**GitHub Pages (ya configurado en este repo)**: el workflow `.github/workflows/deploy.yml` compila el proyecto (`npm run build`) y publica el contenido de `dist/` automaticamente cada vez que haces push a `main`. Solo falta activarlo una vez: en el repo de GitHub anda a **Settings → Pages → Build and deployment → Source** y elegi **GitHub Actions** (no "Deploy from a branch"). Despues de eso, cada push a `main` actualiza sola la web en `https://TU-USUARIO.github.io/mi-coche-control/` (mira el progreso en la pestaña **Actions** del repo). El `base: '/mi-coche-control/'` en `vite.config.ts` ya esta puesto para que las rutas funcionen bajo ese subdirectorio — si renombras el repo, actualiza ese valor tambien.

**Cloudflare Pages (recomendado: dominio propio y cabeceras de seguridad)**
1. En dash.cloudflare.com: **Workers & Pages → Create → Pages → Connect to Git** y elegi el repo `mi-coche-control`.
2. Framework preset: **None**. Build command: `npm run build`. Build output directory: `dist`.
3. En **Environment variables** agrega `BASE_PATH` = `/` (la app se sirve en la raiz, no en `/mi-coche-control/`).
4. Save and Deploy. Queda en `https://mi-coche-control.pages.dev` y se actualiza sola con cada push a `main`.

El archivo `public/_headers` pone la Content-Security-Policy y demas cabeceras de seguridad; Cloudflare lo aplica, GitHub Pages lo ignora. GitHub Pages sigue funcionando igual en paralelo (sin `BASE_PATH` usa `/mi-coche-control/`).

**Mudar los datos**: cada direccion web guarda sus propios datos. En la app vieja: Perfil → *Copia de seguridad completa (JSON)*; en la nueva: Perfil → *Restaurar copia de seguridad*. Despues instala la nueva en el movil y borra la vieja de la pantalla de inicio.

**Vercel** (alternativa, sin usar el workflow anterior)
1. Entra a vercel.com, "Add New Project" y elegi el repo de GitHub.
2. Framework preset: Vite. Build command: `npm run build`. Output directory: `dist`.
3. Deploy. Al terminar, abri la URL desde el navegador del celular y usa "Añadir a pantalla de inicio" (Android) o "Compartir > Añadir a pantalla de inicio" (iPhone).

**Netlify**: igual que Vercel, con build command `npm run build` y publish directory `dist`.

## Estructura del proyecto

```
src/
  components/     Piezas de UI reutilizables (barra inferior, iconos, modales)
  context/        Estado global de la app (React Context + useReducer)
  pages/          Una pantalla por archivo (Dashboard, Vehiculo, Mantenimiento, Gastos, Perfil, Seguro, Asistencia)
  store/          Persistencia en localStorage y datos de ejemplo (seed)
  utils/          Calculo de estados (verde/amarillo/rojo), fechas, gastos, tipos de mantenimiento
  types.ts        Modelos de datos (Vehicle, MaintenanceRecord, Expense, etc.)
```

## Personalizar colores y logo

La paleta violeta esta centralizada en `tailwind.config.js` (`colors.violet`, `colors.amber`, `colors.status`). Los iconos de la app estan en `src/components/Icon.tsx` como SVG en linea, sin dependencias externas. Los iconos de instalacion (PWA) estan en `public/icons/` — reemplazalos por tu logo definitivo cuando lo tengas exportado en 192x192 y 512x512 px.

## Proximos pasos (cuando quieras el backend completo)

El documento original pedia ademas: API REST en Node.js/NestJS, base de datos PostgreSQL, autenticacion (Google/Microsoft/email), notificaciones push/email/SMS reales, un asistente con IA y extras premium (lectura OBD2 por Bluetooth, multiples vehiculos en la nube, copias de seguridad automaticas). Ese trabajo es independiente de este frontend: cuando quieras avanzar con eso, se arma como un proyecto de servidor aparte y este frontend se conecta a el reemplazando las funciones de `src/store/storage.ts` por llamadas a la API (el resto de la app no cambia, porque toda la logica de pantallas ya usa el context central en `src/context/AppContext.tsx`).

**Pendiente, a proposito**: la **sincronizacion de datos en la nube** (para tener el mismo vehiculo en varios dispositivos o hacer copia de seguridad automatica) todavia no esta implementada — se decidio dejarla para una siguiente etapa, junto con el backend. Por ahora, la forma de sacar una copia de los datos es la exportacion a Excel/PDF (Perfil > Exportar datos).
