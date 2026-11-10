# SEGlobal 360 · Plataforma web

Implementación en código del lienzo de diseño **«SEGlobal 360 — Plataforma web»**: el sitio público (inicio, marketplace, detalle de servicio, perfil público del proveedor, contacto, ingreso y registro), los portales de empresa (cliente, proveedor mayorista y operador logístico) y el backoffice de Operaciones.

Es una **implementación visual con datos de ejemplo**: todavía no llama a la API de [`global360_backend`](../global360_backend). Los datos viven tipados en `fixtures.ts` de cada carpeta de `src/features`, con los nombres de campo y los valores de estado del backend, para cambiarlos por llamadas reales sin tocar los componentes.

## Cómo levantarlo

Requiere Node.js 20.9 o superior y pnpm.

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm build && pnpm start
pnpm typecheck
pnpm lint
```

## Pantallas

| Superficie | Ruta | Pantalla del diseño |
|---|---|---|
| Público | `/` | Landing · Inicio |
| | `/marketplace` (`?tab=products\|services&q=&route=CO-CR`) | Marketplace |
| | `/marketplace/services/[id]` | Detalle de servicio |
| | `/marketplace/providers/[id]` | Perfil público del proveedor |
| | `/contact` | Contacto |
| | `/login` · `/register` (`?type=`) · `/get-quote` | Ingreso · Registro de empresa |
| Cliente | `/portal` | Inicio |
| | `/portal/inquiries/new` (`?serviceId=`) · `/portal/inquiries/[code]` (`?status=in_contact`) | Nueva solicitud · Solicitud y cotización |
| | `/portal/quotes` · `/portal/company` · `/portal/company/users` | Cotizaciones · Mi empresa · Usuarios |
| Proveedor mayorista | `/supplier` (`?status=draft\|in_review\|published`) · `/supplier/company` (`?view=operator`) · `/supplier/company/users` | Perfil · Mi empresa · Usuarios |
| Operador logístico | `/logistics` (`?status=`) · `/logistics/services` · `/logistics/company` · `/logistics/company/users` | Perfil · Servicios · Mi empresa · Usuarios |
| Backoffice | `/backoffice` · `/backoffice/inquiries/[code]` · `/backoffice/quotes` | Bandeja · Solicitud y cotizador · Cotizaciones |
| | `/backoffice/companies` · `/backoffice/providers` (`?status=&type=&q=&selected=`) | Empresas · Proveedores |
| | `/backoffice/corridors` · `/backoffice/corridors/[code]` | Corredores · Corredor y comisión |
| Desarrollo | `/dev/ui` | Fundamentos visuales |

Los ejemplos que enlazan varias pantallas son la solicitud `SOL-2026-000017`, su cotización `COT-2026-000009` y el corredor `CO-CR`. Las acciones (aceptar, rechazar, validar, publicar, guardar…) cambian el estado solo en el navegador y se pierden al recargar.

Sin pantalla en el diseño, y por tanto todavía en 404: `/forgot-password`, `/legal/terms` y `/legal/privacy`.

## Estructura

```
src/
  app/                rutas: (site) público, (auth) ingreso y registro, (portal) portales, backoffice, dev/ui
  features/
    <modulo>/model.ts etiquetas y tonos de cada estado, con los valores del backend
    <superficie>/     componentes y datos de ejemplo de cada superficie (marketplace, portal-client…)
  shared/
    ui/               kit propio sobre HTML nativo: botones, estados, campos, avisos, tablas, barra pública y marco de portal
    lib/              utilidades y rutas (`routes`, `demo`, `slug`)
```

Stack: Next.js 16 (App Router), React 19, TypeScript estricto, Tailwind CSS 4 con los tokens del diseño en `src/app/globals.css`, `lucide-react` para los iconos y `country-flag-icons` para las banderas. Sigue las convenciones de [`seglobal360_frontend`](../seglobal360_frontend) (kit propio, sin librerías de componentes), salvo que aquí las carpetas de `features` se organizan por superficie para poder construirlas en paralelo.

## Fundamentos visuales

- Montserrat 700 en títulos e Inter en el resto; nada en mayúsculas sostenidas.
- Navy `#061024` / `#0B1B33` / `#12274A`, dorado `#C9A45C` / `#E8CB8E`, dorado texto `#8A6224`, arena `#F6ECD6`, crema `#F3F0E8` e ivory `#F7F5F0`.
- Botones de 14–16 px de radio, tarjetas de 24–28 px y píldoras solo en chips y estados. Una sola acción dorada por vista.
- Barra pública clara y flotante; menú de los portales navy y flotante, en fila deslizable en el teléfono.
- Sin animaciones: al pasar el cursor solo cambian la sombra y el color.
