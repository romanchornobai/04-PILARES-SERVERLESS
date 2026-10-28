# Venue Control · Festival Operations (Serverless & React Native)

Aplicación móvil y backend Serverless para la gestión y monitorización operativa de las zonas y espacios de un gran festival de música.

---

## 1. Arquitectura del Sistema

```
[ App Móvil / Web (React Native - Expo) ]
                │
         (HTTPS / REST)
                ▼
   [ AWS API Gateway (v1 HTTP REST) ]
    /zones       /zones/{id}
      │               │
      ├── GET ────────┼───► Lambda: listZones
      ├── POST ───────┼───► Lambda: createZone
      │               ├───► Lambda: getZone (GET)
      │               ├───► Lambda: replaceZone (PUT)
      │               ├───► Lambda: updateZone (PATCH)
      │               └───► Lambda: deleteZone (DELETE)
                │
                ▼
    [ Amazon CloudWatch Logs ]
```

- **Cliente (`mobile/`)**: Desarrollado con Expo SDK 54, React Native 0.81 y TypeScript. Cuenta con 4 vistas operativas (`LISTADO`, `DETALLE`, `NUEVO`, `EDITAR`), gestión de estados (`loading`, `busy`, `error`), consumo HTTP con `fetch` y soporte CORS.
- **Backend (`backend/`)**: Microservicios serverless en Node.js 22.x y TypeScript compilado (`tsc`), desplegados con Serverless Framework v4 sobre AWS Lambda y API Gateway (con compatibilidad con `serverless-offline`).
- **Seguridad**: Autenticado mediante el perfil `academy` de AWS con credenciales temporales y ejecución bajo `LabRole`. Cero credenciales expuestas en el repositorio.

---

## 2. Contrato de la API (`/zones`)

| Método | Endpoint | Descripción | Body (JSON) | Código Estado |
|---|---|---|---|---|
| **GET** | `/zones` | Lista todos los espacios del festival | *Ninguno* | `200 OK` |
| **GET** | `/zones/{id}` | Obtiene el detalle de un espacio | *Ninguno* | `200 OK` / `404 Not Found` |
| **POST** | `/zones` | Registra una nueva zona | `{ "name": string, "capacity": number, "status": "OPEN"\|"FULL"\|"CLOSED" }` | `201 Created` / `400 Bad Request` |
| **PUT** | `/zones/{id}` | Sustituye un espacio completo | Objeto completo con `name`, `capacity`, `status` | `200 OK` / `400 Bad Request` |
| **PATCH** | `/zones/{id}` | Modifica únicamente el estado | `{ "status": "OPEN"\|"FULL"\|"CLOSED" }` | `200 OK` / `400 Bad Request` |
| **DELETE** | `/zones/{id}` | Elimina el espacio indicado | *Ninguno* | `200 OK` / `404 Not Found` |

---

## 3. Despliegue en AWS Cloud y Endpoint Activo

- **Stack CloudFormation**: `venue-control-api-roman-dev`
- **Región AWS**: `us-east-1`
- **URL Base API Gateway**:
  ```
  https://fs7aot5xe0.execute-api.us-east-1.amazonaws.com/dev
  ```

---

## 4. Evidencias de Verificación y Pruebas

### 4.1 Comprobación con curl / HTTP

```bash
# 1. GET Listado de zonas
curl -i https://fs7aot5xe0.execute-api.us-east-1.amazonaws.com/dev/zones
# -> HTTP/1.1 200 OK
# -> [{"id":"ZONE-01","name":"Main Stage","capacity":5000,"status":"OPEN"}, ...]

# 2. GET Detalle de una zona existente
curl -i https://fs7aot5xe0.execute-api.us-east-1.amazonaws.com/dev/zones/ZONE-01
# -> HTTP/1.1 200 OK
# -> {"id":"ZONE-01","name":"Main Stage","capacity":5000,"status":"OPEN"}

# 3. POST Creación de nueva zona
curl -i -X POST https://fs7aot5xe0.execute-api.us-east-1.amazonaws.com/dev/zones \
  -H "Content-Type: application/json" \
  -d '{"name":"Sunset Lounge","capacity":1200,"status":"OPEN"}'
# -> HTTP/1.1 201 Created
# -> {"id":"ZONE-86","name":"Sunset Lounge","capacity":1200,"status":"OPEN"}

# 4. PATCH Actualización parcial de estado
curl -i -X PATCH https://fs7aot5xe0.execute-api.us-east-1.amazonaws.com/dev/zones/ZONE-01 \
  -H "Content-Type: application/json" \
  -d '{"status":"FULL"}'
# -> HTTP/1.1 200 OK
# -> {"id":"ZONE-01","name":"Main Stage","capacity":5000,"status":"FULL","operation":"UPDATED"}

# 5. DELETE Eliminación de zona
curl -i -X DELETE https://fs7aot5xe0.execute-api.us-east-1.amazonaws.com/dev/zones/ZONE-02
# -> HTTP/1.1 200 OK
# -> {"id":"ZONE-02","operation":"DELETED"}
```

### 4.2 Trazas en CloudWatch Logs
Invocación real en AWS Cloud registrada para la función `listZones`:
```text
INIT_START Runtime - Version: nodejs:22.mainline.v157 Runtime Version ARN: arn:aws:lambda:us-east-1::runtime:cbcc11b383076fe697bc3db3b70762ca2e957a0fa52f97eb7f3a4a0ae9895c20
START - 77ca5c16-7cd4-4b56-bdf2-282fc0c152e1 - Version: $LATEST
END - 77ca5c16-7cd4-4b56-bdf2-282fc0c152e1
REPORT - 77ca5c16-7cd4-4b56-bdf2-282fc0c152e1
Duration: 3.40 ms  Billed Duration: 136 ms  Memory Size: 1024 MB  Max Memory Used: 70 MB  Init Duration: 131.70 ms
```

---

## 5. Instrucciones de Ejecución

### Ejecución Local:
1. **Backend**:
   ```bash
   cd backend
   npm run typecheck
   npm run build
   npx serverless offline
   ```
2. **Cliente Mobile**:
   Cambiar en `mobile/src/api.ts` `API_URL = 'http://localhost:3000/dev'`:
   ```bash
   cd mobile
   npm run typecheck
   npm run web
   ```

### Ejecución en AWS:
1. En `mobile/src/api.ts` verificar que `API_URL = 'https://fs7aot5xe0.execute-api.us-east-1.amazonaws.com/dev'`.
2. Lanzar la aplicación con `npm run web` (o empaquetar con `npm run build:web`).
3. Todas las operaciones consumirán directamente la infraestructura cloud en AWS.
