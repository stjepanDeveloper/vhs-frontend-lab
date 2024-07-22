import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RentalsService } from './rentals.service';
import { RentalsController } from './rentals.controller';
import { RentalRepository } from './rental.repository';
import { UserRepository } from '../auth/user.repository';
import { VhsRepository } from '../vhs/vhs.repository';
import { User } from 'src/auth/entities/user.entity';
import { Vhs } from 'src/vhs/entities/vhs.entity';
import { Rental } from './entities/rental.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Rental, Vhs, User])],
  controllers: [RentalsController],
  providers: [RentalsService, RentalRepository, UserRepository, VhsRepository],
})
export class RentalsModule {}
