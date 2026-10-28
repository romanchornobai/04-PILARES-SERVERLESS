# Bloque 02

## Resultado
- Qué añadí al proyecto: Se añadió la función Lambda `getEvent` en `backend/src/getEvent.ts` y se configuró en `backend/serverless.yml` con la ruta dinámica `events/{id}` mediante método GET.
- Ruta o pantalla comprobada: Endpoint `http://localhost:3000/dev/events/{id}` (probado con `EVT-104`, `EVT-205` y `EVT-330`) y `http://localhost:3000/dev/hello`.
- Estado y respuesta observados: Código de estado 200 OK con payload JSON que refleja el `id` recibido dinámicamente (`{"id":"EVT-...","artist":"Neon Waves","space":"Main Stage","time":"22:30","status":"CONFIRMED"}`).

## Comprensión
- Recorrido del dato, explicado con mis palabras: El cliente envía la petición HTTP a la URL con un segmento dinámico (`/events/EVT-104`). Serverless Offline (API Gateway) hace match con la plantilla `events/{id}`, extrae el valor `EVT-104` y lo inyecta en el objeto `event` dentro de `event.pathParameters.id`. El handler de TypeScript accede a ese parámetro con optional chaining (`event.pathParameters?.id`), comprueba que exista (devolviendo 400 si falta) y construye una respuesta con código 200 serializando en el `body` JSON el `id` dinámico junto al resto de datos simulados.
- Cambio guiado y resultado: Se probó con los identificadores `EVT-205` y `EVT-330` sin modificar la función TypeScript. En todos los casos el backend devolvió el `id` correspondiente en el JSON con HTTP 200.
- Error encontrado y cómo lo resolví: Ninguno durante la ejecución; se aseguró la compilación correcta mediante `tsc` a la carpeta `dist/` antes de levantar `serverless offline`.

## Evidencias
- Captura o transcripción breve, sin credenciales:
  - Petición: `GET /dev/events/EVT-104` -> Respuesta: `{"id":"EVT-104","artist":"Neon Waves","space":"Main Stage","time":"22:30","status":"CONFIRMED"}`
  - Petición: `GET /dev/events/EVT-205` -> Respuesta: `{"id":"EVT-205","artist":"Neon Waves","space":"Main Stage","time":"22:30","status":"CONFIRMED"}`
  - Petición: `GET /dev/events/EVT-330` -> Respuesta: `{"id":"EVT-330","artist":"Neon Waves","space":"Main Stage","time":"22:30","status":"CONFIRMED"}`
  - GET `/dev/hello` continúa respondiendo 200 OK correctamente.
- Limitaciones del ejercicio: Los datos del evento (`artist`, `space`, `time`, `status`) están cableados/hardcoded en la respuesta. Cualquier ID no vacío devuelve la misma ficha simulada; aún no existe persistencia ni consulta contra base de datos.
