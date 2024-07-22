import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SeedService } from './seed.service';
import { VhsRepository } from '../vhs/vhs.repository';
import { Vhs } from 'src/vhs/entities/vhs.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vhs])],
  providers: [SeedService, VhsRepository],
})
export class SeedModule {}
