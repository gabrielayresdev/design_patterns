import { UserAlreadyExistsError } from "@/use-cases/erros/user-already-exists";
import { makeRegisterUseCase } from "@/use-cases/factories/make-register-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const parser = z.object({
    email: z.email(),
    name: z.string().min(2).max(100),
  });

  const data = parser.parse(request.body);

  try {
    const registerUseCase = makeRegisterUseCase();

    const result = await registerUseCase.execute(data);

    return reply.status(201).send(result);
  } catch (error) {
    if (error instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: error.message });
    }

    throw error;
  }
}
