import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

const authRoute: FastifyPluginAsyncZod = async (app) => {
  if (!app.auth?.handler) {
    throw new Error(
      "Auth handler is not available. Make sure the auth plugin is registered correctly. fastify.auth: " +
        JSON.stringify(app.auth)
    );
  }

  app.route({
    method: ["POST", "GET", "OPTIONS", "PUT", "PATCH", "DELETE"],
    url: "/auth/*",
    handler: async (request, reply) => {
      try {
        // Construct url explicitly with correct proto for proxy environments
        const protocol = request.headers["x-forwarded-proto"] || "http";
        const host =
          request.headers["x-forwarded-host"] || request.headers.host;
        const url = new URL(request.url, `${protocol}://${host}`);

        const headers = new Headers();
        for (const [key, value] of Object.entries(request.headers)) {
          if (value) {
            if (Array.isArray(value)) {
              for (const v of value) headers.append(key, v);
            } else {
              headers.append(key, value as string);
            }
          }
        }

        let bodyInit: string | undefined;
        if (
          request.method !== "GET" &&
          request.method !== "HEAD" &&
          request.body
        ) {
          bodyInit =
            typeof request.body === "string"
              ? request.body
              : JSON.stringify(request.body);
        }

        const req = new Request(url.toString(), {
          method: request.method,
          headers,
          body: bodyInit,
          duplex: "half",
        } as RequestInit & { duplex: "half" });

        const response = await app.auth.handler(req);

        reply.status(response.status);

        const setCookies: string[] = [];
        response.headers.forEach((value, key) => {
          if (key.toLowerCase() === "set-cookie") {
            setCookies.push(value);
          } else {
            reply.header(key, value);
          }
        });

        if (setCookies.length > 0) {
          reply.header("set-cookie", setCookies);
        }

        const body = response.body ? await response.text() : null;
        return reply.send(body);
      } catch (e) {
        app.log.error(e);
        return reply.status(500).send("Internal Server Error in Auth");
      }
    },
  });
};

export default authRoute;
