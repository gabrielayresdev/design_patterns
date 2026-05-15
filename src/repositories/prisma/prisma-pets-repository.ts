import { prisma } from "@/lib/prisma";
import {
  CreatePetInput,
  PetsRepository,
  PetWithRequirements,
} from "../types/pets-repository";
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
        organization_id: data.organization_id,
        requirements: {
          createMany: {
            data: data.requirements.map((r) => ({ text: r })),
          },
        },
      },
    });

    return pet;
  }

  async getById(id: string): Promise<PetWithRequirements | null> {
    const pet = await prisma.pet.findUnique({
      where: {
        id,
      },
      include: {
        requirements: true,
      },
    });

    return pet;
  }

  async getManyNearby(
    lat: number,
    lng: number,
  ): Promise<PetWithRequirements[]> {
    const pets = await prisma.$queryRaw<
      (Pet & {
        requirement_id: string | null;
        requirement_text: string | null;
      })[]
    >`
      SELECT p.*, r.id as requirement_id, r.text as requirement_text
      FROM pets p
      LEFT JOIN requirements r
      ON r.pet_id = p.id
      INNER JOIN organizations o
      ON o.id = p.organization_id
      WHERE ( 6371 * acos( cos( radians(${lat}) ) * cos( radians( o.latitude ) ) * cos( radians( o.longitude ) - radians(${lng}) ) + sin( radians(${lat}) ) * sin( radians( o.latitude ) ) ) ) <= 10
    `;

    const petsMap = new Map<string, PetWithRequirements>();

    pets.forEach((row) => {
      if (!petsMap.has(row.id)) {
        const { requirement_id, requirement_text, ...petData } = row; // Prevent the latitude and longitude from being included in the pet data
        petsMap.set(row.id, { ...petData, requirements: [] });
      }
      if (row.requirement_id) {
        petsMap.get(row.id)?.requirements.push({
          id: row.requirement_id,
          text: row.requirement_text as string,
          pet_id: row.id,
        });
      }
    });

    return Array.from(petsMap.values());
  }
}
