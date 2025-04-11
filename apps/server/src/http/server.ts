import { fastify } from 'fastify';
import { fastifyCors } from '@fastify/cors';
import autoload from '@fastify/autoload';
import { join } from 'path';

import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import fastifyCookie from '@fastify/cookie';

import { env } from '@/env';

import { setupErrorHandler } from './errors';

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

app.register(autoload, {
  dir: join(__dirname, 'plugins'),
  options: {},
  dirNameRoutePrefix: false,
});

app.register(autoload, {
  dir: join(__dirname, 'routes', 'v1'),
  options: {
    prefix: '/api/v1',
  },
  dirNameRoutePrefix: false,
});

app.get('/', (_, reply) => {
  reply.status(200).send('OK');
});

app.listen({ port: env.PORT }).then(() => {
  console.log(`HTTP server running at http://localhost:${env.PORT}`);
});
