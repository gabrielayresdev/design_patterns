import { Organization } from "@/generated/prisma/client";
import { OrganizationsRepository } from "@/repositories/types/organizations-repository";
import { OrganizationAlreadyExistsError } from "./errors/organization-already-exists";
import { GeocodingProvider } from "@/providers/types/geocoding-provider";
import { hash } from "bcryptjs";

interface RegisterOrganizationUseCaseRequest {
  owner_name: string;
  owner_email: string;
  cep: string;
  whatsapp_number: string;
  password: string;
}

interface RegisterOrganizationUseCaseResponse {
  organization: Organization;
}

export class RegisterOrganizationUseCase {
  constructor(
    private organizationsRepository: OrganizationsRepository,
    private geocodingProvider: GeocodingProvider,
  ) {}

  async execute(
    data: RegisterOrganizationUseCaseRequest,
  ): Promise<RegisterOrganizationUseCaseResponse> {
    const organizationExists = await this.organizationsRepository.findByEmail(
      data.owner_email,
    );

    if (organizationExists) {
      throw new OrganizationAlreadyExistsError();
    }

    const { lat, lng, formatted_address } =
      await this.geocodingProvider.getAddressFromCep(data.cep);

    const password_hash = await hash(data.password, 6);

    const organization = await this.organizationsRepository.create({
      owner_email: data.owner_email,
      owner_name: data.owner_name,
      cep: data.cep,
      formated_address: formatted_address,
      latitude: lat,
      longitude: lng,
      whatsapp_number: data.whatsapp_number,
      password_hash,
    });

    return { organization };
  }
}
