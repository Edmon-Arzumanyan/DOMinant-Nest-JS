import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // Create user
  async create(dto: CreateUserDto) {
    try {
      const hashedPassword = await bcrypt.hash(dto.password, 10);

      return await this.prisma.user.create({
        data: {
          first_name: dto.first_name,
          last_name: dto.last_name,
          date_of_birth: new Date(dto.date_of_birth),
          role: dto.role ?? 1,
          phone: dto.phone ?? '',
          description: dto.description,
          email: dto.email,
          encrypted_password: hashedPassword,
        },
      });
    } catch (error: any) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002' &&
        Array.isArray(error.meta?.target) &&
        (error.meta.target as string[]).includes('email')
      ) {
        throw new BadRequestException('Email is already taken');
      }
      throw error;
    }
  }

  // Get all users
  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany();
    if (!users || users.length === 0) {
      throw new NotFoundException('No users found');
    }
    return users;
  }

  // Get one user
  async findOne(id: number): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    return user;
  }

  // Update user
  async update(id: number, dto: UpdateUserDto): Promise<User> {
    const existingUser = await this.prisma.user.findUnique({ where: { id } });
    if (!existingUser)
      throw new NotFoundException(`User with ID ${id} not found`);

    // Prepare update data
    const data: Prisma.UserUpdateInput = { ...dto };

    // handle password separately
    if (dto.password) {
      data.encrypted_password = await bcrypt.hash(dto.password, 10);
    }

    // convert date_of_birth to Date
    if (dto.date_of_birth) {
      data.date_of_birth = new Date(dto.date_of_birth);
    }

    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  // Delete user
  async remove(id: number): Promise<User> {
    const existingUser = await this.prisma.user.findUnique({ where: { id } });
    if (!existingUser)
      throw new NotFoundException(`User with ID ${id} not found`);

    return this.prisma.user.delete({ where: { id } });
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    return user;
  }
}
