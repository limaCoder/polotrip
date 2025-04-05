import { FastifyInstance } from 'fastify';
import { fastifySwagger } from '@fastify/swagger';
import { fastifySwaggerUi } from '@fastify/swagger-ui';
import { jsonSchemaTransform } from 'fastify-type-provider-zod';
import fp from 'fastify-plugin';

export default fp(
  async function swagger(app: FastifyInstance) {
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
  },
  {
    name: 'swagger',
  },
);
