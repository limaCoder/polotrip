import { toNodeHandler } from 'better-auth/node';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';

const authRoute: FastifyPluginAsyncZod = async app => {
  if (!app.auth || !app.auth.handler) {
    throw new Error(
      'Auth handler is not available. Make sure the auth plugin is registered correctly. fastify.auth: ' +
        JSON.stringify(app.auth),
    );
  }

  app.addContentTypeParser('application/json', (_request, _payload, done) => {
    done(null, null);
  });

  const authHandler = toNodeHandler(app.auth.handler);

  app.route({
    method: ['POST', 'GET'],
    url: '/api/auth/*',
    handler: async (req, reply) => {
      console.log('authHandler ', reply.raw);
      return await authHandler(req.raw, reply.raw);
    },
  });
};

export { authRoute };
