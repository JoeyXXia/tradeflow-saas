import { isIP } from 'node:net';

export interface AppConfig {
  readonly nodeEnv: 'development' | 'test' | 'production';
  readonly host: string;
  readonly port: number;
}

export const APP_CONFIG = Symbol('APP_CONFIG');

// Validate runtime input before opening a listening socket. Never echo values.
export function validateConfig(env: NodeJS.ProcessEnv): AppConfig {
  const nodeEnv = env.NODE_ENV ?? 'development';
  if (!['development', 'test', 'production'].includes(nodeEnv)) {
    throw new Error('NODE_ENV must be development, test, or production');
  }

  const host = env.HOST ?? '127.0.0.1';
  if (isIP(host) === 0) {
    throw new Error('HOST must be a valid IPv4 or IPv6 address');
  }

  const rawPort = env.PORT ?? '3000';
  const port = Number(rawPort);
  if (!/^\d+$/.test(rawPort) || !Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('PORT must be an integer between 1 and 65535');
  }

  return Object.freeze({ nodeEnv: nodeEnv as AppConfig['nodeEnv'], host, port });
}
