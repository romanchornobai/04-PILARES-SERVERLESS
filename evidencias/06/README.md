# Bloque 06

## Resultado
- Qué añadí al proyecto: Módulo cliente `mobile/src/api.ts` con función `getEvents()` usando `fetch`, y actualización de `mobile/App.tsx` para cargar los eventos con `useEffect` y estados de carga (`loading`) y error (`error`).
- Ruta o pantalla comprobada: Petición `GET http://localhost:3000/dev/events` desde la aplicación cliente web.
- Estado y respuesta observados: 200 OK con los 2 eventos que se renderizan dinámicamente en las tarjetas. En caso de fallo o ruta inexistente, se muestra el mensaje de error capturado con opción de recargar.

## Comprensión
- Recorrido del dato, explicado con mis palabras: Al montarse el componente, `useEffect` invoca a `loadEvents()`. Este llama a `getEvents()` en `api.ts`, que ejecuta un `fetch` a `http://localhost:3000/dev/events`. Si la respuesta es `ok`, valida que el JSON sea un array de `FestivalEvent` y actualiza el estado `events`, sustituyendo la pantalla de carga por las tarjetas. Si el backend está apagado o falla, captura la excepción y muestra el error en la interfaz sin romper la app.
- Cambio guiado y resultado: Se probó solicitando `/ruta-inexistente` y devolvió HTTP 404, mostrándose el error en pantalla. Al restaurar `/events`, volvió a responder 200 OK y cargó los eventos correctamente.
- Error encontrado y cómo lo resolví: Ninguno; la función `isFestivalEvent` previene renderizar datos con formato inesperado.

## Evidencias
- Captura o transcripción breve, sin credenciales:
  - `GET http://localhost:3000/dev/events` -> 200 OK con `[{"id":"EVT-101",...},{"id":"EVT-102",...}]`.
  - Prueba de fallo: `GET /dev/ruta-inexistente` -> 404 Not Found capturado en la UI.
  - Metro bundler exporta `mobile/` a web sin errores (`npm run build:web`).
- Limitaciones del ejercicio: La aplicación sólo realiza lectura (GET). Todavía no interactúa con los endpoints de creación, modificación o borrado de eventos desde la interfaz.
