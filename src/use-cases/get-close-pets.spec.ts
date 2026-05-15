import { describe, it, expect, beforeEach } from "vitest";
import { GetClosePetsUseCase } from "./get-close-pets";
import { InMemoryOrganizationsRepository } from "@/repositories/in-memory/in-memory-organization-repository";
import { InMemoryPetsRepository } from "@/repositories/in-memory/in-memory-pets-repository";
import { hash } from "bcryptjs";

let organizationsRepository: InMemoryOrganizationsRepository;
let petsRepository: InMemoryPetsRepository;
let sut: GetClosePetsUseCase;

async function createOrganization(overrides: {
  latitude: number;
  longitude: number;
  owner_email?: string;
}) {
  return organizationsRepository.create({
    owner_name: "John Doe",
    owner_email: overrides.owner_email ?? "john@example.com",
    cep: "21941-901",
    formated_address: "Rua Exemplo, 123",
    latitude: overrides.latitude,
    longitude: overrides.longitude,
    whatsapp_number: "21999999999",
    password_hash: await hash("123456", 6),
  });
}

const RIO = { lat: -22.9068, lng: -43.1729 };
const SAO_PAULO = { lat: -23.5505, lng: -46.6333 };

describe("Get Close Pets Use Case", () => {
  beforeEach(() => {
    organizationsRepository = new InMemoryOrganizationsRepository();
    petsRepository = new InMemoryPetsRepository(organizationsRepository);
    sut = new GetClosePetsUseCase(petsRepository);
  });

  it("should return pets from organizations within 10km", async () => {
    const organization = await createOrganization({
      latitude: RIO.lat,
      longitude: RIO.lng,
    });

    await petsRepository.create({
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

    const pets = await sut.execute(RIO.lat, RIO.lng);

    expect(pets).toHaveLength(1);
    expect(pets[0].name).toEqual("Rex");
  });

  it("should not return pets from organizations farther than 10km", async () => {
    const organization = await createOrganization({
      latitude: SAO_PAULO.lat,
      longitude: SAO_PAULO.lng,
    });

    await petsRepository.create({
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

    const pets = await sut.execute(RIO.lat, RIO.lng);

    expect(pets).toHaveLength(0);
  });

  it("should return only pets from close organizations when mixed", async () => {
    const closeOrg = await createOrganization({
      latitude: RIO.lat,
      longitude: RIO.lng,
      owner_email: "close@example.com",
    });

    const farOrg = await createOrganization({
      latitude: SAO_PAULO.lat,
      longitude: SAO_PAULO.lng,
      owner_email: "far@example.com",
    });

    await petsRepository.create({
      name: "Close Pet",
      about: "Friendly dog",
      age: 1,
      size: "SMALL",
      energy_level: "LOW",
      dependency_level: "LOW",
      environment: "APARTMENT",
      requirements: [],
      organization_id: closeOrg.id,
    });

    await petsRepository.create({
      name: "Far Pet",
      about: "Friendly dog",
      age: 2,
      size: "LARGE",
      energy_level: "HIGH",
      dependency_level: "MEDIUM",
      environment: "DOG_PARK",
      requirements: [],
      organization_id: farOrg.id,
    });

    const pets = await sut.execute(RIO.lat, RIO.lng);

    expect(pets).toHaveLength(1);
    expect(pets[0].name).toEqual("Close Pet");
  });

  it("should include requirements of returned pets", async () => {
    const organization = await createOrganization({
      latitude: RIO.lat,
      longitude: RIO.lng,
    });

    await petsRepository.create({
      name: "Rex",
      about: "Friendly dog",
      age: 3,
      size: "MEDIUM",
      energy_level: "HIGH",
      dependency_level: "LOW",
      environment: "HOUSE_WITH_YARD",
      requirements: ["Needs a yard", "No cats"],
      organization_id: organization.id,
    });

    const pets = await sut.execute(RIO.lat, RIO.lng);

    expect(pets[0].requirements).toHaveLength(2);
    expect(pets[0].requirements).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ text: "Needs a yard" }),
        expect.objectContaining({ text: "No cats" }),
      ]),
    );
  });

  it("should return an empty array when there are no pets nearby", async () => {
    const pets = await sut.execute(RIO.lat, RIO.lng);

    expect(pets).toEqual([]);
  });
});
