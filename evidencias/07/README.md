# Bloque 07

## Resultado
- Qué añadí al proyecto: Se completaron las funciones de escritura en `mobile/src/api.ts` (`createEvent`, `replaceEvent`, `updateEvent`, `deleteEvent`) y se integraron en `mobile/App.tsx` con botones dedicados, estado de envío (`busy`), bloqueo de interacción y visor de respuesta del backend.
- Ruta o pantalla comprobada: Interfaz de usuario con acciones sobre `/events` (POST) y `/events/{id}` (PUT, PATCH, DELETE), junto con la recarga (GET).
- Estado y respuesta observados:
  - POST /events: 201 Created con `EVT-NEW`.
  - PUT /events/EVT-101: 200 OK con `operation: "REPLACED"`.
  - PATCH /events/EVT-101: 200 OK con `operation: "UPDATED"` y el nuevo status.
  - DELETE /events/EVT-101: 200 OK con `operation: "DELETED"`.

## Comprensión
- Recorrido del dato, explicado con mis palabras: Al pulsar un botón de acción, se pasa una función asíncrona al helper `run(label, task)`. Se activa el indicador `busy` para deshabilitar los botones y evitar llamadas duplicadas. La función llama a `api.ts`, que ejecuta el `fetch` con el método HTTP correspondiente (`POST`, `PUT`, `PATCH` o `DELETE`) y el payload JSON. La respuesta se formatea en JSON y se muestra directamente en pantalla en el visor de resultados.
- Cambio guiado y resultado: Se probó el envío de `PATCH` cambiando el status a `CONFIRMED`. El backend devolvió HTTP 200 con `status: CONFIRMED` y `operation: UPDATED`. Se mantuvo el valor `CANCELLED` como acción por defecto.
- Error encontrado y cómo lo resolví: Ninguno; la serialización de bodies y la codificación de IDs con `encodeURIComponent` funcionaron de forma limpia.

## Evidencias
- Captura o transcripción breve, sin credenciales:
  - `POST /events` -> 201 (`id: EVT-NEW, status: CONFIRMED`).
  - `PUT /events/EVT-101` -> 200 (`operation: REPLACED`).
  - `PATCH /events/EVT-101` -> 200 (`operation: UPDATED, status: CANCELLED`).
  - `DELETE /events/EVT-101` -> 200 (`operation: DELETED`).
  - `GET /events` posterior -> Mantiene los 2 eventos fijos (`EVT-101` y `EVT-102`).
- Limitaciones del ejercicio: La API no tiene almacenamiento persistente; las respuestas confirman el cumplimiento del contrato HTTP, pero la lista base de eventos no se modifica en el backend.
