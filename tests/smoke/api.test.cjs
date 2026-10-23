const { afterEach, test, expect } = require('@jest/globals');
const { spawn } = require('node:child_process');
const { once } = require('node:events');
const { createServer } = require('node:net');
const { setTimeout: delay } = require('node:timers/promises');
const { mkdtemp, writeFile, rm } = require('node:fs/promises');
const { tmpdir } = require('node:os');
const { join, resolve } = require('node:path');

const root = resolve(__dirname, '../..');
let child;
let exited;
let temporaryDirectory;
let output;

afterEach(async () => {
  if (child && child.exitCode === null && child.signalCode === null) child.kill();
  if (exited) await exited;
  if (temporaryDirectory) await rm(temporaryDirectory, { recursive: true, force: true });
  child = undefined;
  exited = undefined;
  temporaryDirectory = undefined;
});

function launch(args, env) {
  output = '';
  child = spawn(process.execPath, [...args, 'apps/api/dist/main.js'], {
    cwd: root, env, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'],
  });
  exited = once(child, 'exit');
  child.stdout.on('data', (data) => { output += data.toString(); });
  child.stderr.on('data', (data) => { output += data.toString(); });
}

test('compiled API loads an env file and serves GET /health over HTTP', async () => {
  const probe = createServer();
  probe.listen(0, '127.0.0.1');
  await once(probe, 'listening');
  const port = probe.address().port;
  await new Promise((resolveClose) => probe.close(resolveClose));

  temporaryDirectory = await mkdtemp(join(tmpdir(), 'tradeflow-day1-'));
  const envFile = join(temporaryDirectory, '.env');
  await writeFile(envFile, `NODE_ENV=test\nHOST=127.0.0.1\nPORT=${port}\n`);
  const env = { ...process.env };
  delete env.NODE_ENV;
  delete env.HOST;
  delete env.PORT;
  launch([`--env-file=${envFile}`], env);

  let response;
  for (let attempt = 0; attempt < 100; attempt += 1) {
    if (child.exitCode !== null) throw new Error(`API exited: ${output}`);
    try {
      response = await fetch(`http://127.0.0.1:${port}/health`, {
        signal: AbortSignal.timeout(500),
      });
      break;
    } catch { await delay(50); }
  }
  if (!response) throw new Error(`API did not become healthy: ${output}`);
  expect(response.status).toBe(200);
  expect(response.headers.get('content-type')).toContain('application/json');
  expect(await response.json()).toEqual({ status: 'ok', service: 'tradeflow-api' });
  const unknown = await fetch(`http://127.0.0.1:${port}/not-a-route`);
  expect(unknown.status).toBe(404);
});

test('invalid configuration causes a failed startup instead of a listening API', async () => {
  launch([], { ...process.env, NODE_ENV: 'test', HOST: '127.0.0.1', PORT: 'private-invalid-value' });
  const [code] = await exited;
  expect(code).toBe(1);
  expect(output).toContain('PORT must be an integer between 1 and 65535');
  expect(output).not.toContain('private-invalid-value');
  expect(output).not.toContain('Nest application successfully started');
});
