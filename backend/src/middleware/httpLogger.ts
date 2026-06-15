import { randomUUID } from 'node:crypto';
import pinoHttp from 'pino-http';
import { logger } from '../logger';

// Attaches a per-request `requestId` and logs request-in / response-out at the
// HTTP boundary. Grep a single requestId to follow one flow end to end.
export const httpLogger = pinoHttp({
  logger,
  genReqId: (req, res) => {
    const id = randomUUID();
    res.setHeader('x-request-id', id);
    return id;
  },
  customLogLevel: (_req, res, err) => {
    if (err || res.statusCode >= 500) return 'error';
    if (res.statusCode >= 400) return 'warn';
    return 'info';
  },
  customSuccessMessage: (req, res) => `${req.method} ${req.url} ${res.statusCode}`,
});
