import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "@/app";

describe("Register (e2e)", () => {
  beforeAll(async () => {
    app.ready();
  });

  afterAll(async () => {
    app.close();
  });

  it("should be able to register an user", async () => {
    const response = await request(app.server).post("/user").send({
      email: "test@example.com",
      name: "Test User",
    });

    expect(response.status).toBe(201);
  });
});
