import { Pet, Prisma, Requirement } from "@/generated/prisma/client";
import {
  CreatePetInput,
  PetsRepository,
  PetWithRequirements,
} from "../types/pets-repository";
import { getDistanceBetweenCoordinates } from "@/utils/get-distance-between-coordinates";
import { InMemoryOrganizationsRepository } from "./in-memory-organization-repository";

export class InMemoryPetsRepository implements PetsRepository {
  public pets: Pet[] = [];
  public requirements: Requirement[] = [];

  constructor(
    private organizationRepository: InMemoryOrganizationsRepository,
  ) {}

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
      organization_id: data.organization_id,
    };
    const requirements: Requirement[] = data.requirements.map((r) => {
      return {
        id: crypto.randomUUID(),
        text: r,
        pet_id: pet.id,
      };
    });

    this.pets.push(pet);
    this.requirements.push(...requirements);
    return pet;
  }

  async getById(id: string): Promise<PetWithRequirements | null> {
    const pet = this.pets.find((p) => p.id === id);

    if (!pet) return null;

    const requirements = this.requirements.filter((r) => r.pet_id === pet.id);

    return { ...pet, requirements };
  }

  async getManyNearby(lat: number, lng: number) {
    const closeOrganizations = this.organizationRepository.organizations.filter(
      (org) => {
        const distance = getDistanceBetweenCoordinates(
          { lat, lng },
          { lat: Number(org.latitude), lng: Number(org.longitude) },
        );
        return distance <= 10;
      },
    );
    const pets = this.pets.filter((pet) => {
      return closeOrganizations.some((org) => org.id === pet.organization_id);
    });

    const petsWithRequirements = pets.map((pet) => {
      const requirements = this.requirements.filter((r) => r.pet_id === pet.id);
      return { ...pet, requirements };
    });

    return petsWithRequirements;
  }
}
