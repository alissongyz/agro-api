import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Harvest } from './entities/harvest.entity';
import { CreateHarvestDto } from './dto/create-harvest.dto';
import { UpdateHarvestDto } from './dto/update-harvest.dto';
import { Property } from '../properties/entities/properties.entity';
import { HarvestErrorCode } from '../common/errors/error-codes.enum';

@Injectable()
export class HarvestService {
    constructor(
        @InjectRepository(Harvest)
        private harvestRepository: Repository<Harvest>,

        @InjectRepository(Property)
        private propertyRepository: Repository<Property>,
    ) { }

    async create(createHarvestDto: CreateHarvestDto): Promise<Harvest> {
        const property = await this.propertyRepository.findOne({ where: { id: createHarvestDto.propertyId } });

        if (!property) {
            throw new NotFoundException({
                message: 'Property not found',
                errorCode: HarvestErrorCode.HARVEST_NOT_FOUND,
            });
        }

        if (createHarvestDto.year > new Date().getFullYear()) {
            throw new BadRequestException({
                message: 'Invalid year for harvest',
                errorCode: HarvestErrorCode.INVALID_YEAR,
            });
        }

        const harvest = this.harvestRepository.create({ ...createHarvestDto, property });
        return this.harvestRepository.save(harvest);
    }

    async findAll(): Promise<Harvest[]> {
        return this.harvestRepository.find({ relations: ['property'] });
    }

    async findOne(id: number): Promise<Harvest> {
        const harvest = await this.harvestRepository.findOne({ where: { id }, relations: ['property'] });

        if (!harvest) {
            throw new NotFoundException({
                message: 'Harvest not found',
                errorCode: HarvestErrorCode.HARVEST_NOT_FOUND,
            });
        }

        return harvest;
    }

    async update(id: number, updateHarvestDto: UpdateHarvestDto): Promise<Harvest> {
        const harvest = await this.findOne(id);
        Object.assign(harvest, updateHarvestDto);
        return this.harvestRepository.save(harvest);
    }

    async remove(id: number): Promise<void> {
        const result = await this.harvestRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException({
                message: 'Harvest not found',
                errorCode: HarvestErrorCode.HARVEST_NOT_FOUND,
            });
        }
    }
}