import { Pet, Prisma, Requirement } from "@/generated/prisma/client";

export type CreatePetInput = Omit<
  Prisma.PetCreateInput,
  "organization" | "requirements"
> & {
  organizationId: string;
  requirements: string[];
};

export type PetWithRequirements = Pet & {
  requirements: Requirement[];
};

export interface PetsRepository {
  create: (data: CreatePetInput) => Promise<Pet>;
  getById: (id: string) => Promise<PetWithRequirements | null>;
}
