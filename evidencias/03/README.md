# Bloque 03

## Resultado
- Qué añadí al proyecto: La función `createEvent` en `backend/src/createEvent.ts` y el endpoint `POST /events` en `serverless.yml`.
- Ruta o pantalla comprobada: `POST http://localhost:3000/dev/events` con JSON en el body.
- Estado y respuesta observados: 201 Created con el objeto creado y el id `EVT-NEW` cuando el JSON es válido; 400 Bad Request cuando faltan campos o el formato es incorrecto.

## Comprensión
- Recorrido del dato, explicado con mis palabras: El cliente manda un POST con JSON en el body. En la Lambda llega como texto en `event.body`, lo parseo con `JSON.parse` dentro de un try/catch (para capturar errores de sintaxis) y valido tipo `unknown`, campos obligatorios (`artist`, `space`), formato de hora `HH:mm` y `status`. Si todo está bien respondo 201 con los datos limpios; si no, 400 con un mensaje de error.
- Cambio guiado y resultado: Probé con `status: CANCELLED` y dio 201. Con `status: PAUSED` o `time: 29:80` devolvió 400 tal como se esperaba.
- Error encontrado y cómo lo resolví: Ninguno en el código de la Lambda; la validación con regex y comprobación de tipos funcionó a la primera tras compilar con `npm run build`.

## Evidencias
- Captura o transcripción breve, sin credenciales:
  - `POST /dev/events` (datos correctos) -> `201 Created` con `{"id":"EVT-NEW","artist":"Nova Pulse","space":"Main Stage","time":"21:00","status":"CONFIRMED"}`
  - `POST /dev/events` (status CANCELLED) -> `201 Created`
  - `POST /dev/events` (status PAUSED) -> `400 Bad Request` (`{"message":"status debe ser CONFIRMED o CANCELLED"}`)
  - `POST /dev/events` (time 29:80) -> `400 Bad Request` (`{"message":"artist, space y time (HH:mm) son obligatorios"}`)
  - `POST /dev/events` (JSON roto) -> `400 Bad Request` (`{"message":"JSON inválido"}`)
- Limitaciones del ejercicio: No hay base de datos todavía. El id devuelto siempre es `EVT-NEW` fijo y los datos enviados no se guardan en ningún sitio ni se pueden consultar con GET.
