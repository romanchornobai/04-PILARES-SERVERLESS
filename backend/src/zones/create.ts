import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { readBody, isZoneInput, json } from './model.js';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const input = readBody(event.body);
  if (!isZoneInput(input)) {
    return json(400, {
      message: 'Cuerpo inválido: name (string no vacío), capacity (número > 0) y status (OPEN, FULL, CLOSED) son obligatorios'
    });
  }

  const newZone = {
    id: `ZONE-${Math.floor(10 + Math.random() * 90)}`,
    name: input.name.trim(),
    capacity: input.capacity,
    status: input.status
  };

  return json(201, newZone);
};
