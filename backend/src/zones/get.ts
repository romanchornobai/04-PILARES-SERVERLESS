import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { initialZones, json } from './model.js';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const id = event.pathParameters?.id;
  if (!id) return json(400, { message: 'Falta id de zona' });
  const zone = initialZones.find((z) => z.id.toUpperCase() === id.toUpperCase());
  if (!zone) return json(404, { message: `Zona ${id} no encontrada` });
  return json(200, zone);
};
