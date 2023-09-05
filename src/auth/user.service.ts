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

  async findUserById(id: string): Promise<User | undefined> {
    return this.usersRepository.findById(id);
  }

  async findUserByKakaoId(id: number): Promise<User | undefined> {
    return await this.usersRepository.findByKakaoId(id);
  }

  async create(user: RegistUserDTO): Promise<User> {
    return await this.usersRepository.createUser(user);
  }

  async update(user: RegistUserDTO, id: string): Promise<User> {
    return await this.usersRepository.updateUser(user, id);
  }
}
