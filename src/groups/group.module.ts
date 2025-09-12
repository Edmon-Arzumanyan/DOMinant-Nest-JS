import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from './group.entity';
import { GroupUser } from './group-user.entity';
import { Profession } from 'src/professions/profession.entity';
import { User } from 'src/users/user.entity';
import { GroupsController } from './group.controller';
import { GroupsService } from './group.service';

@Module({
  imports: [TypeOrmModule.forFeature([Group, GroupUser, Profession, User])],
  controllers: [GroupsController],
  providers: [GroupsService],
  exports: [GroupsService],
})
export class GroupsModule {}
