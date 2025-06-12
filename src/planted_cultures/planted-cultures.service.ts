import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlantedCulture } from './entities/planted-culture.entity';
import { CreatePlantedCultureDto } from './dto/create-planted-culture.dto';
import { UpdatePlantedCultureDto } from './dto/update-planted-culture.dto';
import { PlantedCultureErrorCode } from '../common/errors/error-codes.enum';
import { Harvest } from '../harvests/entities/harvest.entity';
import { Property } from '../properties/entities/properties.entity';

@Injectable()
export class PlantedCultureService {
    constructor(
        @InjectRepository(PlantedCulture)
        private plantedCultureRepository: Repository<PlantedCulture>,

        @InjectRepository(Harvest)
        private harvestRepository: Repository<Harvest>,

        @InjectRepository(Property)
        private propertyRepository: Repository<Property>,
    ) { }

    async create(createDto: CreatePlantedCultureDto): Promise<PlantedCulture> {
        const [harvest] = await Promise.all([
            this.harvestRepository.findOne({ where: { id: createDto.harvestId } }),
        ]);

        if (!harvest) {
            throw new NotFoundException({
                message: 'Harvest not found.',
                errorCode: PlantedCultureErrorCode.CULTURE_NOT_FOUND,
            });
        }

        const exists = await this.plantedCultureRepository.findOne({
            where: {
                name: createDto.name,
                harvest: { id: harvest.id },
            },
            relations: ['harvest'],
        });

        if (exists) {
            throw new ConflictException({
                message: 'Culture already exists in this harvest.',
                errorCode: PlantedCultureErrorCode.DUPLICATE_CULTURE_IN_HARVEST,
            });
        }

        const culture = this.plantedCultureRepository.create({
            ...createDto,
            harvest
        });

        return this.plantedCultureRepository.save(culture);
    }

    async findAll(): Promise<PlantedCulture[]> {
        return this.plantedCultureRepository.find({ relations: ['harvest'] });
    }

    async findOne(id: number): Promise<PlantedCulture> {
        const culture = await this.plantedCultureRepository.findOne({
            where: { id },
            relations: ['harvest'],
        });

        if (!culture) {
            throw new NotFoundException({
                message: 'Culture not found.',
                errorCode: PlantedCultureErrorCode.CULTURE_NOT_FOUND,
            });
        }

        return culture;
    }

    async update(id: number, updateDto: UpdatePlantedCultureDto): Promise<PlantedCulture> {
        const culture = await this.findOne(id);
        Object.assign(culture, updateDto);
        return this.plantedCultureRepository.save(culture);
    }

    async remove(id: number): Promise<void> {
        const result = await this.plantedCultureRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException({
                message: 'Culture not found.',
                errorCode: PlantedCultureErrorCode.CULTURE_NOT_FOUND,
            });
        }
    }
}
