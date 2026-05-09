import { FastifyInstance } from "fastify";
import { register } from "./register-organization";

export async function organizationRoutes(app: FastifyInstance) {
  app.post("/organizations", register);
}
