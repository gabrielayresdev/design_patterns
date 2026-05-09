import { PrismaOrganizationsRepository } from "@/repositories/prisma/prisma-organizations-repository";
import { RegisterOrganizationUseCase } from "../register-organization";
import { GoogleMapsGeocodingProvider } from "@/providers/google-maps-geocoding-provider";

export function makeRegisterUseCase() {
  const organizationsRepository = new PrismaOrganizationsRepository();
  const geocodingProvider = new GoogleMapsGeocodingProvider();
  const registerUseCase = new RegisterOrganizationUseCase(
    organizationsRepository,
    geocodingProvider,
  );

  return registerUseCase;
}
