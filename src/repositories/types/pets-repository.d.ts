import { Prisma } from "@/generated/prisma/client";

export type CreatePetInput = Omit<
  Prisma.PetCreateInput,
  "organization" | "requirements"
> & {
  organizationId: string;
  requirements: string[];
};

export interface PetsRepository {
  create: (data: CreatePetInput) => Promise<Pet>;
}
