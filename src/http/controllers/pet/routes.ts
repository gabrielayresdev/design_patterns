import { FastifyInstance } from "fastify";
import { register } from "./register-pet";
import { verifyJwt } from "@/http/middlewares/verify-jwt";

export async function petRoutes(app: FastifyInstance) {
  app.post("/pets", { onRequest: [verifyJwt] }, register);
}
