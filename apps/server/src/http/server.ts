import { fastify } from 'fastify';
import { fastifyCors } from '@fastify/cors';
import { fastifySwagger } from '@fastify/swagger';
import { fastifySwaggerUi } from '@fastify/swagger-ui';
import fastifyJwt from '@fastify/jwt';
import fastifyCookie from '@fastify/cookie';

import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';

import { env } from '@/env';

import { setupErrorHandler } from './errors';
import { setupRateLimit } from './plugins/rate-limit';

import { getAlbumsRoute } from './routes/get-albums';
import { createAlbumRoute } from './routes/create-album';
import { createCheckoutRoute } from './routes/create-checkout';
import { uploadPhotosRoute } from './routes/upload-photos';
import { updateAlbumRoute } from './routes/update-album';
import { getAlbumByIdRoute } from './routes/get-album-by-id';
import { syncUserRoute } from './routes/auth/sync-user';
import { getToken } from './routes/auth/get-token';

const app = fastify({
  logger: true,
});

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

setupErrorHandler(app);

app.register(fastifyCors, {
  origin: true,
  credentials: true,
});

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
});

app.register(fastifyCookie);

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

app.register(syncUserRoute);
app.register(getToken);

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
