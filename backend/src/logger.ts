import pino from 'pino';
import { config } from './config';

// Structured JSON logger. Redacts PII paths per the data policy — never log
// CPF, email, or phone, even if they appear in nested context.
export const logger = pino({
  level: config.nodeEnv === 'production' ? 'info' : 'debug',
  redact: {
    paths: ['*.cpf', '*.email', '*.phone', 'cpf', 'email', 'phone', 'password'],
    censor: '[redacted]',
  },
});
