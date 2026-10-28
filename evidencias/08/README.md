# Bloque 08

## Resultado
- Qué añadí al proyecto: Configuración de infraestructura en `backend/serverless.yml` parametrizada con `${env:STUDENT_CODE}`, `${env:AWS_REGION}` y `${env:LAMBDA_ROLE_ARN}`, empaquetado del código TypeScript compilado (`dist/`) y despliegue del stack completo en AWS Academy.
- Ruta o pantalla comprobada: Endpoint en CloudFormation/API Gateway `https://sk4pe4grm0.execute-api.us-east-1.amazonaws.com/dev/events` y logs en CloudWatch con `serverless logs`.
- Estado y respuesta observados:
  - Despliegue con éxito del stack `festival-control-api-roman-dev` en región `us-east-1`.
  - Petición `GET /events` devolvió 200 OK con los 2 eventos del catálogo.
  - Comprobación de logs de Lambda (`listEvents`) mostrando invocación real con tiempo de ejecución (~3ms) en CloudWatch.

## Comprensión
- Recorrido del dato, explicado con mis palabras: Primero compilamos los handlers TypeScript a JavaScript en `dist/`. Serverless Framework lee las credenciales del perfil `academy` y empaqueta el código en un zip junto a la plantilla de CloudFormation. CloudFormation crea la API en API Gateway y las Lambdas asignándoles el rol existente del laboratorio (`LabRole`). Al recibir una petición HTTPS, API Gateway enruta el tráfico a la función Lambda correspondiente, ejecutándola en AWS e imprimiendo la traza en CloudWatch Logs.
- Cambio guiado y resultado: Se comprobó el empaquetado inicial mediante `serverless package` verificando que la plantilla incluía el rol de ejecución autorizado antes de lanzar el `serverless deploy`.
- Error encontrado y cómo lo resolví: Las credenciales temporales anteriores habían caducado (`ExpiredToken`); se actualizaron en `~/.aws/credentials` bajo el perfil `academy` con el token de la sesión activa y se utilizó el rol `LabRole` existente para evitar errores de permisos IAM.

## Evidencias
- Captura o transcripción breve, sin credenciales:
  - Stack CloudFormation: `festival-control-api-roman-dev` (región `us-east-1`).
  - Base URL del API Gateway: `https://sk4pe4grm0.execute-api.us-east-1.amazonaws.com/dev`
  - Invocación `GET /dev/events` -> 200 OK `[{"id":"EVT-101",...},{"id":"EVT-102",...}]`
  - CloudWatch Logs: `REPORT RequestId: 5acb58ee-... Duration: 2.95 ms Billed Duration: 144 ms Memory Size: 1024 MB`
- Limitaciones del ejercicio: Los datos siguen siendo en memoria/simulados dentro de los handlers; el cambio radica en que la infraestructura de ejecución ahora es serverless real en AWS.
