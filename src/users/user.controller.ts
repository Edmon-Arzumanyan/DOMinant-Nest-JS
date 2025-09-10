import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { SnakeCaseInterceptor } from 'snake-case.interceptor';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('users')
@UseInterceptors(SnakeCaseInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('validate_user')
  @UseGuards(JwtAuthGuard)
  me(@Req() req) {
    return req.user;
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Request() req) {
    if (req.user.role !== 0) {
      throw new ForbiddenException('You are not allowed to access this resource');
    }
    return this.userService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string, @Req() req: any) {
    const user = req.user;

    if (user.role === 0 || user.id === +id) {
      return this.userService.findOne(+id);
    }

    throw new ForbiddenException('You are not allowed to access this resource');
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Req() req: any) {
    const user = req.user;

    if (user.role === 0 || user.id === +id) {
      return this.userService.update(+id, updateUserDto);
    }

    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Req() req: any) {
    const user = req.user;

    if (user.role === 0 || user.id === +id) {
      return this.userService.remove(+id);
    }

    throw new ForbiddenException('You are not allowed to delete this resource');
  }
}
