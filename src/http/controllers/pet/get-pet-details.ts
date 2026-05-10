import { makeGetPetDetailsUseCase } from "@/use-cases/factories/make-get-pet-details-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export function getPetDetails(request: FastifyRequest, reply: FastifyReply) {
  const parser = z.object({
    id: z.uuid(),
  });

  const { id } = parser.parse(request.params);

  const getPetDetailsUseCase = makeGetPetDetailsUseCase();

  const pet = getPetDetailsUseCase.execute(id);

  return reply.status(200).send({ pet });
}
