import { makeGetClosePetsUseCase } from "@/use-cases/factories/make-get-close-pets-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export async function getClosePets(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const parser = z.object({
    lat: z.coerce.number(),
    lng: z.coerce.number(),
  });

  const { lat, lng } = parser.parse(request.query);

  const getClosePetsUseCase = makeGetClosePetsUseCase();

  const pets = await getClosePetsUseCase.execute(lat, lng);

  return reply.status(200).send({ pets });
}
