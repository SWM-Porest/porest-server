import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './schemas/user.schema';
import { UsersRepository } from './user.repository';
import { RegistUserDTO } from './dto/registUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async findUserByEmail(email: string): Promise<User | undefined> {
    return await this.usersRepository.findByEmail(email);
  }

  async findUserById(id: string): Promise<User | undefined> {
    return await this.usersRepository.findById(id);
  }

  async findUserByKakaoId(id: number): Promise<User | undefined> {
    return await this.usersRepository.findByKakaoId(id);
  }

  async create(user: RegistUserDTO): Promise<User> {
    return await this.usersRepository.createUser(user);
  }

  async update(userUpdated: UpdateUserDto, id: string): Promise<User> {
    const user = await this.findUserById(id);
    if (!user) {
      throw new NotFoundException('해당 유저가 존재하지 않습니다.');
    }
    return await this.usersRepository.updateUser(userUpdated, id);
  }
}
