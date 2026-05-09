import { Prisma, Organization } from "@/generated/prisma/client";
import { OrganizationsRepository } from "@/repositories/types/organizations-repository";
import { randomUUID } from "node:crypto";

export class InMemoryOrganizationsRepository implements OrganizationsRepository {
  public organizations: Organization[] = [];

  async findByEmail(email: string): Promise<Organization | null> {
    return this.organizations.find((org) => org.owner_email === email) ?? null;
  }

  async create(data: Prisma.OrganizationCreateInput): Promise<Organization> {
    const organization: Organization = {
      id: data.id ?? randomUUID(),
      owner_name: data.owner_name,
      owner_email: data.owner_email,
      cep: data.cep,
      formated_address: data.formated_address,
      latitude: data.latitude as Prisma.Decimal,
      longitude: data.longitude as Prisma.Decimal,
      whatsapp_number: data.whatsapp_number,
      password_hash: data.password_hash,
    };
    this.organizations.push(organization);
    return organization;
  }
}
