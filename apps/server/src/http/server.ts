import { fastifyCors } from '@fastify/cors';
import { fastifySwagger } from '@fastify/swagger';
import { fastifySwaggerUi } from '@fastify/swagger-ui';
import { fastify } from 'fastify';
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';
import { env } from '@/env';

import { getAlbumsRoute } from './routes/get-albums';
import { createAlbumRoute } from './routes/create-album';
import { createCheckoutRoute } from './routes/create-checkout';
import { uploadPhotosRoute } from './routes/upload-photos';
import { updateAlbumRoute } from './routes/update-album';

const app = fastify();

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.register(fastifyCors);

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

app.register(getAlbumsRoute);
app.register(createAlbumRoute);
app.register(createCheckoutRoute);
app.register(uploadPhotosRoute);
app.register(updateAlbumRoute);

app.listen({ port: env.PORT }).then(() => {
  console.log('HTTP server running!');
});
