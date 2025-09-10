import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Profession } from './profession.entity';
import { CreateProfessionDto } from './dto/create-profession.dto';
import { UpdateProfessionDto } from './dto/update-profession.dto';

@Injectable()
export class ProfessionService {
  constructor(
    @InjectRepository(Profession)
    private professionRepo: Repository<Profession>
  ) {}

  findAll() {
    return this.professionRepo.find();
  }

  async findOne(id: number) {
    const profession = await this.professionRepo.findOne({ where: { id } });
    if (!profession) throw new NotFoundException('Profession not found');
    return profession;
  }

  async create(dto: CreateProfessionDto, isAdmin: boolean) {
    if (!isAdmin) throw new ForbiddenException('Only admins can create');

    const profession = this.professionRepo.create(dto);
    return this.professionRepo.save(profession);
  }

  async update(id: number, dto: UpdateProfessionDto, isAdmin: boolean) {
    if (!isAdmin) throw new ForbiddenException('Only admins can update');

    const profession = await this.findOne(id);
    Object.assign(profession, dto);
    return this.professionRepo.save(profession);
  }

  async remove(id: number, isAdmin: boolean) {
    if (!isAdmin) throw new ForbiddenException('Only admins can delete');

    const profession = await this.findOne(id);

    // if (profession.groups?.length) {
    //   throw new ForbiddenException('Profession is used by groups and cannot be deleted');
    // }

    return this.professionRepo.remove(profession);
  }
}
