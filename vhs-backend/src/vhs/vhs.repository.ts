import { DataSource, Repository } from 'typeorm';

import { Vhs } from './entities/vhs.entity';
import { CreateVhsDto } from './dto/create-vhs.dto';
import { UpdateVhsDto } from './dto/update-vhs.dto';
import { GetVhsFilterDto } from './dto/get-vhs-filter.dto';

import * as fs from 'fs';
import { Injectable } from '@nestjs/common';

@Injectable()
export class VhsRepository extends Repository<Vhs> {
  constructor(private dataSource: DataSource) {
    super(Vhs, dataSource.createEntityManager());
  }

  async getAllVhs(vhsFilterDto: GetVhsFilterDto): Promise<Vhs[]> {
    const { title, description, genre, isAvailable } = vhsFilterDto;
    const query = this.createQueryBuilder('vhs');

    if (title) {
      query.andWhere('vhs.title LIKE :title', { title: `%${title}%` });
    }

    if (description) {
      query.andWhere('vhs.description LIKE :description', {
        description: `%${description}%`,
      });
    }

    if (genre) {
      query.andWhere('vhs.genre LIKE :genre', { genre: `%${genre}%` });
    }

    if (isAvailable === true) {
      query.andWhere('vhs.quantity > 0');
    } else if (isAvailable === false) {
      query.andWhere('vhs.quantity = 0');
    }

    const allVhs = await query.getMany();
    return allVhs;
  }

  async createVhs(
    createVhsDto: CreateVhsDto,
    thumbnail?: Express.Multer.File,
  ): Promise<Vhs> {
    const {
      title,
      description,
      genre,
      duration,
      releasedAt,
      rentalPrice,
      rentalDuration,
    } = createVhsDto;

    const vhs = new Vhs();

    vhs.title = title;
    vhs.description = description;
    vhs.genre = genre;
    vhs.duration = duration;
    vhs.releasedAt = releasedAt;
    vhs.rentalPrice = rentalPrice;
    vhs.rentalDuration = rentalDuration;
    vhs.quantity = 1;

    if (thumbnail) {
      vhs.thumbnail = thumbnail.path;
    }

    await vhs.save();
    return vhs;
  }

  async updateVhs(
    vhs: Vhs,
    updateVhsDto: UpdateVhsDto,
    thumbnail?: Express.Multer.File,
  ): Promise<Vhs> {
    const {
      title,
      description,
      genre,
      duration,
      releasedAt,
      rentalPrice,
      rentalDuration,
      quantity,
    } = updateVhsDto;

    if (title) vhs.title = title;
    if (description) vhs.description = description;
    if (genre) vhs.genre = genre;
    if (duration) vhs.duration = duration;
    if (releasedAt) vhs.releasedAt = releasedAt;
    if (rentalPrice) vhs.rentalPrice = rentalPrice;
    if (rentalDuration) vhs.rentalDuration = rentalDuration;
    if (quantity) vhs.quantity = quantity;

    if (thumbnail) {
      if (vhs.thumbnail) {
        fs.unlink(vhs.thumbnail, (error) => {
          if (error) {
            throw error;
          }
        });
      }

      vhs.thumbnail = thumbnail.path;
    }

    await vhs.save();
    return vhs;
  }
}
