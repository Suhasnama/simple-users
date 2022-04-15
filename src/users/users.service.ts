import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    // TODO : Hash the password before storing to db using bcrypt.
    return this.usersRepository.save(createUserDto);
  }

  findAll() {
    return this.usersRepository.find({ where: { isActive: true } });
    // return `This action returns all users`;
  }

  findOne(id: number) {
    return this.usersRepository.findOne(id, { where: { isActive: true } });
    // return `This action returns a #${id} user`;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    console.log(updateUserDto);
    if (await this.findOne(id)) {
      await this.usersRepository.update(id, updateUserDto);
      return {
        statusCode: 200,
        message: `User with #${id} updated successfully`,
      };
    }

    throw new NotFoundException(`No user found with #${id}`);
  }

  async remove(id: number) {
    if (await this.findOne(id)) {
      await this.usersRepository.update(id, { isActive: false });
      return {
        statusCode: 200,
        message: `Removed user with id #${id}`,
      };
    }
    throw new NotFoundException(`No user found with #${id}`);
  }
}
