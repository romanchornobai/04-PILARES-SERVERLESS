import type { APIGatewayProxyResult } from 'aws-lambda';
import { initialZones, json } from './model.js';

export const handler = async (): Promise<APIGatewayProxyResult> => {
  return json(200, initialZones);
};
