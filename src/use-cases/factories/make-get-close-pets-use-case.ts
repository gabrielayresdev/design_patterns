import { PrismaPetsRepository } from "@/repositories/prisma/prisma-pets-repository";
import { GetClosePetsUseCase } from "../get-close-pets";

export function makeGetClosePetsUseCase() {
  const petsRepository = new PrismaPetsRepository();
  const useCase = new GetClosePetsUseCase(petsRepository);

  return useCase;
}
