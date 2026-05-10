import { PrismaOrganizationsRepository } from "@/repositories/prisma/prisma-organizations-repository";
import { PrismaPetsRepository } from "@/repositories/prisma/prisma-pets-repository";
import { RegisterPetUseCase } from "../register-pet";

export function makeRegisterPetUseCase() {
  const organizationsRepository = new PrismaOrganizationsRepository();
  const petsRepository = new PrismaPetsRepository();
  const registerPetUseCase = new RegisterPetUseCase(
    organizationsRepository,
    petsRepository,
  );
  return registerPetUseCase;
}
