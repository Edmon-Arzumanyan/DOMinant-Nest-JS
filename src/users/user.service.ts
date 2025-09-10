import * as bcrypt from 'bcrypt';
import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  public sanitizeUser(user: Partial<User>): Partial<User> {
    const { encryptedPassword, resetPasswordToken, ...rest } = user;
    return rest;
  }

  async create(createUserDto: CreateUserDto) {
    const { password, ...rest } = createUserDto;

    if (!password) {
      throw new InternalServerErrorException('Password is required');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepo.create({
      ...rest,
      encryptedPassword: hashedPassword,
    });

    try {
      const savedUser = await this.userRepo.save(user);
      return this.sanitizeUser(savedUser);
    } catch (error: any) {
      if (error.code === '23505') {
        throw new ConflictException('Email already exists');
      }
      throw new InternalServerErrorException('Database error');
    }
  }

  async findAll() {
    return this.userRepo.find();
  }

  async findOne(id: string | number) {
    const numericId = Number(id);

    if (isNaN(numericId)) {
      throw new BadRequestException('Invalid user id');
    }

    console.log('ID => ' + numericId);

    return this.userRepo.findOne({
      where: { id: numericId },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { email } });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepo.preload({
      id,
      ...updateUserDto,
    });

    if (!user) throw new NotFoundException(`User ${id} not found`);

    if ('password' in updateUserDto && updateUserDto.password) {
      user.encryptedPassword = await bcrypt.hash(updateUserDto.password, 10);
    }

    try {
      const savedUser = await this.userRepo.save(user);
      return this.sanitizeUser(savedUser);
    } catch (error: any) {
      if (error.code === '23505') {
        throw new ConflictException('Email already exists');
      }
      throw new InternalServerErrorException('Database error');
    }
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    try {
      return {
        user: await this.userRepo.remove(user as User),
        message: 'User deleted successfully',
      };
    } catch (error: any) {
      throw new InternalServerErrorException('Database error');
    }
  }
}
