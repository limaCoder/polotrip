import { fastify } from 'fastify';
import { fastifyCors } from '@fastify/cors';
import autoload from '@fastify/autoload';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import fastifyCookie from '@fastify/cookie';

import { env } from '@/env';

import { setupErrorHandler } from './errors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = fastify({
  logger: false,
});

setupErrorHandler(app);

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.register(fastifyCors, {
  origin: env.WEB_URL,
  credentials: true,
  allowedHeaders: ['Authorization', 'cookie', 'content-type', 'stripe-signature'],
});

app.register(fastifyCookie, {
  prefix: 'polotrip',
});

const baseDir = process.env.NODE_ENV === 'production' ? 'dist/http' : 'src/http';

app.register(autoload, {
  dir: join(process.cwd(), baseDir, 'plugins'),
  options: {},
  dirNameRoutePrefix: false,
  forceESM: true,
});

app.register(autoload, {
  dir: join(process.cwd(), baseDir, 'routes', 'v1'),
  options: {
    prefix: '/api/v1',
  },
  dirNameRoutePrefix: false,
  forceESM: true,
});

app.get('/', (_, reply) => {
  reply.status(200).send('OK');
});

app
  .listen({
    port: env.PORT,
    host: '0.0.0.0',
  })
  .then(() => {
    console.log(`HTTP server running on port ${env.PORT}`);
  })
  .catch(err => {
    console.error('Error starting server:', err);
    process.exit(1);
  });
