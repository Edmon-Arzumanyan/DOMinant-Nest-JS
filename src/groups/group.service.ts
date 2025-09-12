import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Group } from './group.entity';
import { Profession } from 'src/professions/profession.entity';
import { User, UserRole } from 'src/users/user.entity';
import { GroupUser } from './group-user.entity';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group) private groupRepo: Repository<Group>,
    @InjectRepository(Profession) private professionRepo: Repository<Profession>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(GroupUser) private groupUserRepo: Repository<GroupUser>
  ) {}

  async findAll(): Promise<Group[]> {
    return this.groupRepo.find({ relations: ['professions', 'groupUsers', 'groupUsers.user'] });
  }

  async findOne(id: number): Promise<Group> {
    const group = await this.groupRepo.findOne({
      where: { id },
      relations: ['professions', 'groupUsers', 'groupUsers.user'],
    });
    if (!group) throw new NotFoundException('Group not found');
    return group;
  }

  async create(dto: CreateGroupDto, currentUser: User) {
    if (![UserRole.SuperAdmin, UserRole.Teacher].includes(currentUser.role)) {
      throw new ForbiddenException('Only Administrators or Teachers can create the group');
    }

    const professions = await this.professionRepo.findByIds(dto.profession_ids || []);
    const users = await this.userRepo.findByIds(dto.user_ids || []);

    const group = this.groupRepo.create({
      ...dto,
      professions,
    });

    group.groupUsers = users.map((user) => {
      return this.groupUserRepo.create({
        user,
        group,
        role: user.role === UserRole.Teacher ? 1 : 2,
      });
    });

    const savedGroup = await this.groupRepo.save(group);

    return this.groupRepo.findOne({
      where: { id: savedGroup.id },
      relations: ['professions', 'groupUsers', 'groupUsers.user'],
    });
  }

  async update(id: number, dto: UpdateGroupDto, currentUser: User): Promise<Group> {
    if (![UserRole.SuperAdmin, UserRole.Teacher].includes(currentUser.role)) {
      throw new ForbiddenException('Only Administrators or Teachers can create the group');
    }

    const group = await this.findOne(id);

    if (dto.profession_ids) {
      group.professions = await this.professionRepo.findBy({ id: In(dto.profession_ids) });
    }

    Object.assign(group, dto);
    return this.groupRepo.save(group);
  }

  async remove(id: number, currentUser: User): Promise<{ message: string }> {
    if (![UserRole.SuperAdmin, UserRole.Teacher].includes(currentUser.role)) {
      throw new ForbiddenException('Only Administrators or Teachers can delete the group');
    }

    const group = await this.findOne(id);
    if (!group) {
      throw new NotFoundException('Group not found');
    }

    await this.groupRepo.remove(group);

    return { message: `Group with ID ${id} successfully deleted` };
  }
}
