import fastify from "fastify";
import { userRoutes } from "./http/controllers/users/routes";
import z, { ZodError } from "zod";

export const app = fastify();

app.register(userRoutes);

app.setErrorHandler((error: unknown, _, reply) => {
  if (error instanceof ZodError) {
    reply.status(400).send({
      error: z.treeifyError(error),
    });
  } else {
    console.log(error);
  }
});
