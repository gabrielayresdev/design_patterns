import { Prisma, Organization } from "@/generated/prisma/client";

export interface OrganizationsRepository {
  create: (user: Prisma.OrganizationCreateInput) => Promise<Organization>;
  findByEmail: (email: string) => Promise<Organization | null>;
}
