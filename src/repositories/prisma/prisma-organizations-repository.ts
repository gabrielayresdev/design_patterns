import { Prisma } from "@/generated/prisma/client";
import { OrganizationsRepository } from "../types/organizations-repository";
import { prisma } from "@/lib/prisma";

export class PrismaOrganizationsRepository implements OrganizationsRepository {
  async create(data: Prisma.OrganizationCreateInput) {
    const organization = await prisma.organization.create({
      data,
    });

    return organization;
  }

  async findByEmail(email: string) {
    const organization = await prisma.organization.findUnique({
      where: {
        owner_email: email,
      },
    });
    return organization;
  }
}
