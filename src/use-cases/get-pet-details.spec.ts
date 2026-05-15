import { describe, it, expect, beforeEach } from "vitest";
import { GetPetDetailsUseCase } from "./get-pet-details";
import { InMemoryOrganizationsRepository } from "@/repositories/in-memory/in-memory-organization-repository";
import { InMemoryPetsRepository } from "@/repositories/in-memory/in-memory-pets-repository";
import { hash } from "bcryptjs";

let organizationsRepository: InMemoryOrganizationsRepository;
let petsRepository: InMemoryPetsRepository;
let sut: GetPetDetailsUseCase;

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

describe("Get Pet Details Use Case", () => {
  beforeEach(() => {
    organizationsRepository = new InMemoryOrganizationsRepository();
    petsRepository = new InMemoryPetsRepository();
    sut = new GetPetDetailsUseCase(petsRepository);
  });

  it("should be able to get pet details by id", async () => {
    const organization = await createOrganization();

    const createdPet = await petsRepository.create({
      name: "Rex",
      about: "Friendly dog",
      age: 3,
      size: "MEDIUM",
      energy_level: "HIGH",
      dependency_level: "LOW",
      environment: "HOUSE_WITH_YARD",
      requirements: ["Needs a yard"],
      organization_id: organization.id,
    });

    const pet = await sut.execute(createdPet.id);

    expect(pet?.id).toEqual(createdPet.id);
    expect(pet?.name).toEqual("Rex");
  });

  it("should return null when the pet does not exist", async () => {
    const pet = await sut.execute("non-existent-pet-id");

    expect(pet).toBeNull();
  });
});
