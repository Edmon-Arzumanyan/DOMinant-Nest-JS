import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profession } from './profession.entity';
import { ProfessionService } from './profession.service';
import { ProfessionController } from './profession.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Profession])],
  providers: [ProfessionService],
  controllers: [ProfessionController],
})
export class ProfessionModule {}
