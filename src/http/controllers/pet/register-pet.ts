import { makeRegisterPetUseCase } from "@/use-cases/factories/make-register-pet-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const parser = z.object({
    name: z.string().min(2).max(100),
    about: z.string().min(10).max(500),
    age: z.number().int().positive(),
    size: z.enum(["SMALL", "MEDIUM", "LARGE"]),
    energy_level: z.enum(["LOW", "MEDIUM", "HIGH"]),
    dependency_level: z.enum(["LOW", "MEDIUM", "HIGH"]),
    environment: z.enum(["APARTMENT", "HOUSE_WITH_YARD", "DOG_PARK"]),
    requirements: z.array(z.string().min(2).max(100)).max(10),
  });

  const data = parser.parse(request.body);
  const organization_id = request.user.sub;

  const registerPetUseCase = makeRegisterPetUseCase();

  const pet = await registerPetUseCase.execute({
    ...data,
    organization_id,
  });

  return reply.status(201).send({ pet });
}
