import { User } from "@/generated/prisma/client";
import { UsersRepository } from "@/repositories/types/users-repository";
import { UserAlreadyExistsError } from "./errors/user-already-exists";

interface RegisterUseCaseRequest {
  email: string;
  name: string;
}

interface RegisterUseCaseResponse {
  user: User;
}

export class RegisterUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute(
    data: RegisterUseCaseRequest,
  ): Promise<RegisterUseCaseResponse> {
    const userExists = await this.usersRepository.findByEmail(data.email);

    if (userExists) {
      throw new UserAlreadyExistsError();
    }

    const user = await this.usersRepository.create({
      email: data.email,
      name: data.name,
    });

    return {
      user,
    };
  }
}
