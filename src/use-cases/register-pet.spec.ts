import { describe, it, expect, beforeEach } from "vitest";
import { RegisterPetUseCase } from "./register-pet";
import { InMemoryOrganizationsRepository } from "@/repositories/in-memory/in-memory-organization-repository";
import { InMemoryPetsRepository } from "@/repositories/in-memory/in-memory-pets-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { hash } from "bcryptjs";

let organizationsRepository: InMemoryOrganizationsRepository;
let petsRepository: InMemoryPetsRepository;
let sut: RegisterPetUseCase;

async function createOrganization() {
  return organizationsRepository.create({
    owner_name: "John Doe",
    owner_email: "john@example.com",
    cep: "21941-901",
    formated_address: "Rua Exemplo, 123",
    latitude: 0,
    longitude: 0,
    whatsapp_number: "21999999999",
    password_hash: await hash("123456", 6),
  });
}

describe("Register Pet Use Case", () => {
  beforeEach(() => {
    organizationsRepository = new InMemoryOrganizationsRepository();
    petsRepository = new InMemoryPetsRepository();
    sut = new RegisterPetUseCase(organizationsRepository, petsRepository);
  });

  it("should be able to register a pet", async () => {
    const organization = await createOrganization();

    const pet = await sut.execute({
      name: "Rex",
      about: "Friendly dog",
      age: 3,
      size: "MEDIUM",
      energy_level: "HIGH",
      dependency_level: "LOW",
      environment: "HOUSE_WITH_YARD",
      requirements: ["Needs a yard"],
      organizationId: organization.id,
    });

    expect(pet.id).toEqual(expect.any(String));
  });

  it("should associate the pet with the given organization", async () => {
    const organization = await createOrganization();

    const pet = await sut.execute({
      name: "Rex",
      about: "Friendly dog",
      age: 3,
      size: "MEDIUM",
      energy_level: "HIGH",
      dependency_level: "LOW",
      environment: "HOUSE_WITH_YARD",
      requirements: ["Needs a yard"],
      organizationId: organization.id,
    });

    expect(pet.organizationId).toEqual(organization.id);
  });

  it("should persist the pet in the repository", async () => {
    const organization = await createOrganization();

    await sut.execute({
      name: "Rex",
      about: "Friendly dog",
      age: 3,
      size: "MEDIUM",
      energy_level: "HIGH",
      dependency_level: "LOW",
      environment: "HOUSE_WITH_YARD",
      requirements: ["Needs a yard"],
      organizationId: organization.id,
    });

    expect(petsRepository.pets).toHaveLength(1);
    expect(petsRepository.pets[0].name).toEqual("Rex");
  });

  it("should create the pet's requirements", async () => {
    const organization = await createOrganization();

    const pet = await sut.execute({
      name: "Rex",
      about: "Friendly dog",
      age: 3,
      size: "MEDIUM",
      energy_level: "HIGH",
      dependency_level: "LOW",
      environment: "HOUSE_WITH_YARD",
      requirements: ["Needs a yard", "Must not live with cats"],
      organizationId: organization.id,
    });

    const petRequirements = petsRepository.requirements.filter(
      (r) => r.petId === pet.id,
    );

    expect(petRequirements).toHaveLength(2);
    expect(petRequirements).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ text: "Needs a yard" }),
        expect.objectContaining({ text: "Must not live with cats" }),
      ]),
    );
  });

  it("should not be able to register a pet for a non-existent organization", async () => {
    await expect(
      sut.execute({
        name: "Rex",
        about: "Friendly dog",
        age: 3,
        size: "MEDIUM",
        energy_level: "HIGH",
        dependency_level: "LOW",
        environment: "HOUSE_WITH_YARD",
        requirements: ["Needs a yard"],
        organizationId: "non-existent-organization-id",
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
