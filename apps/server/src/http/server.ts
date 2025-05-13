import { fastify } from 'fastify';
import { fastifyCors } from '@fastify/cors';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import fastifyCookie from '@fastify/cookie';
import { env } from '@/env';
import { setupErrorHandler } from './errors';

import authPlugin from './plugins/auth.js';
import dbPlugin from './plugins/db.js';
import rateLimitPlugin from './plugins/rate-limit.js';
import swaggerPlugin from './plugins/swagger.js';

import healthRoute from './routes/v1/health.js';
import authRoute from './routes/v1/auth/index.js';
import albumsController from './routes/v1/albums/index.js';
import checkoutController from './routes/v1/checkout/index.js';

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

app.register(dbPlugin);
app.register(authPlugin);
app.register(rateLimitPlugin);
app.register(swaggerPlugin);

app.register(healthRoute, { prefix: '/api/v1' });
app.register(authRoute, { prefix: '/api/v1' });
app.register(albumsController, { prefix: '/api/v1' });
app.register(checkoutController, { prefix: '/api/v1' });

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
