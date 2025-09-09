import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async create(createUserDto: CreateUserDto) {
    const user = this.userRepo.create(createUserDto);

    try {
      return await this.userRepo.save(user);
    } catch (error: any) {
      if (error.code === '23505') {
        // PostgreSQL unique violation
        throw new ConflictException('Email already exists');
      }
      throw new InternalServerErrorException('Database error');
    }
  }

  async findAll() {
    return this.userRepo.find();
  }

  async findOne(id: number) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User ${id} not found`);
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepo.preload({
      id,
      ...updateUserDto,
    });

    if (!user) throw new NotFoundException(`User ${id} not found`);

    try {
      return await this.userRepo.save(user);
    } catch (error: any) {
      if (error.code === '23505') {
        throw new ConflictException('Email already exists');
      }
      throw new InternalServerErrorException('Database error');
    }
  }

  async remove(id: number) {
    const user = await this.findOne(id); // already throws NotFoundException if not found
    try {
      return await this.userRepo.remove(user);
    } catch (error: any) {
      throw new InternalServerErrorException('Database error');
    }
  }
}
