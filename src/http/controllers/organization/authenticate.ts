import { InvalidCredentialsError } from "@/use-cases/errors/invalid-credentials-error";
import { makeAuthenticateUseCase } from "@/use-cases/factories/make-authenticate-use-ase";
import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const parser = z.object({
    email: z.email(),
    password: z.string(),
  });

  const data = parser.parse(request.body);

  try {
    const authenticateUseCase = makeAuthenticateUseCase();

    const { organization } = await authenticateUseCase.execute(data);

    const token = await reply.jwtSign(
      {},
      {
        sign: {
          sub: organization.id,
        },
      },
    );

    const refresh_token = await reply.jwtSign(
      {},
      {
        sign: {
          sub: organization.id,
          expiresIn: "7d",
        },
      },
    );

    return reply
      .setCookie("refresh_token", refresh_token, {
        path: "/",
        secure: true,
        sameSite: true,
        httpOnly: true,
      })
      .status(200)
      .send({
        token,
      });
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return reply.status(401).send({ message: error.message });
    }

    throw error;
  }
}
