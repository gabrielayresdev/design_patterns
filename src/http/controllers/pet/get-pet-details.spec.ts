import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "@/app";

describe("Get Pet Details (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to get pet details", async () => {
    await request(app.server).post("/organizations").send({
      owner_name: "John Doe",
      owner_email: "john@example.com",
      cep: "21941901",
      whatsapp_number: "21999999999",
      password: "123456",
    });

    const authResponse = await request(app.server).post("/sessions").send({
      email: "john@example.com",
      password: "123456",
    });

    const { token } = authResponse.body;

    const registerResponse = await request(app.server)
      .post("/pets")
      .set("Authorization", `Bearer ${token}`)
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

    const petId = registerResponse.body.pet.id;

    const response = await request(app.server).get(`/pets/${petId}`);

    expect(response.status).toBe(200);
    expect(response.body.pet).toEqual(
      expect.objectContaining({
        id: petId,
        name: "Rex",
      }),
    );
  });
});
