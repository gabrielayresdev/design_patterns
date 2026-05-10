import { prisma } from "@/lib/prisma";
import { CreatePetInput, PetsRepository } from "../types/pets-repository";
import { Pet } from "@/generated/prisma/client";
import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error";

export class PrismaPetsRepository implements PetsRepository {
  async create(data: CreatePetInput): Promise<Pet> {
    const pet = await prisma.pet.create({
      data: {
        name: data.name,
        about: data.about,
        age: data.age,
        size: data.size,
        energy_level: data.energy_level,
        dependency_level: data.dependency_level,
        environment: data.environment,
        organizationId: data.organizationId,
        requirements: {
          createMany: {
            data: data.requirements.map((r) => ({ text: r })),
          },
        },
      },
    });

    return pet;
  }

  async getById(id: string): Promise<Pet | null> {
    const pet = await prisma.pet.findUnique({
      where: {
        id,
      },
    });

    if (!pet) throw new ResourceNotFoundError();

    return pet;
  }
}
