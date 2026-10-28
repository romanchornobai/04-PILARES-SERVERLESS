# Bloque 08

## Resultado
- Qué añadí al proyecto: Configuré `backend/serverless.yml` con `${env:STUDENT_CODE}`, `${env:AWS_REGION}` y `${env:LAMBDA_ROLE_ARN}` para desplegar en AWS Academy, compilé TypeScript a `dist/` y subí el stack con `serverless deploy`.
- Ruta o pantalla comprobada: Endpoint generado en API Gateway `https://sk4pe4grm0.execute-api.us-east-1.amazonaws.com/dev/events` y los logs en CloudWatch con `serverless logs`.
- Estado y respuesta observados:
  - Stack `festival-control-api-roman-dev` desplegado en `us-east-1`.
  - Petición `GET /events` devolvió 200 OK con los 2 eventos de prueba.
  - Logs en CloudWatch (`listEvents`) mostrando la ejecución real con ~3ms de duración.

## Comprensión
- Recorrido del dato, explicado con mis palabras: Primero compilo con `tsc` hacia `dist/`. Serverless Framework toma mis credenciales del perfil `academy`, empaqueta el código en un zip y genera la plantilla de CloudFormation. CloudFormation levanta la API en API Gateway y las Lambdas usando el rol existente del laboratorio (`LabRole`). Cuando hago una petición HTTPS, API Gateway la recibe, despierta la Lambda en AWS y registra la ejecución en CloudWatch Logs.
- Cambio guiado y resultado: Hice primero `serverless package` para revisar que la plantilla generada tenía el rol y la configuración correcta antes de hacer el deploy definitivo.
- Error encontrado y cómo lo resolví: Mis credenciales temporales de AWS habían caducado (`ExpiredToken`). Las renové en `~/.aws/credentials` con los datos de mi sesión activa de AWS Academy y usé el rol `LabRole` que ya viene creado en el laboratorio.

## Evidencias
- Captura o transcripción breve, sin credenciales:
  - Stack en CloudFormation: `festival-control-api-roman-dev` (`us-east-1`).
  - Base URL: `https://sk4pe4grm0.execute-api.us-east-1.amazonaws.com/dev`
  - Invocación `GET /dev/events` -> 200 OK con los datos del catálogo.
  - Log en CloudWatch: `REPORT RequestId: 5acb58ee-... Duration: 2.95 ms Billed Duration: 144 ms`.
- Limitaciones del ejercicio: Los datos siguen estando en un array en memoria dentro de las Lambdas, no hay DynamoDB todavía. La diferencia es que ahora el código corre en la nube de AWS.
