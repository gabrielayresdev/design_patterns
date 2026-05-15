import { PetsRepository } from "@/repositories/types/pets-repository";

export class GetClosePetsUseCase {
  constructor(private petsRepository: PetsRepository) {}

  async execute(lat: number, lng: number) {
    const pets = await this.petsRepository.getManyNearby(lat, lng);

    return pets;
  }
}
