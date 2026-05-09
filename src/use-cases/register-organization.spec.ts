import { describe, it, expect, beforeEach } from "vitest";
import { RegisterOrganizationUseCase } from "./register-organization";
import { InMemoryOrganizationsRepository } from "@/repositories/in-memory/in-memory-organization-repository";
import { InMemoryGeocodingProvider } from "@/providers/in-memory/in-memory-geocoding-provider";
import { OrganizationAlreadyExistsError } from "./errors/organization-already-exists";
import { compare } from "bcryptjs";

let organizationsRepository: InMemoryOrganizationsRepository;
let geocodingProvider: InMemoryGeocodingProvider;
let sut: RegisterOrganizationUseCase;

describe("Register Organization Use Case", () => {
  beforeEach(() => {
    organizationsRepository = new InMemoryOrganizationsRepository();
    geocodingProvider = new InMemoryGeocodingProvider();
    sut = new RegisterOrganizationUseCase(
      organizationsRepository,
      geocodingProvider,
    );
  });

  it("should be able to register an organization", async () => {
    const { organization } = await sut.execute({
      owner_name: "John Doe",
      owner_email: "john@example.com",
      cep: "21941-901",
      whatsapp_number: "21999999999",
      password: "123456",
    });

    expect(organization.id).toEqual(expect.any(String));
  });

  it("should hash the password before saving", async () => {
    const { organization } = await sut.execute({
      owner_name: "John Doe",
      owner_email: "john@example.com",
      cep: "21941-901",
      whatsapp_number: "21999999999",
      password: "123456",
    });

    const isPasswordHashed = await compare(
      "123456",
      organization.password_hash,
    );

    expect(isPasswordHashed).toBe(true);
  });

  it("should resolve the address from the CEP via geocoding provider", async () => {
    const { organization } = await sut.execute({
      owner_name: "John Doe",
      owner_email: "john@example.com",
      cep: "21941-901",
      whatsapp_number: "21999999999",
      password: "123456",
    });

    expect(organization.formated_address).toEqual(expect.any(String));
    expect(organization.latitude).toBeDefined();
    expect(organization.longitude).toBeDefined();
  });

  it("should not be able to register an organization with a duplicate email", async () => {
    const email = "john@example.com";

    await sut.execute({
      owner_name: "John Doe",
      owner_email: email,
      cep: "21941-901",
      whatsapp_number: "21999999999",
      password: "123456",
    });

    await expect(
      sut.execute({
        owner_name: "Jane Doe",
        owner_email: email,
        cep: "21941-901",
        whatsapp_number: "21988888888",
        password: "654321",
      }),
    ).rejects.toBeInstanceOf(OrganizationAlreadyExistsError);
  });
});
