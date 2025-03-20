import { FastifyError, FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';
import { ApiError, BadRequestError, InternalServerError } from './api-error';

export function setupErrorHandler(app: FastifyInstance) {
  // Hook to capture untreated errors
  app.setErrorHandler((error: Error, request: FastifyRequest, reply: FastifyReply) => {
    // Custom errors from API
    if (error instanceof ApiError) {
      app.log.error(
        {
          error: {
            name: error.name,
            message: error.message,
            code: error.errorCode,
            status: error.statusCode,
            details: error.details,
            stack: error.stack,
          },
          request: {
            method: request.method,
            url: request.url,
            params: request.params,
            query: request.query,
            headers: {
              // Include only relevant headers to debug
              'user-agent': request.headers['user-agent'],
              'content-type': request.headers['content-type'],
              accept: request.headers['accept'],
            },
          },
        },
        'API Error',
      );

      return reply.status(error.statusCode).send(error.toResponse());
    }

    // Validation errors from Zod
    if (error instanceof ZodError) {
      const badRequestError = new BadRequestError(
        'Erro de validação',
        'VALIDATION_ERROR',
        error.format(),
      );

      app.log.error(
        {
          error: {
            name: 'ZodError',
            details: error.format(),
          },
          request: {
            method: request.method,
            url: request.url,
          },
        },
        'Validation Error',
      );

      return reply.status(400).send(badRequestError.toResponse());
    }

    // Fastify errors
    if ((error as FastifyError).statusCode) {
      const fastifyError = error as FastifyError;
      const statusCode = fastifyError.statusCode || 500;

      app.log.error(
        {
          error: {
            name: fastifyError.name,
            message: fastifyError.message,
            code: fastifyError.code,
            status: statusCode,
            stack: fastifyError.stack,
          },
          request: {
            method: request.method,
            url: request.url,
          },
        },
        'Fastify Error',
      );

      return reply.status(statusCode).send({
        error: {
          message: fastifyError.message,
          code: fastifyError.code || `ERROR_${statusCode}`,
          ...(process.env.NODE_ENV !== 'production' ? { stack: fastifyError.stack } : {}),
        },
      });
    }

    // Another untreated errors
    const internalError = new InternalServerError(
      'An internal error occurred',
      'INTERNAL_ERROR',
      process.env.NODE_ENV !== 'production' ? { originalError: error.message } : undefined,
    );

    app.log.error(
      {
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack,
        },
        request: {
          method: request.method,
          url: request.url,
        },
      },
      'Unhandled Error',
    );

    return reply.status(500).send(internalError.toResponse());
  });
}
