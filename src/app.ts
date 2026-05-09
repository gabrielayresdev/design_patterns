import fastify from "fastify";
import { organizationRoutes } from "./http/controllers/organization/routes";
import z, { ZodError } from "zod";
import fastifyJwt from "@fastify/jwt";
import fastifyCookie from "@fastify/cookie";
import { env } from "./env/config";

export const app = fastify();

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: "refresh_token",
    signed: false,
  },
  sign: {
    expiresIn: "15m",
  },
});
app.register(fastifyCookie);
app.register(organizationRoutes);

app.setErrorHandler((error: unknown, _, reply) => {
  if (error instanceof ZodError) {
    reply.status(400).send({
      error: z.treeifyError(error),
    });
  } else {
    console.log(error);
  }
});
