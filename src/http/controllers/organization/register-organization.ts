import { OrganizationAlreadyExistsError } from "@/use-cases/errors/organization-already-exists";
import { makeRegisterUseCase } from "@/use-cases/factories/make-register-organization-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const parser = z.object({
    owner_name: z.string().min(2).max(100),
    owner_email: z.email(),
    cep: z.string().min(8).max(8),
    whatsapp_number: z.string().min(10).max(12),
    password: z.string().min(6).max(100),
  });

  const data = parser.parse(request.body);

  try {
    const registerUseCase = makeRegisterUseCase();

    const result = await registerUseCase.execute(data);

    return reply.status(201).send(result);
  } catch (error) {
    if (error instanceof OrganizationAlreadyExistsError) {
      return reply.status(409).send({ message: error.message });
    }

    throw error;
  }
}
