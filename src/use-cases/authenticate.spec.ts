import { describe, it, expect, beforeEach } from "vitest";
import { AuthenticateUseCase } from "./authenticate";
import { InMemoryOrganizationsRepository } from "@/repositories/in-memory/in-memory-organization-repository";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";
import { hash } from "bcryptjs";

let organizationsRepository: InMemoryOrganizationsRepository;
let sut: AuthenticateUseCase;

describe("Authenticate Use Case", () => {
  beforeEach(() => {
    organizationsRepository = new InMemoryOrganizationsRepository();
    sut = new AuthenticateUseCase(organizationsRepository);
  });

  it("should be able to authenticate an organization", async () => {
    await organizationsRepository.create({
      owner_name: "John Doe",
      owner_email: "john@example.com",
      cep: "21941-901",
      formated_address: "Rua Exemplo, 123",
      latitude: 0,
      longitude: 0,
      whatsapp_number: "21999999999",
      password_hash: await hash("123456", 6),
    });

    const { organization } = await sut.execute({
      email: "john@example.com",
      password: "123456",
    });

    expect(organization.id).toEqual(expect.any(String));
  });

  it("should not be able to authenticate with a wrong email", async () => {
    await expect(
      sut.execute({
        email: "nonexistent@example.com",
        password: "123456",
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it("should not be able to authenticate with a wrong password", async () => {
    await organizationsRepository.create({
      owner_name: "John Doe",
      owner_email: "john@example.com",
      cep: "21941-901",
      formated_address: "Rua Exemplo, 123",
      latitude: 0,
      longitude: 0,
      whatsapp_number: "21999999999",
      password_hash: await hash("123456", 6),
    });

    await expect(
      sut.execute({
        email: "john@example.com",
        password: "wrong-password",
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
