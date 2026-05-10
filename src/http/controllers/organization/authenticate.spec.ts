import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "@/app";

describe("Authenticate Organization (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to authenticate an organization", async () => {
    await request(app.server).post("/organizations").send({
      owner_name: "John Doe",
      owner_email: "john@example.com",
      cep: "21941901",
      whatsapp_number: "21999999999",
      password: "123456",
    });

    const response = await request(app.server).post("/sessions").send({
      email: "john@example.com",
      password: "123456",
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ token: expect.any(String) });
  });
});
