const { describe, test, expect } = require('@jest/globals');
const { validateConfig } = require('../../apps/api/dist/config.js');

describe('runtime configuration', () => {
  test('uses local development defaults only when keys are absent', () => {
    expect(validateConfig({})).toEqual({
      nodeEnv: 'development', host: '127.0.0.1', port: 3000,
    });
  });

  test('accepts explicit configuration and valid port boundaries', () => {
    expect(validateConfig({ NODE_ENV: 'production', HOST: '::1', PORT: '65535' }))
      .toEqual({ nodeEnv: 'production', host: '::1', port: 65535 });
    expect(validateConfig({ PORT: '1' }).port).toBe(1);
  });

  test.each(['', '0', '-1', '65536', '3.5', '3000oops', '1e3', ' 3000 ', 'NaN'])(
    'rejects malformed PORT %j', (port) => {
      expect(() => validateConfig({ PORT: port })).toThrow('PORT');
    },
  );

  test('rejects invalid environments and listen addresses without leaking values', () => {
    for (const [key, value] of [['NODE_ENV', 'secret-value'], ['HOST', 'secret-value']]) {
      try {
        validateConfig({ [key]: value });
        throw new Error('validation unexpectedly succeeded');
      } catch (error) {
        expect(error.message).toContain(key);
        expect(error.message).not.toContain(value);
      }
    }
  });
});
