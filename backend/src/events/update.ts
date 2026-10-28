import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { catalog, readBody, json } from './model.js';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const id = event.pathParameters?.id;
  if (!id) return json(400, { message: 'Falta id' });
  const current = catalog.find((e) => e.id === id);
  if (!current) return json(404, { message: 'Evento no encontrado' });

  const input = readBody(event.body);
  if (!input || Object.keys(input).length !== 1 || !('status' in input)) {
    return json(400, { message: 'PATCH sólo admite el campo status' });
  }
  const status = input.status;
  if (status !== 'CONFIRMED' && status !== 'CANCELLED') {
    return json(400, { message: 'status debe ser CONFIRMED o CANCELLED' });
  }

  return json(200, {
    ...current,
    status,
    operation: 'UPDATED'
  });
};
