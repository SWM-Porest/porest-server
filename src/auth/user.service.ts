import { Injectable } from '@nestjs/common';
import { User } from './schemas/user.schema';
import { UsersRepository } from './user.repository';
import { RegistUserDTO } from './dto/registUser.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async findUserByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findByEmail(email);
  }

  async findUserById(id: number): Promise<User | undefined> {
    return await this.usersRepository.findById(id);
  }

  async create(user): Promise<User> {
    return await this.usersRepository.createUser(user);
  }

  async update(user: RegistUserDTO): Promise<User> {
    return await this.usersRepository.updateUser(user);
  }
}
