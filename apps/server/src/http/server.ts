import { fastify } from 'fastify';
import { fastifyCors } from '@fastify/cors';
import { fastifySwagger } from '@fastify/swagger';
import { fastifySwaggerUi } from '@fastify/swagger-ui';

import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';
import fastifyCookie from '@fastify/cookie';

import { env } from '@/env';

import { setupErrorHandler } from './errors';
import { setupRateLimit } from './plugins/rate-limit';

import {
  getAlbumsRoute,
  createAlbumRoute,
  uploadPhotosRoute,
  updateAlbumRoute,
  getAlbumByIdRoute,
} from './routes/albums';

import { createCheckoutRoute } from './routes/checkout/create-checkout';
import { authRoute } from './routes/auth';

import dbPlugin from './plugins/db';
import authPlugin from './plugins/auth';

const app = fastify({
  logger: true,
});

setupErrorHandler(app);

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.register(fastifyCors, {
  origin: env.WEB_URL,
  credentials: true,
  allowedHeaders: ['Authorization', 'cookie', 'content-type'],
});

app.register(fastifyCookie, {
  prefix: 'polotrip',
});

app.register(dbPlugin);
app.register(authPlugin);

app.register(setupRateLimit);

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Polotrip',
      version: '0.1',
    },
  },
  transform: jsonSchemaTransform,
});

app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
});

app.register(authRoute);

app.register(getAlbumsRoute);
app.register(createAlbumRoute);
app.register(createCheckoutRoute);
app.register(uploadPhotosRoute);
app.register(updateAlbumRoute);
app.register(getAlbumByIdRoute);

app.get('/', (_, reply) => {
  reply.status(200).send('OK');
});

app.listen({ port: env.PORT }).then(() => {
  console.log(`HTTP server running at http://localhost:${env.PORT}`);
});
