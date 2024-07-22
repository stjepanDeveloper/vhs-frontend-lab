import { DataSource, Repository } from 'typeorm';

import { Rental } from './entities/rental.entity';
import { UpdateRentalDto } from './dto/update-rental.dto';
import { Vhs } from 'src/vhs/entities/vhs.entity';
import { User } from 'src/auth/entities/user.entity';
import { GetRentalsFilterDto } from './dto/get-rentals-filter.dto';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class RentalRepository extends Repository<Rental> {
  private readonly LATE_FEE_COEFFICIENT = 20;

  constructor(private dataSource: DataSource) {
    super(Rental, dataSource.createEntityManager());
  }

  async getRentals(rentalFilterDto: GetRentalsFilterDto): Promise<Rental[]> {
    const { userId } = rentalFilterDto;
    const query = this.createQueryBuilder('rental');

    if (userId) {
      query.andWhere('rental.userId = :userId', { userId });
    }

    const rentals = await query
      .leftJoinAndSelect('rental.user', 'user')
      .leftJoinAndSelect('rental.vhs', 'vhs')
      .getMany();
    return rentals;
  }

  async createRental(user: User, vhs: Vhs): Promise<Rental> {
    if (vhs.quantity === 0) {
      throw new BadRequestException('No VHS tapes for this movie right now');
    }

    const rental = new Rental();

    rental.rented_at = new Date(new Date().toISOString());
    rental.lateFee = 0;
    rental.user = user;

    vhs.quantity = vhs.quantity - 1;
    await vhs.save();

    rental.vhs = vhs;

    await rental.save();
    return rental;
  }

  async updateRental(
    rental: Rental,
    updateRentalDto: UpdateRentalDto,
  ): Promise<Rental> {
    const { returned_at } = updateRentalDto;

    if (returned_at) {
      rental.returned_at = returned_at;

      const daysHeld = Math.ceil(
        (new Date(rental.returned_at).getTime() -
          new Date(rental.rented_at).getTime()) /
          (1000 * 3600 * 24),
      );

      const vhs = rental.vhs;

      if (daysHeld - vhs.rentalDuration > 0) {
        rental.lateFee =
          (daysHeld - vhs.rentalDuration) * this.LATE_FEE_COEFFICIENT;
      }

      vhs.quantity = vhs.quantity + 1;
      await vhs.save();
    }

    await rental.save();
    return rental;
  }

  async deleteRental(id: number): Promise<void> {
    const rental = await this.findOne({ where: { id } });

    if (rental) {
      const vhs = rental.vhs;
      vhs.quantity = vhs.quantity + 1;

      await vhs.save();
    }

    const result = await this.delete(id);

    if (!result.affected) {
      throw new NotFoundException(`Rental with ID ${id} not found`);
    }
  }
}
