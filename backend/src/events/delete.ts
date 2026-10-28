import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { catalog, json } from './model.js';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const id = event.pathParameters?.id;
  if (!id) return json(400, { message: 'Falta id' });
  const exists = catalog.some((e) => e.id === id);
  if (!exists) return json(404, { message: 'Evento no encontrado' });

  return json(200, {
    id,
    operation: 'DELETED'
  });
};
