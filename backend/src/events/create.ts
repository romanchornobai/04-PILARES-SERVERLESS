import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { readBody, isEventInput, json } from './model.js';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const input = readBody(event.body);
  if (!isEventInput(input)) {
    return json(400, { message: 'Cuerpo incompleto o inválido: artist, space, time (HH:mm) y status son obligatorios' });
  }
  return json(201, {
    id: 'EVT-NEW',
    artist: input.artist.trim(),
    space: input.space.trim(),
    time: input.time,
    status: input.status
  });
};
