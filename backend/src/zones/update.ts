import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { initialZones, readBody, json } from './model.js';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const id = event.pathParameters?.id;
  if (!id) return json(400, { message: 'Falta id de zona' });

  const current = initialZones.find((z) => z.id.toUpperCase() === id.toUpperCase());
  if (!current) return json(404, { message: `Zona ${id} no encontrada` });

  const input = readBody(event.body);
  if (!input || Object.keys(input).length !== 1 || !('status' in input)) {
    return json(400, { message: 'PATCH sólo admite el campo status' });
  }

  const status = input.status;
  if (status !== 'OPEN' && status !== 'FULL' && status !== 'CLOSED') {
    return json(400, { message: 'status debe ser OPEN, FULL o CLOSED' });
  }

  return json(200, {
    ...current,
    status,
    operation: 'UPDATED'
  });
};
