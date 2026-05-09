import fastify from "fastify";
import { organizationRoutes } from "./http/controllers/organization/routes";
import z, { ZodError } from "zod";

export const app = fastify();

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
