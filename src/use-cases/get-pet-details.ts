import { Pet } from "@/generated/prisma/client";
import { PetsRepository } from "@/repositories/types/pets-repository";

export class GetPetDetailsUseCase {
  constructor(private petsRepository: PetsRepository) {}

  async execute(id: string): Promise<Pet | null> {
    const pet = await this.petsRepository.getById(id);

    return pet;
  }
}
