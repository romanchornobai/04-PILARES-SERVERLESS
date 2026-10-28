# Bloque 07

## Resultado
- Qué añadí al proyecto: Completé en `mobile/src/api.ts` las funciones de escritura (`createEvent`, `replaceEvent`, `updateEvent` y `deleteEvent`) y las integré en `mobile/App.tsx` con botones para cada acción, estado `busy` para bloquear clics repetidos y un visor donde veo la respuesta JSON del servidor.
- Ruta o pantalla comprobada: La app en el navegador probando POST sobre `/events` y PUT, PATCH y DELETE sobre `/events/{id}`, además del botón de recargar con GET.
- Estado y respuesta observados:
  - POST /events: 201 Created con el id nuevo `EVT-NEW`.
  - PUT /events/EVT-101: 200 OK con `operation: "REPLACED"`.
  - PATCH /events/EVT-101: 200 OK con `operation: "UPDATED"`.
  - DELETE /events/EVT-101: 200 OK con `operation: "DELETED"`.

## Comprensión
- Recorrido del dato, explicado con mis palabras: Cuando pulso un botón de acción, ejecuto una función asíncrona dentro de `run()`. Pongo `busy` a true para deshabilitar los botones mientras espero la respuesta de red. Esa tarea llama a `api.ts`, que lanza el `fetch` con el método HTTP adecuado (POST, PUT, PATCH o DELETE) y serializa el JSON. Al volver la respuesta, la formateo con `JSON.stringify` y la muestro en la caja de resultados de la pantalla.
- Cambio guiado y resultado: Cambié el estado en la acción PATCH a `CONFIRMED`. Al pulsar el botón, el backend me respondió 200 OK con `status: CONFIRMED` y `operation: UPDATED`. Luego volví a dejar `CANCELLED` como valor por defecto.
- Error encontrado y cómo lo resolví: Ninguno; usando `encodeURIComponent` para los IDs y pasando bien las cabeceras `Content-Type: application/json` funcionó todo a la primera.

## Evidencias
- Captura o transcripción breve, sin credenciales:
  - `POST /events` -> 201 (`id: EVT-NEW, status: CONFIRMED`).
  - `PUT /events/EVT-101` -> 200 (`operation: REPLACED`).
  - `PATCH /events/EVT-101` -> 200 (`operation: UPDATED, status: CANCELLED`).
  - `DELETE /events/EVT-101` -> 200 (`operation: DELETED`).
  - `GET /events` posterior -> Sigo viendo los 2 eventos iniciales en la lista (`EVT-101` y `EVT-102`).
- Limitaciones del ejercicio: Como no hay base de datos real, los datos no persisten. Los botones prueban que el contrato HTTP responde bien, pero al recargar con GET el catálogo sigue intacto.
