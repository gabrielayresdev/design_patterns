import { FastifyInstance } from "fastify";
import { register } from "./register-pet";
import { verifyJwt } from "@/http/middlewares/verify-jwt";
import { getPetDetails } from "./get-pet-details";

export async function petRoutes(app: FastifyInstance) {
  app.post("/pets", { onRequest: [verifyJwt] }, register);
  app.get("/pets/:id", getPetDetails);
}
