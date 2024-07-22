import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { VhsService } from './vhs.service';
import { VhsController } from './vhs.controller';
import { VhsRepository } from './vhs.repository';
import { Vhs } from './entities/vhs.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vhs])],
  controllers: [VhsController],
  providers: [VhsService, VhsRepository],
})
export class VhsModule {}
