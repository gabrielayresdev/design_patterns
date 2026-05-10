import { FastifyInstance } from "fastify";
import { register } from "./register-organization";
import { authenticate } from "./authenticate";

export async function organizationRoutes(app: FastifyInstance) {
  app.post("/organizations", register);
  app.post("/sessions", authenticate);
}
