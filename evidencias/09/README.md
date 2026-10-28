# Bloque 09

## Resultado
- Qué añadí al proyecto: Cambié la constante `API_URL` en `mobile/src/api.ts` para que apunte a la URL real HTTPS de mi API Gateway en AWS (`https://sk4pe4grm0.execute-api.us-east-1.amazonaws.com/dev`).
- Ruta o pantalla comprobada: La app de Festival Control en el navegador consumiendo directamente la API en la nube con Serverless Offline apagado.
- Estado y respuesta observados:
  - GET /events: 200 OK con los 2 eventos que me devuelve la Lambda en AWS.
  - POST /events: 201 Created con `EVT-NEW`.
  - PUT /events/EVT-101: 200 OK (`operation: REPLACED`).
  - PATCH /events/EVT-101: 200 OK (`operation: UPDATED`).
  - DELETE /events/EVT-101: 200 OK (`operation: DELETED`).
  - Comprobé que cada petición genera su correspondiente log en CloudWatch.

## Comprensión
- Recorrido del dato, explicado con mis palabras: Al cambiar `API_URL` en el cliente, las llamadas `fetch` ya no van a `localhost:3000` sino que salen a Internet por HTTPS hacia API Gateway. API Gateway enruta cada llamada a su función Lambda correspondiente en AWS, la cual responde con los datos JSON y los headers de CORS que configuré en `serverless.yml`. La interfaz funciona exactamente igual que en local pero contra la nube y sin necesitar credenciales de AWS en el navegador.
- Cambio guiado y resultado: Comprobé que para cambiar entre entorno local y cloud solo tengo que tocar la variable `API_URL` en `api.ts` (`http://localhost:3000/dev` para local con Serverless Offline, o la URL de API Gateway para AWS).
- Error encontrado y cómo lo resolví: Ninguno; como ya tenía activado `cors: true` en el backend, el navegador no me bloqueó las peticiones por origen cruzado.

## Evidencias
- Captura o transcripción breve, sin credenciales:
  - Servidor offline apagado en mi terminal.
  - URL en la app: `https://sk4pe4grm0.execute-api.us-east-1.amazonaws.com/dev`
  - Invocaciones cloud comprobadas: GET (200), POST (201), PUT (200), PATCH (200), DELETE (200).
  - Logs en CloudWatch confirmados para `listEvents` y `updateEvent`.
- Limitaciones del ejercicio: La API en AWS sigue usando datos en memoria dentro del handler; todavía no tenemos una base de datos conectada.
