import { OrganizationsRepository } from "@/repositories/types/organizations-repository";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";
import { compare } from "bcryptjs";
import { Organization } from "@/generated/prisma/client";

interface AuthenticateUseCaseRequest {
  email: string;
  password: string;
}

interface AuthenticateUseCaseResponse {
  organization: Organization;
}

export class AuthenticateUseCase {
  constructor(public organizationsRepository: OrganizationsRepository) {}

  async execute({
    email,
    password,
  }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    const organization = await this.organizationsRepository.findByEmail(email);

    if (!organization) {
      throw new InvalidCredentialsError();
    }

    const does_password_match = await compare(
      password,
      organization.password_hash,
    );

    if (!does_password_match) {
      throw new InvalidCredentialsError();
    }

    return {
      organization,
    };
  }
}
