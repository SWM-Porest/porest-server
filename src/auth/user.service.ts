import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { UsersRepository } from './user.repository';
import { RegistUserDTO } from './dto/registUser.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly usersRepository: UsersRepository,
  ) {}

  async findUserByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findByEmail(email);
  }

  async findUserById(id: number): Promise<User | undefined> {
    return await this.usersRepository.findById(id);
  }

  async create(user: User): Promise<User> {
    return await this.usersRepository.createUser(user);
  }

  async update(user: RegistUserDTO): Promise<User> {
    return await this.usersRepository.updateUser(user);
  }
}
