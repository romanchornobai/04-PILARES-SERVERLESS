# Festival Control · Bloque 01
 
## Qué he construido
Una función Lambda en TypeScript ejecutada en local con Serverless Framework y `serverless-offline`. Responde a peticiones HTTP GET en:
`http://localhost:3000/dev/hello`
 
## Qué he comprendido
- **Tipos del handler**: `APIGatewayProxyEvent` tipa lo que nos envía API Gateway (headers, path, query...) y `APIGatewayProxyResult` nos obliga a devolver un objeto con `statusCode` y `body` serializado en string.
- **Compilación**: TypeScript (`src/hello.ts`) se compila a JavaScript (`dist/hello.js`) con `tsc`. Serverless Offline apunta directamente a ese archivo generado (`dist/hello.handler`).
- **Dónde aparece `EVENT RECIBIDO`**: En la terminal donde está corriendo `serverless-offline`. Es la salida estándar (`stdout`) que en AWS equivaldría a CloudWatch.
 
## Qué he modificado
Cambié el cuerpo de la respuesta en `src/hello.ts`:
- De: `{"message": "Festival Control API online"}`
- A:
  ```json
  {
    "message": "Festival Control · equipo preparado",
    "service": "hello"
  }
  ```
- **Por qué no cambió la URL**: Porque la ruta la define el archivo `serverless.yml` (`path: hello` bajo el stage `dev`), no el contenido que devuelve el código.
 
## Cómo lo he comprobado
1. **Compilación y tipos**:
   ```bash
   npm run typecheck # OK, sin errores
   ```
2. **Petición por consola (`curl`)**:
   ```bash
   curl http://localhost:3000/dev/hello
   # Devuelve: {"message":"Festival Control API online"}
   ```
3. **Evidencia en los logs**:
   En la terminal de `npm start` saltó el log del evento justo al lanzar la petición:
   ```text
   EVENT RECIBIDO: {
     rawPath: '/dev/hello',
     requestContext: { http: { method: 'GET', path: '/dev/hello' } }
   }
   ```
