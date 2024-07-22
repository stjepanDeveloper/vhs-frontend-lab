import { Injectable, NotFoundException } from '@nestjs/common';

import { Rental } from './entities/rental.entity';
import { RentalRepository } from './rental.repository';
import { VhsRepository } from '../vhs/vhs.repository';
import { UserRepository } from '../auth/user.repository';
import { CreateRentalDto } from './dto/create-rental.dto';
import { UpdateRentalDto } from './dto/update-rental.dto';
import { GetRentalsFilterDto } from './dto/get-rentals-filter.dto';

@Injectable()
export class RentalsService {
  constructor(
    private rentalRepository: RentalRepository,
    private vhsRepository: VhsRepository,
    private userRepository: UserRepository,
  ) {}

  getRentals(rentalFilterDto: GetRentalsFilterDto): Promise<Rental[]> {
    return this.rentalRepository.getRentals(rentalFilterDto);
  }

  async getRentalById(id: number): Promise<Rental> {
    const rental = await this.rentalRepository.findOne({ where: { id } });

    if (!rental) {
      throw new NotFoundException(`Rental with ID ${id} not found`);
    }

    return rental;
  }

  async createRental(createRentalDto: CreateRentalDto): Promise<Rental> {
    const vhs = await this.vhsRepository.findOne({
      where: { id: createRentalDto.vhsId },
    });

    const user = await this.userRepository.findOne({
      where: { id: createRentalDto.userId },
    });

    return this.rentalRepository.createRental(user, vhs);
  }

  async updateRental(
    id: number,
    updateRentalDto: UpdateRentalDto,
  ): Promise<Rental> {
    const rental = await this.getRentalById(id);

    if (!rental) {
      throw new NotFoundException('The specified rental does not exist');
    }

    return this.rentalRepository.updateRental(rental, updateRentalDto);
  }

  async deleteRental(id: number): Promise<void> {
    return this.rentalRepository.deleteRental(id);
  }
}
