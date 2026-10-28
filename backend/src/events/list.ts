import type { APIGatewayProxyResult } from 'aws-lambda';
import { catalog, json } from './model.js';

export const handler = async (): Promise<APIGatewayProxyResult> => {
  return json(200, catalog);
};
