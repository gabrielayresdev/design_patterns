import { OrganizationsRepository } from "@/repositories/types/organizations-repository";
import { PetsRepository } from "@/repositories/types/pets-repository";
import { Pet } from "@/generated/prisma/client";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface RegisterPetUseCaseRequest {
  name: string;
  about: string;
  age: number;
  size: "SMALL" | "MEDIUM" | "LARGE";
  energy_level: "LOW" | "MEDIUM" | "HIGH";
  dependency_level: "LOW" | "MEDIUM" | "HIGH";
  environment: "APARTMENT" | "HOUSE_WITH_YARD" | "DOG_PARK";
  requirements: string[];
  organizationId: string;
}

export class RegisterPetUseCase {
  constructor(
    private organizationsRepository: OrganizationsRepository,
    private petsRepository: PetsRepository,
  ) {}

  async execute(data: RegisterPetUseCaseRequest): Promise<Pet> {
    const organization = await this.organizationsRepository.findById(
      data.organizationId,
    );

    if (!organization) {
      throw new ResourceNotFoundError();
    }

    const pet = await this.petsRepository.create({
      ...data,
      organizationId: organization.id,
    });

    return pet;
  }
}
