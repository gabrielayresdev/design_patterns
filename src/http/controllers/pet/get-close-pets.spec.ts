import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "@/app";

const RIO_CEP = "21941901";
const RIO = { lat: -22.8624546, lng: -43.2240407 };
const SAO_PAULO = { lat: -23.5505, lng: -46.6333 };

async function createOrgAndRegisterPet() {
  await request(app.server).post("/organizations").send({
    owner_name: "John Doe",
    owner_email: "john@example.com",
    cep: RIO_CEP,
    whatsapp_number: "21999999999",
    password: "123456",
  });

  const authResponse = await request(app.server).post("/sessions").send({
    email: "john@example.com",
    password: "123456",
  });

  await request(app.server)
    .post("/pets")
    .set("Authorization", `Bearer ${authResponse.body.token}`)
    .send({
      name: "Rex",
      about: "Friendly dog looking for a loving home",
      age: 3,
      size: "MEDIUM",
      energy_level: "HIGH",
      dependency_level: "LOW",
      environment: "HOUSE_WITH_YARD",
      requirements: ["Needs a yard"],
    });
}

describe("Get Close Pets (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should return pets from organizations within 10km of the given coordinates", async () => {
    await createOrgAndRegisterPet();

    const response = await request(app.server)
      .get("/pets")
      .query({ lat: RIO.lat, lng: RIO.lng });

    expect(response.status).toBe(200);
    expect(response.body.pets).toHaveLength(1);
    expect(response.body.pets[0]).toEqual(
      expect.objectContaining({ name: "Rex" }),
    );
  });

  it("should return an empty list when no organizations are nearby", async () => {
    const response = await request(app.server)
      .get("/pets")
      .query({ lat: SAO_PAULO.lat, lng: SAO_PAULO.lng });

    expect(response.status).toBe(200);
    expect(response.body.pets).toEqual([]);
  });
});
