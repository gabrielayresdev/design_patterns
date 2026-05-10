import { Pet, Prisma, Requirement } from "@/generated/prisma/client";
import { CreatePetInput, PetsRepository } from "../types/pets-repository";

export class InMemoryPetsRepository implements PetsRepository {
  public pets: Pet[] = [];
  public requirements: Requirement[] = [];

  async create(data: CreatePetInput): Promise<Pet> {
    const pet: Pet = {
      id: crypto.randomUUID(),
      name: data.name,
      about: data.about,
      age: data.age,
      size: data.size,
      energy_level: data.energy_level,
      dependency_level: data.dependency_level,
      environment: data.environment,
      organizationId: data.organizationId,
    };
    const requirements: Requirement[] = data.requirements.map((r) => {
      return {
        id: crypto.randomUUID(),
        text: r,
        petId: pet.id,
      };
    });

    this.pets.push(pet);
    this.requirements.push(...requirements);
    return pet;
  }

  async getById(id: string): Promise<Pet | null> {
    const pet = this.pets.find((p) => p.id === id);

    if (!pet) return null;

    return pet;
  }
}
