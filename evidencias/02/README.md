# Bloque 02

## Resultado
- Qué añadí al proyecto: La función `getEvent` en `backend/src/getEvent.ts` y la ruta dinámica `events/{id}` en `serverless.yml`.
- Ruta o pantalla comprobada: `http://localhost:3000/dev/events/EVT-104`, `/events/EVT-205` y `/events/EVT-330`.
- Estado y respuesta observados: 200 OK devolviendo el JSON con el `id` correspondiente recibido en la URL.

## Comprensión
- Recorrido del dato, explicado con mis palabras: Pongo el ID en la URL, Serverless Offline lo mapea a `pathParameters.id` y en el handler lo recojo con `event.pathParameters?.id`. Si viene lo devuelvo en el JSON; si no, devuelvo un 400.
- Cambio guiado y resultado: Probé con `EVT-205` y `EVT-330` sin tocar el código y la respuesta reflejó cada id correctamente.
- Error encontrado y cómo lo resolví: Ninguno, compiló a la primera tras crear los archivos.

## Evidencias
- Captura o transcripción breve, sin credenciales:
  - `GET /dev/events/EVT-104` -> `{"id":"EVT-104","artist":"Neon Waves",...}` (200 OK)
  - `GET /dev/events/EVT-205` -> `{"id":"EVT-205",...}` (200 OK)
  - `GET /dev/hello` -> sigue funcionando correctamente.
- Limitaciones del ejercicio: Los datos del evento son estáticos/simulados; cualquier id devuelve los mismos datos fijos excepto el propio identificador.
