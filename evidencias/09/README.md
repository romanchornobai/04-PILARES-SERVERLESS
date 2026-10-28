# Bloque 09

## Resultado
- Qué añadí al proyecto: Se configuró `mobile/src/api.ts` apuntando a la URL base HTTPS real desplegada en AWS API Gateway (`https://sk4pe4grm0.execute-api.us-east-1.amazonaws.com/dev`).
- Ruta o pantalla comprobada: Interfaz de Festival Control conectada a AWS en la nube con Serverless Offline detenido localmente.
- Estado y respuesta observados:
  - GET /events: 200 OK con los 2 eventos devueltos directamente por la Lambda de AWS.
  - POST /events: 201 Created (`EVT-NEW`).
  - PUT /events/EVT-101: 200 OK (`operation: REPLACED`).
  - PATCH /events/EVT-101: 200 OK (`operation: UPDATED`).
  - DELETE /events/EVT-101: 200 OK (`operation: DELETED`).
  - Trazabilidad confirmada en CloudWatch Logs para las ejecuciones en la nube.

## Comprensión
- Recorrido del dato, explicado con mis palabras: Al cambiar únicamente la constante `API_URL` por la URL de API Gateway, todas las llamadas `fetch` de la app viajan por Internet mediante HTTPS hacia AWS. API Gateway recibe la petición y desencadena la Lambda correspondiente, la cual responde con los encabezados CORS configurados y el body JSON. Todo el frontend funciona igual que en local pero contra la nube y sin requerir credenciales AWS en el cliente.
- Cambio guiado y resultado: Se comprobó que para alternar entre desarrollo local y nube sólo es necesario cambiar la constante `API_URL` en `api.ts` (`http://localhost:3000/dev` vs `https://<id>.execute-api.us-east-1.amazonaws.com/dev`) y arrancar o detener Serverless Offline según convenga.
- Error encontrado y cómo lo resolví: Ninguno; la API ya contaba con `cors: true` y cabeceras de origen permitidas, por lo que el navegador no bloqueó ninguna petición de origen cruzado.

## Evidencias
- Captura o transcripción breve, sin credenciales:
  - Offline local detenido.
  - Endpoint configurado: `https://sk4pe4grm0.execute-api.us-east-1.amazonaws.com/dev`
  - Invocaciones cloud comprobadas: GET (200), POST (201), PUT (200), PATCH (200), DELETE (200).
  - Logs en CloudWatch verificados para `listEvents` y `updateEvent`.
- Limitaciones del ejercicio: Los datos siguen siendo una simulación en memoria dentro de las Lambdas en AWS; no hay base de datos DynamoDB/RDS todavía.
