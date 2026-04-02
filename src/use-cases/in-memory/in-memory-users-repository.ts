import { Prisma, User } from "@/generated/prisma/client";
import { UsersRepository } from "@/repositories/types/users-repository";
import { randomUUID } from "node:crypto";

export class InMemoryUsersRepository implements UsersRepository {
  private users: User[] = [];

  findByEmail: (email: string) => Promise<User | null> = async (email) => {
    const user = this.users.find((user) => user.email === email);
    return user ? { ...user } : null;
  };

  create: (data: Prisma.UserCreateInput) => Promise<User> = async (data) => {
    const newUser = {
      email: data.email,
      name: data.name,
      id: randomUUID(),
    };
    this.users.push(newUser);
    return newUser;
  };
}
