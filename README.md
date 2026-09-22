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

Cualquiera de estas opciones te da una URL publica en minutos, sin mantener un servidor:

**Vercel**
1. Entra a vercel.com, "Add New Project" y elegi el repo de GitHub.
2. Framework preset: Vite. Build command: `npm run build`. Output directory: `dist`.
3. Deploy. Al terminar, abri la URL desde el navegador del celular y usa "Añadir a pantalla de inicio" (Android) o "Compartir > Añadir a pantalla de inicio" (iPhone).

**Netlify**: igual que arriba, con build command `npm run build` y publish directory `dist`.

**GitHub Pages**: agrega `base: '/mi-coche-control/'` en `vite.config.ts` (dentro de `defineConfig`) con el nombre de tu repo, corre `npm run build` y publica el contenido de `dist/` en la rama `gh-pages` (podes usar la accion `peaceiris/actions-gh-pages` o el paquete `gh-pages`).

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
