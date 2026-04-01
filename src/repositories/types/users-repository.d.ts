import { Prisma, User } from "@/generated/prisma/client";

export interface UsersRepository {
  create: (user: Prisma.UserCreateInput) => Promise<User>;
  findByEmail: (email: string) => Promise<User | null>;
}
