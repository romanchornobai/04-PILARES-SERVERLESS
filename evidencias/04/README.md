# Bloque 04

## Resultado
- Qué añadí al proyecto: Módulo compartido `backend/src/events/model.ts` y los handlers `list.ts`, `get.ts`, `create.ts`, `replace.ts`, `update.ts` y `delete.ts` con soporte CORS en `serverless.yml`.
- Ruta o pantalla comprobada: `/events` (GET, POST, OPTIONS) y `/events/{id}` (GET, PUT, PATCH, DELETE).
- Estado y respuesta observados: GET lista (200 con 2 eventos), GET id existente (200), GET id inexistente (404), POST (201), PUT completo (200 REPLACED), PUT incompleto (400), PATCH status (200 UPDATED), DELETE (200 DELETED).

## Comprensión
- Recorrido del dato, explicado con mis palabras: Cada método HTTP llama a su función correspondiente dentro de `src/events/`. Usan `model.ts` para compartir catálogo fijo, tipos y el helper `json` con headers CORS. PUT exige el objeto completo y falla con 400 si falta algún campo; PATCH solo acepta modificar `status`.
- Cambio guiado y resultado:
  - PUT a EVT-101 sólo con `{"status":"CANCELLED"}` devolvió 400 (exige todos los campos).
  - PATCH con ese mismo body devolvió 200 con `operation: UPDATED`.
  - GET posterior a EVT-101 devolvió `status: CONFIRMED` porque el catálogo es una constante en memoria sin persistencia.
- Error encontrado y cómo lo resolví: Ninguno, la estructura modular y las importaciones relativas `.js` compilaron perfectamente con `NodeNext`.

## Evidencias
- Captura o transcripción breve, sin credenciales:
  - `GET /dev/events` -> 200 `[{"id":"EVT-101",...},{"id":"EVT-102",...}]`
  - `GET /dev/events/EVT-999` -> 404 `{"message":"Evento no encontrado"}`
  - `PUT /dev/events/EVT-101` (solo status) -> 400 `{"message":"Cuerpo incompleto o inválido: ..."}`
  - `PATCH /dev/events/EVT-101` (`{"status":"CANCELLED"}`) -> 200 `{"id":"EVT-101",...,"status":"CANCELLED","operation":"UPDATED"}`
  - `DELETE /dev/events/EVT-102` -> 200 `{"id":"EVT-102","operation":"DELETED"}`
  - `GET /dev/events` posterior -> Sigue conteniendo los 2 eventos intactos.
- Limitaciones del ejercicio: La API simula los contratos CRUD pero no tiene base de datos; las modificaciones o borrados no persisten entre peticiones.
