import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { catalog, readBody, isEventInput, json } from './model.js';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const id = event.pathParameters?.id;
  if (!id) return json(400, { message: 'Falta id' });
  const exists = catalog.some((e) => e.id === id);
  if (!exists) return json(404, { message: 'Evento no encontrado' });

  const input = readBody(event.body);
  if (!isEventInput(input)) {
    return json(400, { message: 'Cuerpo incompleto o inválido: artist, space, time (HH:mm) y status son obligatorios' });
  }

  return json(200, {
    id,
    artist: input.artist.trim(),
    space: input.space.trim(),
    time: input.time,
    status: input.status,
    operation: 'REPLACED'
  });
};
